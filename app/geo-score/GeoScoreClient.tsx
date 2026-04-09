'use client';

import ScanDemo from '../components/ScanDemo';

export default function InlineScanSection() {
  return (
    <section className="py-16 px-6" style={{ backgroundColor: '#F8F9FB' }}>
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs font-medium tracking-widest uppercase mb-3" style={{ color: '#1B5299' }}>
          Check your score
        </p>
        <h2
          className="text-3xl text-gray-900 mb-4 tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          See what your GEO score is.
        </h2>
        <p className="text-sm text-gray-500 mb-10 max-w-lg mx-auto leading-relaxed">
          Enter your bank&apos;s website below. BankForge has already computed
          GEO scores across 4,300+ institutions from our March 2026 corpus.
          Results are instant.
        </p>
        <ScanDemo inline />
      </div>
    </section>
  );
}
