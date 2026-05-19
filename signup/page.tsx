'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'

function SignupForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const plan = searchParams.get('plan') || 'free'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback?plan=${plan}`,
      },
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success('Check your email to confirm your account!')
    router.push('/auth/check-email')
  }

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?plan=${plan}`,
      },
    })
    if (error) toast.error(error.message)
  }

  const planLabels: Record<string, string> = {
    free: 'Free 7-day trial',
    starter: 'Starter — €69/month',
    pro: 'Pro — €299/month',
    pro_consult: 'Pro + Consult — €1,499/month',
  }

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-10 group">
          <div className="w-8 h-8 rounded-lg bg-amber flex items-center justify-center text-ink font-display font-bold text-sm">
            FH
          </div>
          <span className="font-display font-bold text-lg text-cream group-hover:text-amber transition-colors">
            FoundersHub
          </span>
        </Link>

        <div className="p-8 rounded-2xl bg-ink-soft border border-ink-muted">
          <h1 className="font-display text-2xl text-cream mb-1">Create your account</h1>
          {plan !== 'free' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber/10 border border-amber/20 text-amber text-xs font-mono mt-2 mb-4">
              Plan: {planLabels[plan]}
            </div>
          )}
          <p className="text-cream/40 text-sm mb-8 mt-2">
            Start your {plan === 'free' ? '7-day free trial' : 'subscription'} today.
          </p>

          {/* Google OAuth */}
          <button
            onClick={handleGoogleSignup}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-ink-muted hover:border-amber/30 text-cream/70 hover:text-cream text-sm font-medium transition-all mb-4"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-ink-muted" />
            <span className="text-cream/25 text-xs font-mono">OR</span>
            <div className="flex-1 h-px bg-ink-muted" />
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-cream/40 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full px-4 py-3 bg-ink border border-ink-muted rounded-xl text-cream placeholder-cream/20 text-sm focus:outline-none focus:border-amber/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-cream/40 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 bg-ink border border-ink-muted rounded-xl text-cream placeholder-cream/20 text-sm focus:outline-none focus:border-amber/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-cream/40 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  required
                  minLength={8}
                  className="w-full px-4 py-3 bg-ink border border-ink-muted rounded-xl text-cream placeholder-cream/20 text-sm focus:outline-none focus:border-amber/50 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream/60"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber hover:bg-amber-light disabled:opacity-50 text-ink font-semibold rounded-xl transition-all"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Create account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-cream/30 text-xs mt-6">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-amber/60 hover:text-amber">Terms</Link>
            {' & '}
            <Link href="/privacy" className="text-amber/60 hover:text-amber">Privacy Policy</Link>
          </p>
        </div>

        <p className="text-center text-cream/30 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-amber hover:text-amber-light transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen mesh-bg flex items-center justify-center"><div className="text-cream/40">Loading...</div></div>}>
      <SignupForm />
    </Suspense>
  )
}
