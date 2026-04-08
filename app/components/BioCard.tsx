const credentials = [
  'UDAAP', 'Reg Z', 'Reg DD', 'FFIEC', 'Fair Lending',
  'Rule 206(4)-1', 'Harvard MLA Finance', 'Post-SVB Integration',
];

export default function BioCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <p className="text-bf-navy text-xs font-medium tracking-wide uppercase mb-2">
        Methodology
      </p>
      <h3
        className="text-xl text-gray-900 mb-3"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Built on examiner-side experience.
      </h3>
      <p className="text-sm text-gray-500 mb-1">
        Compliance Methodology &middot; $100B+ Institution Track Record
      </p>
      <p className="text-sm text-gray-600 leading-relaxed mt-3 mb-4">
        The BankForge compliance framework was designed by a VP-level operational risk
        professional with 13 years across City National, First Citizens (post-SVB, $100B+),
        and Citi. The methodology operationalizes what federal examiners look for &mdash;
        not what marketing teams think compliance means. Every finding is mapped to specific
        regulatory citations and calibrated against examiner expectations.
      </p>
      <div className="flex flex-wrap gap-2">
        {credentials.map((c) => (
          <span
            key={c}
            className="bg-bf-blue-wash text-bf-navy text-[11px] font-medium px-2.5 py-1 rounded-full"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}
