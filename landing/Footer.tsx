import Link from 'next/link'
import { MapPin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-ink-muted py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber flex items-center justify-center text-ink font-display font-bold text-sm">
                FH
              </div>
              <span className="font-display font-bold text-lg text-cream">FoundersHub</span>
            </div>
            <p className="text-cream/40 text-sm leading-relaxed max-w-xs mb-4">
              AI-powered business idea validation for entrepreneurs in Ireland & Europe. Built by a founder, for founders.
            </p>
            <div className="flex items-center gap-1.5 text-cream/30 text-xs">
              <MapPin size={12} />
              <span>Cork, Ireland · EU</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-cream/60 text-xs font-mono uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Features', href: '#features' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'How it works', href: '#how-it-works' },
                { label: 'Sign up', href: '/auth/signup' },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-cream/40 hover:text-cream/80 text-sm transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-cream/60 text-xs font-mono uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Cookie Policy', href: '/cookies' },
                { label: 'GDPR', href: '/gdpr' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-cream/40 hover:text-cream/80 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-ink-muted pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream/25 text-xs">
            © 2025 FoundersHub. All rights reserved. Registered in Ireland.
          </p>
          <div className="flex items-center gap-1.5 text-cream/25 text-xs">
            <Mail size={11} />
            <a href="mailto:hello@foundershub.app" className="hover:text-cream/50 transition-colors">
              hello@foundershub.app
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
