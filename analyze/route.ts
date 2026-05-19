import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check profile & usage limits
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const isUnlimited = profile.plan === 'pro' || profile.plan === 'pro_consult'
    if (!isUnlimited && profile.analyses_used >= profile.analyses_limit) {
      return NextResponse.json(
        { error: 'Analysis limit reached. Please upgrade your plan.' },
        { status: 403 }
      )
    }

    const { ideaId, title, description } = await req.json()

    if (!ideaId || !title || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Run AI analysis
    const prompt = `You are an expert business analyst specialising in the Irish and European market. 
Analyse the following business idea and provide a comprehensive structured analysis.

Business Idea Title: ${title}
Description: ${description}

Provide your analysis in valid JSON format with exactly these fields:
{
  "summary": "2-3 sentence executive summary",
  "target_customer": "Detailed ideal customer profile for Ireland/EU market",
  "problem_solved": "The core problem this solves and why it matters in Ireland/EU",
  "offer": "The specific product/service offer and unique value proposition",
  "revenue_model": "Detailed revenue model with realistic Irish/EU pricing in EUR",
  "market_size": "TAM/SAM/SOM for Ireland and EU market with numbers where possible",
  "competitor_analysis": "Top 3-5 competitors operating in Ireland/EU, their weaknesses, and your differentiation",
  "seven_day_plan": ["Day 1: action", "Day 2: action", "Day 3: action", "Day 4: action", "Day 5: action", "Day 6: action", "Day 7: action"],
  "thirty_day_goal": "Specific measurable goal achievable in 30 days with a realistic EUR target",
  "pros": ["advantage 1", "advantage 2", "advantage 3"],
  "cons": ["challenge 1", "challenge 2", "challenge 3"],
  "viability_score": 8,
  "market_score": 7,
  "execution_score": 6,
  "next_steps": ["step 1", "step 2", "step 3"],
  "ireland_eu_context": "Specific insights about Irish regulations, Enterprise Ireland grants, LEO support, VAT considerations, or EU market access relevant to this idea"
}

Be specific, actionable, and realistic. Focus on the Irish/EU market context. 
All monetary values in EUR. Scores 1-10. Return ONLY the JSON object, no markdown.`

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from AI')
    }

    let analysis
    try {
      const cleaned = content.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      analysis = JSON.parse(cleaned)
    } catch {
      throw new Error('Failed to parse AI response as JSON')
    }

    // Save to database
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('analyses')
      .insert({
        idea_id: ideaId,
        user_id: user.id,
        target_customer: analysis.target_customer,
        problem_solved: analysis.problem_solved,
        offer: analysis.offer,
        revenue_model: analysis.revenue_model,
        market_size: analysis.market_size,
        competitor_analysis: analysis.competitor_analysis,
        seven_day_plan: analysis.seven_day_plan?.join('\n'),
        thirty_day_goal: analysis.thirty_day_goal,
        viability_score: analysis.viability_score,
        market_score: analysis.market_score,
        execution_score: analysis.execution_score,
        full_analysis: analysis,
      })
      .select()
      .single()

    if (saveError) throw saveError

    // Update idea status
    await supabase
      .from('ideas')
      .update({ status: 'analyzed' })
      .eq('id', ideaId)

    // Increment usage counter
    if (!isUnlimited) {
      await supabase
        .from('profiles')
        .update({ analyses_used: profile.analyses_used + 1 })
        .eq('id', user.id)
    }

    return NextResponse.json({ analysis: savedAnalysis, full: analysis })
  } catch (error: any) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    )
  }
}
