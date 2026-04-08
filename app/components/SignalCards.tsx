interface SignalCard {
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  citation: string;
}

const severityStyles = {
  HIGH: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-600 text-white', dot: 'bg-red-500' },
  MEDIUM: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-500 text-white', dot: 'bg-amber-400' },
  LOW: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-600 text-white', dot: 'bg-green-500' },
};

export default function SignalCards({ cards }: { cards: SignalCard[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map((card, i) => {
        const s = severityStyles[card.severity];
        return (
          <div key={i} className={`${s.bg} ${s.border} border rounded-lg p-5`}>
            <div className="flex items-center gap-2 mb-2">
              <span className={`${s.badge} text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                {card.severity}
              </span>
            </div>
            <h4 className="text-[15px] font-medium text-gray-900 mb-1">{card.title}</h4>
            <p className="text-[13px] text-gray-600 leading-relaxed mb-2">{card.description}</p>
            <p className="text-[11px] text-gray-400 font-mono">{card.citation}</p>
          </div>
        );
      })}
    </div>
  );
}
