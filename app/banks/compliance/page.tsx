import type { Metadata } from 'next';
import { PageIntro, FindingList, CtaBand } from '@/app/components/PageIntro';

export const metadata: Metadata = {
  title: 'Compliance review for banks and credit unions',
  description:
    'A structured review of a bank or credit union website against Regulation DD, Regulation Z, Fair Lending, UDAAP and FFIEC criteria. Findings are severity-graded and carry their citation.',
  alternates: { canonical: '/banks/compliance' },
};

const deliverable = [
  {
    title: 'Severity-graded findings',
    body: 'High, Medium or Low, each tied to the page and the element it was found on.',
    anchor: 'Per finding',
  },
  {
    title: 'The regulation, stated',
    body: 'Every finding names the regulation or guidance behind it rather than asserting a problem.',
    anchor: 'Per finding',
  },
  {
    title: 'Reviewed before delivery',
    body: 'A person reads the findings before you do. We flag items for counsel; we do not conclude that a violation has occurred.',
    anchor: 'Before delivery',
  },
  {
    title: 'Tracked over time',
    body: 'On an ongoing engagement the same criteria are re-run, so you can see what was fixed and what reappeared.',
    anchor: 'Ongoing',
  },
];

export default function BankCompliancePage() {
  return (
    <>
      <PageIntro
        eyebrow="Banks and credit unions · Compliance"
        title="A compliance review of your public site."
        lede="We read your public pages against the advertising and disclosure rules that apply to them, and write down what we find with the regulation attached."
      />

      <FindingList
        heading="What you get"
        intro="A report your compliance team can work from, and argue with."
        items={deliverable}
      />

      <section className="bg-white px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <h2
            className="text-xl text-bf-navy-deep"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            What this is not
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            This is not legal advice and it is not an examination. We surface things
            on your public website that a regulator could ask about, and hand them to
            the people whose job it is to decide what they mean.
          </p>
        </div>
      </section>

      <CtaBand
        title="Book a walkthrough"
        body="We will show you the review on your own site first."
        subject="Bank compliance review"
        secondaryHref="/pricing"
        secondaryLabel="See pricing"
      />
    </>
  );
}
