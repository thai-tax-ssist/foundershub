'use client'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  plan: string
  priceId: string
}

export default function CheckoutButton({ plan, priceId }: Props) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, plan }),
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error || 'Checkout failed')
        setLoading(false)
      }
    } catch {
      toast.error('Something went wrong')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-2.5 bg-ink-muted hover:bg-amber/10 border border-ink-muted hover:border-amber/40 text-cream/70 hover:text-amber text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 size={14} className="animate-spin" />
          Redirecting...
        </>
      ) : (
        `Upgrade to ${plan} →`
      )}
    </button>
  )
}
