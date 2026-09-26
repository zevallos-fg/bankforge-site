import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro } from '@/app/components/PageIntro';
import PricingTable from '@/app/components/PricingTable';
import FaqBlock, { type FaqItem } from '@/app/components/FaqBlock';
import WalkthroughForm from '@/app/components/WalkthroughForm';
import { getPricing, rowsForLane } from '@/app/lib/pricing';

/**
 * MONEY PAGE 2 (D-TW-13) — buyer prompt: "How much does an RIA marketing
 * compliance review cost". New route.
 *
 * Every figure on this page comes from `public.v_sku_catalog_public` through
 * app/lib/pricing.ts. There is no price literal in this file, and none may be
 * added: the whole point of that module is that the site has exactly one place
 * where it learns what anything costs.
 *
 * It prints NO expiry date for the founding rate. Two contradictory expiries on
 * the old site — one of which had already lapsed while still being advertised —
 * are why the pricing reader exists (TD-SITE-FOUNDING-RATE-EXPIRY-CONTRADICTS-
 * AND-HAS-LAPSED, 0a63cda0). An expiry is a commercial term for a conversation,
 * not for cached HTML.
 *
 * This is also the one page that mounts the walkthrough form, so the intake path
 * rewritten in S2 is reachable by a person rather than only by a POST.
 */

export const metadata: Metadata = {
  title: 'How much does an RIA marketing compliance review cost',
  description:
    'What a marketing compliance review costs for a registered investment adviser, read from the price registry: the reviewed Forge engagements and the lighter self-serve Edge tiers, with founding rates where they apply.',
  alternates: { canonical: '/rias/pricing' },
};

const faqs: readonly FaqItem[] = [
  {
    q: 'How much does an RIA marketing compliance review cost?',
    a: 'It depends on which of two things you want. A reviewed engagement, where a person reads the findings and you receive a written report with a citation on every item, is priced per engagement and shown in the Forge rows above. A lighter self-serve benchmark, which you run yourself, is priced monthly and shown in the Edge rows. Every figure on this page is read from our price registry rather than typed into the page, so what you see here is what we are currently quoting.',
  },
  {
    q: 'Is there a cheaper way to start?',
    a: 'Yes. The self-serve Edge tiers are the lower-commitment starting point, and a one-off reviewed engagement costs less than an ongoing one. If none of the rows fits what you need, say so and we will tell you — including if the answer is that you do not need us yet.',
  },
  {
    q: 'What is a founding rate?',
    a: 'Where a row shows a founding rate, that is the rate for our first five clients on that row. We deliberately do not print an expiry date for it, because an expiry is a commercial term that belongs in a conversation rather than in a cached web page. Ask us and we will tell you where that count currently stands.',
  },
  {
    q: 'Do I have to pay on the website?',
    a: 'No. There is no signup and no payment on this site. Every engagement starts with a conversation, so we can tell you whether the work is worth doing before you buy anything.',
  },
  {
    q: 'What makes the price go up or down?',
    a: 'For a reviewed engagement, the scope of the site and whether the review is one-off or ongoing. Some rows are quoted rather than listed, which is what "Custom pricing" means where you see it: those need a conversation before a number would mean anything.',
  },
  {
    q: 'What is included in the written report?',
    a: 'Items graded High, Medium or Low, each naming the page and element it was found on and the paragraph of the rule it relates to. A person reads the findings before they reach you. We flag items for your counsel; we do not conclude that a violation has occurred.',
  },
];

export default async function RiaPricingPage() {
  const pricing = await getPricing();

  if (!pricing.bound) {
    console.warn(
      `[rias-pricing] WARNING: rendering the unavailable message. reason=${
        pricing.reason ?? 'unknown'
      }`,
    );
  }

  const riaRows = rowsForLane(pricing.rows, 'ria');
  const forgeCount = riaRows.filter((r) => r.family === 'forge').length;
  const edgeCount = riaRows.filter((r) => r.family === 'edge').length;

  return (
    <>
      <PageIntro
        eyebrow="Investment advisers · Pricing"
        title="How much does an RIA marketing compliance review cost?"
        lede="The rows below are read from our price registry when this page is built. Nothing here is a remembered number."
      />

      {/* ANSWER FIRST */}
      <section className="bg-white px-6 pt-14 pb-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-gray-700">
            It depends on which of two things you want, and both are listed below. A
            reviewed engagement — a person reads your public pages against the rules
            that apply and you receive a written report with a citation on every item —
            is priced per engagement and appears in the Forge rows. A lighter
            self-serve benchmark you run yourself is priced monthly and appears in the
            Edge rows. There is no signup and no payment on this site: every engagement
            starts with a conversation.
          </p>
          {pricing.bound && (
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              {riaRows.length} adviser rows are shown, {forgeCount} reviewed and{' '}
              {edgeCount} self-serve, read from the price registry when this page was
              built.
            </p>
          )}
        </div>
      </section>

      <section className="bg-white px-6 pb-16">
        <div className="mx-auto max-w-5xl">
          <PricingTable rows={pricing.rows} lane="ria" bound={pricing.bound} />

          <div className="mt-10 grid gap-6 border-t border-gray-200 pt-8 md:grid-cols-2">
            <div>
              <h2 className="text-base font-medium text-bf-navy-deep">
                Forge — the reviewed engagement
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                A structured review of your public site against the rules that apply to
                it, read by a person before it reaches you, delivered as a written
                report with a citation on every finding.
              </p>
            </div>
            <div>
              <h2 className="text-base font-medium text-bf-navy-deep">
                Edge — the self-serve benchmark
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Self-serve, peer-benchmarked visibility. Advisers are compared with
                peers in your metro area. Peers are described by market, never named.
              </p>
            </div>
          </div>

          <p className="mt-8 text-sm leading-relaxed text-gray-500">
            Where a row shows a founding rate, that is the rate for our first five
            clients on that row. We do not print an expiry date for it — ask us where
            the count stands.
          </p>
        </div>
      </section>

      <section className="bg-bf-slate px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <WalkthroughForm
            lane="ria"
            heading="Ask what a review would cost for your firm"
            body="Tell us what you are registered as and what you are worried about. We will reply with what a review would look at on your own site, and what it would cost."
          />
        </div>
      </section>

      <FaqBlock items={faqs} heading="Questions advisers ask about cost" />

      {/* CLOSING RESTATEMENT */}
      <section className="bg-white px-6 pb-14">
        <div className="mx-auto max-w-3xl border-t border-gray-200 pt-8">
          <p className="text-base leading-relaxed text-gray-700">
            In short: a reviewed engagement is priced per engagement and a self-serve
            benchmark is priced monthly, with the current figures in the rows above and
            some rows quoted rather than listed. Nothing is charged on this site.
          </p>
          <p className="mt-5 text-sm text-gray-600">
            Related:{' '}
            <Link href="/rias" className="text-bf-navy underline">
              everything for investment advisers
            </Link>
            {' · '}
            <Link href="/rias/compliance" className="text-bf-navy underline">
              what a Marketing Rule review covers
            </Link>
            {' · '}
            <Link href="/pricing" className="text-bf-navy underline">
              pricing for every lane
            </Link>
            {' · '}
            <Link href="/ai-visibility" className="text-bf-navy underline">
              what AI visibility is
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
