import type { Metadata } from 'next';
import ComplianceReviewClient from './ComplianceReviewClient';

export const metadata: Metadata = {
  title: 'FDIC-Insured Bank Compliance Review — Website Compliance Audit | BankForge.ai',
  description:
    "BankForge has scanned 4,300+ FDIC-insured banks for Reg DD, UDAAP, Equal Housing, and FFIEC compliance gaps. 78% fail a basic Reg DD disclosure check. $1,750/mo founding rate — first 5 institutions.",
  alternates: { canonical: 'https://bankforge.ai/compliance-review' },
  openGraph: {
    title: 'FDIC-Insured Bank Compliance Review — Website Compliance Audit | BankForge.ai',
    description:
      '78% of FDIC-insured banks fail a basic Reg DD disclosure check. BankForge scans your public digital presence against examiner criteria.',
    url: 'https://bankforge.ai/compliance-review',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What does BankForge check in a bank compliance review?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "BankForge scans your institution\u2019s public website against Reg DD, UDAAP, Equal Housing Lender disclosure requirements, and FFIEC accessibility and disclosure standards. Every finding is severity-graded (Low, Medium, High) with a regulatory citation and peer benchmark context from 4,300+ institutions.",
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a bank compliance review cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Community banks ($100M\u2013$1B) start at $1,750/mo founding rate for the first 5 institutions, stepping up to $3,000/mo at Month 7. Growth ($1B\u2013$5B) starts at $2,500/mo, Regional ($5B\u2013$50B) at $5,000/mo. Enterprise is custom. All tiers include AI SEO and Marketing Intelligence monitoring from Month 1.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is included in each compliance review?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Each review includes a full website scan, severity-graded findings with regulatory citations, peer benchmarks from 4,300+ FDIC-Insured Banks, and a DOCX report delivered within 5 business days. AI SEO and Marketing Intelligence monitoring are included from Month 1 at all tiers.',
      },
    },
    {
      '@type': 'Question',
      name: 'When does compliance remediation launch?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Compliance Remediation launches September 2026, available to active Compliance Review subscribers only. Remediation is a single $1,500 engagement covering all High findings in a 60-minute working session with a DOCX summary delivered within 48 hours. Most subscribers complete remediation in one engagement.',
      },
    },
  ],
};

export default function ComplianceReviewPage() {
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
            name: 'Bank Website Compliance Review',
            provider: { '@type': 'Organization', name: 'BankForge', url: 'https://www.bankforge.ai' },
            description: 'Website compliance audit for FDIC-insured banks and credit unions against Reg DD, UDAAP, Equal Housing Lender, FFIEC, and Fair Lending standards.',
            serviceType: 'Regulatory Compliance Audit',
          }),
        }}
      />
      <ComplianceReviewClient />
    </>
  );
}
