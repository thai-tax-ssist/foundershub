import { Brain, Map, TrendingUp, FileText, Users, Shield } from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Claude AI analyses every dimension of your idea — market, competitors, revenue model, and execution risk — in under 60 seconds.',
    color: 'amber',
  },
  {
    icon: Map,
    title: '7-Day Action Plan',
    description: 'No more analysis paralysis. Get a concrete day-by-day plan to validate your idea this week without quitting your job.',
    color: 'sage',
  },
  {
    icon: TrendingUp,
    title: 'Ireland & EU Market Focus',
    description: 'Not generic US advice. Every analysis is contextualised for Irish regulations, EU market size, and realistic local pricing.',
    color: 'coral',
  },
  {
    icon: FileText,
    title: 'PDF Export Reports',
    description: 'Download a beautifully formatted analysis report to share with co-founders, investors, or keep in your files.',
    color: 'amber',
  },
  {
    icon: Users,
    title: 'Curated Idea Library',
    description: 'Browse hand-picked business ideas from Annie — validated concepts with real Irish/EU market potential and low startup cost.',
    color: 'sage',
  },
  {
    icon: Shield,
    title: 'Your Ideas Stay Private',
    description: 'Your submissions are private by default. We will never share your ideas or use them to train AI models.',
    color: 'coral',
  },
]

const colorMap = {
  amber: 'bg-amber/10 text-amber border-amber/20',
  sage: 'bg-sage/10 text-sage-light border-sage/20',
  coral: 'bg-coral/10 text-coral-light border-coral/20',
}

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sage/30 bg-sage/5 text-sage-light text-xs font-mono mb-6">
            BUILT FOR EUROPEAN FOUNDERS
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-cream leading-tight">
            Stop guessing.{' '}
            <br />
            <span className="text-gradient-sage">Start validating.</span>
          </h2>
          <p className="mt-4 text-cream/50 text-lg">
            Most business ideas fail because founders skip validation. FoundersHub gives you the framework to know if your idea is worth pursuing — before you invest time and money.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            const colors = colorMap[feature.color as keyof typeof colorMap]
            return (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-ink-soft border border-ink-muted hover:border-ink-muted/60 transition-all duration-300 hover:-translate-y-1 card-hover"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${colors}`}>
                  <Icon size={18} />
                </div>
                <h3 className="font-display text-lg text-cream mb-2">{feature.title}</h3>
                <p className="text-cream/50 text-sm leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
