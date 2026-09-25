import type { Metadata } from 'next';
import { PageIntro, CtaBand } from '@/app/components/PageIntro';
import PricingTabs from '@/app/components/PricingTabs';
import { getPricing } from '@/app/lib/pricing';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'What a Tiqsi compliance review and AI visibility engagement costs, for investment advisers and for banks and credit unions.',
  alternates: { canonical: '/pricing' },
};

/**
 * Prices come from public.v_sku_catalog_public and from nowhere else. If that
 * read fails, the tables say pricing is being updated — they never fall back to
 * a remembered figure.
 */
export default async function PricingPage() {
  const pricing = await getPricing();

  if (!pricing.bound) {
    console.warn(
      `[pricing-page] WARNING: rendering the unavailable message. reason=${pricing.reason ?? 'unknown'}`,
    );
  }

  return (
    <>
      <PageIntro
        eyebrow="Pricing"
        title="What it costs, written down."
        lede="Two families. Forge is the reviewed engagement with a written report. Edge is the lighter, self-serve benchmark. Pick the row that matches what you need."
      />

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <PricingTabs rows={pricing.rows} bound={pricing.bound} />

          <div className="mt-10 grid gap-6 border-t border-gray-200 pt-8 md:grid-cols-2">
            <div>
              <h2 className="text-base font-medium text-bf-navy-deep">Forge</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                A structured review of your public site against the rules that apply
                to it, read by a person before it reaches you, delivered as a written
                report with a citation on every finding.
              </p>
            </div>
            <div>
              <h2 className="text-base font-medium text-bf-navy-deep">Edge</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Self-serve, peer-benchmarked visibility. Advisers are compared within
                their metro area; banks and credit unions within their asset tier and
                state. Peers are described by market, never named.
              </p>
            </div>
          </div>

          <p className="mt-8 text-sm leading-relaxed text-gray-500">
            There is no signup and no payment on this site. Every option starts with a
            conversation, so we can tell you whether it is worth doing before you buy
            anything.
          </p>
        </div>
      </section>

      <CtaBand
        title="Not sure which row you are?"
        body="Tell us what you are registered as and what you are worried about, and we will point you at the right one — including if that is none of them."
        subject="Pricing question"
      />
    </>
  );
}
