'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Sparkles, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  ideaTitle: string
  ideaDescription: string
  userId: string
}

export default function CopyAndAnalyzeButton({ ideaTitle, ideaDescription, userId }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleCopyAndAnalyze = async () => {
    setLoading(true)
    const toastId = toast.loading('Copying idea and running analysis...')

    try {
      // Create user's own copy of the idea
      const { data: idea, error } = await supabase
        .from('ideas')
        .insert({
          user_id: userId,
          title: ideaTitle,
          description: ideaDescription,
          is_curated: false,
          is_public: false,
          status: 'draft',
        })
        .select()
        .single()

      if (error) throw error

      // Run analysis
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId: idea.id, title: ideaTitle, description: ideaDescription }),
      })

      const data = await response.json()
      toast.dismiss(toastId)

      if (!response.ok) {
        toast.error(data.error || 'Analysis failed')
        router.push(`/dashboard/ideas/${idea.id}`)
        return
      }

      toast.success('Analysis complete! 🎉')
      router.push(`/dashboard/ideas/${idea.id}`)
    } catch (err: any) {
      toast.dismiss(toastId)
      toast.error(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCopyAndAnalyze}
      disabled={loading}
      className="inline-flex items-center gap-2 px-6 py-3 bg-amber hover:bg-amber-light disabled:opacity-50 text-ink font-semibold rounded-xl transition-colors"
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Sparkles size={16} />
      )}
      {loading ? 'Analysing...' : 'Analyse this idea for my market'}
    </button>
  )
}
