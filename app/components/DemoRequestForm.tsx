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

/**
 * Map the marketing site's audience vocabulary onto the lane vocabulary
 * `public.submit_walkthrough_request` accepts, which is {ria, bank, bd, other}.
 *
 * `credit_union` has no lane of its own, so it normalises to `other` — a real
 * loss of granularity, named here rather than hidden, and tracked in
 * TD-WALKTHROUGH-RPC-DROPS-SEVEN-ATTRIBUTION-COLUMNS. Doing it in one place
 * means the route never has to guess what the site meant.
 */
function toLane(audienceType: DemoRequestFormProps['audienceType']): string {
  switch (audienceType) {
    case 'bank':
      return 'bank';
    case 'ria':
      return 'ria';
    case 'credit_union':
    case 'unknown':
    default:
      return 'other';
  }
}

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
  /**
   * HONEYPOT. Visually hidden, `aria-hidden`, `tabIndex={-1}`, and not labelled —
   * a person never sees it and a screen reader never announces it. A bot that
   * fills every input it finds fills this one, and the route then returns 200
   * while writing nothing. It is deliberately named `company_website`: plausible
   * enough that a bot will not skip it.
   */
  const [companyWebsite, setCompanyWebsite] = useState('');

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
          institution: null,
          lane: toLane(audienceType),
          message: null,
          company_website: companyWebsite,
          // Sent but NOT persisted: submit_walkthrough_request has no parameter
          // for either. They are kept on the wire so that widening the RPC is a
          // server-side change only. See the route's header comment.
          source_page: sourcePage,
          source_cta: sourceCta,
        }),
      });

      if (res.ok) {
        setState('success');
        return;
      }

      // Distinguish the reasons the intake function actually returns, so a
      // person who hit a rate limit is not told to "try again".
      let reason = '';
      try {
        reason = ((await res.json()) as { reason?: string }).reason ?? '';
      } catch {
        /* a body we cannot parse is handled by the generic message below */
      }

      if (res.status === 429 || reason === 'rate_limited') {
        setState('error');
        setError(
          'We already have a recent request from this address. We will be in touch shortly.',
        );
        return;
      }
      if (reason === 'invalid_email') {
        setState('error');
        setError('Please enter a valid work email.');
        return;
      }
      throw new Error(reason || 'failed');
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
      {/* HONEYPOT — never shown, never focusable, never announced. */}
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        aria-hidden="true"
        autoComplete="off"
        value={companyWebsite}
        onChange={(e) => setCompanyWebsite(e.target.value)}
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
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
