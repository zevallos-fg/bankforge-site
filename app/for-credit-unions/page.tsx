import type { Metadata } from 'next';
import AudiencePage from '../components/AudiencePage';

export const metadata: Metadata = {
  title: 'Credit Union Website Compliance — BankForge.ai',
  description:
    'BankForge scans credit union websites for compliance gaps and AI visibility signals. NCUA exam prep. Built by practitioners from regulated financial institutions.',
  alternates: { canonical: 'https://bankforge.ai/for-credit-unions' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What compliance issues do credit union websites commonly have?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Common credit union website compliance gaps include missing Truth in Savings (Reg DD) disclosures on share certificate pages, absent Equal Housing Lender statements on real estate lending pages, NMLS identifier gaps on loan officer pages, and non-deposit product disclaimers missing near NCUSIF branding. BankForge scans for these plus UDAAP, Reg Z, and Fair Lending signals across your full public web presence.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I prepare my credit union website for an NCUA examination?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Start with a baseline compliance scan of your public-facing website. NCUA examiners review digital presence as part of consumer compliance examinations. BankForge scans your homepage, product pages, rate disclosures, and footers against the same regulatory criteria examiners use. Every finding is severity-graded with a specific citation so your compliance team knows exactly what to remediate before the exam.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does BankForge work for credit unions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. BankForge serves credit unions under NCUA supervision with the same compliance frameworks applied to FDIC-supervised banks \u2014 UDAAP, Reg Z, Reg DD, FFIEC interagency guidance, and Fair Lending. Our corpus includes 4,400+ credit unions alongside 4,300+ banks and 23,000+ RIAs.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a GEO score for a credit union?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A GEO score measures how visible your credit union is on AI-powered search engines like ChatGPT, Perplexity, and Google AI Overviews. It is driven by structured data, Google Business Profile completeness, content authority, and technical signals. BankForge computes GEO scores across 4,400+ credit unions as part of our monthly corpus scan.',
      },
    },
  ],
};

const faqItems = [
  {
    q: 'What compliance issues do credit union websites commonly have?',
    a: 'Common credit union website compliance gaps include missing Truth in Savings (Reg DD) disclosures on share certificate pages, absent Equal Housing Lender statements on real estate lending pages, NMLS identifier gaps on loan officer pages, and non-deposit product disclaimers missing near NCUSIF branding.',
  },
  {
    q: 'How do I prepare my credit union website for an NCUA examination?',
    a: 'Start with a baseline compliance scan of your public-facing website. NCUA examiners review digital presence as part of consumer compliance examinations. BankForge scans your homepage, product pages, rate disclosures, and footers against the same regulatory criteria examiners use.',
  },
  {
    q: 'Does BankForge work for credit unions?',
    a: 'Yes. BankForge serves credit unions under NCUA supervision with the same compliance frameworks applied to FDIC-supervised banks \u2014 UDAAP, Reg Z, Reg DD, FFIEC interagency guidance, and Fair Lending. Our corpus includes 4,400+ credit unions alongside 4,300+ banks and 23,000+ RIAs.',
  },
  {
    q: 'What is a GEO score for a credit union?',
    a: 'A GEO score measures how visible your credit union is on AI-powered search engines like ChatGPT, Perplexity, and Google AI Overviews. It is driven by structured data, Google Business Profile completeness, content authority, and technical signals.',
  },
];

export default function ForCreditUnionsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <AudiencePage
        pageType="cu"
        h1="What your NCUA examiner sees when they pull up your credit union's website."
        description="BankForge scans credit union websites for compliance gaps and AI visibility signals."
        ctaText="Request a Credit Union Compliance Review"
        faqItems={faqItems}
      />
    </>
  );
}
