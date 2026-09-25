import type { Metadata } from 'next';
import { PageIntro, FindingList, CtaBand } from '@/app/components/PageIntro';
import { ANSWER_ENGINES, MEASURED } from '@/app/lib/site';

export const metadata: Metadata = {
  title: 'AI visibility for banks and credit unions',
  description:
    'We put the questions customers ask to ChatGPT, Perplexity and Google AI Overviews, record whether your institution is named, and benchmark the result by asset tier and state.',
  alternates: { canonical: '/banks/ai-visibility' },
};

const method = [
  {
    title: 'Questions a customer would ask',
    body: 'Phrased the way someone comparing banks in your area would phrase them.',
    anchor: 'Method',
  },
  {
    title: 'Three answer engines',
    body: `Each question goes to ${ANSWER_ENGINES.join(', ')}, and we keep the response.`,
    anchor: 'Coverage',
  },
  {
    title: 'What the site gives them to work with',
    body: 'Structured data, the reachability of product pages, and whether AI crawlers can read them at all.',
    anchor: 'Signals',
  },
  {
    title: 'Benchmarked by tier and state',
    body: 'Institutions are compared within their asset tier and state. Peers are described, never named.',
    anchor: 'Peer set',
  },
];

export default function BankAiVisibilityPage() {
  return (
    <>
      <PageIntro
        eyebrow="Banks and credit unions · AI visibility"
        title="What an AI assistant says when asked for a bank like yours."
        lede="A growing share of the people comparing institutions ask an assistant first. What it returns is worth measuring rather than assuming."
      />

      <FindingList
        heading="How it is measured"
        intro="The comparison is the useful part: a score on its own does not tell you whether to do anything."
        items={method}
      />

      <section className="bg-bf-slate px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <h2
            className="text-xl text-bf-navy-deep"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            What a reading is worth
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            {MEASURED.aiVisibilityQueriesThisMonth.toLocaleString('en-US')} questions
            were put to those three engines since 1 {MEASURED.readOn}. Answers move
            between runs, so we report what came back on the dates we asked and follow
            the direction rather than treating one run as settled.
          </p>
        </div>
      </section>

      <CtaBand
        title="Ask us what they say about you"
        body="We will run the questions for your institution and show you the answers next to your tier and state."
        subject="Bank AI visibility walkthrough"
        secondaryHref="/pricing"
        secondaryLabel="See pricing"
      />
    </>
  );
}
