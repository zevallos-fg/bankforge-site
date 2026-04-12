export const metadata = { title: 'Terms of Service — BankForge.ai' };

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-24">
      <div className="max-w-2xl mx-auto">
        <a href="/" className="text-sm text-[#1b5299] hover:underline mb-8 inline-block">
          ← Back to BankForge.ai
        </a>
        <h1 className="text-2xl font-semibold text-[#0f2341] mb-4">Terms of Service</h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          This document is under review by our legal counsel. For questions,
          contact{' '}
          <a href="mailto:outreach@bankforge.ai" className="text-[#1b5299] underline">
            outreach@bankforge.ai
          </a>.
        </p>
      </div>
    </main>
  );
}
