import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getCorpusMonth } from '@/app/lib/corpus-month';

// Rate limit: 1 scan per IP per 72 hours
const scanHistory = new Map<string, number>();

/* eslint-disable @typescript-eslint/no-explicit-any */

function normalizeDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '');
}

export async function GET(req: NextRequest) {
  const rawDomain = req.nextUrl.searchParams.get('domain');
  if (!rawDomain) {
    return NextResponse.json({ error: 'Missing domain parameter' }, { status: 400 });
  }

  // Rate limiting by IP
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown';
  const now = Date.now();
  const last = scanHistory.get(ip);
  const WINDOW = 72 * 60 * 60 * 1000;

  const bypassRateLimit = process.env.DISABLE_SCAN_RATE_LIMIT === 'true';

  if (!bypassRateLimit && last && now - last < WINDOW) {
    return NextResponse.json(
      {
        error: 'rate_limited',
        message:
          'One preview scan is available every 72 hours. Request a full review for immediate access.',
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
  const domain = normalizeDomain(rawDomain);

  // Step 1: resolve entity
  let entityResult = await supabase
    .from('entity_registry')
    .select('entity_id, entity_name, domain, fdic_cert, entity_type')
    .eq('domain', domain)
    .in('entity_type', ['bank', 'ria', 'credit_union'])
    .maybeSingle();

  if (!entityResult.data) {
    entityResult = await supabase
      .from('entity_registry')
      .select('entity_id, entity_name, domain, fdic_cert, entity_type')
      .eq('domain', `www.${domain}`)
      .in('entity_type', ['bank', 'ria', 'credit_union'])
      .maybeSingle();
  }

  const entity = entityResult.data;
  if (!entity) {
    return NextResponse.json({ found: false });
  }

  // Step 2: get baseline — 1 month in arrears, merge if data split across rows
  const corpusRepdte = getCorpusMonth();
  const selectCols = 'repdte, geo_visibility_score, benchmark_context, risk_tier, bank_compliance_raw, dns_security_raw, gbp_raw, web_archive_raw, signal_checks_raw, serp_raw, fdic_enforcement_raw, exam_cycle_signal, risk_indicators';
  const { data: baselineRows } = await supabase
    .from('bank_monthly_baseline')
    .select(selectCols)
    .eq('entity_id', entity.entity_id)
    .eq('repdte', corpusRepdte)
    .is('deleted_at', null)
    .limit(4);

  // Merge rows: coalesce null fields from sibling rows for same entity/repdte
  const rows = baselineRows ?? [];
  const baseline = rows.length > 0
    ? rows.reduce((merged: any, row: any) => {
        for (const key of Object.keys(row)) {
          if (merged[key] == null && row[key] != null) merged[key] = row[key];
        }
        return merged;
      }, { ...rows[0] })
    : null;

  // Record scan in rate limit map
  scanHistory.set(ip, now);
  for (const [key, timestamp] of scanHistory) {
    if (now - timestamp > WINDOW) scanHistory.delete(key);
  }

  if (!baseline) {
    return NextResponse.json({
      found: true,
      entity: {
        name: entity.entity_name,
        domain: entity.domain,
        fdic_cert: entity.fdic_cert,
        entity_type: entity.entity_type,
        asset_tier: null,
        location: null,
      },
      geo: { score: null, peer_avg: null, peer_p75: null, percentile: null, peer_count: null, peer_state: null, peer_asset_tier: null, top_peer_score: null, top_peer_name: null },
      signals: { gbp_claimed: null, gbp_rating: null, gbp_reviews: null, dmarc_present: null, dmarc_policy: null, dkim_present: null, spf_present: null, ssl_health: null, tls_version: null, cert_expiry_days: null, web_velocity: null, last_capture: null },
      compliance: { total: 0, high: 0, medium: 0, low: 0, top_flags: [] },
      seoSignals: { https: null, pageTitle: null, metaDescription: null, h1Tag: null, schemaMarkup: null, brandVisibility: null, gbpListed: null },
      repdte: null,
    });
  }

  // Step 3: parse benchmark_context
  const bc = baseline.benchmark_context as Record<string, any> | null;
  const geoSignals = bc?.signals?.geo_score as Record<string, any> | undefined;
  const peerGroup = bc?.peer_group as Record<string, any> | undefined;

  // Step 4: get top peer by AI SEO score in same state
  let topPeerScore: number | null = null;
  let topPeerName: string | null = null;
  const peerState = (baseline as any).institution_state ?? peerGroup?.state ?? null;

  if (peerState) {
    const { data: topPeerBaseline } = await supabase
      .from('bank_monthly_baseline')
      .select('entity_id, geo_visibility_score')
      .eq('institution_state', peerState)
      .eq('repdte', baseline.repdte)
      .neq('entity_id', entity.entity_id)
      .is('deleted_at', null)
      .not('geo_visibility_score', 'is', null)
      .order('geo_visibility_score', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (topPeerBaseline) {
      topPeerScore = topPeerBaseline.geo_visibility_score as number;
      const { data: topEnt } = await supabase
        .from('entity_registry')
        .select('entity_name')
        .eq('entity_id', topPeerBaseline.entity_id)
        .single();
      topPeerName = topEnt?.entity_name ?? null;
    }
  }

  // Step 5: parse compliance findings
  const complianceRaw = baseline.bank_compliance_raw as Record<string, any> | null;
  const rawFindings = (complianceRaw?.findings ?? complianceRaw?.complianceObservations ?? []) as any[];
  const high = rawFindings.filter((f: any) => String(f.severity ?? '').toUpperCase() === 'HIGH');
  const medium = rawFindings.filter((f: any) => String(f.severity ?? '').toUpperCase() === 'MEDIUM');
  const low = rawFindings.filter((f: any) => String(f.severity ?? '').toUpperCase() === 'LOW');

  const topFlags = high.slice(0, 2).map((f: any) => ({
    category: f.category ?? f.framework ?? null,
    location: f.location ?? f.page ?? null,
    summary: String(f.finding ?? f.description ?? f.observation ?? '').substring(0, 120),
  }));

  // Step 6: parse signals
  const gbp = baseline.gbp_raw as Record<string, any> | null;
  const dns = baseline.dns_security_raw as Record<string, any> | null;
  const webArchive = baseline.web_archive_raw as Record<string, any> | null;
  const signalChecks = baseline.signal_checks_raw as Record<string, any> | null;
  const serpRaw = baseline.serp_raw as Record<string, any> | null;

  // Derive SEO signals from signal_checks_raw
  const seoSignals = {
    https: signalChecks?.hasHttps ?? null,
    pageTitle: signalChecks?.hasPageTitle ?? null,
    metaDescription: signalChecks?.hasMetaDescription ?? null,
    h1Tag: signalChecks?.hasH1 ?? null,
    schemaMarkup: signalChecks?.hasSchemaMarkup ?? null,
    brandVisibility: serpRaw?.organic_results
      ? (serpRaw.organic_results as any[]).some(
          (r: any) => (r.position ?? 99) <= 10,
        )
      : null,
    gbpListed: gbp?.place_id != null || gbp?.isClaimed === true,
  };

  // Parse enforcement, exam cycle, risk indicators
  const enforcementRaw = baseline.fdic_enforcement_raw as Record<string, any> | null;
  const examCycle = baseline.exam_cycle_signal as Record<string, any> | null;
  const riskIndicators = baseline.risk_indicators as Record<string, any> | null;

  const enforcement = {
    hasActive: enforcementRaw?.data_status !== 'source_unavailable' && (enforcementRaw?.actions?.length ?? 0) > 0,
    count: enforcementRaw?.actions?.length ?? 0,
  };

  const examCycleSignal = {
    tier: examCycle?.tier ?? null,
    daysEstimate: examCycle?.days_until_exam ?? null,
  };

  const riskTier = riskIndicators?.risk_tier ?? baseline.risk_tier ?? null;

  // Enrich findings with canonical bank finding types
  const CANONICAL: Record<string, { regTag: string; examinerLanguage: string; frequency: string }> = {
    reg_dd_rate_advertisement: { regTag: 'REG DD', examinerLanguage: "On the examiner's checklist every cycle. APY displayed without effective date, minimum balance, or fee disclosure triggers a Reg DD deficiency under 12 CFR 1030.4.", frequency: 'Very common' },
    reg_dd_apy_calculation: { regTag: 'REG DD', examinerLanguage: "APY must be calculated using the exact formula in Appendix A of Reg DD. Inaccurate or missing APY is a direct examination deficiency.", frequency: 'Common' },
    equal_housing_disclosure: { regTag: 'ECOA', examinerLanguage: "Required statement or logo not detected on consumer lending pages. Consistent examiner flag across FDIC, OCC, and CFPB supervised institutions.", frequency: 'Common' },
    udaap_dark_pattern: { regTag: 'UDAAP', examinerLanguage: "Teaser rate or promotional language without clear conditions. Post-2022 CFPB focus area.", frequency: 'Elevated' },
    nmls_disclosure: { regTag: 'SAFE ACT', examinerLanguage: "NMLS unique identifier must be displayed on all pages advertising mortgage loan products.", frequency: 'Common' },
    privacy_notice_accessibility: { regTag: 'REG P', examinerLanguage: "Privacy notice absent from footer or not linked from account-opening pages. Examiners verify link placement during consumer compliance exams.", frequency: 'Very common' },
    non_deposit_disclaimer: { regTag: 'FDIC', examinerLanguage: "Investment or insurance products displayed without required non-deposit disclaimer.", frequency: 'Common' },
    accessibility_wcag: { regTag: 'ADA', examinerLanguage: "FFIEC guidance and DOJ ADA enforcement position require WCAG 2.1 AA standards. Enforcement activity increasing since 2023.", frequency: 'Very common' },
    schema_markup_missing: { regTag: 'FFIEC', examinerLanguage: "Structured data helps AI search engines accurately categorize your institution's products. Absence signals low digital maturity.", frequency: 'Very common' },
    https_failure: { regTag: 'FFIEC IT', examinerLanguage: "HTTPS required for all consumer-facing pages. FFIEC IT examiners flag HTTP as a cybersecurity control failure.", frequency: 'Rare on primary domain' },
    cra_performance_context: { regTag: 'CRA', examinerLanguage: "Digital accessibility in LMI areas is an emerging CRA examination consideration.", frequency: 'Emerging' },
    fdic_membership_display: { regTag: 'FDIC', examinerLanguage: "FDIC Part 328 requires the official FDIC digital sign on bank home page and deposit pages.", frequency: 'Common' },
  };

  const enrichedFindings = rawFindings.map((f: any) => {
    const cat = String(f.category ?? f.finding_type ?? '').toLowerCase().replace(/[\s-]+/g, '_');
    const canonical = CANONICAL[cat] ?? null;
    const citation = String(f.regulatory_citation ?? f.regulation ?? f.framework ?? '');
    return {
      severity: String(f.severity ?? 'MEDIUM').toUpperCase(),
      category: f.category ?? f.finding_type ?? null,
      finding: String(f.finding ?? f.description ?? f.observation ?? ''),
      regulatoryCitation: citation,
      location: f.location ?? f.page ?? null,
      regTag: canonical?.regTag ?? citation.split('/')[0]?.trim().toUpperCase().slice(0, 12) ?? '',
      examinerLanguage: canonical?.examinerLanguage ?? null,
      frequency: canonical?.frequency ?? null,
    };
  });

  // Derive location from GBP address
  let location: string | null = null;
  if (gbp?.address) {
    const parts = String(gbp.address).split(',').map((s: string) => s.trim());
    location = parts.length >= 3 ? `${parts[parts.length - 2]}, ${parts[parts.length - 1]}` : String(gbp.address);
  }

  return NextResponse.json({
    found: true,
    entity: {
      name: entity.entity_name,
      domain: entity.domain,
      fdic_cert: entity.fdic_cert,
      entity_type: entity.entity_type,
      asset_tier: peerGroup?.asset_tier ?? null,
      location,
    },
    geo: {
      score: baseline.geo_visibility_score,
      peer_avg: geoSignals?.peer_avg ?? null,
      peer_p75: geoSignals?.peer_p75 ?? null,
      percentile: geoSignals?.percentile ?? null,
      peer_count: peerGroup?.peer_count ?? null,
      peer_state: peerGroup?.state ?? peerState,
      peer_asset_tier: peerGroup?.asset_tier ?? null,
      top_peer_score: topPeerScore,
      top_peer_name: topPeerName,
    },
    signals: {
      gbp_claimed: gbp?.isClaimed ?? null,
      gbp_rating: gbp?.rating ?? null,
      gbp_reviews: gbp?.reviewCount ?? null,
      dmarc_present: dns?.dmarc_present ?? null,
      dmarc_policy: dns?.dmarc_policy ?? null,
      dkim_present: dns?.dkim_present ?? null,
      spf_present: dns?.spf_present ?? null,
      ssl_health: dns?.ssl_health_tier ?? null,
      tls_version: dns?.tls_version ?? null,
      cert_expiry_days: dns?.days_until_expiry ?? null,
      web_velocity: webArchive?.change_velocity_tier ?? null,
      last_capture: webArchive?.last_capture_date ?? null,
    },
    compliance: {
      total: rawFindings.length,
      high: high.length,
      medium: medium.length,
      low: low.length,
      top_flags: topFlags,
      enrichedFindings,
      peerAvgFindingCount: bc?.signals?.compliance?.peer_avg_finding_count ?? null,
      peerPercentile: bc?.signals?.compliance?.percentile ?? null,
    },
    enforcement,
    examCycleSignal,
    riskTier,
    seoSignals,
    repdte: baseline.repdte,
  });
}
