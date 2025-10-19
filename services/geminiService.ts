import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise summary of the bill's core purpose and main provisions."
    },
    ratings: {
      type: Type.OBJECT,
      properties: {
        growth: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.STRING, description: "The predicted impact, must be one of: 'positive', 'negative', or 'neutral'." },
            justification: { type: Type.STRING, description: "Justification for the score." }
          },
          required: ['score', 'justification']
        },
        publicServices: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.STRING, description: "The predicted impact, must be one of: 'positive', 'negative', or 'neutral'." },
            justification: { type: Type.STRING, description: "Justification for the score." }
          },
          required: ['score', 'justification']
        },
        governance: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.STRING, description: "The predicted impact, must be one of: 'positive', 'negative', or 'neutral'." },
            justification: { type: Type.STRING, description: "Justification for the score." }
          },
          required: ['score', 'justification']
        },
        environment: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.STRING, description: "The predicted impact, must be one of: 'positive', 'negative', or 'neutral'." },
            justification: { type: Type.STRING, description: "Justification for the score." }
          },
          required: ['score', 'justification']
        },
      },
      required: ['growth', 'publicServices', 'governance', 'environment']
    },
  },
  required: ['summary', 'ratings']
};

export const analyzeBillText = async (billText: string): Promise<AnalysisResult> => {
  const prompt = `
    You are an expert political and economic analyst. Analyze the following summary of a UK parliamentary bill.

    Your task is to provide a concise summary and rate the bill's *predicted impact* (not its stated intention) as 'positive', 'negative', or 'neutral' across four dimensions:

    1.  **Growth:** The bill's likely effect on economic growth, innovation, and business environment.
    2.  **Public Services & Wellbeing:** The bill's likely effect on public services (like healthcare, education, security, public safety) and the general wellbeing and quality of life of the population. Take into account the expected public response to the bill.
    3.  **Governance Quality:** The bill's likely effect on transparency, accountability, and the rule of law.
    4.  **Environment:** The bill's likely effect on environmental protection and sustainability. Take into account the expected mangitute of the impact: a positive change of very limited impact should be rated neutral.

    Here is the bill summary:
    ---
    ${billText}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: analysisSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text;
    const result = JSON.parse(jsonText);
    
    // Basic validation
    if (!result.summary || !result.ratings) {
      throw new Error("Invalid analysis format received from API.");
    }

    return result as AnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
};