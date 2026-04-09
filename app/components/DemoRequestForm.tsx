'use client';
import { useState } from 'react';

interface DemoRequestFormProps {
  audienceType: 'bank' | 'credit_union' | 'ria' | 'unknown';
  sourcePage: string;
  sourceCta: string;
  ctaLabel: string;
  buttonClassName?: string;
}

type State = 'idle' | 'open' | 'submitting' | 'success' | 'error';

export default function DemoRequestForm({
  audienceType,
  sourcePage,
  sourceCta,
  ctaLabel,
  buttonClassName,
}: DemoRequestFormProps) {
  const [state, setState] = useState<State>('idle');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const defaultBtnClass =
    'bg-white text-[#0F2341] font-medium px-6 py-3 rounded-lg text-sm hover:bg-gray-50 transition-colors cursor-pointer';

  async function handleSubmit() {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid work email.');
      return;
    }
    setState('submitting');
    setError('');
    try {
      const res = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name || null,
          audience_type: audienceType,
          source_page: sourcePage,
          source_cta: sourceCta,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setState('success');
    } catch {
      setState('error');
      setError('Something went wrong. Please try again.');
    }
  }

  // DEFAULT: button only — no inputs visible
  if (state === 'idle') {
    return (
      <button
        onClick={() => setState('open')}
        className={buttonClassName || defaultBtnClass}
      >
        {ctaLabel}
      </button>
    );
  }

  // SUCCESS STATE
  if (state === 'success') {
    return (
      <p className="text-sm text-white/80 py-2">
        ✓ We&apos;ll be in touch within one business day.
      </p>
    );
  }

  // FORM STATE (open / submitting / error)
  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-sm mx-auto">
      <input
        type="email"
        placeholder="Work email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={state === 'submitting'}
        autoFocus
        className="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-white/60 focus:outline-none"
      />
      <input
        type="text"
        placeholder="Your name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={state === 'submitting'}
        className="w-full rounded-lg border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-white/60 focus:outline-none"
      />
      {error && (
        <p className="w-full text-xs text-red-300">{error}</p>
      )}
      <button
        onClick={handleSubmit}
        disabled={state === 'submitting'}
        className={
          (buttonClassName || defaultBtnClass) +
          ' w-full disabled:opacity-60'
        }
      >
        {state === 'submitting' ? 'Sending...' : ctaLabel}
      </button>
      <button
        onClick={() => {
          setState('idle');
          setError('');
        }}
        className="text-xs text-white/40 hover:text-white/60 transition-colors cursor-pointer"
      >
        ← Cancel
      </button>
    </div>
  );
}
