'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Lightbulb, Library, CreditCard,
  Settings, LogOut, Shield, ChevronLeft
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Profile } from '@/types'
import { useState } from 'react'

interface Props {
  profile: Profile | null
}

export default function DashboardSidebar({ profile }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [collapsed, setCollapsed] = useState(false)

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/ideas', label: 'My Ideas', icon: Lightbulb },
    { href: '/dashboard/library', label: 'Idea Library', icon: Library },
    { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  if (profile?.role === 'admin') {
    navItems.splice(3, 0, { href: '/admin', label: 'Admin Panel', icon: Shield })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const planColors = {
    free: 'text-cream/40',
    starter: 'text-amber',
    pro: 'text-sage-light',
    pro_consult: 'text-coral-light',
  }

  return (
    <div className={`hidden md:flex flex-col bg-ink-soft border-r border-ink-muted transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-ink-muted">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber flex items-center justify-center text-ink font-display font-bold text-xs flex-shrink-0">
              FH
            </div>
            <span className="font-display font-bold text-cream text-sm">FoundersHub</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-lg bg-amber flex items-center justify-center text-ink font-display font-bold text-xs mx-auto">
            FH
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`text-cream/20 hover:text-cream/60 transition-colors ${collapsed ? 'hidden' : ''}`}
        >
          <ChevronLeft size={14} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? 'bg-amber/10 text-amber border border-amber/20'
                  : 'text-cream/50 hover:text-cream hover:bg-ink-muted/50'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={16} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User info + logout */}
      <div className="p-3 border-t border-ink-muted">
        {!collapsed && profile && (
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-cream/60 truncate">{profile.full_name || profile.email}</p>
            <p className={`text-xs font-mono uppercase ${planColors[profile.plan] || 'text-cream/40'}`}>
              {profile.plan === 'pro_consult' ? 'Pro + Consult' : profile.plan} plan
            </p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-cream/40 hover:text-cream hover:bg-ink-muted/50 transition-all ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Sign out' : undefined}
        >
          <LogOut size={16} className="flex-shrink-0" />
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </div>
  )
}
