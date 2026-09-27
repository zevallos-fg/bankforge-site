import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro, FindingList, CtaBand } from '@/app/components/PageIntro';
import FaqBlock, { type FaqItem } from '@/app/components/FaqBlock';
import { getPricing, ctaFor, rowsForLane } from '@/app/lib/pricing';

/**
 * MONEY PAGE 1 (D-TW-13) — buyer prompt: "SEC Marketing Rule website review for RIAs".
 *
 * Retitled and restructured around that prompt: the title and H1 use the buyer's
 * phrasing, the first paragraph answers the question outright, and the closing
 * section restates the answer.
 *
 * EDUCATIONAL page. Every rule statement here was read from official text on
 * 2026-09-26, not from memory:
 *  - the seven general prohibitions, verbatim, from the eCFR renderer for
 *    17 CFR 275.206(4)-1 paragraph (a) — note they live at (a)(1)-(a)(7)
 *  - the rule's identity, what it replaced, and the testimonial / endorsement and
 *    third-party rating conditions, from the SEC's own marketing rule page
 * It names the rule and describes what a review looks at. It does NOT conclude
 * that any adviser violates anything, and it carries the not-legal-advice line.
 * Goes to counsel with Terms and Privacy (counsel_review_pages).
 */

export const metadata: Metadata = {
  title: 'SEC Marketing Rule website review for RIAs',
  description:
    'What an SEC Marketing Rule website review covers for a registered investment adviser: the seven general prohibitions in Rule 206(4)-1(a), testimonial and endorsement disclosure, and third-party ratings. Educational information, not legal advice.',
  alternates: { canonical: '/rias/compliance' },
};

const looksAt = [
  {
    title: 'The seven general prohibitions',
    body: 'Rule 206(4)-1(a) sets out seven. They run from untrue statements of material fact, through statements the adviser has no reasonable basis for believing it can substantiate on demand, to presenting benefits without fair and balanced treatment of material risks, and end with "otherwise be materially misleading".',
    anchor: 'Rule 206(4)-1(a)(1)-(a)(7)',
  },
  {
    title: 'Testimonials and endorsements',
    body: 'The SEC describes the conditions as clear and prominent disclosure of whether the person giving it is a client and whether they are compensated, written agreements with compensated promoters, and disqualification of certain bad actors. A review reads your pages for whether that disclosure is present and prominent.',
    anchor: 'Rule 206(4)-1',
  },
  {
    title: 'Third-party ratings',
    body: 'The rule permits a rating where the adviser provides disclosures and satisfies criteria about how the rating was prepared. A review records which ratings your site displays and what accompanies them.',
    anchor: 'Rule 206(4)-1',
  },
  {
    title: 'Performance and specific advice',
    body: 'Paragraph (a)(5) addresses references to specific investment advice that is not presented in a manner that is fair and balanced, and (a)(6) addresses including or excluding performance results, or presenting performance time periods, in a manner that is not fair and balanced.',
    anchor: 'Rule 206(4)-1(a)(5)-(a)(6)',
  },
];

const faqs: readonly FaqItem[] = [
  {
    q: 'What is an SEC Marketing Rule website review?',
    a: 'It is a structured read of an adviser’s public website against the criteria in Rule 206(4)-1 under the Investment Advisers Act of 1940. Each thing we note carries the paragraph of the rule it relates to, so your compliance counsel can act on it or set it aside on the merits. It is a review of public pages, not an audit and not an examination.',
  },
  {
    q: 'Which rule is the SEC Marketing Rule?',
    a: 'Rule 206(4)-1 under the Investment Advisers Act of 1940, codified at 17 CFR 275.206(4)-1. The SEC describes it as consolidating the former advertising rule, adopted in 1961, and the former cash solicitation rule, Rule 206(4)-3, adopted in 1979. The SEC states a compliance date of November 4, 2022.',
  },
  {
    q: 'Does a review tell me whether my firm is in violation?',
    a: 'No, and it is worth being plain about that. We identify things on your public website that a regulator could ask about, and we hand them to the people whose job it is to decide what they mean. Whether something is a violation is a judgement for your counsel, not for us and not for software.',
  },
  {
    q: 'Do you need access to our systems?',
    a: 'No. We read the pages your prospects read. There is no login, no agent on your network, and nothing asked of your IT team.',
  },
  {
    q: 'How are testimonials and endorsements treated?',
    a: 'The SEC describes the conditions as clear and prominent disclosure of whether the person giving the testimonial or endorsement is a client and whether they are compensated, together with written agreements for compensated promoters and disqualification provisions for certain bad actors. A review looks at whether that disclosure appears where the testimonial appears, rather than only in a page footer.',
  },
  {
    q: 'What do we receive at the end?',
    a: 'A written report your compliance counsel and marketing team can work from directly. Each item is graded High, Medium or Low, names the page and element it was found on, and carries its citation. A person reads the findings before they reach you.',
  },
];

export default async function RiaCompliancePage() {
  const pricing = await getPricing();
  const forge = rowsForLane(pricing.rows, 'ria').filter((r) => r.family === 'forge');
  const cta = ctaFor(
    pricing.bound && forge.length > 0 ? forge[0].site_status : 'book_walkthrough',
  );

  return (
    <>
      <PageIntro
        eyebrow="Investment advisers · Compliance"
        title="SEC Marketing Rule website review for RIAs"
        lede="What such a review covers, which rule it is read against, and what you get at the end of it."
      />

      {/* ANSWER FIRST */}
      <section className="bg-white px-6 pt-14 pb-4">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-gray-700">
            An SEC Marketing Rule website review is a structured read of your public
            website against Rule 206(4)-1 under the Investment Advisers Act of 1940
            (17 CFR 275.206(4)-1). It works through the seven general prohibitions in
            paragraph (a), then the rule&rsquo;s treatment of testimonials, endorsements
            and third-party ratings, and records what it finds on each page with the
            paragraph of the rule attached. It is a review of public pages only, it
            reaches no conclusion about whether your firm has violated anything, and
            its output is a written report for your compliance counsel.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-gray-500">
            Educational information, not legal advice.
          </p>
        </div>
      </section>

      <FindingList
        heading="What the review looks at"
        intro="The rule text below was read from the official source, and each item names the paragraph it comes from."
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
            This is not legal advice and it is not a compliance opinion. We do not
            conclude that an adviser has violated a rule. We describe what is on the
            public page and which paragraph of the rule speaks to it, and the judgement
            stays with your counsel.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-gray-500">
            Educational information, not legal advice.
          </p>
        </div>
      </section>

      <FaqBlock
        items={faqs}
        heading="Questions advisers ask about a Marketing Rule review"
      />

      {/* CLOSING RESTATEMENT */}
      <section className="bg-white px-6 pb-14">
        <div className="mx-auto max-w-3xl border-t border-gray-200 pt-8">
          <p className="text-base leading-relaxed text-gray-700">
            In short: a Marketing Rule website review reads your public pages against
            Rule 206(4)-1, names the paragraph behind each observation, and hands the
            result to your counsel as a written report. It does not decide whether you
            are in violation.
          </p>
          <p className="mt-5 text-sm text-gray-600">
            Related:{' '}
            <Link href="/rias" className="text-bf-navy underline">
              everything for investment advisers
            </Link>
            {' · '}
            <Link href="/rias/pricing" className="text-bf-navy underline">
              what a review costs
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
        body="We will show you the review on your own site before you commit to anything."
        label={cta.label}
        subject="SEC Marketing Rule website review for RIAs"
        secondaryHref="/rias/pricing"
        secondaryLabel="See what it costs"
      />
    </>
  );
}
