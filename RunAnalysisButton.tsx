'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Loader2, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  idea: { id: string; title: string; description: string }
  hasAnalysis: boolean
  primary?: boolean
}

export default function RunAnalysisButton({ idea, hasAnalysis, primary }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAnalyze = async () => {
    setLoading(true)
    const toastId = toast.loading('Running AI analysis... this may take 30-60 seconds')

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ideaId: idea.id,
          title: idea.title,
          description: idea.description,
        }),
      })

      const data = await response.json()
      toast.dismiss(toastId)

      if (!response.ok) {
        toast.error(data.error || 'Analysis failed')
        return
      }

      toast.success('Analysis complete! 🎉')
      router.refresh()
    } catch (err) {
      toast.dismiss(toastId)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (primary) {
    return (
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="inline-flex items-center gap-2 px-6 py-3 bg-amber hover:bg-amber-light disabled:opacity-50 text-ink font-semibold rounded-xl transition-colors"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        {loading ? 'Analysing...' : 'Analyse with AI'}
      </button>
    )
  }

  return (
    <button
      onClick={handleAnalyze}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-2 bg-amber/10 hover:bg-amber/20 border border-amber/30 text-amber text-xs rounded-lg transition-all disabled:opacity-50"
    >
      {loading ? (
        <Loader2 size={12} className="animate-spin" />
      ) : hasAnalysis ? (
        <RefreshCw size={12} />
      ) : (
        <Sparkles size={12} />
      )}
      {loading ? 'Analysing...' : hasAnalysis ? 'Re-analyse' : 'Analyse'}
    </button>
  )
}
