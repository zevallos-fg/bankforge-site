import type { Metadata } from 'next';
import { CONTACT_EMAIL } from '@/app/lib/site';

/**
 * Placeholder, and deliberately noindex. See app/terms/page.tsx for the reason.
 * Tracked as TD-MARKETING-SITE-HAS-NO-TERMS-OR-PRIVACY (fd6d19a8).
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
        <h1
          className="text-2xl text-bf-navy-deep"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-gray-600">
          This policy is with our legal counsel and is not yet published. For
          questions about what we hold, write to{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-bf-navy underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
