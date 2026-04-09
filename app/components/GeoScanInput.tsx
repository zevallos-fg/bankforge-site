'use client';

import { useState } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Props {
  onResult: (data: any) => void;
}

export default function GeoScanInput({ onResult }: Props) {
  const [domain, setDomain] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'not_found' | 'error'>('idle');
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  async function handleScan() {
    if (!domain.trim()) return;
    setState('loading');
    try {
      const clean = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '');
      const res = await fetch(`/api/scan-preview?domain=${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (data.found) {
        onResult(data);
      } else {
        setState('not_found');
      }
    } catch {
      setState('error');
    }
  }

  async function handleNotify() {
    if (!email.includes('@')) return;
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: 'GEO Score Request', bankName: domain, email, source: 'geo_not_found' }),
      });
      setEmailSent(true);
    } catch { /* silent */ }
  }

  if (state === 'idle' || state === 'loading') {
    return (
      <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto mt-8">
        <input
          type="text"
          placeholder="yourbank.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleScan()}
          disabled={state === 'loading'}
          className="flex-1 rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-white/60 focus:outline-none"
        />
        <button
          onClick={handleScan}
          disabled={state === 'loading' || !domain.trim()}
          className="bg-white text-[#0F2341] font-medium px-6 py-3 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-60 whitespace-nowrap cursor-pointer"
        >
          {state === 'loading' ? 'Checking...' : 'See your GEO score'}
        </button>
      </div>
    );
  }

  if (state === 'not_found' || state === 'error') {
    if (emailSent) {
      return (
        <div className="max-w-lg mx-auto mt-8 text-center">
          <p className="text-white/80 text-sm">Got it. We&apos;ll reach out when your scan is ready.</p>
        </div>
      );
    }
    return (
      <div className="max-w-lg mx-auto mt-8 text-center">
        <p className="text-white/70 text-sm mb-4">
          We haven&apos;t scanned this institution yet. Enter your email and we&apos;ll reach out when it&apos;s ready.
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNotify()}
            className="flex-1 rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-white/60 focus:outline-none"
          />
          <button onClick={handleNotify} className="bg-white text-[#0F2341] font-medium px-6 py-3 rounded-lg text-sm cursor-pointer">
            Notify me
          </button>
        </div>
        <button
          onClick={() => { setState('idle'); setDomain(''); }}
          className="text-xs text-white/40 hover:text-white/60 mt-3 cursor-pointer"
        >
          &larr; Try a different domain
        </button>
      </div>
    );
  }

  return null;
}
