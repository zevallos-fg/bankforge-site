import type { PeerComparison } from '@/app/lib/peer-comparisons';

interface Props {
  comparisons: PeerComparison[];
}

export default function PeerComparisonCallouts({ comparisons }: Props) {
  if (!comparisons || comparisons.length === 0) return null;

  return (
    <div className="mt-3">
      <div
        className="rounded p-2.5"
        style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B' }}
      >
        {comparisons.map((c, i) => (
          <div
            key={i}
            className={
              i > 0
                ? 'pt-2 mt-2 border-t border-amber-200'
                : ''
            }
          >
            <p className="text-xs text-amber-800 leading-relaxed">
              <span className="mr-1">{'\u26A0\uFE0F'}</span>
              <strong>{c.label}</strong>
              <span className="block text-[11px] text-amber-700/90 mt-0.5 font-normal">
                {c.body}
              </span>
            </p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-right">
        <a
          href="mailto:outreach@bankforge.ai"
          className="text-xs font-medium hover:underline"
          style={{ color: '#C8A84B' }}
        >
          See how your peers compare &rarr; Request a Call
        </a>
      </p>
    </div>
  );
}
