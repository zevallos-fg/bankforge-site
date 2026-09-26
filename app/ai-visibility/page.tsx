import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro, FindingList, CtaBand } from '@/app/components/PageIntro';
import FaqBlock, { type FaqItem } from '@/app/components/FaqBlock';
import { ANSWER_ENGINES, MEASURED } from '@/app/lib/site';

/**
 * MONEY PAGE 8 (D-TW-13) — buyer prompt: "What is AI visibility for financial
 * institutions". New route, serving BOTH lanes, and linked from the home page.
 *
 * This is the definitional page the other seven link to, so it is the one that
 * most needs to avoid overclaiming. It describes how answer engines choose sources
 * in general terms only, and the single figure it carries
 * (MEASURED.aiVisibilityQueriesThisMonth) carries its read month and the three
 * engines it spans. No share, percentage, growth or adoption claim appears —
 * "a growing share of people ask an assistant first" is exactly the sort of
 * unsourced claim the gate exists to stop, so it is not made here.
 *
 * The two peer definitions differ by lane and the page says so rather than
 * flattening them: advisers are compared with peers in their metro area,
 * institutions within their asset tier and state.
 */

export const metadata: Metadata = {
  title: 'What is AI visibility for financial institutions',
  description:
    'AI visibility is whether an AI assistant names your firm when someone asks it a question you could answer. What it means for investment advisers and for banks and credit unions, measured across ChatGPT, Perplexity and Google AI Overviews.',
  alternates: { canonical: '/ai-visibility' },
};

const parts = [
  {
    title: 'A question, not a keyword',
    body: 'We ask what a prospect or customer would actually ask — for an adviser in a city, or a bank offering a particular product — rather than submitting keyword strings.',
    anchor: 'Input',
  },
  {
    title: 'Three answer engines',
    body: `Each question goes to ${ANSWER_ENGINES.join(
      ', ',
    )}. Those are the three we hold measurements for, and we do not report on an engine we have not run.`,
    anchor: 'Coverage',
  },
  {
    title: 'Named, or named instead',
    body: 'We record whether you are named, which firms are named in your place, and what those firms publish that you do not. The second and third parts are usually more actionable than the first.',
    anchor: 'Output',
  },
  {
    title: 'Read against a peer set',
    body: 'Advisers are compared with peers in their metro area. Banks and credit unions are compared within their asset tier and state. Peers are described by market and never named.',
    anchor: 'Comparison',
  },
];

const faqs: readonly FaqItem[] = [
  {
    q: 'What is AI visibility for financial institutions?',
    a: 'It is whether an AI assistant names your firm when someone asks it a question your firm could answer, and what it says about you when it does. Where traditional search returns a list of links, an assistant writes an answer that names a few firms — so the question changes from "where do we rank?" to "are we named at all, and who is named beside us?"',
  },
  {
    q: 'How is it measured?',
    a: `We put the questions a prospect or customer would ask to ${ANSWER_ENGINES.join(
      ', ',
    )}, record whether your firm is named, record which firms are named instead, and note what those firms publish that you do not. The result is read against a peer set: peers in your metro area for advisers, asset tier and state for banks and credit unions.`,
  },
  {
    q: 'Why do the answers change between runs?',
    a: `Because these systems do not return a fixed result the way a database query does. The same question can return different firms on different days. ${MEASURED.aiVisibilityQueriesThisMonth.toLocaleString(
      'en-US',
    )} questions were put to those three engines since 1 ${
      MEASURED.readOn
    }. A reading therefore reports the dates it was taken on, and the direction across several readings is more informative than any single run.`,
  },
  {
    q: 'Is AI visibility the same as SEO?',
    a: 'They overlap without being the same. Both depend on what you publish and how readable it is. But optimisation is measured by position in a list of links, and this is measured by whether you are named inside a written answer. A firm can do acceptably at one and poorly at the other.',
  },
  {
    q: 'Can you promise we will be named?',
    a: 'No, and nobody honestly can. Anything an assistant says about your firm is its own output and we do not control it. What can be worked on is what is publicly readable about you, which is the material an assistant has to draw on when it answers.',
  },
  {
    q: 'Does this apply to advisers as well as banks?',
    a: 'Yes, with different peer sets and different questions. An adviser is usually asked about by someone looking for an adviser in a place; a bank is often asked about by someone comparing a product. The method is the same and the comparison set is not.',
  },
];

export default function AiVisibilityPage() {
  return (
    <>
      <PageIntro
        eyebrow="Investment advisers · Banks and credit unions"
        title="What is AI visibility for financial institutions?"
        lede="The short version, how it is measured, and what it is not."
      />

      {/* ANSWER FIRST */}
      <section className="bg-white px-6 pt-14 pb-4">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-gray-700">
            AI visibility is whether an AI assistant names your firm when someone asks it
            a question your firm could answer, and what it says about you when it does.
            Where a search engine returns a list of links, an assistant writes an answer
            that names a few firms — so the question changes from where you rank to
            whether you are named at all, and which firms are named beside you. We measure
            it by putting the questions a prospect or customer would ask to{' '}
            {ANSWER_ENGINES.join(', ')}, recording what came back, and reading the result
            against a peer set. Because answers move between runs, a reading reports the
            dates it was taken on rather than acting as a standing score.
          </p>
        </div>
      </section>

      <FindingList
        heading="What a reading consists of"
        intro="Four parts. The comparison is the one that tells you whether to act."
        items={parts}
      />

      <section className="bg-bf-slate px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <h2
            className="text-xl text-bf-navy-deep"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            What it is not
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            It is not a placement you can buy, and it is not an outcome anyone can
            promise. Anything an assistant says about your firm is its own output and we
            do not control it. It is also not a single permanent number: the same question
            can return different firms on different days, which is why a reading is
            reported with its dates.
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            We also will not tell you how an assistant decided. Those mechanics are not
            published, and a ranking factor we cannot evidence is not one we will sell
            you.
          </p>
        </div>
      </section>

      <FaqBlock items={faqs} heading="Questions about AI visibility" />

      {/* CLOSING RESTATEMENT */}
      <section className="bg-white px-6 pb-14">
        <div className="mx-auto max-w-3xl border-t border-gray-200 pt-8">
          <p className="text-base leading-relaxed text-gray-700">
            In short: AI visibility is whether the assistants name you when someone asks
            a question you could answer, and who they name instead. It is measured by
            asking, across {ANSWER_ENGINES.join(', ')}, and reported with the dates it
            was asked on.
          </p>
          <p className="mt-5 text-sm text-gray-600">
            For your lane:{' '}
            <Link href="/rias/ai-visibility" className="text-bf-navy underline">
              AI visibility for financial advisors
            </Link>
            {' · '}
            <Link href="/banks/ai-visibility" className="text-bf-navy underline">
              AI SEO for community banks
            </Link>
            {' · '}
            <Link href="/rias/ai-visibility/chatgpt" className="text-bf-navy underline">
              how advisors show up in ChatGPT
            </Link>
            {' · '}
            <Link href="/pricing" className="text-bf-navy underline">
              pricing
            </Link>
          </p>
        </div>
      </section>

      <CtaBand
        title="Ask us what they say about you"
        body="We will run the questions for your firm and show you what came back, alongside your peer set."
        subject="AI visibility for financial institutions"
        secondaryHref="/pricing"
        secondaryLabel="See pricing"
      />
    </>
  );
}
