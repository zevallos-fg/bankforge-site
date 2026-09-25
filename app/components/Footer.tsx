import Link from 'next/link';
import { COPYRIGHT_YEAR, LEGAL_ENTITY, CONTACT_EMAIL } from '@/app/lib/site';

/**
 * The ONE footer. Before this component the markup was copy-pasted inline into
 * eight route files (TD-SITE-FOOTER-ENTITY-DUPLICATED-IN-EIGHT-FILES, 03fb39a1),
 * which made the legal entity an eight-file edit.
 *
 * The entity rendered is BankForge.ai LLC, which D-TW-11 (bf34ac8e) rules
 * correct per the EIN. The product brand is Tiqsi.ai and appears elsewhere; no
 * "d/b/a" line is rendered, because no fictitious-name filing is established.
 */
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-8 text-sm text-gray-500">
      <div className="max-w-6xl mx-auto flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <span className="flex flex-wrap items-center gap-2">
          <span>&copy; {COPYRIGHT_YEAR} {LEGAL_ENTITY}</span>
          <span className="text-gray-300">&middot;</span>
          <Link href="/privacy" className="text-gray-500 hover:text-gray-700 transition-colors">
            Privacy Policy
          </Link>
          <span className="text-gray-300">&middot;</span>
          <Link href="/terms" className="text-gray-500 hover:text-gray-700 transition-colors">
            Terms of Service
          </Link>
        </span>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          {CONTACT_EMAIL}
        </a>
      </div>
      <div className="max-w-6xl mx-auto mt-4 text-xs leading-relaxed text-gray-400">
        We flag findings for compliance counsel review. We do not conclude that a
        violation has occurred, and nothing here is legal advice.
      </div>
    </footer>
  );
}
