'use client'
import type { Analysis } from '@/types'

interface Props {
  analysis: Analysis
}

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 10) * circumference

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
          <circle cx="48" cy="48" r={radius} fill="none" stroke="#2A2A35" strokeWidth="8" />
          <circle
            cx="48" cy="48" r={radius} fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-xl text-cream">{score}</span>
        </div>
      </div>
      <span className="text-xs text-cream/40 font-mono text-center">{label}</span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-6 rounded-2xl bg-ink-soft border border-ink-muted">
      <h3 className="font-display text-lg text-amber mb-3">{title}</h3>
      {children}
    </div>
  )
}

export default function AnalysisDisplay({ analysis }: Props) {
  const full = analysis.full_analysis as any

  return (
    <div className="space-y-4">
      {/* Scores */}
      <div className="p-6 rounded-2xl bg-ink-soft border border-ink-muted">
        <h3 className="font-display text-lg text-cream mb-6">AI Scores</h3>
        <div className="grid grid-cols-3 gap-4">
          <ScoreRing score={analysis.viability_score || 0} label="Viability" color="#5A7A6A" />
          <ScoreRing score={analysis.market_score || 0} label="Market" color="#E8A020" />
          <ScoreRing score={analysis.execution_score || 0} label="Execution" color="#D45A3A" />
        </div>
        {full?.summary && (
          <div className="mt-6 p-4 rounded-xl bg-amber/5 border border-amber/20">
            <p className="text-xs font-mono text-amber/60 mb-1">SUMMARY</p>
            <p className="text-cream/70 text-sm leading-relaxed">{full.summary}</p>
          </div>
        )}
      </div>

      {/* Core analysis grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Section title="🎯 Target Customer">
          <p className="text-cream/60 text-sm leading-relaxed">{analysis.target_customer}</p>
        </Section>

        <Section title="🔍 Problem Solved">
          <p className="text-cream/60 text-sm leading-relaxed">{analysis.problem_solved}</p>
        </Section>

        <Section title="💡 The Offer">
          <p className="text-cream/60 text-sm leading-relaxed">{analysis.offer}</p>
        </Section>

        <Section title="💶 Revenue Model">
          <p className="text-cream/60 text-sm leading-relaxed">{analysis.revenue_model}</p>
        </Section>
      </div>

      {/* Market size + competitors */}
      <Section title="📊 Market Size (Ireland / EU)">
        <p className="text-cream/60 text-sm leading-relaxed">{analysis.market_size}</p>
      </Section>

      <Section title="⚔️ Competitor Analysis">
        <p className="text-cream/60 text-sm leading-relaxed">{analysis.competitor_analysis}</p>
      </Section>

      {/* 7-day plan */}
      <div className="p-6 rounded-2xl bg-ink-soft border border-ink-muted">
        <h3 className="font-display text-lg text-amber mb-4">📅 Your 7-Day Launch Plan</h3>
        <div className="space-y-2">
          {full?.seven_day_plan?.map((day: string, i: number) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-ink border border-ink-muted">
              <div className="w-6 h-6 rounded-full bg-amber/10 border border-amber/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-amber text-xs font-mono">{i + 1}</span>
              </div>
              <p className="text-cream/60 text-sm leading-relaxed">{day}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 30-day goal */}
      <Section title="🚀 30-Day Goal">
        <p className="text-cream/60 text-sm leading-relaxed">{analysis.thirty_day_goal}</p>
      </Section>

      {/* Pros & Cons */}
      {full?.pros && full?.cons && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Section title="✅ Advantages">
            <ul className="space-y-2">
              {full.pros.map((pro: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-sage-light mt-0.5">→</span>
                  <span className="text-cream/60">{pro}</span>
                </li>
              ))}
            </ul>
          </Section>
          <Section title="⚠️ Challenges">
            <ul className="space-y-2">
              {full.cons.map((con: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-coral mt-0.5">→</span>
                  <span className="text-cream/60">{con}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      )}

      {/* Ireland/EU context */}
      {full?.ireland_eu_context && (
        <div className="p-6 rounded-2xl bg-sage/5 border border-sage/20">
          <h3 className="font-display text-lg text-sage-light mb-3">🇮🇪 Ireland & EU Context</h3>
          <p className="text-cream/60 text-sm leading-relaxed">{full.ireland_eu_context}</p>
        </div>
      )}

      {/* Next steps */}
      {full?.next_steps && (
        <Section title="⚡ Recommended Next Steps">
          <ol className="space-y-2">
            {full.next_steps.map((step: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className="w-5 h-5 rounded-full bg-amber/10 text-amber text-xs font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-cream/60">{step}</span>
              </li>
            ))}
          </ol>
        </Section>
      )}

      <p className="text-center text-cream/20 text-xs pb-4">
        Analysis generated: {new Date(analysis.created_at).toLocaleDateString('en-IE', {
          year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        })}
      </p>
    </div>
  )
}
