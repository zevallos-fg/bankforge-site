import type { Metadata } from 'next';
import AudiencePage from '../components/AudiencePage';

export const metadata: Metadata = {
  title: 'RIA Marketing Rule Compliance Review — BankForge.ai',
  description:
    'BankForge reviews RIA websites against SEC Marketing Rule Rule 206(4)-1 criteria. December 2025 Risk Alert. Built by practitioners from $100B+ institutions.',
  alternates: { canonical: 'https://bankforge.ai/for-rias' },
  openGraph: { url: 'https://bankforge.ai/for-rias' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the SEC Marketing Rule for RIAs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The SEC Marketing Rule (Rule 206(4)-1 under the Investment Advisers Act) governs how registered investment advisers may advertise their services. Key requirements include: testimonials and endorsements must include compensation disclosures and material conditions legends; third-party ratings must disclose the criteria, date range, and any compensation; performance advertising must be fair and balanced. The SEC\u2019s December 2025 Risk Alert identified these areas as top examination deficiencies.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does a BankForge RIA compliance review cover?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BankForge scrapes your public-facing website and Form ADV filings, then scans for the specific disclosures, language patterns, and omissions that SEC examiners look for under Rule 206(4)-1 and Regulation S-P. Every finding is severity-graded with the regulatory citation attached. The BankForge team reviews all findings before delivery. BankForge flags for counsel review \u2014 we never conclude a violation.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the most common Marketing Rule violations on RIA websites?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Based on BankForge analysis of 23,000+ RIA websites and the SEC\u2019s December 2025 Risk Alert, the most common deficiencies are: testimonials displayed without required compensation and material conditions disclosures; third-party ratings shown without criteria, date range, or compensation context; performance advertising without gross/net, time period, and benchmark disclosures; and privacy notices not readily accessible from the homepage.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I prepare my RIA website for an SEC examination?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Start by running a Marketing Rule compliance scan. The SEC Division of Examinations identified marketing practices as a 2026 examination priority. BankForge reviews your website against the same criteria examiners use \u2014 testimonial disclosures, performance advertising, third-party ratings, and Reg S-P privacy notice accessibility. Every finding is severity-graded with the specific regulatory citation.',
      },
    },
  ],
};

const faqItems = [
  {
    q: 'What is the SEC Marketing Rule for RIAs?',
    a: 'The SEC Marketing Rule (Rule 206(4)-1 under the Investment Advisers Act) governs how registered investment advisers may advertise their services. Key requirements include: testimonials and endorsements must include compensation disclosures and material conditions legends; third-party ratings must disclose the criteria, date range, and any compensation; performance advertising must be fair and balanced. The SEC\u2019s December 2025 Risk Alert identified these areas as top examination deficiencies.',
  },
  {
    q: 'What does a BankForge RIA compliance review cover?',
    a: 'BankForge scrapes your public-facing website and Form ADV filings, then scans for the specific disclosures, language patterns, and omissions that SEC examiners look for under Rule 206(4)-1 and Regulation S-P. Every finding is severity-graded with the regulatory citation attached.',
  },
  {
    q: 'What are the most common Marketing Rule violations on RIA websites?',
    a: 'Based on BankForge analysis of 23,000+ RIA websites and the SEC\u2019s December 2025 Risk Alert, the most common deficiencies are: testimonials without required disclosures, third-party ratings without context, performance advertising without required disclosures, and privacy notices not readily accessible.',
  },
  {
    q: 'How do I prepare my RIA website for an SEC examination?',
    a: 'Start by running a Marketing Rule compliance scan. The SEC Division of Examinations identified marketing practices as a 2026 examination priority. BankForge reviews your website against the same criteria examiners use.',
  },
];

export default function ForRiasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <AudiencePage
        pageType="ria"
        h1="What the SEC Division of Examinations sees when they pull up your RIA's website."
        description="BankForge reviews RIA websites against SEC Marketing Rule criteria."
        ctaText="Request Your RIA Compliance Review"
        faqItems={faqItems}
      />
    </>
  );
}
