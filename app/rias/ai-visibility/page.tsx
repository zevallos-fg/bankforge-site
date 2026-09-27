import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro, FindingList, CtaBand } from '@/app/components/PageIntro';
import FaqBlock, { type FaqItem } from '@/app/components/FaqBlock';
import { ANSWER_ENGINES, MEASURED } from '@/app/lib/site';
import { getPricing, ctaFor, rowsForLane } from '@/app/lib/pricing';

/**
 * MONEY PAGE 3 (D-TW-13) — buyer prompt: "AI visibility for financial advisors".
 *
 * Restructured around that prompt: answer-first opening, a closing restatement,
 * and an FAQ whose FAQPage JSON-LD is generated from the same array as the
 * visible text.
 *
 * The engines named are exactly the three with rows in
 * `public.ai_visibility_msa_queries` (ANSWER_ENGINES). No fourth engine is named
 * and no competitor is compared. Every figure carries its read date, and peer
 * wording is "peers in your metro area" with no size claim.
 */

export const metadata: Metadata = {
  title: 'AI visibility for financial advisors',
  description:
    'What AI visibility means for a financial advisor: whether ChatGPT, Perplexity and Google AI Overviews name your firm when someone asks for an adviser, which firms are named instead, and how that compares with peers in your metro area.',
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
    title: 'Compared with peers in your metro area',
    body: 'Advisers are compared with peers in their metro area. Peers are described by market, never by name.',
    anchor: 'Peer set',
  },
];

const faqs: readonly FaqItem[] = [
  {
    q: 'What is AI visibility for a financial advisor?',
    a: 'It is whether an AI assistant names your firm when someone asks it for an adviser, and what it says about you when it does. We put the questions a prospect would ask to ChatGPT, Perplexity and Google AI Overviews, record whether your firm is named, note which firms are named instead, and compare the result with peers in your metro area.',
  },
  {
    q: 'Which AI engines do you check?',
    a: `${ANSWER_ENGINES.join(', ')}. Those are the three we have measurements for, so those are the three we report on. We do not report on an engine we have not run.`,
  },
  {
    q: 'Does a single reading settle it?',
    a: `No. Answers move between runs, so a reading describes the dates it was taken on rather than acting as a verdict. ${MEASURED.aiVisibilityQueriesThisMonth.toLocaleString(
      'en-US',
    )} such questions were put to those three engines since 1 ${
      MEASURED.readOn
    }. What is useful is the direction over several readings, and what your peers show that you do not.`,
  },
  {
    q: 'Can you make an assistant say something specific about my firm?',
    a: 'No, and you should be wary of anyone who says they can. Anything an assistant says about your firm is its own output and we do not control it. What can be worked on is what is publicly readable about you, which is the material an assistant has to draw on.',
  },
  {
    q: 'How are peers chosen?',
    a: 'Advisers are compared with peers in their metro area. We describe the peer set by market and never name the firms in it — the same courtesy we extend to you when your firm appears in someone else’s comparison.',
  },
  {
    q: 'Is this the same as search engine optimisation?',
    a: 'It overlaps but it is not the same question. Traditional optimisation asks where you rank in a list of links. This asks whether you are named at all in a written answer, and what is named beside you. Both depend on what you publish, but the thing being measured is different.',
  },
];

export default async function RiaAiVisibilityPage() {
  const pricing = await getPricing();
  const edge = rowsForLane(pricing.rows, 'ria').filter((r) => r.family === 'edge');
  const cta = ctaFor(
    pricing.bound && edge.length > 0 ? edge[0].site_status : 'book_walkthrough',
  );

  return (
    <>
      <PageIntro
        eyebrow="Investment advisers · AI visibility"
        title="AI visibility for financial advisors"
        lede="What an AI assistant says when someone asks it for an adviser like you — and how to find out."
      />

      {/* ANSWER FIRST */}
      <section className="bg-white px-6 pt-14 pb-4">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-gray-700">
            AI visibility for a financial advisor is whether an AI assistant names your
            firm when a prospect asks it for an adviser, and what it says about you when
            it does. We put the questions a prospect would actually ask to{' '}
            {ANSWER_ENGINES.join(', ')}, record whether your firm is named, note which
            firms are named in its place, and set the result against peers in your metro
            area. Answers move between runs, so a reading describes the dates it was
            taken on rather than serving as a verdict.
          </p>
        </div>
      </section>

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
            Anything an assistant says about your firm is its own output, not ours, and
            we do not control it.
          </p>
        </div>
      </section>

      <FaqBlock items={faqs} heading="Questions advisers ask about AI visibility" />

      {/* CLOSING RESTATEMENT */}
      <section className="bg-white px-6 pb-14">
        <div className="mx-auto max-w-3xl border-t border-gray-200 pt-8">
          <p className="text-base leading-relaxed text-gray-700">
            In short: AI visibility is whether the assistants name your firm when asked
            for an adviser, and what they name instead. We measure it across{' '}
            {ANSWER_ENGINES.join(', ')}, report the dates we asked on, and compare the
            result with peers in your metro area.
          </p>
          <p className="mt-5 text-sm text-gray-600">
            Related:{' '}
            <Link href="/rias" className="text-bf-navy underline">
              everything for investment advisers
            </Link>
            {' · '}
            <Link href="/rias/ai-visibility/chatgpt" className="text-bf-navy underline">
              how advisors show up in ChatGPT
            </Link>
            {' · '}
            <Link href="/pricing" className="text-bf-navy underline">
              pricing
            </Link>
            {' · '}
            <Link href="/ai-visibility" className="text-bf-navy underline">
              what AI visibility is
            </Link>
          </p>
        </div>
      </section>

      <CtaBand
        title="Ask us what they say about you"
        body="We will run the questions for your firm and show you the answers alongside peers in your metro area."
        label={cta.label}
        subject="RIA AI visibility walkthrough"
        secondaryHref="/rias/pricing"
        secondaryLabel="See what it costs"
      />
    </>
  );
}
