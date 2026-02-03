
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const suggestOptions = async (theme: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User is struggling with this theme: "${theme}". Suggest 4-6 very concise (1-2 words each) options to help them decide. Return as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return ["Option 1", "Option 2", "Option 3", "Option 4"];
  }
};

export const getExpertAdvice = async (optionA: string, optionB: string, context: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Compare "${optionA}" vs "${optionB}" for the topic "${context}". Provide a witty 1-sentence critique and a subtle recommendation. JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tucao: { type: Type.STRING },
            recommendation: { type: Type.STRING }
          },
          required: ["tucao", "recommendation"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { tucao: "Both have merit in the void.", recommendation: "Follow your intuition." };
  }
};

export const getDecisionJourneySummary = async (decision: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize the journey: The winner was "${decision.winner}". It survived a duel tournament against ${decision.eliminated.join(', ')}. Context: ${decision.title}. Provide a psychological profile of the user's values based on this choice.`,
    });
    return response.text;
  } catch (error) {
    return "Your choice reflects a balanced priority system.";
  }
};
