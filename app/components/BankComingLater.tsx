import WalkthroughForm from './WalkthroughForm';

/**
 * Bank lane: "coming later" (WEB2.A.1, D-GTMR-31 45c9a547 -- "Keep pages, no prices,
 * waitlist only"). The bank pages stay up and keep explaining what a review reads,
 * but nothing on them is for sale yet, no price is shown, and the only call to action
 * is the waitlist. Sign-ups go through the same request route as every other form,
 * tagged bank-waitlist (app/lib/request-tags.ts).
 */

/** The notice shown under each bank page's intro. */
export function ComingLaterNotice({ href = '#waitlist' }: { href?: string }) {
  return (
    <section className="bg-white px-6 pt-10">
      <div className="mx-auto max-w-3xl rounded-lg border border-amber-300 bg-amber-50 px-5 py-4">
        <p className="text-sm leading-relaxed text-amber-900">
          <span className="font-medium">Coming later.</span> Reviews for banks and credit
          unions are not available yet, so no prices are shown. This page describes what
          the review will read.{' '}
          <a href={href} className="font-medium underline">
            Join the waitlist
          </a>{' '}
          and we will tell you when it opens.
        </p>
      </div>
    </section>
  );
}

/** The waitlist form section that replaces each bank page's closing call to action. */
export function BankWaitlist({ id = 'waitlist' }: { id?: string }) {
  return (
    <section id={id} className="scroll-mt-20 bg-bf-slate px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <WalkthroughForm
          lane="bank"
          tag="bank-waitlist"
          heading="Join the bank and credit union waitlist"
          body="Leave your email and institution. We will write when reviews for banks and credit unions open. Nothing is charged and no account is created."
        />
      </div>
    </section>
  );
}
