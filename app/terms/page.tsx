import type { Metadata } from 'next';
import { CONTACT_EMAIL } from '@/app/lib/site';

/**
 * Placeholder, and deliberately noindex.
 *
 * Launch is gated on an attorney-drafted Terms and Privacy (D-TW-10 Q5), so this
 * page stays a stub — but it is excluded from indexing rather than published as
 * though it were a real agreement. Tracked as
 * TD-MARKETING-SITE-HAS-NO-TERMS-OR-PRIVACY (fd6d19a8).
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
        <h1
          className="text-2xl text-bf-navy-deep"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Terms of Service
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-gray-600">
          These terms are with our legal counsel and are not yet published. Until they
          are, nothing on this site forms an agreement. For questions, write to{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-bf-navy underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
