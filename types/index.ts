export type UserRole = 'user' | 'admin'
export type UserPlan = 'free' | 'starter' | 'pro' | 'pro_consult'

export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: UserRole
  plan: UserPlan
  stripe_customer_id?: string
  stripe_subscription_id?: string
  subscription_status?: string
  trial_ends_at?: string
  analyses_used: number
  analyses_limit: number
  created_at: string
  updated_at: string
}

export interface Idea {
  id: string
  user_id: string
  title: string
  description: string
  industry?: string
  tags?: string[]
  is_curated: boolean
  is_public: boolean
  status: 'draft' | 'analyzed' | 'archived'
  created_at: string
  updated_at: string
  analyses?: Analysis[]
}

export interface Analysis {
  id: string
  idea_id: string
  user_id: string
  target_customer?: string
  problem_solved?: string
  offer?: string
  revenue_model?: string
  market_size?: string
  competitor_analysis?: string
  seven_day_plan?: string
  thirty_day_goal?: string
  viability_score?: number
  market_score?: number
  execution_score?: number
  full_analysis?: FullAnalysis
  created_at: string
}

export interface FullAnalysis {
  summary: string
  target_customer: string
  problem_solved: string
  offer: string
  revenue_model: string
  market_size: string
  competitor_analysis: string
  seven_day_plan: string[]
  thirty_day_goal: string
  pros: string[]
  cons: string[]
  viability_score: number
  market_score: number
  execution_score: number
  next_steps: string[]
  ireland_eu_context: string
}

export const PLANS = {
  free: {
    name: 'Free Trial',
    price: 0,
    analyses: 3,
    features: ['3 AI analyses', '7-day trial', 'Browse curated ideas', 'Basic PDF export'],
  },
  starter: {
    name: 'Starter',
    price: 69,
    analyses: 20,
    features: ['20 AI analyses/month', 'Full idea library', 'PDF export', 'Email support'],
  },
  pro: {
    name: 'Pro',
    price: 299,
    analyses: -1, // unlimited
    features: ['Unlimited analyses', 'Priority AI', 'Admin-curated picks', 'Advanced PDF', 'Slack/Email support'],
  },
  pro_consult: {
    name: 'Pro + Consult',
    price: 1499,
    analyses: -1,
    features: ['Everything in Pro', '1:1 monthly strategy call', 'Personal idea review', 'Slack direct access', 'Custom analysis template'],
  },
} as const
