
import { GoogleGenAI, Type } from "@google/genai";
import { DecisionAnalysis } from "../types";

export const analyzeDecisionStyle = async (recentDecisions: string): Promise<DecisionAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following decision-making thoughts/log: "${recentDecisions}". Determine the associate's logical style and provide a structured JSON response.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          style: { type: Type.STRING, description: "One-word descriptor of decision style (e.g., Analytical, Intuitive, Stoic)" },
          summary: { type: Type.STRING, description: "Brief overview of the style." },
          recommendation: { type: Type.STRING, description: "Improvement advice." },
          logicalFallacies: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of logical fallacies identified if any."
          }
        },
        required: ["style", "summary", "recommendation", "logicalFallacies"]
      }
    }
  });

  return JSON.parse(response.text);
};
