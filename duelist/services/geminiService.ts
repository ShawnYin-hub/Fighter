
import { GoogleGenAI, Type } from "@google/genai";
import { DecisionBreakdown, Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const breakdownDecision = async (userInput: string, lang: Language): Promise<DecisionBreakdown> => {
  const isZh = lang === 'zh';
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `The user is facing this dilemma: "${userInput}". 
    Generate 4-6 distinct, creative options/paths. 
    LANGUAGE: Generate all output in ${isZh ? 'Chinese' : 'English'}.
    CRITICAL: Each option must be extremely concise (strictly 1 or 2 ${isZh ? 'characters' : 'words'} maximum, e.g., ${isZh ? '"电影", "休息", "冒险"' : '"Cinema", "Rest", "Venture"'}).
    Also provide a witty, philosophical category and a high-level contrast quote in ${isZh ? 'Chinese' : 'English'}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          options: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of concise options" 
          },
          category: { type: Type.STRING },
          logicQuote: { type: Type.STRING }
        },
        required: ["options", "category", "logicQuote"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    return {
      options: isZh ? ["进", "退", "观", "变"] : ["Venture", "Stay", "Observe", "Pivot"],
      category: isZh ? "路径" : "Pathways",
      logicQuote: isZh ? "最短的词往往最沉重。" : "The shortest words often carry the heaviest weight."
    };
  }
};

export const getAIAdvice = async (optionA: string, optionB: string, lang: Language): Promise<string> => {
  const isZh = lang === 'zh';
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Compare these two concise options: "${optionA}" vs "${optionB}". 
    Provide a deep, 1-sentence analytical advice on which might be better and why. 
    Output strictly in ${isZh ? 'Chinese' : 'English'}.`,
  });
  return response.text.trim();
};
