import type { Metadata } from 'next';
import { PageIntro, FindingList, CtaBand } from '@/app/components/PageIntro';
import { ANSWER_ENGINES, MEASURED } from '@/app/lib/site';

export const metadata: Metadata = {
  title: 'AI visibility for investment advisers',
  description:
    'We put the questions prospects ask to ChatGPT, Perplexity and Google AI Overviews, record whether your firm is named, and benchmark the result against advisers in your metro area.',
  alternates: { canonical: '/rias/ai-visibility' },
};

const method = [
  {
    title: 'Questions a prospect would actually ask',
    body: 'Phrased the way someone looking for an adviser in your city would phrase them, not as keyword strings.',
    anchor: 'Method',
  },
  {
    title: 'Three answer engines',
    body: `Each question goes to ${ANSWER_ENGINES.join(', ')}, and we keep what each one returned.`,
    anchor: 'Coverage',
  },
  {
    title: 'Named, or named instead',
    body: 'We record whether your firm appears, which firms appear in its place, and what those firms publish that you do not.',
    anchor: 'Result',
  },
  {
    title: 'Benchmarked by metro area',
    body: 'Advisers are compared within their metro area. Peers are described by market, never by name.',
    anchor: 'Peer set',
  },
];

export default function RiaAiVisibilityPage() {
  return (
    <>
      <PageIntro
        eyebrow="Investment advisers · AI visibility"
        title="What an AI assistant says when asked for an adviser like you."
        lede="Search is no longer only a list of links. When someone asks an assistant to suggest an adviser in their city, something gets said — and it is worth knowing what."
      />

      <FindingList
        heading="How it is measured"
        intro="A visibility number on its own says very little. What it is next to is the part that tells you whether to act."
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
            between runs, so we report what came back on the dates we asked and track
            the direction over time rather than treating a single run as a verdict.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-gray-500">
            Anything an assistant says about your firm is its own output, not ours,
            and we do not control it.
          </p>
        </div>
      </section>

      <CtaBand
        title="Ask us what they say about you"
        body="We will run the questions for your firm and show you the answers alongside your metro-area peers."
        subject="RIA AI visibility walkthrough"
        secondaryHref="/pricing"
        secondaryLabel="See pricing"
      />
    </>
  );
}
