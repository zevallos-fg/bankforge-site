import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro, FindingList, CtaBand } from '@/app/components/PageIntro';
import FaqBlock, { type FaqItem } from '@/app/components/FaqBlock';
import { getPricing, ctaFor, rowsForLane } from '@/app/lib/pricing';

/**
 * MONEY PAGE 5 (D-TW-13) — buyer prompt: "UDAAP website compliance review for
 * community banks".
 *
 * EDUCATIONAL page. The statutory material was read from the official U.S. Code
 * on 2026-09-26, not recalled:
 *  - 12 U.S.C. 5531, "Prohibiting unfair, deceptive, or abusive acts or
 *    practices", which the source credit ties to section 1031 of the Dodd-Frank
 *    Wall Street Reform and Consumer Protection Act (Pub. L. 111-203)
 *  - 12 U.S.C. 5536, "Prohibited acts", section 1036 of the same Act, whose
 *    subsection (a)(1)(B) prohibits "to engage in any unfair, deceptive, or
 *    abusive act or practice"
 *  - the unfairness test in 5531(c) and the abusiveness standard in 5531(d)
 *
 * It names the statute and describes what a website review looks at. It does NOT
 * conclude that any institution violates anything, and it carries the
 * not-legal-advice line. On counsel_review_pages.
 */

export const metadata: Metadata = {
  title: 'UDAAP website compliance review for community banks',
  description:
    'What a UDAAP website compliance review covers for a community bank: the unfair, deceptive or abusive standards in 12 U.S.C. 5531 and the prohibition in 12 U.S.C. 5536, read against your public pages. Educational information, not legal advice.',
  alternates: { canonical: '/banks/compliance' },
};

const looksAt = [
  {
    title: 'Where the prohibition comes from',
    body: 'Section 1036 of the Dodd-Frank Act, at 12 U.S.C. 5536, is headed "Prohibited acts"; subsection (a)(1)(B) prohibits "to engage in any unfair, deceptive, or abusive act or practice". Section 1031, at 12 U.S.C. 5531, is headed "Prohibiting unfair, deceptive, or abusive acts or practices" and sets out the standards.',
    anchor: '12 U.S.C. 5531 · 5536',
  },
  {
    title: 'The unfairness standard',
    body: 'Under 12 U.S.C. 5531(c) an act or practice may be declared unfair where it "causes or is likely to cause substantial injury to consumers which is not reasonably avoidable by consumers" and "such substantial injury is not outweighed by countervailing benefits to consumers or to competition".',
    anchor: '12 U.S.C. 5531(c)',
  },
  {
    title: 'The abusiveness standard',
    body: 'Under 12 U.S.C. 5531(d) the standards include an act or practice that "materially interferes with the ability of a consumer to understand a term or condition of a consumer financial product or service", and one that takes unreasonable advantage of a consumer’s lack of understanding, inability to protect their interests, or reasonable reliance on the covered person.',
    anchor: '12 U.S.C. 5531(d)',
  },
  {
    title: 'What that means on a web page',
    body: 'A review reads your public pages for claims about products and fees, the prominence and placement of qualifying language relative to the claim it qualifies, and whether what a page promises is consistent with what its own disclosures say. Each observation names the standard it relates to.',
    anchor: 'Method',
  },
];

const faqs: readonly FaqItem[] = [
  {
    q: 'What is a UDAAP website compliance review?',
    a: 'It is a structured read of a bank’s public website against the unfair, deceptive and abusive standards in the Dodd-Frank Act — section 1031 at 12 U.S.C. 5531 and the prohibition in section 1036 at 12 U.S.C. 5536. We record what is on the page, name the standard it relates to, and hand the result to your compliance counsel. We do not decide whether a practice is unfair, deceptive or abusive; that determination is not ours to make.',
  },
  {
    q: 'What does UDAAP stand for?',
    a: 'Unfair, deceptive, or abusive acts or practices. The phrase is taken from the statute: 12 U.S.C. 5536(a)(1)(B) prohibits "to engage in any unfair, deceptive, or abusive act or practice", and 12 U.S.C. 5531 is headed "Prohibiting unfair, deceptive, or abusive acts or practices".',
  },
  {
    q: 'How is "unfair" defined?',
    a: '12 U.S.C. 5531(c) sets out that an act or practice may be declared unfair where it causes or is likely to cause substantial injury to consumers which is not reasonably avoidable by consumers, and that substantial injury is not outweighed by countervailing benefits to consumers or to competition. Applying that standard to a particular page is a legal judgement, which is why a review hands the observation to counsel rather than reaching the conclusion itself.',
  },
  {
    q: 'Does the review tell us we have a UDAAP problem?',
    a: 'No. We describe what the page says and which standard speaks to it. Whether a practice meets the statutory standard is a determination for your counsel and, ultimately, for a regulator. A report that told you otherwise would be overstating what reading a website can establish.',
  },
  {
    q: 'Which other rules does a bank website review cover?',
    a: 'Alongside the UDAAP standards, a review covers deposit advertising under Regulation DD, lending disclosure and triggering terms under Regulation Z, Equal Housing Lender presence under ECOA and Regulation B, and non-deposit product disclaimers under FFIEC interagency guidance. Deposit rate advertising has its own page.',
  },
  {
    q: 'Do you need access to our systems?',
    a: 'No. We read the public pages your customers read. There is no login, no agent on your network, and nothing asked of your IT team.',
  },
];

export default async function BankCompliancePage() {
  const pricing = await getPricing();
  const forge = rowsForLane(pricing.rows, 'bank').filter((r) => r.family === 'forge');
  const cta = ctaFor(
    pricing.bound && forge.length > 0 ? forge[0].site_status : 'book_walkthrough',
  );

  return (
    <>
      <PageIntro
        eyebrow="Community banks · Compliance"
        title="UDAAP website compliance review for community banks"
        lede="What such a review covers, which statutory standards it is read against, and what you get at the end of it."
      />

      {/* ANSWER FIRST */}
      <section className="bg-white px-6 pt-14 pb-4">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-gray-700">
            A UDAAP website compliance review is a structured read of your public pages
            against the unfair, deceptive and abusive standards in the Dodd-Frank Act —
            section 1031, codified at 12 U.S.C. 5531, and the prohibition in section
            1036, codified at 12 U.S.C. 5536. It reads product and fee claims, the
            prominence and placement of qualifying language, and whether a page is
            consistent with its own disclosures, then records each observation with the
            standard it relates to. It reaches no conclusion about whether your bank has
            engaged in an unfair, deceptive or abusive practice: that determination
            belongs to your counsel and to a regulator.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-gray-500">
            Educational information, not legal advice.
          </p>
        </div>
      </section>

      <FindingList
        heading="What the review looks at"
        intro="The statutory text below was read from the official U.S. Code, and each item names the section it comes from."
        items={looksAt}
      />

      <section className="bg-bf-slate px-6 py-14">
        <div className="mx-auto max-w-3xl">
          <h2
            className="text-xl text-bf-navy-deep"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            What this is not
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            This is not legal advice and it is not an examination. We do not conclude
            that an institution has engaged in an unfair, deceptive or abusive act or
            practice. We surface what is on the public page and the standard that speaks
            to it, and hand it to the people whose job it is to decide what it means.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-gray-500">
            Educational information, not legal advice.
          </p>
        </div>
      </section>

      <FaqBlock items={faqs} heading="Questions banks ask about a UDAAP website review" />

      {/* CLOSING RESTATEMENT */}
      <section className="bg-white px-6 pb-14">
        <div className="mx-auto max-w-3xl border-t border-gray-200 pt-8">
          <p className="text-base leading-relaxed text-gray-700">
            In short: a UDAAP website review reads your public pages against the
            standards in 12 U.S.C. 5531 and the prohibition in 12 U.S.C. 5536, names the
            standard behind each observation, and hands the result to your counsel. It
            does not decide whether a practice meets the statutory standard.
          </p>
          <p className="mt-5 text-sm text-gray-600">
            Related:{' '}
            <Link href="/banks" className="text-bf-navy underline">
              everything for banks and credit unions
            </Link>
            {' · '}
            <Link href="/banks/compliance/reg-dd" className="text-bf-navy underline">
              deposit rate advertising under Regulation DD
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
        body="We will show you the review on your own site first."
        label={cta.label}
        subject="UDAAP website compliance review for community banks"
        secondaryHref="/pricing"
        secondaryLabel="See pricing"
      />
    </>
  );
}
