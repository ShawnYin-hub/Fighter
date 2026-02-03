import { DecisionBreakdown, Language, Decision } from "../types";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-bf1778c500a04bc399b65f046236618f';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// DeepSeek API 调用函数
async function callDeepSeek(messages: Array<{ role: string; content: string }>, options?: any) {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      temperature: 0.7,
      ...options
    })
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export interface DecisionAnalysis {
  style: string;
  summary: string;
  recommendation: string;
  logicalFallacies: string[];
}

export interface LogicDuelAnalysis {
  score: number;
  verdict: string;
  analysis: string;
}

export const breakdownDecision = async (userInput: string, lang: Language): Promise<DecisionBreakdown> => {
  const isZh = lang === 'zh';
  const prompt = `The user is facing this dilemma: "${userInput}". 
    Generate 4-6 distinct, creative options/paths. 
    LANGUAGE: Generate all output in ${isZh ? 'Chinese' : 'English'}.
    CRITICAL: Each option must be extremely concise (strictly 1 or 2 ${isZh ? 'characters' : 'words'} maximum, e.g., ${isZh ? '"电影", "休息", "冒险"' : '"Cinema", "Rest", "Venture"'}).
    Also provide a witty, philosophical category and a high-level contrast quote in ${isZh ? 'Chinese' : 'English'}.
    
    Return ONLY a valid JSON object with this exact structure:
    {
      "options": ["option1", "option2", ...],
      "category": "category name",
      "logicQuote": "philosophical quote"
    }`;

  try {
    const response = await callDeepSeek([
      { role: 'system', content: 'You are a decision-making assistant. Always return valid JSON.' },
      { role: 'user', content: prompt }
    ], {
      response_format: { type: 'json_object' }
    });

    const parsed = JSON.parse(response);
    return {
      options: parsed.options || [],
      category: parsed.category || (isZh ? "路径" : "Pathways"),
      logicQuote: parsed.logicQuote || (isZh ? "最短的词往往最沉重。" : "The shortest words often carry the heaviest weight.")
    };
  } catch (e) {
    console.error('DeepSeek breakdown error:', e);
    return {
      options: isZh ? ["进", "退", "观", "变"] : ["Venture", "Stay", "Observe", "Pivot"],
      category: isZh ? "路径" : "Pathways",
      logicQuote: isZh ? "最短的词往往最沉重。" : "The shortest words often carry the heaviest weight."
    };
  }
};

export const getAIAdvice = async (optionA: string, optionB: string, lang: Language): Promise<string> => {
  const isZh = lang === 'zh';
  const prompt = `Compare these two concise options: "${optionA}" vs "${optionB}". 
    Provide a deep, 1-sentence analytical advice on which might be better and why. 
    Output strictly in ${isZh ? 'Chinese' : 'English'}.`;

  try {
    return await callDeepSeek([
      { role: 'system', content: `You are a wise decision advisor. Respond in ${isZh ? 'Chinese' : 'English'}.` },
      { role: 'user', content: prompt }
    ]);
  } catch (e) {
    console.error('DeepSeek advice error:', e);
    return isZh ? "两种路径各有其价值，选择取决于你的内心。" : "Both paths have merit. Choose based on your heart.";
  }
};

export const suggestOptions = async (theme: string): Promise<string[]> => {
  try {
    const prompt = `User is struggling with this theme: "${theme}". Suggest 4-6 very concise (1-2 words each) options to help them decide. Return as a JSON array of strings.`;
    
    const response = await callDeepSeek([
      { role: 'system', content: 'You are a creative option generator. Always return valid JSON arrays.' },
      { role: 'user', content: prompt }
    ], {
      response_format: { type: 'json_object' }
    });

    const parsed = JSON.parse(response);
    return Array.isArray(parsed) ? parsed : (parsed.options || ["Option 1", "Option 2", "Option 3", "Option 4"]);
  } catch (error) {
    console.error("DeepSeek Suggestion Error:", error);
    return ["Option 1", "Option 2", "Option 3", "Option 4"];
  }
};

export const getExpertAdvice = async (optionA: string, optionB: string, context: string): Promise<{ tucao: string; recommendation: string }> => {
  try {
    const prompt = `Compare "${optionA}" vs "${optionB}" for the topic "${context}". Provide a witty 1-sentence critique and a subtle recommendation. Return ONLY valid JSON with this structure:
    {
      "tucao": "witty critique",
      "recommendation": "subtle recommendation"
    }`;

    const response = await callDeepSeek([
      { role: 'system', content: 'You are a witty decision advisor. Always return valid JSON.' },
      { role: 'user', content: prompt }
    ], {
      response_format: { type: 'json_object' }
    });

    const parsed = JSON.parse(response);
    return {
      tucao: parsed.tucao || "Both have merit in the void.",
      recommendation: parsed.recommendation || "Follow your intuition."
    };
  } catch (error) {
    console.error('DeepSeek expert advice error:', error);
    return { tucao: "Both have merit in the void.", recommendation: "Follow your intuition." };
  }
};

export const getDecisionJourneySummary = async (decision: any): Promise<string> => {
  try {
    const prompt = `Summarize the journey: The winner was "${decision.winner}". It survived a duel tournament against ${decision.eliminated.join(', ')}. Context: ${decision.title}. Provide a psychological profile of the user's values based on this choice.`;

    return await callDeepSeek([
      { role: 'system', content: 'You are a psychological analyst. Provide insightful summaries.' },
      { role: 'user', content: prompt }
    ]);
  } catch (error) {
    console.error('DeepSeek summary error:', error);
    return "Your choice reflects a balanced priority system.";
  }
};

// For associate-logic-portal (light profile): decision style analysis
export const analyzeDecisionStyle = async (recentDecisions: string): Promise<DecisionAnalysis> => {
  try {
    const prompt = `Analyze the following decision-making thoughts/log: "${recentDecisions}". Determine the associate's logical style and provide a structured JSON response.
Return ONLY valid JSON with:
{
  "style": "One-word archetype",
  "summary": "Brief overview",
  "recommendation": "Improvement advice",
  "logicalFallacies": ["...", "..."]
}`;

    const response = await callDeepSeek(
      [
        { role: "system", content: "You are an expert in decision psychology and logic. Always return valid JSON." },
        { role: "user", content: prompt }
      ],
      { response_format: { type: "json_object" } }
    );

    const parsed = JSON.parse(response);
    return {
      style: parsed.style || "Synthesizer",
      summary: parsed.summary || "A balanced, reflective decision style.",
      recommendation: parsed.recommendation || "Clarify constraints before optimizing.",
      logicalFallacies: Array.isArray(parsed.logicalFallacies) ? parsed.logicalFallacies : []
    };
  } catch (error) {
    console.error("DeepSeek analyzeDecisionStyle error:", error);
    return {
      style: "Synthesizer",
      summary: "A balanced, reflective decision style.",
      recommendation: "Clarify constraints before optimizing.",
      logicalFallacies: []
    };
  }
};

// For duelist-premium---logical-excellence (dark profile): logic duel analysis
export const analyzeLogic = async (statement: string): Promise<LogicDuelAnalysis> => {
  try {
    const prompt = `Perform a logical "duel" analysis on this statement: "${statement}".
Evaluate its logical consistency, fallacies, and overall clarity.
Return ONLY valid JSON:
{
  "score": 0-100,
  "verdict": "VALIANT|FLAWED|SUPERIOR|UNCERTAIN",
  "analysis": "concise 1-2 sentences"
}`;

    const response = await callDeepSeek(
      [
        { role: "system", content: "You are a strict logic arbiter. Always return valid JSON." },
        { role: "user", content: prompt }
      ],
      { response_format: { type: "json_object" } }
    );

    const parsed = JSON.parse(response);
    return {
      score: typeof parsed.score === "number" ? parsed.score : 50,
      verdict: parsed.verdict || "UNCERTAIN",
      analysis: parsed.analysis || "The logical structure could not be verified by the arbiter."
    };
  } catch (error) {
    console.error("DeepSeek analyzeLogic error:", error);
    return {
      score: 50,
      verdict: "UNCERTAIN",
      analysis: "The logical structure could not be verified by the arbiter."
    };
  }
};

// Deep brainstorm: generate options with scenario context (life / work / money / love)
export const deepBrainstormOptions = async (
  theme: string,
  scenario: 'life' | 'work' | 'money' | 'love'
): Promise<string[]> => {
  try {
    const prompt = `The user is struggling with: "${theme}".
Context: ${scenario.toUpperCase()} (life / work / money / love).
Generate 6–10 extremely concise options (1–2 words each) that span different dimensions:
- short-term vs long-term
- safe vs adventurous
- inner growth vs outer gain
Return ONLY a JSON array of strings.`;

    const response = await callDeepSeek(
      [
        { role: 'system', content: 'You are a decision strategist. Always return a valid JSON array of concise options.' },
        { role: 'user', content: prompt },
      ],
      { response_format: { type: 'json_object' } }
    );

    const parsed = JSON.parse(response);
    return Array.isArray(parsed) ? parsed : parsed.options || [];
  } catch (error) {
    console.error('DeepSeek deepBrainstormOptions error:', error);
    return [];
  }
};

// Post-mortem analysis: after a decision is made and the user reflects
export const analyzePostMortem = async (decision: Decision, reflection: string): Promise<string> => {
  try {
    const prompt = `A user made this decision: "${decision.title}" with winner "${decision.winner}".
Defeated options: ${Array.isArray(decision.eliminated) ? decision.eliminated.join(', ') : ''}.
Now the user reflects: "${reflection}".
Provide a short, 2–3 sentence reflection that:
1) validates their feelings,
2) surfaces what this reveals about their values,
3) suggests how they could decide even better next time.
Keep it gentle, practical, and human.`;

    return await callDeepSeek(
      [
        { role: 'system', content: 'You are a compassionate decision coach. Respond concisely in 2–3 sentences.' },
        { role: 'user', content: prompt },
      ]
    );
  } catch (error) {
    console.error('DeepSeek analyzePostMortem error:', error);
    return 'Your reflection already shows growth. Next time, bring this awareness to the start of the decision instead of only at the end.';
  }
};
