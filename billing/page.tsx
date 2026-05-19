import { createClient } from '@/lib/supabase/server'
import { Check, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import CheckoutButton from '@/components/dashboard/CheckoutButton'

const plans = [
  {
    key: 'starter',
    name: 'Starter',
    price: 69,
    priceId: process.env.STRIPE_STARTER_PRICE_ID!,
    features: ['20 AI analyses/month', 'Full idea library', 'PDF export', 'Email support'],
  },
  {
    key: 'pro',
    name: 'Pro',
    price: 299,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: ['Unlimited analyses', 'Priority AI', 'Admin curated picks', 'Advanced PDF', 'Priority support'],
    highlight: true,
  },
  {
    key: 'pro_consult',
    name: 'Pro + Consult',
    price: 1499,
    priceId: process.env.STRIPE_PRO_CONSULT_PRICE_ID!,
    features: ['Everything in Pro', 'Monthly strategy call', 'Personal idea review', 'Direct Slack access'],
  },
]

export default async function BillingPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const isCurrentPlan = (planKey: string) => profile?.plan === planKey

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-cream">Billing & Plans</h1>
        <p className="text-cream/40 mt-1">
          Current plan: <span className="text-amber capitalize">{profile?.plan || 'free'}</span>
          {profile?.subscription_status === 'trialing' && (
            <span className="text-cream/30"> · Free trial</span>
          )}
        </p>
      </div>

      {/* Current subscription info */}
      {profile?.plan !== 'free' && (
        <div className="p-5 rounded-2xl bg-sage/5 border border-sage/20 mb-8">
          <p className="text-sage-light text-sm">
            ✓ You are on the <strong className="text-cream capitalize">{profile.plan}</strong> plan.
            Manage your subscription, update payment methods, or cancel via Stripe below.
          </p>
          <a
            href="/api/billing/portal"
            className="inline-flex items-center gap-1.5 text-amber text-sm mt-2 hover:text-amber-light"
          >
            Manage subscription <ExternalLink size={12} />
          </a>
        </div>
      )}

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.key}
            className={`relative p-6 rounded-2xl flex flex-col ${
              plan.highlight
                ? 'bg-amber/10 border-2 border-amber'
                : 'bg-ink-soft border border-ink-muted'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber text-ink text-xs font-semibold">
                Recommended
              </div>
            )}
            <h3 className={`font-display text-xl mb-1 ${plan.highlight ? 'text-amber' : 'text-cream'}`}>
              {plan.name}
            </h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-cream/40">€</span>
              <span className={`text-3xl font-display ${plan.highlight ? 'text-amber' : 'text-cream'}`}>
                {plan.price}
              </span>
              <span className="text-cream/40 text-sm">/month</span>
            </div>
            <ul className="space-y-2.5 flex-1 mb-6">
              {plan.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check size={14} className={`mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-amber' : 'text-sage-light'}`} />
                  <span className="text-cream/60">{f}</span>
                </li>
              ))}
            </ul>

            {isCurrentPlan(plan.key) ? (
              <div className="w-full py-2.5 text-center text-sm text-cream/40 border border-ink-muted rounded-xl font-mono">
                Current plan
              </div>
            ) : (
              <CheckoutButton plan={plan.key} priceId={plan.priceId} />
            )}
          </div>
        ))}
      </div>

      <p className="text-cream/20 text-xs text-center mt-8">
        All prices exclude VAT. Irish/EU VAT applied at checkout. Powered by Stripe. Cancel anytime.
      </p>
    </div>
  )
}
