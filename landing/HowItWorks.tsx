import { Lightbulb, Cpu, Download } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Lightbulb,
    title: 'Submit your idea',
    description: 'Write your business idea in plain language. No jargon needed. Just describe what you want to build and who it\'s for.',
  },
  {
    number: '02',
    icon: Cpu,
    title: 'AI analyses everything',
    description: 'Claude AI runs a deep analysis — target customer, problem validation, revenue model, EU market size, competitors, and a 7-day plan.',
  },
  {
    number: '03',
    icon: Download,
    title: 'Take action',
    description: 'Get your full analysis in seconds. Download the PDF, follow your 7-day plan, and launch before self-doubt stops you.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber/3 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber/30 bg-amber/5 text-amber text-xs font-mono mb-6">
            HOW IT WORKS
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-cream">
            From idea to plan in{' '}
            <span className="text-gradient-amber">under 2 minutes</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[calc(100%+1rem)] w-[calc(100%-2rem)] h-px bg-gradient-to-r from-amber/30 to-transparent z-10" />
                )}

                <div className="p-8 rounded-2xl bg-ink-soft border border-ink-muted relative">
                  {/* Step number */}
                  <div className="absolute -top-4 left-6 px-3 py-1 bg-ink rounded-lg border border-ink-muted">
                    <span className="font-mono text-xs text-amber/60">{step.number}</span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-amber/10 border border-amber/20 flex items-center justify-center mb-6 mt-2">
                    <Icon size={20} className="text-amber" />
                  </div>

                  <h3 className="font-display text-xl text-cream mb-3">{step.title}</h3>
                  <p className="text-cream/50 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Sample analysis preview */}
        <div className="mt-16 p-6 md:p-8 rounded-2xl bg-ink-soft border border-ink-muted overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber/5 rounded-full blur-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div>
              <h3 className="font-display text-2xl text-cream mb-2">Sample Analysis</h3>
              <p className="text-cream/40 text-sm mb-4">What you get for your idea</p>
              <div className="space-y-2">
                {[
                  'Target customer profile',
                  'Core problem being solved',
                  'Offer & positioning',
                  'Revenue model breakdown',
                  'EU/Irish market size estimate',
                  'Top 3 competitors',
                  'Day-by-day 7-day launch plan',
                  '30-day revenue goal',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber flex-shrink-0" />
                    <span className="text-cream/60">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {/* Mock score cards */}
              {[
                { label: 'Viability Score', value: 8, color: '#5A7A6A' },
                { label: 'Market Score', value: 7, color: '#E8A020' },
                { label: 'Execution Score', value: 9, color: '#D45A3A' },
              ].map((score) => (
                <div key={score.label} className="p-4 rounded-xl bg-ink border border-ink-muted">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-cream/40 font-mono">{score.label}</span>
                    <span className="font-display text-lg text-cream">{score.value}/10</span>
                  </div>
                  <div className="h-1.5 bg-ink-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${score.value * 10}%`, backgroundColor: score.color }}
                    />
                  </div>
                </div>
              ))}
              <div className="p-4 rounded-xl bg-amber/10 border border-amber/20">
                <p className="text-xs font-mono text-amber/60 mb-1">AI VERDICT</p>
                <p className="text-sm text-cream/70">Strong execution potential in the Irish market. First-mover advantage available in Cork/Munster region. Recommended next step: validate with 10 customer interviews.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
