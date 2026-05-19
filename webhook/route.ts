import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

const planFromPriceId: Record<string, { plan: string; limit: number }> = {
  [process.env.STRIPE_STARTER_PRICE_ID!]: { plan: 'starter', limit: 20 },
  [process.env.STRIPE_PRO_PRICE_ID!]: { plan: 'pro', limit: 999 },
  [process.env.STRIPE_PRO_CONSULT_PRICE_ID!]: { plan: 'pro_consult', limit: 999 },
}

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Log event
  await supabase.from('stripe_events').upsert({
    id: event.id,
    type: event.type,
    data: event.data as any,
  })

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.supabase_user_id
      const priceId = subscription.items.data[0]?.price.id
      const planInfo = planFromPriceId[priceId]

      if (userId && planInfo) {
        await supabase
          .from('profiles')
          .update({
            plan: planInfo.plan,
            analyses_limit: planInfo.limit,
            analyses_used: 0,
            stripe_subscription_id: subscription.id,
            subscription_status: subscription.status,
          })
          .eq('id', userId)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata?.supabase_user_id

      if (userId) {
        await supabase
          .from('profiles')
          .update({
            plan: 'free',
            analyses_limit: 3,
            stripe_subscription_id: null,
            subscription_status: 'cancelled',
          })
          .eq('id', userId)
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string
      await supabase
        .from('profiles')
        .update({ subscription_status: 'past_due' })
        .eq('stripe_customer_id', customerId)
      break
    }
  }

  return NextResponse.json({ received: true })
}
