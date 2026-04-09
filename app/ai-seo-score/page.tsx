import type { Metadata } from 'next';
import GeoScorePageClient from './GeoScoreClient';

export const metadata: Metadata = {
  title: 'Bank AI SEO Score — AI Search Visibility for Community Banks | BankForge.ai',
  description:
    'BankForge has computed AI SEO scores across 4,300+ community banks. The average score is 45.8 out of 100. Find out where your institution stands on ChatGPT, Perplexity, and Google AI Overviews.',
  keywords:
    'bank AI search visibility, AI SEO score community bank, ChatGPT bank search, Perplexity bank visibility, AI search optimization financial institution',
  openGraph: {
    title: 'Bank AI SEO Score — AI Search Visibility | BankForge.ai',
    description:
      '16.6% of community banks score below 40 on AI search — invisible when customers search for local banking services. See where your institution stands.',
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
        text: 'An AI SEO score measures how visible a bank is on AI-powered search engines like ChatGPT, Perplexity, and Google AI Overviews. BankForge computes AI SEO scores across 4,300+ community banks. The average score is 45.8 out of 100. Banks scoring below 40 are effectively invisible when customers search for local banking services on AI platforms.',
      },
    },
    {
      '@type': 'Question',
      name: "How does BankForge compute a bank's AI SEO score?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BankForge measures five factors: schema markup (JSON-LD structured data), Google Business Profile completeness, content authority and freshness, AI crawler access, and web archive history. Each factor is weighted by its observed impact on AI search engine citation rates across the BankForge corpus of 4,300+ institutions.',
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
      <GeoScorePageClient />
    </>
  );
}
