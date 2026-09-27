import type { Metadata } from 'next';
import { CONTACT_EMAIL, LEGAL_ENTITY } from '@/app/lib/site';

/**
 * Interim Privacy notice (TW1.L.1, S1). Still noindex.
 *
 * EVERY STATEMENT BELOW WAS READ OFF THE CODE, not assumed. Measured 2026-09-26 on
 * the launch tree:
 *
 *   - The walkthrough form (app/components/WalkthroughForm.tsx) sends exactly
 *     email, name, institution, the institution-type select, and message. It also
 *     sends a hidden anti-spam field; a filled value makes the route return 200
 *     WITHOUT writing a row, so its contents are never stored. That is why the
 *     notice lists five fields and mentions the sixth for what it is.
 *   - Neither API route reads an IP address, a referrer, a user agent or a cookie.
 *     Grepped for `headers`, `x-forwarded`, `referer`, `user-agent`, `cookies(` in
 *     app/api/**: zero hits. The old route DID persist a server-derived referrer;
 *     the RPC has no parameter for it, so it is not collected any more.
 *   - There is no analytics package, no tag manager and no third-party script. The
 *     only <script> in app/layout.tsx is inline JSON-LD. `@vercel/analytics` is not
 *     a dependency. Fonts come through next/font, which self-hosts the files at
 *     build time, so loading a page makes no request to a font host.
 *   - The look-up tool records no domain. public.scan_preview_lookup increments a
 *     per-minute counter in scan_preview_rate_bucket (minute_bucket, call_count)
 *     for rate limiting and writes nothing else.
 *
 * WHAT THIS DELIBERATELY DOES NOT CLAIM. No retention period, no legal basis under
 * a named regime, no transfer mechanism, no certification, no jurisdiction. Those
 * are decisions, and inventing one here would read as settled when it is not.
 *
 * A placeholder that collects an email address while stating no purpose for it was
 * the actual defect (TD-MARKETING-SITE-HAS-NO-TERMS-OR-PRIVACY, fd6d19a8). That TD
 * stays OPEN until counsel-reviewed versions ship.
 */
export const metadata: Metadata = {
  title: 'Privacy Policy',
  robots: { index: false, follow: false },
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <p className="mb-8 rounded border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
          <strong>Interim &mdash; pending review by counsel.</strong> This notice
          describes what the site collects today. It has not been reviewed by an
          attorney and will be replaced by a version that has.
        </p>

        <h1
          className="text-2xl text-bf-navy-deep"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Privacy Policy
        </h1>

        <div className="mt-8 space-y-7 text-base leading-relaxed text-gray-700">
          <section>
            <h2 className="text-lg text-bf-navy-deep">Who operates this site</h2>
            <p className="mt-2">This site is operated by {LEGAL_ENTITY}.</p>
          </section>

          <section>
            <h2 className="text-lg text-bf-navy-deep">
              What we collect, and where from
            </h2>
            <p className="mt-2">
              One form on this site collects anything: the walkthrough request form.
              When you submit it, we receive the five things you typed or chose:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>your name</li>
              <li>your email address</li>
              <li>your institution</li>
              <li>the type of institution you select</li>
              <li>your message, if you write one</li>
            </ul>
            <p className="mt-3">
              The form carries one further field that is hidden from people and exists
              to catch automated submissions. If it arrives filled, the request is
              discarded and nothing is stored.
            </p>
            <p className="mt-3">
              Nothing else on this site collects information about you. There is no
              account and no signup, so there is nothing to log in to.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-bf-navy-deep">
              What we do not collect
            </h2>
            <p className="mt-2">
              This site sets no cookies and runs no analytics, tag manager or
              third-party tracking script. Our forms and look-up do not record your IP
              address, the page you arrived from, or your browser&rsquo;s user agent.
            </p>
            <p className="mt-3">
              The institution look-up does not record the address you enter. It counts
              how many look-ups happen each minute, so the tool can be rate limited,
              and keeps nothing that identifies the request.
            </p>
            <p className="mt-3">
              Our hosting provider keeps its own operational server logs, as any host
              does. We do not add to them and we do not use them for marketing.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-bf-navy-deep">Why we hold it</h2>
            <p className="mt-2">
              To read your request and reply to it. That is the whole purpose. We do not
              add you to a mailing list from the form.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-bf-navy-deep">Who else sees it</h2>
            <p className="mt-2">
              We do not sell your information and we do not share it for anyone
              else&rsquo;s marketing. A request you submit is stored with the database
              provider that runs our systems, and reaches us by email. Those providers
              hold it so they can carry out that work for us.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-bf-navy-deep">
              Information about institutions, which is not information about you
            </h2>
            <p className="mt-2">
              Separately from the form, we hold measurements about financial
              institutions &mdash; drawn from public regulatory filings and from public
              websites, and from questions we put to answer engines. That is information
              about an organisation and its public website, not about you as an
              individual, and it is not built from anything a visitor to this site
              submits.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-bf-navy-deep">
              Asking us to delete what you sent
            </h2>
            <p className="mt-2">
              Write to{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-bf-navy underline">
                {CONTACT_EMAIL}
              </a>{' '}
              and ask us to delete your request, and we will delete it and confirm. You
              can also ask what we hold for you and we will tell you.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-bf-navy-deep">Changes</h2>
            <p className="mt-2">
              This notice is interim and will be replaced once counsel has reviewed a
              full privacy policy. If what we collect changes before then, this page
              changes with it.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-bf-navy-deep">Contact</h2>
            <p className="mt-2">
              Questions about this notice go to{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-bf-navy underline">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
