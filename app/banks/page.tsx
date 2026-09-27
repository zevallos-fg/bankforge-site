import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro, FindingList, CtaBand } from '@/app/components/PageIntro';
import { MEASURED, ANSWER_ENGINES } from '@/app/lib/site';

export const metadata: Metadata = {
  title: 'For banks and credit unions',
  description:
    'Tiqsi reviews bank and credit union websites against deposit advertising, lending disclosure, Fair Lending, UDAAP and FFIEC criteria, and benchmarks AI search visibility by asset tier and state. Deposit advertising is Regulation DD for banks and the NCUA rule at 12 CFR part 707 for credit unions.',
  alternates: { canonical: '/banks' },
};

const items = [
  {
    title: 'Rate advertising',
    body:
      'A rate shown without the disclosures that have to travel with it once you advertise it. Which rule that is depends on your charter: 12 CFR 1030.1(c) provides that Regulation DD applies to depository institutions except for credit unions, and the National Credit Union Administration issues the parallel Truth in Savings rule for credit unions at 12 CFR part 707, whose advertising section is 707.8.',
    anchor: 'Regulation DD 12 CFR 1030 (banks) / NCUA 12 CFR 707 (credit unions)',
  },
  {
    title: 'Triggering terms',
    body: 'A loan page that names a term which obliges the rest of the disclosure to appear with it.',
    anchor: 'Regulation Z',
  },
  {
    title: 'Equal Housing Lender',
    body: 'Whether the required housing-lender disclosure is present where mortgage products are described.',
    anchor: 'ECOA / Regulation B',
  },
  {
    title: 'Non-deposit products',
    body: 'Investment and insurance products described without the not-FDIC-insured disclaimer the guidance expects.',
    anchor: 'FFIEC guidance',
  },
  {
    title: 'UDAAP language',
    body: 'Claims and comparisons written in a way a reader could reasonably be misled by.',
    anchor: 'UDAAP',
  },
  {
    title: 'NMLS identifier',
    body: 'Whether the identifier appears where mortgage origination is discussed.',
    anchor: 'SAFE Act',
  },
];

export default function BanksPage() {
  return (
    <>
      <PageIntro
        eyebrow="Banks and credit unions"
        title="The disclosures an examiner can check without asking you."
        lede="Before anyone requests a document, your public website already answers a lot of questions about how you advertise. It is worth knowing what it currently says."
      />

      <FindingList
        heading="What the review looks at"
        intro="Each item names the regulation behind it, and where banks and credit unions are under different rules it names both. The report is meant to be arguable — your compliance team should be able to disagree with a finding on the merits."
        items={items}
      />

      <section className="bg-bf-slate px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2
            className="text-2xl text-bf-navy-deep"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Compared with institutions your size
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-600">
            Banks and credit unions are compared by asset tier and state, so the
            comparison is against institutions facing the same examiners and the same
            market. When someone asks {ANSWER_ENGINES.join(', ')} for a bank in your
            area, we record what comes back. Peers are described by tier and market,
            never by name.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            {MEASURED.banks.toLocaleString('en-US')} FDIC-insured banks with a
            recorded asset tier and {MEASURED.creditUnions.toLocaleString('en-US')}{' '}
            NCUA-supervised credit unions were tracked as of {MEASURED.readOn}.
          </p>
          <Link
            href="/banks/ai-visibility"
            className="mt-6 inline-block text-sm font-medium text-bf-navy hover:underline"
          >
            How AI visibility is measured →
          </Link>
        </div>
      </section>

      <CtaBand
        title="See it on your own site"
        body="We will run the review, walk you through the findings, and you decide what is worth acting on."
        subject="Bank walkthrough request"
        secondaryHref="/pricing"
        secondaryLabel="See pricing"
      />
    </>
  );
}
