import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'

export default async function LibraryPage() {
  const supabase = createClient()

  const { data: ideas } = await supabase
    .from('ideas')
    .select('*')
    .eq('is_curated', true)
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  const industries = [...new Set(ideas?.map(i => i.industry).filter(Boolean))]

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Star size={16} className="text-amber" />
          <span className="text-amber text-xs font-mono uppercase tracking-wider">Curated by Annie</span>
        </div>
        <h1 className="font-display text-3xl text-cream">Idea Library</h1>
        <p className="text-cream/40 mt-1">
          Hand-picked business ideas with real Irish & European market potential.
          Click any idea to analyse it with AI.
        </p>
      </div>

      {/* Industry filters */}
      {industries.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {industries.map(ind => (
            <span key={ind} className="px-3 py-1 rounded-full border border-ink-muted text-cream/40 text-xs font-mono cursor-default hover:border-amber/30 hover:text-cream/70 transition-colors">
              {ind}
            </span>
          ))}
        </div>
      )}

      {(!ideas || ideas.length === 0) ? (
        <div className="text-center py-20">
          <p className="text-cream/30">No curated ideas yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ideas.map((idea) => (
            <Link
              key={idea.id}
              href={`/dashboard/library/${idea.id}`}
              className="group p-6 rounded-2xl bg-ink-soft border border-ink-muted hover:border-amber/20 transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber/10 text-amber border border-amber/20 font-mono">
                    ★ Curated
                  </span>
                  {idea.industry && (
                    <span className="text-xs text-cream/30">{idea.industry}</span>
                  )}
                </div>
                <ArrowRight size={14} className="text-cream/20 group-hover:text-amber transition-colors" />
              </div>
              <h3 className="font-display text-lg text-cream mb-2 group-hover:text-amber transition-colors">
                {idea.title}
              </h3>
              <p className="text-cream/50 text-sm leading-relaxed line-clamp-3">
                {idea.description}
              </p>
              <div className="mt-4 pt-4 border-t border-ink-muted">
                <span className="text-xs text-amber/60 font-mono">
                  Click to analyse with AI →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
