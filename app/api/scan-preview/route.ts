import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Rate limit: 1 scan per IP per 72 hours
const scanHistory = new Map<string, number>();

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get('domain');
  if (!domain) {
    return NextResponse.json({ error: 'Missing domain parameter' }, { status: 400 });
  }

  // Rate limiting by IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? req.headers.get('x-real-ip') ?? 'unknown';
  const now = Date.now();
  const last = scanHistory.get(ip);
  const WINDOW = 72 * 60 * 60 * 1000; // 72 hours

  if (last && now - last < WINDOW) {
    return NextResponse.json(
      {
        error: 'rate_limited',
        message: 'One preview scan is available every 72 hours. Request a full review for immediate access.',
        retryAfter: Math.ceil((last + WINDOW - now) / 3600000) + ' hours',
      },
      { status: 429 },
    );
  }

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ found: false });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const cleanDomain = domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '');

  // Query entity_registry — exact match on normalized bare domain
  let entityResult = await supabase
    .from('entity_registry')
    .select('entity_id, entity_name, domain, entity_type, asset_tier, primary_msa')
    .eq('domain', cleanDomain)
    .in('entity_type', ['bank', 'ria', 'credit_union'])
    .limit(1)
    .maybeSingle();

  // Fallback: try with www. prefix if exact match misses
  if (!entityResult.data) {
    entityResult = await supabase
      .from('entity_registry')
      .select('entity_id, entity_name, domain, entity_type, asset_tier, primary_msa')
      .eq('domain', `www.${cleanDomain}`)
      .in('entity_type', ['bank', 'ria', 'credit_union'])
      .limit(1)
      .maybeSingle();
  }

  const entity = entityResult.data;

  if (!entity) {
    return NextResponse.json({ found: false });
  }

  // Query bank_monthly_baseline for March 2026 data
  const { data: baseline } = await supabase
    .from('bank_monthly_baseline')
    .select('geo_visibility_score, signal_checks_raw, gbp_raw, dns_security_raw, bank_compliance_raw')
    .eq('entity_id', entity.entity_id)
    .eq('repdte', '2026-03')
    .limit(1)
    .single();

  // Record scan in rate limit map
  scanHistory.set(ip, now);

  // Cleanup old entries (older than 72 hours)
  for (const [key, timestamp] of scanHistory) {
    if (now - timestamp > WINDOW) {
      scanHistory.delete(key);
    }
  }

  if (!baseline) {
    return NextResponse.json({
      found: true,
      entity_name: entity.entity_name,
      domain: entity.domain,
      entity_type: entity.entity_type,
      asset_tier: entity.asset_tier,
      primary_msa: entity.primary_msa,
      geo_visibility_score: null,
    });
  }

  // Parse findings from bank_compliance_raw
  const findings: Array<{ description: string; severity: string }> = [];
  const complianceRaw = baseline.bank_compliance_raw as Record<string, unknown> | null;
  if (complianceRaw) {
    const findingsArr = (complianceRaw.findings ?? complianceRaw.complianceObservations) as Array<Record<string, unknown>> | undefined;
    if (Array.isArray(findingsArr)) {
      for (const f of findingsArr) {
        findings.push({
          description: String(f.description ?? f.observation ?? f.finding ?? ''),
          severity: String(f.severity ?? 'MEDIUM').toUpperCase(),
        });
      }
    }
  }

  // Parse signal checks for additional findings
  const signalChecks = baseline.signal_checks_raw as Record<string, unknown> | null;
  if (signalChecks?.disclosures) {
    const disclosures = signalChecks.disclosures as Record<string, unknown>;
    if (Array.isArray(disclosures.findings)) {
      for (const f of disclosures.findings as Array<Record<string, unknown>>) {
        findings.push({
          description: String(f.description ?? f.label ?? ''),
          severity: String(f.severity ?? 'MEDIUM').toUpperCase(),
        });
      }
    }
  }

  const gbpRaw = baseline.gbp_raw as Record<string, unknown> | null;
  const dnsRaw = baseline.dns_security_raw as Record<string, unknown> | null;

  return NextResponse.json({
    found: true,
    entity_name: entity.entity_name,
    domain: entity.domain,
    entity_type: entity.entity_type,
    asset_tier: entity.asset_tier,
    primary_msa: entity.primary_msa,
    geo_visibility_score: baseline.geo_visibility_score,
    gbp_claimed: gbpRaw?.isClaimed != null ? String(gbpRaw.isClaimed) : null,
    gbp_rating: gbpRaw?.rating != null ? String(gbpRaw.rating) : null,
    dmarc_present: dnsRaw?.dmarc_present != null ? String(dnsRaw.dmarc_present) : null,
    dkim_present: dnsRaw?.dkim_present != null ? String(dnsRaw.dkim_present) : null,
    ssl_health_tier: dnsRaw?.ssl_health_tier != null ? String(dnsRaw.ssl_health_tier) : null,
    findings: findings.slice(0, 10),
  });
}
