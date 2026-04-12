import type { Metadata } from 'next';
import SecMarketingClient from './SecMarketingClient';

export const metadata: Metadata = {
  title: '2025 SEC Marketing Rule Audit | BankForge.ai',
  description:
    'BankForge has scanned 23,000+ RIAs for SEC Marketing Rule (Rule 206(4)-1) compliance gaps. Testimonial disclosures, third-party ratings, performance advertising, and AI search visibility. $4,500 one-time audit. Delivered in 5 business days.',
  alternates: { canonical: 'https://bankforge.ai/sec-marketing-rule-audit' },
  openGraph: {
    title: '2025 SEC Marketing Rule Audit | BankForge.ai',
    description:
      'The SEC December 2025 Risk Alert identified Marketing Rule compliance gaps as a top examination deficiency. BankForge has already scanned 23,000+ RIAs.',
    url: 'https://bankforge.ai/sec-marketing-rule-audit',
  },
};

export default function SecMarketingRuleAuditPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                name: 'BankForge',
                url: 'https://www.bankforge.ai',
                description: 'Compliance intelligence and AI search visibility platform for regulated financial institutions.',
              },
              {
                '@type': 'Service',
                name: '2025 SEC Marketing Rule Audit',
                provider: { '@type': 'Organization', name: 'BankForge', url: 'https://www.bankforge.ai' },
                description: 'Marketing footprint audit for registered investment advisers against SEC Rule 206(4)-1. Covers testimonials, endorsements, third-party ratings, and performance advertising.',
                serviceType: 'Regulatory Compliance Audit',
              },
            ],
          }),
        }}
      />
      <SecMarketingClient />
    </>
  );
}
