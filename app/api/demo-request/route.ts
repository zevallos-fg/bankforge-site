import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase credentials');
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email, name, institution_name, audience_type,
      source_page, source_cta, domain, message
    } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    const supabase = getSupabase();
    const { error } = await supabase.from('website_demo_requests').insert({
      email:            email.trim().toLowerCase(),
      name:             name?.trim() || null,
      institution_name: institution_name?.trim() || null,
      audience_type:    audience_type || 'unknown',
      source_page:      source_page || null,
      source_cta:       source_cta || null,
      domain:           domain?.trim() || null,
      message:          message?.trim() || null,
      referrer:         req.headers.get('referer') || null,
    });

    if (error) {
      console.error('Demo request insert error:', error);
      return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Demo request error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
