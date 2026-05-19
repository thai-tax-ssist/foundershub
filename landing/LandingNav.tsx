'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-ink/90 backdrop-blur-md border-b border-ink-muted/50' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-amber flex items-center justify-center text-ink font-display font-bold text-sm">
            FH
          </div>
          <span className="font-display font-bold text-lg text-cream group-hover:text-amber transition-colors">
            FoundersHub
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-cream/60 hover:text-cream text-sm transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-cream/60 hover:text-cream text-sm transition-colors">
            How it works
          </a>
          <a href="#pricing" className="text-cream/60 hover:text-cream text-sm transition-colors">
            Pricing
          </a>
          <Link
            href="/auth/login"
            className="text-cream/60 hover:text-cream text-sm transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="px-4 py-2 bg-amber hover:bg-amber-light text-ink text-sm font-semibold rounded-lg transition-colors"
          >
            Start free trial →
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-cream/60 hover:text-cream"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-ink-soft border-b border-ink-muted px-6 py-4 flex flex-col gap-4">
          <a href="#features" className="text-cream/70 hover:text-cream text-sm" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#how-it-works" className="text-cream/70 hover:text-cream text-sm" onClick={() => setMobileOpen(false)}>How it works</a>
          <a href="#pricing" className="text-cream/70 hover:text-cream text-sm" onClick={() => setMobileOpen(false)}>Pricing</a>
          <Link href="/auth/login" className="text-cream/70 hover:text-cream text-sm" onClick={() => setMobileOpen(false)}>Sign in</Link>
          <Link
            href="/auth/signup"
            className="px-4 py-2 bg-amber text-ink text-sm font-semibold rounded-lg text-center"
            onClick={() => setMobileOpen(false)}
          >
            Start free trial →
          </Link>
        </div>
      )}
    </nav>
  )
}
