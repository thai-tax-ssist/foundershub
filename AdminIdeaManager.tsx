'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Check, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Props {
  ideas: any[]
  userId: string
}

export default function AdminIdeaManager({ ideas: initialIdeas, userId }: Props) {
  const [ideas, setIdeas] = useState(initialIdeas)
  const [showAdd, setShowAdd] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [industry, setIndustry] = useState('')
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  const handleAddCurated = async () => {
    if (!title || !description) {
      toast.error('Title and description required')
      return
    }
    setSaving(true)
    const { data, error } = await supabase
      .from('ideas')
      .insert({
        user_id: userId,
        title,
        description,
        industry: industry || null,
        is_curated: true,
        is_public: true,
        status: 'draft',
      })
      .select()
      .single()

    if (error) {
      toast.error(error.message)
    } else {
      setIdeas([data, ...ideas])
      setTitle('')
      setDescription('')
      setIndustry('')
      setShowAdd(false)
      toast.success('Curated idea added!')
    }
    setSaving(false)
  }

  const togglePublic = async (idea: any) => {
    const { error } = await supabase
      .from('ideas')
      .update({ is_public: !idea.is_public })
      .eq('id', idea.id)

    if (!error) {
      setIdeas(ideas.map(i => i.id === idea.id ? { ...i, is_public: !i.is_public } : i))
    }
  }

  const toggleCurated = async (idea: any) => {
    const { error } = await supabase
      .from('ideas')
      .update({ is_curated: !idea.is_curated })
      .eq('id', idea.id)

    if (!error) {
      setIdeas(ideas.map(i => i.id === idea.id ? { ...i, is_curated: !i.is_curated } : i))
    }
  }

  const deleteIdea = async (id: string) => {
    if (!confirm('Delete this idea and all its analyses?')) return
    const { error } = await supabase.from('ideas').delete().eq('id', id)
    if (!error) {
      setIdeas(ideas.filter(i => i.id !== id))
      toast.success('Deleted')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl text-cream">Idea Management</h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1.5 px-4 py-2 bg-amber hover:bg-amber-light text-ink text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus size={14} />
          Add curated idea
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="p-6 rounded-2xl bg-amber/5 border border-amber/20 mb-6 space-y-4">
          <h3 className="text-amber font-display text-lg">Add Curated Idea</h3>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Idea title"
            className="w-full px-4 py-3 bg-ink border border-ink-muted rounded-xl text-cream placeholder-cream/20 text-sm focus:outline-none focus:border-amber/50"
          />
          <input
            value={industry}
            onChange={e => setIndustry(e.target.value)}
            placeholder="Industry (optional)"
            className="w-full px-4 py-3 bg-ink border border-ink-muted rounded-xl text-cream placeholder-cream/20 text-sm focus:outline-none focus:border-amber/50"
          />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Full description (be detailed for better AI analysis)"
            rows={5}
            className="w-full px-4 py-3 bg-ink border border-ink-muted rounded-xl text-cream placeholder-cream/20 text-sm focus:outline-none focus:border-amber/50 resize-none"
          />
          <div className="flex gap-3">
            <button
              onClick={handleAddCurated}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber hover:bg-amber-light disabled:opacity-50 text-ink font-semibold rounded-xl transition-colors"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Save idea
            </button>
            <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 text-cream/40 hover:text-cream text-sm rounded-xl border border-ink-muted transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Ideas table */}
      <div className="rounded-2xl bg-ink-soft border border-ink-muted overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-muted">
                <th className="text-left px-6 py-3 text-cream/40 font-mono text-xs uppercase">Title</th>
                <th className="text-left px-6 py-3 text-cream/40 font-mono text-xs uppercase">Author</th>
                <th className="text-left px-6 py-3 text-cream/40 font-mono text-xs uppercase">Status</th>
                <th className="text-left px-6 py-3 text-cream/40 font-mono text-xs uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ideas.slice(0, 20).map((idea) => (
                <tr key={idea.id} className="border-b border-ink-muted/50 hover:bg-ink-muted/20 transition-colors">
                  <td className="px-6 py-3">
                    <div>
                      <p className="text-cream text-sm truncate max-w-[240px]">{idea.title}</p>
                      {idea.industry && <p className="text-cream/30 text-xs">{idea.industry}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-cream/40 text-xs">
                    {idea.profiles?.full_name || idea.profiles?.email || 'admin'}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-1.5">
                      {idea.is_curated && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber/10 text-amber border border-amber/20 font-mono">
                          curated
                        </span>
                      )}
                      {idea.is_public && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-sage/10 text-sage-light border border-sage/20 font-mono">
                          public
                        </span>
                      )}
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${
                        idea.status === 'analyzed' ? 'bg-sage/10 text-sage-light' : 'bg-ink-muted text-cream/30'
                      }`}>
                        {idea.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCurated(idea)}
                        className="text-xs px-2 py-1 rounded border border-ink-muted hover:border-amber/30 text-cream/40 hover:text-amber transition-colors"
                        title={idea.is_curated ? 'Remove from curated' : 'Mark as curated'}
                      >
                        {idea.is_curated ? '★' : '☆'}
                      </button>
                      <button
                        onClick={() => togglePublic(idea)}
                        className="text-cream/30 hover:text-cream transition-colors"
                        title={idea.is_public ? 'Make private' : 'Make public'}
                      >
                        {idea.is_public ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button
                        onClick={() => deleteIdea(idea.id)}
                        className="text-cream/20 hover:text-coral transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
