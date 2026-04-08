interface Step {
  number: string;
  title: string;
  description: string;
}

export default function HowItWorks({ steps }: { steps: Step[] }) {
  return (
    <section className="bg-bf-navy-deep py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-blue-300 text-sm font-medium tracking-wide uppercase mb-3">
          How It Works
        </p>
        <h2
          className="text-white text-3xl mb-10"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Three steps. No login required.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i}>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-blue-300 text-sm font-medium mb-4">
                {step.number}
              </div>
              <h3 className="text-white text-lg font-medium mb-2">{step.title}</h3>
              <p className="text-blue-200/80 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
