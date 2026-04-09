import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Your Bank's AI Score Is Low. Here's Why — and What to Fix | BankForge.ai",
  description:
    "AI-powered search engines are reshaping how consumers discover financial institutions. Most community banks are invisible. Here's what drives your AI score and how to fix it.",
  alternates: { canonical: 'https://bankforge.ai/insights/bank-ai-score' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a bank AI score?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A bank AI score measures how likely your institution is to appear in AI-powered search results — Google AI Overviews, Perplexity, ChatGPT, and similar platforms. It is driven by structured data (schema markup), Google Business Profile completeness, content authority, and technical signals like HTTPS, page speed, and mobile responsiveness.',
      },
    },
    {
      '@type': 'Question',
      name: "Why doesn't my bank show up in AI search results?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Most community bank websites lack the structured data that AI engines rely on. Without JSON-LD schema markup, a complete Google Business Profile, and authoritative content, AI systems cannot extract or reference your institution. BankForge analysis shows 64% of community banks have significant Google Business Profile gaps.",
      },
    },
    {
      '@type': 'Question',
      name: "How do I improve my bank's Google Business Profile?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Start by claiming and verifying your profile if you haven't already. Then ensure all fields are complete: business hours, services offered, products (checking, savings, mortgage, etc.), photos, and a detailed business description. Respond to reviews regularly. Post updates at least monthly. BankForge scans show that top-quartile banks maintain 90%+ profile completeness versus bottom-quartile banks at under 40%.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is schema markup for a bank website?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Schema markup (JSON-LD) is structured data embedded in your website's HTML that tells search engines and AI systems exactly what your institution offers. For banks, this includes Organization schema (name, address, contact info), FinancialProduct schema (account types, rates), and LocalBusiness schema (branch locations, hours). Without it, AI engines must guess — and they usually don't guess in your favor.",
      },
    },
  ],
};

export default function BankAiScorePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Nav */}
      <nav
        className="fixed top-0 inset-x-0 z-50 px-6 py-3 flex items-center justify-between"
        style={{ backgroundColor: 'rgba(15,35,65,0.80)', backdropFilter: 'blur(12px)' }}
      >
        <Link
          href="/"
          className="text-xl tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span style={{ color: '#7EB3E8' }}>BankForge</span>
          <span className="text-white">.ai</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <Link href="/for-banks" className="hover:text-white transition-colors">Banks</Link>
          <Link href="/for-credit-unions" className="hover:text-white transition-colors">Credit Unions</Link>
          <Link href="/for-rias" className="hover:text-white transition-colors">Investment Advisers</Link>
          <Link href="/insights" className="text-white">Insights</Link>
        </div>
        <Link
          href="mailto:outreach@bankforge.ai"
          className="bg-white text-bf-navy-deep text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Request a Call
        </Link>
      </nav>

      {/* Article */}
      <article className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/insights"
            className="text-bf-navy text-xs font-medium tracking-wide uppercase mb-6 inline-block hover:underline"
          >
            &larr; Back to Insights
          </Link>

          <h1
            className="text-4xl text-gray-900 mb-4 leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Your Bank&apos;s AI Score Is Low.{' '}
            <em className="text-bf-navy">Here&apos;s Why</em> — and What to Fix.
          </h1>

          <p className="text-sm text-gray-400 mb-10">
            April 2026 &middot; BankForge Research Team
          </p>

          <div className="prose prose-gray max-w-none text-[15px] leading-relaxed">
            <p>
              If your CMO mentioned your bank&apos;s AI score in a recent meeting, you&apos;re not
              alone. AI-powered search engines like Google&apos;s AI Overviews, Perplexity, and
              ChatGPT are reshaping how consumers discover financial institutions — and most
              community banks are invisible.
            </p>

            <p>
              BankForge has computed AI visibility scores across 4,300+ FDIC-insured bank
              websites. The results are stark: the median community bank scores 34 out of 100.
              The top quartile averages 72. The bottom quartile averages 11.
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)' }}>
              What drives your AI score
            </h2>

            <p>
              AI search engines don&apos;t read your website the way a human does. They extract
              structured signals — and if those signals aren&apos;t there, your institution
              effectively doesn&apos;t exist in the AI layer. Here are the five factors that
              matter most:
            </p>

            <h3 style={{ fontFamily: 'var(--font-display)' }}>
              1. Schema markup (JSON-LD)
            </h3>
            <p>
              Schema markup is structured data embedded in your website&apos;s HTML that tells
              AI systems exactly what your institution offers. Organization schema identifies
              your bank. FinancialProduct schema describes your accounts and rates.
              LocalBusiness schema maps your branches.
            </p>
            <p>
              BankForge analysis: <strong>78% of community bank websites have no schema
              markup at all.</strong> Without it, AI engines must infer what you offer from
              unstructured text — and they rarely do so accurately.
            </p>

            <h3 style={{ fontFamily: 'var(--font-display)' }}>
              2. Google Business Profile completeness
            </h3>
            <p>
              Your Google Business Profile (GBP) is one of the primary data sources that AI
              search engines draw from when answering questions about local financial
              services. Incomplete profiles — missing services, stale hours, no product
              categories — signal to AI systems that your institution isn&apos;t a reliable
              source.
            </p>
            <p>
              BankForge data: <strong>64% of community banks have significant GBP gaps.</strong>{' '}
              Top-quartile banks maintain 90%+ profile completeness. Bottom-quartile banks
              average under 40%.
            </p>

            <h3 style={{ fontFamily: 'var(--font-display)' }}>
              3. Content authority and freshness
            </h3>
            <p>
              AI engines prioritize content that demonstrates expertise. A bank website with
              a single-page rate table and a generic &ldquo;About Us&rdquo; page scores lower than one
              with educational content, market commentary, and regularly updated product
              information. The Wayback Machine delta — the rate at which your website content
              changes — is a measurable signal.
            </p>
            <p>
              BankForge finding: banks with content updated in the last 90 days score
              2.4x higher on AI visibility than banks whose content hasn&apos;t changed in
              12+ months.
            </p>

            <h3 style={{ fontFamily: 'var(--font-display)' }}>
              4. Technical signals
            </h3>
            <p>
              HTTPS enforcement, mobile responsiveness, page speed, proper canonical tags,
              and accessible navigation all factor into whether AI engines trust your website
              as a source. These are table stakes for traditional SEO — and they&apos;re
              equally important for AI visibility.
            </p>

            <h3 style={{ fontFamily: 'var(--font-display)' }}>
              5. Third-party citation density
            </h3>
            <p>
              When multiple authoritative sources reference your institution — FDIC listings,
              state banking department records, industry directories, news coverage — AI
              systems gain confidence in your entity. Banks that appear in AI Overviews
              typically have 3&ndash;5x more citation sources than those that don&apos;t.
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)' }}>
              The MSA gap
            </h2>

            <p>
              AI visibility isn&apos;t just an individual bank problem — it&apos;s a competitive
              one. In the Miami market, the top-ranked institution scored 80 out of 100.
              The lowest-ranked institution in the same market scored 10. Same city.
              Same customer base.
            </p>

            <p>
              Average bank AI SEO score nationally: <strong>45.8</strong>.
              Average RIAn AI SEO score: <strong>33.3</strong>.
            </p>

            <p>
              Consumers asking AI engines &ldquo;what&apos;s the best bank for a checking
              account near me&rdquo; are getting answers that favor the institutions with
              structured, complete, authoritative digital presences.
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)' }}>
              What to fix first
            </h2>

            <p>
              If your bank&apos;s AI score is in the bottom quartile, here are the three
              highest-impact actions:
            </p>

            <ol>
              <li>
                <strong>Add JSON-LD schema markup</strong> — Organization, LocalBusiness,
                and FinancialProduct schemas. This is a one-time technical implementation
                that most web developers can complete in a day.
              </li>
              <li>
                <strong>Complete your Google Business Profile</strong> — Every field filled,
                every service listed, photos current, reviews responded to. This is free
                and takes 2&ndash;3 hours.
              </li>
              <li>
                <strong>Publish authoritative content</strong> — Rate updates, market
                commentary, community banking insights. AI engines need fresh, expert
                content to cite. Monthly updates are the minimum cadence.
              </li>
            </ol>

            <h2 style={{ fontFamily: 'var(--font-display)' }}>
              One thing to do before all of this
            </h2>

            <p>
              If your bank is planning a website redesign — and most community banks
              redesign every 3&ndash;5 years — run a compliance scan first. BankForge has
              found that 89% of community bank websites have at least one compliance gap
              that would appear on an examiner&apos;s checklist: missing Equal Housing Lender
              disclosures, UDAAP-risk language in product descriptions, or Reg DD
              triggering terms without required context.
            </p>

            <p>
              A redesign without a compliance baseline risks baking those gaps into a
              brand-new site. And once they&apos;re built in, they&apos;re harder to find.
            </p>

            {/* CTA */}
            <div
              className="rounded-lg p-6 my-10 not-prose"
              style={{
                backgroundColor: 'var(--bf-gold-bg)',
                borderLeft: '4px solid var(--bf-gold-bdr)',
              }}
            >
              <p className="text-amber-800 text-xs font-medium uppercase tracking-wide mb-2">
                Starting a website redesign?
              </p>
              <p className="text-sm text-amber-900 leading-relaxed mb-4">
                Run a compliance scan before you build. BankForge identifies the regulatory
                gaps your current site has — so your new site launches clean.
              </p>
              <Link
                href="/ai-seo-remediation"
                className="inline-block bg-bf-navy text-white font-medium px-5 py-2.5 rounded-lg hover:bg-bf-navy-deep transition-colors text-sm"
              >
                Learn about AI SEO Remediation &rarr;
              </Link>
            </div>

            <p className="text-xs text-gray-400 italic">
              BankForge flags findings for compliance counsel review. We never conclude a violation. All
              compliance observations are advisory and should be reviewed by qualified
              compliance counsel before remediation.
            </p>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-gray-400">
          <span style={{ fontFamily: 'var(--font-display)' }} className="text-gray-500 text-sm">
            <span style={{ color: '#1B5299' }}>BankForge</span>.ai
          </span>
          <span>BankForge flags findings for compliance counsel review. We never conclude a violation.</span>
          <span>&copy; 2026</span>
        </div>
      </footer>
    </div>
  );
}
