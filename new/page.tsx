'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { ArrowRight, Loader2, Sparkles } from 'lucide-react'

const industries = [
  'Food & Beverage', 'Technology', 'Health & Wellness', 'E-Commerce',
  'Education', 'Finance & FinTech', 'Property & Real Estate',
  'Professional Services', 'Sustainability', 'Agriculture', 'Tourism & Hospitality',
  'Media & Content', 'Other',
]

export default function NewIdeaPage() {
  const router = useRouter()
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [industry, setIndustry] = useState('')
  const [saving, setSaving] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  const handleSaveAndAnalyze = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in title and description')
      return
    }

    setSaving(true)

    // Save idea first
    const { data: { user } } = await supabase.auth.getUser()
    const { data: idea, error } = await supabase
      .from('ideas')
      .insert({
        user_id: user!.id,
        title: title.trim(),
        description: description.trim(),
        industry: industry || null,
        status: 'draft',
      })
      .select()
      .single()

    if (error) {
      toast.error('Failed to save idea: ' + error.message)
      setSaving(false)
      return
    }

    setSaving(false)
    setAnalyzing(true)

    // Run AI analysis
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ideaId: idea.id, title, description }),
    })

    const data = await response.json()

    if (!response.ok) {
      toast.error(data.error || 'Analysis failed')
      setAnalyzing(false)
      router.push(`/dashboard/ideas/${idea.id}`)
      return
    }

    toast.success('Analysis complete! 🎉')
    router.push(`/dashboard/ideas/${idea.id}`)
  }

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      toast.error('Please add a title')
      return
    }

    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data: idea, error } = await supabase
      .from('ideas')
      .insert({
        user_id: user!.id,
        title: title.trim(),
        description: description.trim(),
        industry: industry || null,
        status: 'draft',
      })
      .select()
      .single()

    if (error) {
      toast.error('Failed to save: ' + error.message)
    } else {
      toast.success('Saved as draft')
      router.push(`/dashboard/ideas/${idea.id}`)
    }
    setSaving(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-cream">New Business Idea</h1>
        <p className="text-cream/40 mt-1">
          Describe your idea in plain language. The AI will handle the rest.
        </p>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-xs font-mono text-cream/40 uppercase tracking-wider mb-2">
            Idea Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. AI-powered invoice service for Irish tradespeople"
            className="w-full px-4 py-3 bg-ink-soft border border-ink-muted rounded-xl text-cream placeholder-cream/20 text-sm focus:outline-none focus:border-amber/50 transition-colors"
          />
        </div>

        {/* Industry */}
        <div>
          <label className="block text-xs font-mono text-cream/40 uppercase tracking-wider mb-2">
            Industry (optional)
          </label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full px-4 py-3 bg-ink-soft border border-ink-muted rounded-xl text-cream text-sm focus:outline-none focus:border-amber/50 transition-colors"
          >
            <option value="">Select an industry...</option>
            {industries.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-mono text-cream/40 uppercase tracking-wider mb-2">
            Describe Your Idea *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us about your business idea. Who is it for? What problem does it solve? How will it make money? Don't worry about perfect language — just explain it clearly."
            rows={8}
            className="w-full px-4 py-3 bg-ink-soft border border-ink-muted rounded-xl text-cream placeholder-cream/20 text-sm focus:outline-none focus:border-amber/50 transition-colors resize-none"
          />
          <p className="text-cream/25 text-xs mt-1.5">
            Minimum 50 characters for a good analysis. {description.length} characters written.
          </p>
        </div>

        {/* Tips */}
        <div className="p-4 rounded-xl bg-amber/5 border border-amber/20">
          <p className="text-xs font-mono text-amber/60 mb-2">💡 TIPS FOR BETTER ANALYSIS</p>
          <ul className="space-y-1 text-xs text-cream/40">
            <li>→ Mention your target customer (e.g. "Cork-based sole traders")</li>
            <li>→ Describe the problem you're solving</li>
            <li>→ Include how you plan to charge (subscription, one-time, commission)</li>
            <li>→ Mention if you have any unfair advantage (expertise, contacts, existing audience)</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSaveAndAnalyze}
            disabled={saving || analyzing || description.length < 50}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-amber hover:bg-amber-light disabled:opacity-50 disabled:cursor-not-allowed text-ink font-semibold rounded-xl transition-all"
          >
            {analyzing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analysing with AI...
              </>
            ) : saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Analyse with AI
                <ArrowRight size={16} />
              </>
            )}
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={saving || analyzing}
            className="px-5 py-3.5 border border-ink-muted hover:border-amber/30 text-cream/50 hover:text-cream text-sm rounded-xl transition-all"
          >
            Save draft
          </button>
        </div>

        {description.length < 50 && description.length > 0 && (
          <p className="text-cream/25 text-xs text-center">
            Add {50 - description.length} more characters to enable AI analysis
          </p>
        )}
      </div>
    </div>
  )
}
