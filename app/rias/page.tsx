import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro, FindingList, CtaBand } from '@/app/components/PageIntro';
import { MEASURED, ANSWER_ENGINES } from '@/app/lib/site';

export const metadata: Metadata = {
  title: 'For investment advisers',
  description:
    'Tiqsi reviews RIA websites against SEC Marketing Rule 206(4)-1 criteria and measures how the firm appears in AI search among metro-area peers.',
  alternates: { canonical: '/rias' },
};

const items = [
  {
    title: 'Testimonials and endorsements',
    body: 'A client statement or an endorsement shown without the required disclosure of compensation and material conflicts.',
    anchor: 'Rule 206(4)-1(b)',
  },
  {
    title: 'Third-party ratings',
    body: 'A rating, ranking or award displayed without the criteria behind it, the period it covers, or whether anything was paid for it.',
    anchor: 'Rule 206(4)-1(c)',
  },
  {
    title: 'Performance advertising',
    body: 'Performance shown without the presentation and time-period conditions the rule attaches to it.',
    anchor: 'Rule 206(4)-1(d)',
  },
  {
    title: 'Form ADV alignment',
    body: 'Statements on the site that sit uneasily beside what the firm describes in its own filings.',
    anchor: 'Form ADV Part 2A',
  },
  {
    title: 'Privacy notice access',
    body: 'Whether the privacy notice is actually reachable from the public site, and in what form.',
    anchor: 'Regulation S-P',
  },
  {
    title: 'Form CRS posting',
    body: 'Whether the relationship summary is posted and current on the public site.',
    anchor: 'Form CRS',
  },
];

export default function RiasPage() {
  return (
    <>
      <PageIntro
        eyebrow="Investment advisers"
        title="The Marketing Rule, read off your own website."
        lede="Most adviser marketing findings are not subtle judgements. They are a disclosure that is missing, a rating without its criteria, or a notice nobody can reach. Those are visible from outside, which is exactly how an examiner sees them."
      />

      <FindingList
        heading="What the review looks at"
        intro="Each item names the rule it comes from, so your compliance counsel can act on it or set it aside on the merits."
        items={items}
      />

      <section className="bg-bf-slate px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2
            className="text-2xl text-bf-navy-deep"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Where you stand with advisers near you
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-600">
            Comparisons for advisers are drawn by metro area. When someone asks{' '}
            {ANSWER_ENGINES.join(', ')} for an adviser in your city, we record whether
            you are named and which firms are named instead. We describe peers by
            market and never by name.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            {MEASURED.rias.toLocaleString('en-US')} SEC-registered investment advisers
            were tracked as of {MEASURED.readOn}.
          </p>
          <Link
            href="/rias/ai-visibility"
            className="mt-6 inline-block text-sm font-medium text-bf-navy hover:underline"
          >
            How AI visibility is measured →
          </Link>
        </div>
      </section>

      <CtaBand
        title="See it on your own site"
        body="We will run the review, walk you through what it surfaces, and you decide whether it is worth acting on."
        subject="RIA walkthrough request"
        secondaryHref="/pricing"
        secondaryLabel="See pricing"
      />
    </>
  );
}
