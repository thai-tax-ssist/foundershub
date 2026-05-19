import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft, Star } from 'lucide-react'
import Link from 'next/link'
import CopyAndAnalyzeButton from '@/components/dashboard/CopyAndAnalyzeButton'

interface Props {
  params: { id: string }
}

export default async function LibraryIdeaPage({ params }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: idea } = await supabase
    .from('ideas')
    .select('*')
    .eq('id', params.id)
    .eq('is_curated', true)
    .eq('is_public', true)
    .single()

  if (!idea) notFound()

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/dashboard/library"
        className="flex items-center gap-1.5 text-cream/40 hover:text-cream text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to library
      </Link>

      <div className="p-8 rounded-2xl bg-ink-soft border border-ink-muted mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Star size={14} className="text-amber" />
          <span className="text-amber text-xs font-mono">Curated by Annie</span>
          {idea.industry && <span className="text-cream/30 text-xs">· {idea.industry}</span>}
        </div>
        <h1 className="font-display text-3xl text-cream mb-4">{idea.title}</h1>
        <p className="text-cream/60 leading-relaxed">{idea.description}</p>
      </div>

      <div className="p-6 rounded-2xl bg-amber/5 border border-amber/20 text-center">
        <p className="text-cream/60 text-sm mb-4">
          Ready to validate this idea for your market? Run an AI analysis to get your personalised strategy.
        </p>
        <CopyAndAnalyzeButton
          ideaTitle={idea.title}
          ideaDescription={idea.description}
          userId={user!.id}
        />
      </div>
    </div>
  )
}
