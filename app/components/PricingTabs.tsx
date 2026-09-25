'use client';

import { useState } from 'react';
import type { SkuRow } from '@/app/lib/pricing';
import PricingTable from './PricingTable';

/**
 * RIA / Bank tabs.
 *
 * Both panels are rendered into the HTML and the inactive one is hidden with the
 * `hidden` attribute rather than being omitted. That keeps the full catalogue in
 * the served markup, which is what both a crawler and the copy-claims gate read.
 */
export default function PricingTabs({
  rows,
  bound,
}: {
  rows: SkuRow[];
  bound: boolean;
}) {
  const [lane, setLane] = useState<'ria' | 'bank'>('ria');

  const tabs: { key: 'ria' | 'bank'; label: string }[] = [
    { key: 'ria', label: 'Investment advisers' },
    { key: 'bank', label: 'Banks & credit unions' },
  ];

  return (
    <div>
      <div className="mb-8 inline-flex rounded-lg border border-gray-200 bg-white p-1" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={lane === t.key}
            aria-controls={`panel-${t.key}`}
            onClick={() => setLane(t.key)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              lane === t.key
                ? 'bg-bf-navy text-white'
                : 'text-gray-600 hover:text-bf-navy-deep'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div id="panel-ria" role="tabpanel" hidden={lane !== 'ria'}>
        <PricingTable rows={rows} lane="ria" bound={bound} />
      </div>
      <div id="panel-bank" role="tabpanel" hidden={lane !== 'bank'}>
        <PricingTable rows={rows} lane="bank" bound={bound} />
      </div>
    </div>
  );
}
