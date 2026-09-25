import {
  SITE_URL,
  BRAND_NAME,
  LEGAL_ENTITY,
  CONTACT_EMAIL,
  ANSWER_ENGINES,
  MEASURED,
  ROUTES,
  absoluteUrl,
} from '@/app/lib/site';
import {
  getPricing,
  headlinePrice,
  unitLabel,
  foundingLine,
} from '@/app/lib/pricing';

/**
 * /llms.txt, generated.
 *
 * The previous file was hand-maintained and became the most commercially
 * detailed page on the site while carrying prices and statistics the rest of the
 * site had already superseded. Everything here is now derived: routes from
 * ROUTES, figures from MEASURED with their read date attached, and prices from
 * v_sku_catalog_public. When the catalogue cannot be read, the pricing section
 * says so instead of printing a remembered number.
 */
export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  const pricing = await getPricing();

  const priceLines = pricing.bound
    ? pricing.rows.map((r) => {
        const founding = foundingLine(r);
        const tier = r.tier_label ? ` (${r.tier_label})` : '';
        return `- ${r.product_name}${tier}: ${headlinePrice(r)} ${unitLabel(
          r.billing_unit,
        )}${founding ? ` — ${founding}` : ''}`;
      })
    : ['- Pricing is being updated. Contact us for current pricing.'];

  const body = `# ${BRAND_NAME}

${BRAND_NAME} reviews the public websites of regulated financial institutions
against the regulations that apply to them, and measures how those institutions
appear in AI search. Findings are flagged for compliance counsel review. We do
not conclude that a violation has occurred, and nothing we publish is legal advice.

Legal entity: ${LEGAL_ENTITY}
Website: ${SITE_URL}
Contact: ${CONTACT_EMAIL}

## Who we work with

- SEC-registered investment advisers
- FDIC-insured banks
- NCUA-supervised credit unions

## What we measure against

Counts below were read in ${MEASURED.readOn}. Any figure quoted from this file
should carry that date.

- ${MEASURED.rias.toLocaleString('en-US')} SEC-registered investment advisers tracked
- ${MEASURED.banks.toLocaleString('en-US')} FDIC-insured banks with a recorded asset tier
- ${MEASURED.creditUnions.toLocaleString('en-US')} NCUA-supervised credit unions tracked

## AI visibility

We put the questions prospects ask to ${ANSWER_ENGINES.join(
    ', ',
  )} and record what
comes back: whether the institution is named, which are named instead, and what
on the site accounts for the difference. ${MEASURED.aiVisibilityQueriesThisMonth.toLocaleString(
    'en-US',
  )} such questions were put to those
three engines since 1 ${MEASURED.readOn}. Answers move between runs, so a reading
describes the dates it was taken on.

Peer comparison is by market: advisers within their metro area, banks and credit
unions within their asset tier and state. Peers are described, never named.

## Regulatory frameworks covered

- SEC Marketing Rule (Rule 206(4)-1), Form ADV, Form CRS, Regulation S-P
- Regulation DD (savings rate advertising)
- Regulation Z (lending disclosure and triggering terms)
- ECOA / Regulation B, including Equal Housing Lender disclosure
- UDAAP
- FFIEC interagency guidance, including non-deposit product disclaimers
- NCUA examination criteria

## Pricing

${priceLines.join('\n')}

There is no signup and no payment on the website. Every engagement starts with a
conversation.

## Pages

${ROUTES.map((r) => `- ${r.title}: ${absoluteUrl(r.path)}`).join('\n')}
`;

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600',
    },
  });
}
