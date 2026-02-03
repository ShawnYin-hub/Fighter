
import { GoogleGenAI, Type } from "@google/genai";
import { DuelResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const analyzeDuel = async (optionA: string, optionB: string): Promise<DuelResult> => {
  const prompt = `Analyze a 'Duel' between two choices: "${optionA}" vs "${optionB}". 
  Compare them based on practicality, value, and general consensus. 
  Decide a clear winner and provide a concise rationale. 
  List 3 pros and 2 cons for each.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          winner: { type: Type.STRING },
          loser: { type: Type.STRING },
          rationale: { type: Type.STRING },
          prosA: { type: Type.ARRAY, items: { type: Type.STRING } },
          prosB: { type: Type.ARRAY, items: { type: Type.STRING } },
          consA: { type: Type.ARRAY, items: { type: Type.STRING } },
          consB: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["winner", "loser", "rationale", "prosA", "prosB", "consA", "consB"],
      },
    },
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(response.text.trim()) as DuelResult;
};
