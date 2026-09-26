/**
 * The FAQ block and its FAQPage JSON-LD, generated from ONE array.
 *
 * Why it is built this way: a hand-written JSON-LD block beside a hand-written
 * visible FAQ is two copies of the same sentences, and they drift. Structured
 * data that claims an answer the page does not show is a misrepresentation to
 * the engines reading it — and it is exactly the kind of thing this business
 * charges to find on other people's websites.
 *
 * So the visible list and the `acceptedAnswer.text` come from the same `items`.
 * They cannot disagree, because there is only one of them.
 */

export type FaqItem = {
  /** The question, in the phrasing a buyer would actually use. */
  q: string;
  /** The answer as one or more plain-English paragraphs. */
  a: string;
};

/** Build the FAQPage object. Exported so a test can assert against it. */
export function faqJsonLd(items: readonly FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

export default function FaqBlock({
  items,
  heading = 'Questions people ask',
}: {
  items: readonly FaqItem[];
  heading?: string;
}) {
  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h2
          className="text-2xl text-bf-navy-deep"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {heading}
        </h2>

        <dl className="mt-8 divide-y divide-gray-200">
          {items.map((i) => (
            <div key={i.q} className="py-5">
              <dt className="text-base font-medium text-bf-navy-deep">{i.q}</dt>
              <dd className="mt-2 text-base leading-relaxed text-gray-600">{i.a}</dd>
            </div>
          ))}
        </dl>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(items)) }}
      />
    </section>
  );
}
