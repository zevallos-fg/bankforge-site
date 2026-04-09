'use client';

import { useState } from 'react';

interface DemoRequestFormProps {
  audienceType: 'bank' | 'credit_union' | 'ria' | 'unknown';
  sourcePage: string;
  sourceCta: string;
  ctaLabel: string;
  buttonClassName?: string;
}

export default function DemoRequestForm({
  audienceType,
  sourcePage,
  sourceCta,
  ctaLabel,
  buttonClassName = 'bg-white text-bf-navy-deep font-medium px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors text-sm',
}: DemoRequestFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

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

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <p className="text-sm text-gray-600">
        We&apos;ll be in touch within one business day.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-md">
      <input
        type="email"
        required
        placeholder="Work email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
      />
      <input
        type="text"
        placeholder="Name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
      />
      <button
        type="submit"
        disabled={submitting}
        className={`${buttonClassName} disabled:opacity-50 shrink-0 whitespace-nowrap`}
      >
        {submitting ? 'Sending...' : ctaLabel}
      </button>
      {error && <p className="text-red-600 text-xs w-full">{error}</p>}
    </form>
  );
}
