import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro, FindingList, CtaBand } from '@/app/components/PageIntro';
import FaqBlock, { type FaqItem } from '@/app/components/FaqBlock';
import { ANSWER_ENGINES, MEASURED } from '@/app/lib/site';
import { getPricing, ctaFor, rowsForLane } from '@/app/lib/pricing';

/**
 * MONEY PAGE 7 (D-TW-13) — buyer prompt: "AI SEO for community banks".
 *
 * Restructured around that prompt. "AI SEO" is the buyer's phrase and is used in
 * the title and H1; "GEO" is forbidden by the copy claims gate and does not
 * appear. Engines named are exactly ANSWER_ENGINES, no competitor comparison,
 * and every figure carries its read month.
 *
 * Peer wording for this lane is asset tier and state — the bank peer set — which
 * is a different peer definition from the adviser lane's metro area.
 */

export const metadata: Metadata = {
  title: 'AI SEO for community banks',
  description:
    'What AI SEO means for a community bank: whether ChatGPT, Perplexity and Google AI Overviews name your institution when a customer asks, which institutions are named instead, and how that compares within your asset tier and state.',
  alternates: { canonical: '/banks/ai-visibility' },
};

const method = [
  {
    title: 'Questions a customer would ask',
    body: 'Phrased the way someone comparing banks in your area would phrase them, rather than as keyword strings.',
    anchor: 'Method',
  },
  {
    title: 'Three answer engines',
    body: `Each question goes to ${ANSWER_ENGINES.join(', ')}, and we keep the response.`,
    anchor: 'Coverage',
  },
  {
    title: 'What the site gives them to work with',
    body: 'Structured data, the reachability of product pages, and whether AI crawlers can read them at all. Material an assistant cannot reach is material it cannot use.',
    anchor: 'Signals',
  },
  {
    title: 'Compared within tier and state',
    body: 'Institutions are compared within their asset tier and state. Peers are described by market, never by name.',
    anchor: 'Peer set',
  },
];

const faqs: readonly FaqItem[] = [
  {
    q: 'What is AI SEO for a community bank?',
    a: 'It is work on whether an AI assistant names your institution when a customer asks it a question your bank could answer — and on what it has to draw on when it does. We put those questions to ChatGPT, Perplexity and Google AI Overviews, record whether your institution is named and which are named instead, and look at what your site gives an assistant to work with.',
  },
  {
    q: 'How is it different from ordinary SEO?',
    a: 'Ordinary optimisation is about your position in a list of links. This is about whether you are named at all inside a written answer, and which institutions are named beside you. Both depend on what you publish and how readable it is, so the work overlaps, but the outcome being measured is different.',
  },
  {
    q: 'Which engines do you measure?',
    a: `${ANSWER_ENGINES.join(', ')}. Those are the three we have measurements for, so those are the three we report on. We do not report on an engine we have not run.`,
  },
  {
    q: 'Who are we compared against?',
    a: 'Institutions in your asset tier and state. We describe the peer set by market and never name the institutions in it. Note that this is a different peer definition from the one we use for investment advisers, who are compared with peers in their metro area.',
  },
  {
    q: 'Does a single reading settle it?',
    a: `No. Answers move between runs, so a reading describes the dates it was taken on. ${MEASURED.aiVisibilityQueriesThisMonth.toLocaleString(
      'en-US',
    )} questions were put to those three engines since 1 ${
      MEASURED.readOn
    }. The direction across several readings is more informative than any single run.`,
  },
  {
    q: 'Should we allow AI crawlers to read our site?',
    a: 'It is a trade-off you own. If an assistant cannot read your pages it has less to work with when a customer asks about you. Some institutions conclude that blocking is right for other reasons. The thing to avoid is having that decision made by default in a configuration file nobody has reviewed.',
  },
];

export default async function BankAiVisibilityPage() {
  const pricing = await getPricing();
  const edge = rowsForLane(pricing.rows, 'bank').filter((r) => r.family === 'edge');
  const cta = ctaFor(
    pricing.bound && edge.length > 0 ? edge[0].site_status : 'book_walkthrough',
  );

  return (
    <>
      <PageIntro
        eyebrow="Community banks · AI visibility"
        title="AI SEO for community banks"
        lede="What an AI assistant says when a customer asks it for a bank like yours, and what your site gives it to work with."
      />

      {/* ANSWER FIRST */}
      <section className="bg-white px-6 pt-14 pb-4">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-gray-700">
            AI SEO for a community bank is work on whether an AI assistant names your
            institution when a customer asks it something your bank could answer, and on
            what the assistant has to draw on when it does. We put those questions to{' '}
            {ANSWER_ENGINES.join(', ')}, record whether your institution is named and
            which are named in its place, and look at what your site offers an assistant
            to work with — structured data, whether product pages are reachable, and
            whether AI crawlers can read them at all. Results are set against
            institutions in your asset tier and state, and because answers move between
            runs a reading reports the dates it was taken on.
          </p>
        </div>
      </section>

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
          <p className="mt-4 text-sm leading-relaxed text-gray-500">
            Anything an assistant says about your institution is its own output, not
            ours, and we do not control it.
          </p>
        </div>
      </section>

      <FaqBlock items={faqs} heading="Questions banks ask about AI SEO" />

      {/* CLOSING RESTATEMENT */}
      <section className="bg-white px-6 pb-14">
        <div className="mx-auto max-w-3xl border-t border-gray-200 pt-8">
          <p className="text-base leading-relaxed text-gray-700">
            In short: AI SEO for a community bank is about being named in written answers
            rather than ranked in a list, measured across {ANSWER_ENGINES.join(', ')},
            compared within your asset tier and state, and reported with the dates the
            questions were asked on.
          </p>
          <p className="mt-5 text-sm text-gray-600">
            Related:{' '}
            <Link href="/banks" className="text-bf-navy underline">
              everything for banks and credit unions
            </Link>
            {' · '}
            <Link href="/banks/compliance" className="text-bf-navy underline">
              UDAAP website review
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
        body="We will run the questions for your institution and show you the answers next to your tier and state."
        label={cta.label}
        subject="AI SEO for community banks"
        secondaryHref="/pricing"
        secondaryLabel="See pricing"
      />
    </>
  );
}
