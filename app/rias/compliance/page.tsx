import type { Metadata } from 'next';
import { PageIntro, FindingList, CtaBand } from '@/app/components/PageIntro';

export const metadata: Metadata = {
  title: 'Marketing Rule review for investment advisers',
  description:
    'A structured review of an adviser website against SEC Marketing Rule 206(4)-1 criteria. Findings are severity-graded, carry their citation, and are reviewed by a person before delivery.',
  alternates: { canonical: '/rias/compliance' },
};

const deliverable = [
  {
    title: 'Severity-graded findings',
    body: 'Each item is High, Medium or Low, with the page and the element it was found on.',
    anchor: 'Per finding',
  },
  {
    title: 'The citation, not an opinion',
    body: 'Every finding names the rule or form behind it, so it can be argued with on the merits.',
    anchor: 'Per finding',
  },
  {
    title: 'Reviewed before it reaches you',
    body: 'Findings are read by a person before delivery. We flag items for counsel; we do not conclude that a violation has occurred.',
    anchor: 'Before delivery',
  },
  {
    title: 'A document you can circulate',
    body: 'Delivered as a written report your compliance counsel and marketing team can work from directly.',
    anchor: 'Deliverable',
  },
];

export default function RiaCompliancePage() {
  return (
    <>
      <PageIntro
        eyebrow="Investment advisers · Compliance"
        title="A Marketing Rule review of your public site."
        lede="We read the pages your prospects read, against the criteria an examiner would apply, and write down what we find with the rule attached to it."
      />

      <FindingList
        heading="What you get"
        intro="The point of the report is that someone can disagree with it. A finding without its citation is just an opinion about your marketing."
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
            This is not legal advice, and it is not a compliance opinion. We identify
            things on your public website that a regulator could ask about, and we
            hand them to the people whose job it is to decide what they mean. Whether
            something is a violation is a judgement for your counsel.
          </p>
        </div>
      </section>

      <CtaBand
        title="Book a walkthrough"
        body="We will show you the review on your own site before you commit to anything."
        subject="RIA Marketing Rule review"
        secondaryHref="/pricing"
        secondaryLabel="See pricing"
      />
    </>
  );
}
