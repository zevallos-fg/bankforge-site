import {
  type SkuRow,
  headlinePrice,
  foundingLine,
  unitLabel,
  ctaFor,
  rowsForLane,
  STARTS_AT_FOOTNOTE,
  PRICING_UNAVAILABLE_MESSAGE,
} from '@/app/lib/pricing';
import { CONTACT_EMAIL } from '@/app/lib/site';

/**
 * Renders the catalogue for one lane. Every number here came from
 * v_sku_catalog_public; this component has no price of its own and no default.
 * When `rows` is empty it says pricing is being updated rather than inventing
 * a figure.
 */
export default function PricingTable({
  rows,
  lane,
  bound,
}: {
  rows: SkuRow[];
  lane: 'ria' | 'bank' | 'bd';
  bound: boolean;
}) {
  const laneRows = bound ? rowsForLane(rows, lane) : [];

  if (!bound || laneRows.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-bf-slate p-8 text-center">
        <p className="text-base text-gray-700">{PRICING_UNAVAILABLE_MESSAGE}</p>
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=Walkthrough%20request`}
          className="mt-4 inline-block rounded-lg bg-bf-navy px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          Book a walkthrough
        </a>
      </div>
    );
  }

  const showFootnote = laneRows.some((r) => r.display_rule === 'starts_at');

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        {laneRows.map((row) => {
          const cta = ctaFor(row.site_status);
          const founding = foundingLine(row);
          return (
            <div
              key={`${row.sku_code}-${row.tier_key ?? 'base'}`}
              className="flex flex-col rounded-xl border border-gray-200 bg-white p-6"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3
                  className="text-lg text-bf-navy-deep"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {row.product_name}
                </h3>
                <span className="shrink-0 rounded bg-bf-blue-wash px-2 py-0.5 text-[11px] uppercase tracking-wide text-bf-navy">
                  {row.family === 'edge' ? 'Edge' : 'Forge'}
                </span>
              </div>

              {row.tier_label && (
                <p className="mt-1 text-sm text-gray-500">{row.tier_label}</p>
              )}

              <p className="mt-4 text-2xl text-bf-navy-deep" style={{ fontFamily: 'var(--font-display)' }}>
                {headlinePrice(row)}
              </p>
              <p className="text-sm text-gray-500">{unitLabel(row.billing_unit)}</p>

              {founding && (
                <p className="mt-2 text-xs leading-relaxed text-gray-500">{founding}</p>
              )}

              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                  `${cta.label}: ${row.product_name}`,
                )}`}
                className="mt-5 inline-block rounded-lg bg-bf-navy px-4 py-2 text-center text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                {cta.label}
              </a>
            </div>
          );
        })}
      </div>

      {showFootnote && (
        <p className="mt-4 text-xs text-gray-500">{STARTS_AT_FOOTNOTE}</p>
      )}
    </div>
  );
}
