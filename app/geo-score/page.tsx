import type { Metadata } from 'next';
import GeoScorePageClient from './GeoScoreClient';

export const metadata: Metadata = {
  title: 'Bank GEO Score — AI Search Visibility for Community Banks | BankForge.ai',
  description:
    'BankForge has computed GEO scores across 4,300+ community banks. The average score is 45.8 out of 100. Find out where your institution stands on ChatGPT, Perplexity, and Google AI Overviews.',
  keywords:
    'bank AI search visibility, GEO score community bank, ChatGPT bank search, Perplexity bank visibility, AI search optimization financial institution',
  openGraph: {
    title: 'Bank GEO Score — AI Search Visibility | BankForge.ai',
    description:
      '16.6% of community banks score below 40 on AI search — invisible when customers search for local banking services. See where your institution stands.',
    url: 'https://bankforge.ai/geo-score',
  },
  alternates: { canonical: 'https://bankforge.ai/geo-score' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a GEO score for a bank?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A GEO score measures how visible a bank is on AI-powered search engines like ChatGPT, Perplexity, and Google AI Overviews. BankForge computes GEO scores across 4,300+ community banks. The average score is 45.8 out of 100. Banks scoring below 40 are effectively invisible when customers search for local banking services on AI platforms.',
      },
    },
    {
      '@type': 'Question',
      name: "How does BankForge compute a bank's GEO score?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BankForge measures five factors: schema markup (JSON-LD structured data), Google Business Profile completeness, content authority and freshness, AI crawler access, and web archive history. Each factor is weighted by its observed impact on AI search engine citation rates across the BankForge corpus of 4,300+ institutions.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does the GEO remediation service include?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BankForge GEO remediation has three steps: a Baseline Report ($3,000) with your GEO score, competitor gap analysis, and 10 prioritized fixes; a Remediation Spec and 60-minute working session ($2,000) where BankForge walks your marketing and IT team through every fix; and optional monthly GEO Monitoring ($999/month) to track score changes over time.',
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
      <GeoScorePageClient />
    </>
  );
}
