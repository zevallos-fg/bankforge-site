import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro, FindingList, CtaBand } from '@/app/components/PageIntro';
import FaqBlock, { type FaqItem } from '@/app/components/FaqBlock';
import { ANSWER_ENGINES, MEASURED } from '@/app/lib/site';
import { getPricing, ctaFor, rowsForLane } from '@/app/lib/pricing';

/**
 * MONEY PAGE 4 (D-TW-13) — buyer prompt: "How do financial advisors show up in
 * ChatGPT". New route.
 *
 * This page describes how answer engines choose sources IN GENERAL TERMS. That
 * restraint is the point: the selection mechanics of a commercial assistant are
 * not published, so any confident account of "the algorithm" would be invented.
 * What can be said honestly is what is observable — that an assistant can only
 * draw on what is publicly readable, that answers move between runs, and what we
 * record when we ask.
 *
 * Numbers: the only figure is MEASURED.aiVisibilityQueriesThisMonth, which
 * carries its read month and the three engines it was spread across. No
 * percentage, share or ranking claim appears, because none is established.
 * ChatGPT is named as one of the three measured engines and no competing product
 * is compared.
 */

export const metadata: Metadata = {
  title: 'How do financial advisors show up in ChatGPT',
  description:
    'How a financial advisor comes to be named in a ChatGPT answer: what an assistant can draw on, why answers move between runs, and what we record when we ask. Measured across ChatGPT, Perplexity and Google AI Overviews.',
  alternates: { canonical: '/rias/ai-visibility/chatgpt' },
};

const howItWorks = [
  {
    title: 'It can only use what it can read',
    body: 'An assistant composes an answer from material it can reach — your public pages and whatever else the open web says about you. Anything behind a login, inside an image, or in a document it cannot parse is not available to it.',
    anchor: 'What it draws on',
  },
  {
    title: 'It answers in prose, not in a list',
    body: 'A written answer usually names a handful of firms rather than returning a ranked page of links. Being on page one of a search result and being named in a written answer are two different outcomes.',
    anchor: 'Shape of the answer',
  },
  {
    title: 'The question matters as much as the site',
    body: 'A prospect asking for an adviser in a particular city is a different question from one asking about a particular service, and they do not return the same firms. This is why we ask many phrasings rather than one.',
    anchor: 'Prompt sensitivity',
  },
  {
    title: 'It is not stable between runs',
    body: 'The same question asked twice can return different firms. That is a property of the systems, not a fault in the measurement, and it is why a reading is reported with the dates it was taken on.',
    anchor: 'Variability',
  },
];

const faqs: readonly FaqItem[] = [
  {
    q: 'How do financial advisors show up in ChatGPT?',
    a: 'By being part of what the assistant can read and draw on when it composes an answer. It works from publicly readable material — your own pages and what the open web says about you — so firms that publish clear, specific, readable information about what they do and who they serve have more for it to work with. There is no submission process and no placement to buy.',
  },
  {
    q: 'Can I pay to appear in a ChatGPT answer?',
    a: 'Not as far as we can establish for the assistant answers we measure. What you can do is make what you publish clearer and easier to read. Be sceptical of anyone offering guaranteed placement in an AI answer.',
  },
  {
    q: 'Why does the answer change every time I ask?',
    a: `Because these systems do not return a fixed result the way a database query does. The same question can return different firms on different days. That is why we report what came back on the dates we asked rather than presenting one run as settled, and why we follow the direction across several readings. ${MEASURED.aiVisibilityQueriesThisMonth.toLocaleString(
      'en-US',
    )} questions were put to ${ANSWER_ENGINES.join(
      ', ',
    )} since 1 ${MEASURED.readOn}.`,
  },
  {
    q: 'Should I block AI crawlers from my site?',
    a: 'That is a decision with a trade-off, and it is yours to make. If an assistant cannot read your pages it has less to draw on when someone asks about your firm. Some firms conclude that is the right call for other reasons. What matters is that the choice is deliberate rather than an accident of a configuration file nobody has read in two years.',
  },
  {
    q: 'Is this the same thing as ranking in Google?',
    a: 'No. Ranking is about position in a list of links. This is about whether you are named at all in a written answer, and which firms are named beside you. The two are related, because both depend on what you publish, but you can do acceptably at one and not the other.',
  },
  {
    q: 'What do you actually measure?',
    a: `We put the questions a prospect would ask to ${ANSWER_ENGINES.join(
      ', ',
    )}, record whether your firm is named, record which firms are named instead, and note what those firms publish that you do not. We then compare the result with peers in your metro area, described by market and never named.`,
  },
];

export default async function RiaChatGptPage() {
  const pricing = await getPricing();
  const edge = rowsForLane(pricing.rows, 'ria').filter((r) => r.family === 'edge');
  const cta = ctaFor(
    pricing.bound && edge.length > 0 ? edge[0].site_status : 'book_walkthrough',
  );

  return (
    <>
      <PageIntro
        eyebrow="Investment advisers · AI visibility"
        title="How do financial advisors show up in ChatGPT?"
        lede="What an assistant has to work with when someone asks it to suggest an adviser, and what that means for what you publish."
      />

      {/* ANSWER FIRST */}
      <section className="bg-white px-6 pt-14 pb-4">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-gray-700">
            Advisors show up in a ChatGPT answer by being part of the publicly readable
            material the assistant draws on when it composes that answer — your own
            pages, and what the open web says about you. There is no submission form and
            no placement to buy. Firms that publish clear, specific information about
            what they do and who they serve give an assistant more to work with, and
            material it cannot reach or parse is material it cannot use. Answers also
            move between runs, so being named once is not a standing position.
          </p>
        </div>
      </section>

      <FindingList
        heading="How answer engines choose what to name"
        intro="In general terms only. The selection mechanics of a commercial assistant are not published, so what follows is what can be observed rather than an account of an algorithm."
        items={howItWorks}
      />

      <section className="bg-bf-slate px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <h2
            className="text-xl text-bf-navy-deep"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            What we can and cannot tell you
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            We can tell you what came back when we asked, on the dates we asked, across{' '}
            {ANSWER_ENGINES.join(', ')} — whether your firm was named, which firms were
            named instead, and what those firms publish that you do not.
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            We cannot tell you how the assistant decided, because that is not published,
            and we will not offer you a ranking factor we cannot evidence. Anything an
            assistant says about your firm is its own output and we do not control it.
          </p>
        </div>
      </section>

      <FaqBlock items={faqs} heading="Questions advisers ask about ChatGPT" />

      {/* CLOSING RESTATEMENT */}
      <section className="bg-white px-6 pb-14">
        <div className="mx-auto max-w-3xl border-t border-gray-200 pt-8">
          <p className="text-base leading-relaxed text-gray-700">
            In short: you show up in ChatGPT by being readable and specific in public,
            not by submitting or buying a position — and because answers move between
            runs, the useful question is what came back on which dates, and what your
            peers show that you do not.
          </p>
          <p className="mt-5 text-sm text-gray-600">
            Related:{' '}
            <Link href="/rias" className="text-bf-navy underline">
              everything for investment advisers
            </Link>
            {' · '}
            <Link href="/rias/ai-visibility" className="text-bf-navy underline">
              AI visibility for financial advisors
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
        body="We will run the questions for your firm and show you what came back, alongside peers in your metro area."
        label={cta.label}
        subject="How advisers show up in ChatGPT"
        secondaryHref="/rias/pricing"
        secondaryLabel="See what it costs"
      />
    </>
  );
}
