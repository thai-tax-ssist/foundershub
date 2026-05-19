import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber/10 border border-amber/20 flex items-center justify-center mx-auto mb-6">
          <Mail size={28} className="text-amber" />
        </div>
        <h1 className="font-display text-2xl text-cream mb-3">Check your email</h1>
        <p className="text-cream/50 mb-8">
          We've sent a confirmation link to your email address. Click it to activate your account and start analysing ideas.
        </p>
        <Link href="/auth/login" className="text-amber hover:text-amber-light text-sm transition-colors">
          Back to sign in →
        </Link>
      </div>
    </div>
  )
}
