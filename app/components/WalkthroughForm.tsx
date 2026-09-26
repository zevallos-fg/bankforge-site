'use client';

import { useState } from 'react';

/**
 * Walkthrough request form.
 *
 * It POSTs JSON to `/api/demo-request`, which calls
 * `public.submit_walkthrough_request` with the anon key. Validation and rate
 * limiting live in that function, so this component does not duplicate either —
 * it renders whatever the route reports back.
 *
 * There is still no signup and no payment on the site (D-TW-10). This collects a
 * request for a conversation and nothing else.
 *
 * The `company_website` field is a honeypot: visually hidden, `aria-hidden`, and
 * removed from the tab order, so a person never sees or focuses it. A filled
 * value makes the route return 200 without writing a row.
 */

type State =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'error'; message: string };

const LANES: { value: string; label: string }[] = [
  { value: 'ria', label: 'Investment adviser' },
  { value: 'bank', label: 'Bank or credit union' },
  { value: 'bd', label: 'Broker-dealer' },
  { value: 'other', label: 'Something else' },
];

export default function WalkthroughForm({
  lane = 'ria',
  heading = 'Book a walkthrough',
  body = 'Tell us what you are registered as and what you are worried about. We will reply with what a review would look at on your own site.',
}: {
  lane?: string;
  heading?: string;
  body?: string;
}) {
  const [state, setState] = useState<State>({ kind: 'idle' });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ kind: 'sending' });

    const fd = new FormData(e.currentTarget);
    const payload = {
      email: String(fd.get('email') ?? ''),
      name: String(fd.get('name') ?? ''),
      institution: String(fd.get('institution') ?? ''),
      lane: String(fd.get('lane') ?? lane),
      message: String(fd.get('message') ?? ''),
      company_website: String(fd.get('company_website') ?? ''),
    };

    try {
      const res = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setState({ kind: 'sent' });
        return;
      }

      // Say what actually happened. A form that reports success on a refusal is
      // how a request goes missing without anyone knowing.
      if (res.status === 429) {
        setState({
          kind: 'error',
          message:
            'We have already had a few requests from this address today. Email us directly and we will pick it up.',
        });
        return;
      }
      if (res.status === 400) {
        setState({
          kind: 'error',
          message: 'That email address does not look right. Please check it and try again.',
        });
        return;
      }
      setState({
        kind: 'error',
        message: 'Something went wrong on our side. Please email us instead.',
      });
    } catch {
      setState({
        kind: 'error',
        message: 'We could not reach the server. Please email us instead.',
      });
    }
  }

  if (state.kind === 'sent') {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8">
        <h2
          className="text-xl text-bf-navy-deep"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Request received
        </h2>
        <p className="mt-3 text-base leading-relaxed text-gray-600">
          Thank you — we have your request and will reply by email. Nothing has been
          charged and no account has been created.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8">
      <h2
        className="text-xl text-bf-navy-deep"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {heading}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-gray-600">{body}</p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-bf-navy-deep">Your name</span>
            <input
              type="text"
              name="name"
              autoComplete="name"
              maxLength={120}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-bf-navy-deep">
              Work email <span aria-hidden="true">*</span>
            </span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              maxLength={254}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-bf-navy-deep">Firm or institution</span>
          <input
            type="text"
            name="institution"
            autoComplete="organization"
            maxLength={200}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-bf-navy-deep">What are you registered as?</span>
          <select
            name="lane"
            defaultValue={lane}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            {LANES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-bf-navy-deep">
            What would you like us to look at?
          </span>
          <textarea
            name="message"
            rows={4}
            maxLength={2000}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </label>

        {/* Honeypot. Never shown, never focusable, never announced. */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            overflow: 'hidden',
            clip: 'rect(0 0 0 0)',
            whiteSpace: 'nowrap',
          }}
        >
          <label htmlFor="company_website">Company website</label>
          <input
            id="company_website"
            type="text"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={state.kind === 'sending'}
            className="rounded-lg bg-bf-navy px-6 py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {state.kind === 'sending' ? 'Sending…' : 'Request a walkthrough'}
          </button>
          <p className="text-xs text-gray-500">
            No signup and no payment. We reply by email.
          </p>
        </div>

        {state.kind === 'error' && (
          <p role="alert" className="text-sm text-red-700">
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}
