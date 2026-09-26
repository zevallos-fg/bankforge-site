import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro, FindingList, CtaBand } from '@/app/components/PageIntro';
import FaqBlock, { type FaqItem } from '@/app/components/FaqBlock';
import { getPricing, ctaFor, rowsForLane } from '@/app/lib/pricing';

/**
 * MONEY PAGE 6 (D-TW-13) — buyer prompt: "Reg DD / Truth in Savings website
 * disclosure check". New route.
 *
 * EDUCATIONAL page. Read from official text on 2026-09-26, not recalled:
 *  - 12 CFR part 1030 is "Truth in Savings" (Regulation DD), issued by the Bureau
 *    of Consumer Financial Protection to implement the Truth in Savings Act of
 *    1991 (consumerfinance.gov; 12 CFR 1030.1)
 *  - the Truth in Savings Act is Title 12 Chapter 44 of the U.S. Code, beginning
 *    at 12 U.S.C. 4301 (uscode.house.gov)
 *  - 12 CFR 1030.8 "Advertising", paragraphs (a) misleading or inaccurate
 *    advertisements, (b) permissible rates, (c) when additional disclosures are
 *    required, (d) bonuses, (e) exemption for certain advertisements, (f)
 *    additional disclosures in connection with overdraft payment; (b) requires
 *    that where "an advertisement states a rate of return, it shall state the rate
 *    as an 'annual percentage yield'"
 *
 * LOAD-BEARING CORRECTION, and the reason this page is worded as it is:
 * 12 CFR 1030.1 states Regulation DD applies to "depository institutions except
 * for credit unions". Credit unions are covered by the NCUA's parallel rule,
 * 12 CFR part 707, whose advertising section is 707.8. The rest of this site
 * addresses "banks and credit unions" together, which is right for most of what
 * it covers but WRONG for Reg DD specifically. This page says so rather than
 * inheriting the blur. Filed as a TD against the pages that still blur it.
 *
 * It names the rule and describes what a check looks at. It does NOT conclude
 * that any institution violates anything. On counsel_review_pages.
 */

export const metadata: Metadata = {
  title: 'Reg DD / Truth in Savings website disclosure check',
  description:
    'What a Regulation DD website disclosure check covers: the advertising rules in 12 CFR 1030.8, including the requirement to state a rate of return as an annual percentage yield. Credit unions fall under the NCUA rule at 12 CFR 707. Educational information, not legal advice.',
  alternates: { canonical: '/banks/compliance/reg-dd' },
};

const looksAt = [
  {
    title: 'Misleading or inaccurate advertisements',
    body: 'Paragraph (a) of 12 CFR 1030.8 addresses advertisements that misrepresent the deposit contract, and the conditions on describing an account as "free". A check reads your deposit pages for claims of that shape.',
    anchor: '12 CFR 1030.8(a)',
  },
  {
    title: 'Rates stated as an annual percentage yield',
    body: 'Paragraph (b) requires that where "an advertisement states a rate of return, it shall state the rate as an ‘annual percentage yield’". The abbreviation APY may be used where the full term appears at least once. A check records every rate shown on your public pages and how it is labelled.',
    anchor: '12 CFR 1030.8(b)',
  },
  {
    title: 'When additional disclosures are required',
    body: 'Paragraph (c) addresses disclosure of variable-rate information, time periods, minimum balances, opening deposits, the effect of fees, and for time accounts terms such as early withdrawal penalties. Paragraph (d) sets out what an advertisement stating a bonus must disclose.',
    anchor: '12 CFR 1030.8(c)-(d)',
  },
  {
    title: 'What the exemptions do and do not cover',
    body: 'Paragraph (e) provides exceptions for certain media, including broadcast, outdoor signage and telephone response systems, with modified requirements for indoor signs. A check notes where a page relies on an exemption that does not apply to a web page.',
    anchor: '12 CFR 1030.8(e)',
  },
];

const faqs: readonly FaqItem[] = [
  {
    q: 'What is a Reg DD website disclosure check?',
    a: 'It is a read of your public deposit pages against the advertising rules in Regulation DD, at 12 CFR 1030.8. It records every rate of return shown, how it is labelled, and what accompanies it — variable-rate information, minimum balances, the effect of fees, time-account terms and bonus conditions — and names the paragraph of the rule each observation relates to. It reaches no conclusion about whether your institution has violated the rule.',
  },
  {
    q: 'What is Regulation DD?',
    a: 'Regulation DD is 12 CFR part 1030, "Truth in Savings", issued by the Bureau of Consumer Financial Protection to implement the Truth in Savings Act of 1991. The Act is Title 12, Chapter 44 of the U.S. Code, beginning at 12 U.S.C. 4301. Its stated purpose is to enable consumers to make informed decisions about accounts at depository institutions by requiring disclosures that allow meaningful comparison.',
  },
  {
    q: 'Does Regulation DD apply to credit unions?',
    a: 'No — and this is worth stating plainly, because it is commonly blurred. 12 CFR 1030.1 provides that Regulation DD applies to depository institutions except for credit unions. Credit unions are covered by the National Credit Union Administration’s parallel rule, 12 CFR part 707, also called Truth in Savings, whose advertising section is 707.8. The substance is closely parallel, but a credit union should be read against part 707 and not part 1030.',
  },
  {
    q: 'Do we have to write out "annual percentage yield" every time?',
    a: 'Paragraph (b) of 12 CFR 1030.8 requires a stated rate of return to be stated as an annual percentage yield, and the abbreviation APY may be used where the full term appears at least once. A check records where a rate appears and whether the full term appears with it.',
  },
  {
    q: 'Does the advertising rule reach pages we did not write?',
    a: 'The coverage of the advertising rules extends beyond the institution itself: 12 CFR 1030.1 notes they apply to anyone who advertises such accounts, including deposit brokers. In practice that means a rate published on your behalf elsewhere is worth looking at too.',
  },
  {
    q: 'Will you tell us whether we are in violation?',
    a: 'No. We describe what is on the page and the paragraph of the rule that speaks to it, and hand it to your compliance counsel. Whether a particular disclosure satisfies the rule is a judgement for them.',
  },
];

export default async function BankRegDdPage() {
  const pricing = await getPricing();
  const forge = rowsForLane(pricing.rows, 'bank').filter((r) => r.family === 'forge');
  const cta = ctaFor(
    pricing.bound && forge.length > 0 ? forge[0].site_status : 'book_walkthrough',
  );

  return (
    <>
      <PageIntro
        eyebrow="Community banks · Compliance"
        title="Reg DD / Truth in Savings website disclosure check"
        lede="What such a check covers on your deposit pages, and which rule applies to whom."
      />

      {/* ANSWER FIRST */}
      <section className="bg-white px-6 pt-14 pb-4">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-gray-700">
            A Reg DD website disclosure check reads your public deposit pages against the
            advertising rules in Regulation DD — 12 CFR part 1030, &ldquo;Truth in
            Savings&rdquo;, and in particular section 1030.8. It records every rate of
            return your pages show and how it is labelled, since paragraph (b) requires a
            stated rate to be given as an annual percentage yield, then checks what
            accompanies it: variable-rate information, minimum balances, the effect of
            fees, time-account terms and bonus conditions. Each observation names the
            paragraph it relates to, and none of them concludes that your institution has
            violated the rule.
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-700">
            One distinction matters before you start: 12 CFR 1030.1 provides that
            Regulation DD applies to depository institutions <em>except</em> for credit
            unions. A credit union should be read against the NCUA&rsquo;s parallel rule,
            12 CFR part 707, whose advertising section is 707.8.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-gray-500">
            Educational information, not legal advice.
          </p>
        </div>
      </section>

      <FindingList
        heading="What the check looks at"
        intro="The rule text below was read from the official source, and each item names the paragraph it comes from."
        items={looksAt}
      />

      <section className="bg-bf-slate px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <h2
            className="text-xl text-bf-navy-deep"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Banks and credit unions are under different rules here
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            Regulation DD, 12 CFR part 1030, is issued by the Bureau of Consumer
            Financial Protection and applies to depository institutions except for credit
            unions. The National Credit Union Administration issues the parallel Truth in
            Savings rule for credit unions at 12 CFR part 707, with its advertising
            section at 707.8. The two are closely parallel in substance, and a check names
            whichever one applies to you rather than treating the pair as one rule.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-gray-500">
            Educational information, not legal advice.
          </p>
        </div>
      </section>

      <FaqBlock items={faqs} heading="Questions banks ask about Reg DD on a website" />

      {/* CLOSING RESTATEMENT */}
      <section className="bg-white px-6 pb-14">
        <div className="mx-auto max-w-3xl border-t border-gray-200 pt-8">
          <p className="text-base leading-relaxed text-gray-700">
            In short: a Reg DD check reads the rates and deposit claims on your public
            pages against 12 CFR 1030.8, names the paragraph behind each observation, and
            leaves the judgement to your counsel — and if you are a credit union, the rule
            to read yourself against is 12 CFR part 707.
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
        title={cta.label}
        body="We will run the check on your own deposit pages and show you what it returns."
        label={cta.label}
        subject="Reg DD / Truth in Savings website disclosure check"
        secondaryHref="/pricing"
        secondaryLabel="See pricing"
      />
    </>
  );
}
