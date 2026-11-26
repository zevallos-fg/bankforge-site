/**
 * Request tags the site may attach to a walkthrough request (WEB2.A.1).
 *
 * `bank-waitlist` marks a sign-up from the bank pages, which are "coming later" with a
 * waitlist only (D-GTMR-31 45c9a547). It goes through the same fixed request route as
 * every other request, /api/demo-request -> public.submit_walkthrough_request.
 *
 * The RPC has no tag parameter, and adding one is a function change outside this leg,
 * so the tag travels as a fixed bracketed prefix on p_message. A reader of
 * website_demo_requests filters on: message LIKE '[bank-waitlist]%'. Only tags in this
 * set are written; anything else a caller sends is dropped, so a caller cannot forge an
 * arbitrary prefix.
 */
export const REQUEST_TAGS: ReadonlySet<string> = new Set(['bank-waitlist']);

export function taggedMessage(tag: string, message: string): string | null {
  const prefix = REQUEST_TAGS.has(tag) ? `[${tag}]` : '';
  const text = [prefix, message].filter(Boolean).join(' ');
  return text || null;
}
