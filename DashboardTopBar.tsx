'use client'
import { Bell, Plus } from 'lucide-react'
import Link from 'next/link'
import type { Profile } from '@/types'

interface Props {
  profile: Profile | null
}

export default function DashboardTopBar({ profile }: Props) {
  const trialDaysLeft = profile?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0

  const isTrialing = profile?.subscription_status === 'trialing' && trialDaysLeft > 0

  return (
    <header className="h-16 border-b border-ink-muted flex items-center justify-between px-6 gap-4 bg-ink/50 backdrop-blur-sm">
      {/* Trial notice */}
      {isTrialing && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber/10 border border-amber/20">
          <div className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
          <span className="text-amber text-xs font-mono">
            {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} left in trial
          </span>
          <Link href="/dashboard/billing" className="text-xs text-amber/60 hover:text-amber underline">
            Upgrade
          </Link>
        </div>
      )}

      {/* Analyses usage */}
      {profile && (
        <div className="hidden sm:flex items-center gap-3 ml-auto mr-4">
          <span className="text-xs text-cream/30 font-mono">
            {profile.plan === 'pro' || profile.plan === 'pro_consult' ? '∞' : `${profile.analyses_used}/${profile.analyses_limit}`} analyses
          </span>
          {profile.plan === 'free' || profile.plan === 'starter' ? (
            <div className="w-20 h-1.5 bg-ink-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-amber rounded-full transition-all"
                style={{ width: `${Math.min(100, (profile.analyses_used / profile.analyses_limit) * 100)}%` }}
              />
            </div>
          ) : null}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 rounded-lg border border-ink-muted flex items-center justify-center text-cream/40 hover:text-cream hover:border-amber/30 transition-all">
          <Bell size={14} />
        </button>
        <Link
          href="/dashboard/ideas/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-amber hover:bg-amber-light text-ink text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus size={14} />
          New idea
        </Link>
      </div>
    </header>
  )
}
