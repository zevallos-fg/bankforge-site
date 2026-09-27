import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro } from '@/app/components/PageIntro';
import { ANSWER_ENGINES } from '@/app/lib/site';

export const metadata: Metadata = {
  title: 'Why a bank’s AI visibility score comes back low',
  description:
    'The common causes are structural: product pages an assistant cannot parse, absent structured data, and crawler rules that exclude AI readers.',
  alternates: { canonical: '/insights/bank-ai-score' },
};

const causes = [
  {
    h: 'Nothing on the page states the obvious',
    p: 'Assistants answer from what a page says plainly. Rates, locations, product names and eligibility often live in an image, a slider or a PDF, where a reader that only has text finds nothing to quote.',
  },
  {
    h: 'No structured data',
    p: 'Schema markup is how a page tells a machine what kind of thing it is describing. Without it, an assistant is guessing from prose — and it guesses conservatively, which usually means leaving you out.',
  },
  {
    h: 'AI crawlers are excluded',
    p: 'Plenty of robots.txt files were written when the only crawlers that mattered were search engines. If the assistants are disallowed, the rest of the work cannot help.',
  },
  {
    h: 'The site answers questions nobody asked',
    p: 'Pages are often organised around internal product naming rather than the question a customer would type. An assistant matches the question, not the brochure.',
  },
];

export default function BankAiScorePage() {
  return (
    <>
      <PageIntro
        eyebrow="Insights"
        title="Why a bank’s AI visibility score comes back low."
        lede="When an institution scores poorly, the cause is usually structural rather than editorial. These are the four we see most often."
      />

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-base leading-relaxed text-gray-600">
            An AI visibility score is a summary of a simple exercise: ask{' '}
            {ANSWER_ENGINES.join(', ')} the questions your customers ask, and record
            whether your institution is named. A low score means the assistants had
            little to work with, or had reason to name somebody else.
          </p>

          <div className="mt-10 space-y-8">
            {causes.map((c) => (
              <div key={c.h}>
                <h2 className="text-lg text-bf-navy-deep" style={{ fontFamily: 'var(--font-display)' }}>
                  {c.h}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{c.p}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-sm leading-relaxed text-gray-500">
            None of these are quick wins in the marketing sense; they are ordinary
            site work. The useful part is knowing which of them is actually costing
            you, which is what a benchmarked reading is for.
          </p>

          <Link
            href="/banks/ai-visibility"
            className="mt-8 inline-block text-sm font-medium text-bf-navy hover:underline"
          >
            How we measure it →
          </Link>
        </div>
      </section>
    </>
  );
}
