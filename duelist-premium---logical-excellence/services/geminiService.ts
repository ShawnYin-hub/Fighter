
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeLogic = async (statement: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a logical "duel" analysis on this statement: "${statement}". 
                 Evaluate its logical consistency, fallacies, and overall clarity.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "A score from 0-100 for logical clarity" },
            verdict: { type: Type.STRING, description: "A one word verdict like 'VALIANT', 'FLAWED', or 'SUPERIOR'" },
            analysis: { type: Type.STRING, description: "A concise 2-sentence breakdown of the logic." }
          },
          required: ["score", "verdict", "analysis"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Analysis failed:", error);
    return {
      score: 50,
      verdict: "UNCERTAIN",
      analysis: "The logical structure could not be verified by the arbiter."
    };
  }
};
