import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '../components/SiteNav';

export const metadata: Metadata = {
  title: 'Insights — BankForge.ai',
  description:
    'Research and analysis on bank compliance, AI visibility, and regulatory readiness from the BankForge team.',
  alternates: { canonical: 'https://bankforge.ai/insights' },
};

const articles = [
  {
    slug: 'bank-ai-score',
    title: "Your Bank's AI Score Is Low. Here's Why — and What to Fix.",
    date: 'April 2026',
    author: 'BankForge Research Team',
    excerpt:
      "If your CMO mentioned your bank's AI score in a recent meeting, you're not alone. AI-powered search engines like Google's AI Overviews, Perplexity, and ChatGPT are reshaping how consumers discover financial institutions — and most community banks are invisible.",
  },
];

export default function InsightsPage() {
  return (
    <div className="min-h-screen bg-bf-slate">
      {/* Nav */}
      <SiteNav />

      {/* Content */}
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-bf-navy text-xs font-medium tracking-wide uppercase mb-3">
            Insights
          </p>
          <h1
            className="text-4xl text-gray-900 mb-10"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Research &amp; Analysis
          </h1>

          <div className="grid grid-cols-1 gap-6">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/insights/${article.slug}`}
                className="bg-white rounded-xl border border-gray-200 p-8 hover:border-bf-navy/30 transition-colors block"
              >
                <p className="text-xs text-gray-400 mb-2">
                  {article.date} &middot; {article.author}
                </p>
                <h2
                  className="text-xl text-gray-900 mb-3"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {article.title}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {article.excerpt}
                </p>
                <span className="text-bf-navy text-sm font-medium">
                  Read More &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-gray-400">
          <span className="flex items-center gap-2">
            <span style={{ fontFamily: 'var(--font-display)' }} className="text-gray-500 text-sm">
              <span style={{ color: '#1B5299' }}>BankForge</span>.ai
            </span>
            <span className="text-gray-300">·</span>
            <a href="https://www.linkedin.com/company/bankforge-ai" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 transition-colors">LinkedIn</a>
          </span>
          <span>BankForge flags findings for compliance counsel review. We never conclude a violation.</span>
          <span className="flex items-center gap-2">&copy; 2026 BankForge.ai LLC<span className="text-gray-300">·</span><a href="/privacy" className="text-gray-500 hover:text-gray-700 transition-colors">Privacy Policy</a><span className="text-gray-300">·</span><a href="/terms" className="text-gray-500 hover:text-gray-700 transition-colors">Terms of Service</a></span>
        </div>
      </footer>
    </div>
  );
}
