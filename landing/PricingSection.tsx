'use client'
import { Check, Zap } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Free Trial',
    price: 0,
    period: '7 days',
    badge: null,
    description: 'Test the platform risk-free. No commitment.',
    features: [
      '3 AI idea analyses',
      'Browse curated idea library',
      'Basic PDF export',
      'Ireland/EU market focus',
      'Email support',
    ],
    cta: 'Start free trial',
    href: '/auth/signup',
    highlight: false,
    note: 'Credit card required. Cancel anytime.',
  },
  {
    name: 'Starter',
    price: 69,
    period: 'month',
    badge: 'Most popular',
    description: 'For early-stage founders exploring ideas.',
    features: [
      '20 AI analyses per month',
      'Full curated idea library',
      'Detailed PDF reports',
      'Competitor landscape',
      '7-day action plans',
      'Email support',
    ],
    cta: 'Get Starter',
    href: '/auth/signup?plan=starter',
    highlight: true,
    note: null,
  },
  {
    name: 'Pro',
    price: 299,
    period: 'month',
    badge: null,
    description: 'Serious founders who move fast.',
    features: [
      'Unlimited AI analyses',
      'Priority Claude AI model',
      'Admin-curated idea picks',
      'Advanced PDF with branding',
      'Slack + email support',
      'Early feature access',
    ],
    cta: 'Get Pro',
    href: '/auth/signup?plan=pro',
    highlight: false,
    note: null,
  },
  {
    name: 'Pro + Consult',
    price: 1499,
    period: 'month',
    badge: '🔥 High-touch',
    description: 'Done-with-you mentorship from Annie.',
    features: [
      'Everything in Pro',
      '1-on-1 monthly strategy call',
      'Personal idea deep-dive review',
      'Direct Slack access to Annie',
      'Custom analysis templates',
      'Priority response <2hrs',
    ],
    cta: 'Apply for Pro+',
    href: '/auth/signup?plan=pro_consult',
    highlight: false,
    note: 'Limited to 5 clients per month.',
  },
]

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber/30 bg-amber/5 text-amber text-xs font-mono mb-6">
            <Zap size={12} />
            TRANSPARENT PRICING
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-cream mb-4">
            One idea can change{' '}
            <span className="text-gradient-amber">everything</span>
          </h2>
          <p className="text-cream/50 max-w-xl mx-auto text-lg">
            Start free, upgrade when you're ready. All plans include Ireland & EU market analysis.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                plan.highlight
                  ? 'bg-amber/10 border-2 border-amber amber-glow'
                  : 'bg-ink-soft border border-ink-muted hover:border-ink-muted/80'
              }`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                  plan.highlight ? 'bg-amber text-ink' : 'bg-ink-muted text-cream/80'
                }`}>
                  {plan.badge}
                </div>
              )}

              {/* Plan name + price */}
              <div className="mb-6">
                <h3 className={`font-display text-xl mb-1 ${plan.highlight ? 'text-amber' : 'text-cream'}`}>
                  {plan.name}
                </h3>
                <p className="text-cream/40 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  {plan.price === 0 ? (
                    <span className="text-4xl font-display font-bold text-cream">Free</span>
                  ) : (
                    <>
                      <span className="text-cream/40 text-lg">€</span>
                      <span className={`text-4xl font-display font-bold ${plan.highlight ? 'text-amber' : 'text-cream'}`}>
                        {plan.price.toLocaleString()}
                      </span>
                      <span className="text-cream/40 text-sm">/{plan.period}</span>
                    </>
                  )}
                </div>
                {plan.price === 0 && (
                  <p className="text-cream/40 text-xs mt-1">for {plan.period}</p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      plan.highlight ? 'bg-amber/20 text-amber' : 'bg-sage/20 text-sage-light'
                    }`}>
                      <Check size={10} strokeWidth={3} />
                    </div>
                    <span className="text-cream/70">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div>
                <Link
                  href={plan.href}
                  className={`w-full flex items-center justify-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.highlight
                      ? 'bg-amber hover:bg-amber-light text-ink'
                      : 'bg-ink-muted hover:bg-ink-muted/80 text-cream border border-ink-muted hover:border-amber/30'
                  }`}
                >
                  {plan.cta} {!plan.highlight && '→'}
                </Link>
                {plan.note && (
                  <p className="text-cream/30 text-xs text-center mt-2">{plan.note}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-cream/30 text-sm mt-10">
          All prices exclude VAT. Irish & EU VAT applied at checkout where applicable.
          Stripe-secured payments. Cancel anytime.
        </p>
      </div>
    </section>
  )
}
