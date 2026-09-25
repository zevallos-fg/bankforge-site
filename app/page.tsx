import Link from 'next/link';
import type { Metadata } from 'next';
import { MEASURED, ANSWER_ENGINES, CONTACT_EMAIL, BRAND_NAME } from './lib/site';

export const metadata: Metadata = {
  title: `${BRAND_NAME} — see your public presence the way an examiner does`,
  description:
    'Tiqsi reviews the public websites of investment advisers, banks and credit unions against regulatory criteria, and measures how those firms appear in AI search.',
  alternates: { canonical: '/' },
};

const audiences = [
  {
    href: '/rias',
    eyebrow: 'Investment advisers',
    title: 'SEC Marketing Rule, read off your own website',
    body: 'Testimonial and endorsement disclosure, third-party ratings, performance advertising and Regulation S-P notice access — each finding carries the rule it comes from.',
  },
  {
    href: '/banks',
    eyebrow: 'Banks and credit unions',
    title: 'The disclosures an examiner opens a browser to check',
    body: 'Regulation DD rate advertising, Regulation Z triggering terms, Equal Housing Lender presence, UDAAP language and FFIEC non-deposit disclaimers.',
  },
];

const how = [
  {
    step: '01',
    title: 'We read what the public reads',
    body: 'Only public pages. No login, no agent on your network, and nothing asked of your IT team.',
  },
  {
    step: '02',
    title: 'Every finding carries its citation',
    body: 'Each item is graded High, Medium or Low and names the regulation behind it, so your compliance counsel can act on it or set it aside on the merits.',
  },
  {
    step: '03',
    title: 'A person reviews it before you see it',
    body: 'Findings are reviewed before delivery. We flag items for counsel; we do not conclude that a violation has occurred.',
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-bf-navy-deep px-6 py-24 text-white">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">
            Compliance and AI visibility for regulated firms
          </p>
          <h1
            className="mt-5 text-4xl leading-tight md:text-5xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            See your public presence the way an examiner does.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
            Your website is the part of your firm a regulator can read without asking
            permission — and increasingly it is also what an AI assistant reads when
            someone asks for a firm like yours. Tiqsi looks at both, and shows you
            what each one finds.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/pricing"
              className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-bf-navy-deep hover:bg-gray-100 transition-colors"
            >
              See pricing
            </Link>
            <Link
              href="/rias"
              className="rounded-lg border border-white/25 px-5 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              For investment advisers
            </Link>
          </div>
        </div>
      </section>

      {/* Measured scope */}
      <section className="border-b border-gray-200 bg-white px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-sm uppercase tracking-[0.15em] text-gray-500">
            What we measure against
          </h2>
          <div className="mt-6 grid gap-8 sm:grid-cols-3">
            <Stat
              value={MEASURED.rias.toLocaleString('en-US')}
              label={`SEC-registered investment advisers tracked, ${MEASURED.readOn}`}
            />
            <Stat
              value={MEASURED.banks.toLocaleString('en-US')}
              label={`FDIC-insured banks with a recorded asset tier, ${MEASURED.readOn}`}
            />
            <Stat
              value={MEASURED.creditUnions.toLocaleString('en-US')}
              label={`NCUA-supervised credit unions tracked, ${MEASURED.readOn}`}
            />
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-gray-500">
            Those counts are what your results are compared against. A finding on its
            own is an opinion; a finding next to how peers of your size and market
            handle the same thing is a priority.
          </p>
        </div>
      </section>

      {/* Audiences */}
      <section className="bg-bf-slate px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2
            className="text-2xl text-bf-navy-deep"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Two regulatory worlds, one method
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {audiences.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="group block rounded-xl border border-gray-200 bg-white p-7 transition-colors hover:border-bf-navy"
              >
                <p className="text-xs uppercase tracking-[0.15em] text-bf-navy">
                  {a.eyebrow}
                </p>
                <h3
                  className="mt-3 text-xl text-bf-navy-deep"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {a.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{a.body}</p>
                <span className="mt-5 inline-block text-sm font-medium text-bf-navy group-hover:underline">
                  Read more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI visibility */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2
            className="text-2xl text-bf-navy-deep"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            When someone asks an AI assistant for a firm like yours
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-600">
            We put the questions your prospects actually ask to{' '}
            {ANSWER_ENGINES.join(', ')} and record what comes back — whether you are
            named, which firms are named instead, and what on your site explains the
            difference. Results are peer-benchmarked, so you see your position among
            firms of your size and market rather than a score with no context.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            {MEASURED.aiVisibilityQueriesThisMonth.toLocaleString('en-US')} such
            questions were put to those three engines since 1 {MEASURED.readOn}.
          </p>
          <p className="mt-6 text-sm text-gray-500">
            We report what the engines returned on the dates we asked. Answers move,
            and a measurement is a reading rather than a promise.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-bf-slate px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2
            className="text-2xl text-bf-navy-deep"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            How a review works
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {how.map((h) => (
              <div key={h.step} className="rounded-xl border border-gray-200 bg-white p-6">
                <span className="text-xs font-medium tracking-[0.2em] text-bf-navy">
                  {h.step}
                </span>
                <h3 className="mt-3 text-base font-medium text-bf-navy-deep">{h.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bf-navy-deep px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
            Walk through it with us
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/75">
            We will take your site, show you what the review surfaces, and you can
            decide whether it is worth acting on.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Walkthrough%20request`}
            className="mt-7 inline-block rounded-lg bg-white px-6 py-3 text-sm font-medium text-bf-navy-deep hover:bg-gray-100 transition-colors"
          >
            Book a walkthrough
          </a>
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p
        className="text-3xl text-bf-navy-deep"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {value}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">{label}</p>
    </div>
  );
}
