import Link from 'next/link';
import { CONTACT_EMAIL } from '@/app/lib/site';

/** Standard page header: eyebrow, title, lede. */
export function PageIntro({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede: string;
}) {
  return (
    <section className="bg-bf-navy-deep px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs uppercase tracking-[0.2em] text-white/50">{eyebrow}</p>
        <h1
          className="mt-5 text-3xl leading-tight md:text-4xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">{lede}</p>
      </div>
    </section>
  );
}

/** A list of what the review looks at. Each item names its regulatory anchor. */
export function FindingList({
  heading,
  intro,
  items,
}: {
  heading: string;
  intro?: string;
  items: { title: string; body: string; anchor: string }[];
}) {
  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h2
          className="text-2xl text-bf-navy-deep"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {heading}
        </h2>
        {intro && (
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-600">{intro}</p>
        )}
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {items.map((i) => (
            <div key={i.title} className="rounded-xl border border-gray-200 p-6">
              <h3 className="text-base font-medium text-bf-navy-deep">{i.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{i.body}</p>
              <p className="mt-3 text-xs uppercase tracking-wide text-bf-navy">
                {i.anchor}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Closing call to action. No signup and no payment — email only (D-TW-10). */
export function CtaBand({
  title,
  body,
  label = 'Book a walkthrough',
  subject = 'Walkthrough request',
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  body: string;
  label?: string;
  subject?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <section className="bg-bf-slate px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h2
          className="text-2xl text-bf-navy-deep"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-gray-600">{body}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`}
            className="rounded-lg bg-bf-navy px-6 py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            {label}
          </a>
          {secondaryHref && secondaryLabel && (
            <Link
              href={secondaryHref}
              className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-medium text-bf-navy-deep hover:bg-white transition-colors"
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
