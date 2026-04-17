import type { Metadata } from 'next';
import GeoScorePageClient from './GeoScoreClient';

export const metadata: Metadata = {
  title: 'AI SEO + Marketing Intelligence — FDIC-Insured Banks | BankForge.ai',
  description:
    "BankForge tracks 37 AI visibility and marketing intelligence signals across 4,300+ FDIC-insured banks. Average score: 66. See where your institution stands on ChatGPT, Perplexity, and Google AI Overviews.",
  keywords:
    'bank AI search visibility, AI SEO score community bank, ChatGPT bank search, Perplexity bank visibility, AI search optimization financial institution, marketing intelligence',
  openGraph: {
    title: 'AI SEO + Marketing Intelligence | BankForge.ai',
    description:
      '14.8% of FDIC-insured banks score below 40 on AI search — invisible when customers search for local banking services. See where your institution stands.',
    url: 'https://bankforge.ai/ai-seo-score',
  },
  alternates: { canonical: 'https://bankforge.ai/ai-seo-score' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is an AI SEO score for a bank?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An AI SEO score measures how visible a bank is on AI-powered search engines like ChatGPT, Perplexity, and Google AI Overviews. BankForge computes AI SEO scores across 4,300+ FDIC-insured banks. The average score is 66 out of 100. Banks scoring below 40 are effectively invisible when customers search for local banking services on AI platforms.',
      },
    },
    {
      '@type': 'Question',
      name: "How does BankForge compute a bank's AI SEO score?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BankForge measures five factors: schema markup (JSON-LD structured data), Google Business Profile completeness, content authority and freshness, AI crawler access, and web archive history. Each factor is weighted by its observed impact on AI search engine citation rates across the BankForge peer benchmarks from 4,300+ FDIC-insured banks.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does the AI SEO remediation service include?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BankForge AI SEO remediation has three steps: a Baseline Report ($3,000) with your AI SEO score, competitor gap analysis, and 10 prioritized fixes; a Remediation Spec and 60-minute working session ($2,000) where BankForge walks your marketing and IT team through every fix; and optional monthly AI SEO Monitoring ($999/month) to track score changes over time.',
      },
    },
  ],
};

export default function GeoScorePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'AI SEO + Marketing Intelligence Report',
            provider: { '@type': 'Organization', name: 'BankForge', url: 'https://www.bankforge.ai' },
            description: 'AI search visibility scoring and peer benchmarking for community banks and credit unions. Scores institutions against 4,300+ FDIC-insured bank dataset.',
            serviceType: 'Digital Marketing Intelligence',
          }),
        }}
      />
      <GeoScorePageClient />
    </>
  );
}
