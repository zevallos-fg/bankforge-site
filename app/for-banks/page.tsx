import type { Metadata } from 'next';
import AudiencePage from '../components/AudiencePage';

export const metadata: Metadata = {
  title: 'Bank Website Compliance Monitoring — BankForge.ai',
  description:
    'BankForge scans bank websites for UDAAP, Reg Z, Reg DD, Fair Lending, and FFIEC compliance gaps. Built by practitioners from $100B+ institutions. Know what your examiners see before they do.',
  alternates: { canonical: 'https://bankforge.ai/for-banks' },
  openGraph: { url: 'https://bankforge.ai/for-banks' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I check if my bank website is compliant?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BankForge scans your public-facing website against UDAAP, Reg Z, Reg DD, FFIEC interagency guidance, and Fair Lending standards. Every finding is severity-graded with the specific regulatory citation attached. No login or IT access required. The BankForge team reviews every finding before delivery.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does a bank website compliance audit cover?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A BankForge bank compliance review covers rate advertising (Reg DD triggering terms), loan advertising (Reg Z APR disclosures), Equal Housing Lender disclosures, NMLS identifier presence, non-deposit product disclaimers near FDIC branding, UDAAP risk language, accessibility compliance, schema markup, and digital performance signals. Every finding is mapped to its regulatory citation.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can AI tools monitor a bank website for regulatory compliance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. BankForge uses AI to scan bank websites against the specific regulatory criteria that examiners apply — UDAAP, Reg Z, Reg DD, FFIEC guidance, and Fair Lending. The system processes every public-facing page and flags language, disclosures, and omissions that would appear on an examiner checklist. Every finding is reviewed by the BankForge team before delivery. BankForge flags for counsel review — we never conclude a violation.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should a bank website include before a redesign?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Before a redesign, banks should establish a compliance baseline. BankForge analysis shows 89% of community bank websites have at least one compliance gap. Common issues include missing Equal Housing Lender disclosures, UDAAP-risk language in product descriptions, and Reg DD triggering terms without required context. A redesign without a compliance baseline risks building those gaps into a brand-new site.',
      },
    },
  ],
};

const faqItems = [
  {
    q: 'How do I check if my bank website is compliant?',
    a: 'BankForge scans your public-facing website against UDAAP, Reg Z, Reg DD, FFIEC interagency guidance, and Fair Lending standards. Every finding is severity-graded with the specific regulatory citation attached. No login or IT access required. The BankForge team reviews every finding before delivery.',
  },
  {
    q: 'What does a bank website compliance audit cover?',
    a: 'A BankForge bank compliance review covers rate advertising (Reg DD triggering terms), loan advertising (Reg Z APR disclosures), Equal Housing Lender disclosures, NMLS identifier presence, non-deposit product disclaimers near FDIC branding, UDAAP risk language, accessibility compliance, schema markup, and digital performance signals.',
  },
  {
    q: 'Can AI tools monitor a bank website for regulatory compliance?',
    a: 'Yes. BankForge uses AI to scan bank websites against the specific regulatory criteria that examiners apply. The system processes every public-facing page and flags language, disclosures, and omissions that would appear on an examiner checklist. Every finding is reviewed by the BankForge team before delivery. BankForge flags for counsel review \u2014 we never conclude a violation.',
  },
  {
    q: 'What should a bank website include before a redesign?',
    a: 'Before a redesign, banks should establish a compliance baseline. BankForge analysis shows 89% of community bank websites have at least one compliance gap. Common issues include missing Equal Housing Lender disclosures, UDAAP-risk language in product descriptions, and Reg DD triggering terms without required context.',
  },
];

export default function ForBanksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <AudiencePage
        pageType="bank"
        h1="What your bank's examiner sees when they pull up your website. You should know first."
        description="BankForge scans bank websites for UDAAP, Reg Z, Reg DD, Fair Lending, and FFIEC compliance gaps."
        ctaText="Request a Bank Compliance Review"
        faqItems={faqItems}
        extraNote="BankForge also serves credit unions under NCUA supervision — same frameworks, same rigour."
      />
    </>
  );
}
