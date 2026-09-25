import type { Metadata } from 'next';
import Link from 'next/link';
import { PageIntro } from '@/app/components/PageIntro';

export const metadata: Metadata = {
  title: 'Insights',
  description:
    'Notes on website compliance and AI search visibility for regulated financial institutions.',
  alternates: { canonical: '/insights' },
};

const posts = [
  {
    href: '/insights/bank-ai-score',
    title: 'Why a bank’s AI visibility score comes back low',
    blurb:
      'The usual reasons are structural rather than editorial: product pages an assistant cannot parse, no structured data, and crawler rules that exclude the readers you now care about.',
  },
];

export default function InsightsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Insights"
        title="Notes from the reviews."
        lede="Short pieces on what we keep finding on public websites, and on how AI assistants read them."
      />

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <ul className="space-y-6">
            {posts.map((p) => (
              <li key={p.href} className="border-b border-gray-200 pb-6 last:border-0">
                <Link href={p.href} className="group block">
                  <h2
                    className="text-xl text-bf-navy-deep group-hover:underline"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {p.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{p.blurb}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
