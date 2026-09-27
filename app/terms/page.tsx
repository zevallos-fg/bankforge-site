import type { Metadata } from 'next';
import { CONTACT_EMAIL, LEGAL_ENTITY } from '@/app/lib/site';

/**
 * Interim Terms notice (TW1.L.1, S1). Still noindex.
 *
 * WHAT CHANGED AND WHY. This page was a placeholder reading "these terms are with
 * our legal counsel and are not yet published" for 161+ days
 * (TD-MARKETING-SITE-HAS-NO-TERMS-OR-PRIVACY, fd6d19a8). D-TW-16 is a launch GO,
 * so the site goes public — and a public site that collects an email address
 * through a form while saying nothing about the terms of its own use is worse than
 * one that says the few things that are actually true. This is the smaller of two
 * honest options, not a substitute for the attorney-drafted version.
 *
 * WHAT THIS DELIBERATELY DOES NOT DO. It states no governing law, no jurisdiction,
 * no venue, no arbitration clause, no limitation-of-liability cap, no retention
 * period and no certification. Every one of those is a legal commitment that would
 * be invented here rather than decided, and an invented commitment is a worse
 * defect than an absent one because it reads as settled. The notice says what is
 * true today and says plainly that counsel has not reviewed it.
 *
 * It stays noindex: an interim notice is for the person reading the site, not for
 * a search engine to index as though it were a published agreement.
 * TD-MARKETING-SITE-HAS-NO-TERMS-OR-PRIVACY stays OPEN until counsel-reviewed
 * versions ship.
 */
export const metadata: Metadata = {
  title: 'Terms of Service',
  robots: { index: false, follow: false },
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <p className="mb-8 rounded border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
          <strong>Interim &mdash; pending review by counsel.</strong> This notice is
          published so the site is not silent about its own terms. It has not been
          reviewed by an attorney and will be replaced by a version that has.
        </p>

        <h1
          className="text-2xl text-bf-navy-deep"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Terms of Service
        </h1>

        <div className="mt-8 space-y-7 text-base leading-relaxed text-gray-700">
          <section>
            <h2 className="text-lg text-bf-navy-deep">Who operates this site</h2>
            <p className="mt-2">This site is operated by {LEGAL_ENTITY}.</p>
          </section>

          <section>
            <h2 className="text-lg text-bf-navy-deep">
              What the content on this site is
            </h2>
            <p className="mt-2">
              Everything published here is general information about website compliance
              review and about how financial institutions appear in answer engines. It
              is not legal advice, not compliance advice, and not a legal opinion about
              your institution. It does not create an attorney&ndash;client
              relationship, and reading it is not a substitute for advice from your own
              counsel or compliance officer.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-bf-navy-deep">
              What a reading on this site does and does not mean
            </h2>
            <p className="mt-2">
              Where this site shows a figure for an institution, it reports what our own
              measurement returned on the date named beside it. Answer engines give
              different answers to the same question at different times, so a reading is
              an observation on a date rather than a settled fact about the institution.
              Where we hold no reading, the site says so rather than showing a number in
              its place.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-bf-navy-deep">No warranty</h2>
            <p className="mt-2">
              The site and its content are provided as they are, without warranties of
              any kind, express or implied. We do not warrant that the content is
              complete, current, or fit for a particular purpose, and we do not warrant
              that any outcome follows from acting on it.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-bf-navy-deep">
              Nothing is sold or charged here
            </h2>
            <p className="mt-2">
              There is no account, no signup and no payment on this site. Prices shown
              are for information. Submitting the walkthrough form requests a
              conversation; it does not create an agreement, an engagement, or a charge.
            </p>
          </section>

          <section>
            <h2 className="text-lg text-bf-navy-deep">Changes</h2>
            <p className="mt-2">
              This notice is interim and will be replaced once counsel has reviewed a
              full set of terms.
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
