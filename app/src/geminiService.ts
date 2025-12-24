
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Strictly follow initialization requirements for GoogleGenAI with process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const summarizeNote = async (content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Summarize the following note content into a concise 1-2 sentence "Glow Insight":\n\n${content}`,
    });
    // Fix: Access the .text property directly (not as a function call)
    return response.text;
  } catch (error) {
    console.error("Gemini Summarization Error:", error);
    return null;
  }
};

export const extractActions = async (content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Identify any actionable items or tasks in this note. Return them as a JSON array of strings. Content: ${content}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    // Fix: Ensure we use the .text property correctly and safely parse the JSON
    const text = response.text;
    const jsonStr = text ? text.trim() : '[]';
    return JSON.parse(jsonStr || '[]');
  } catch (error) {
    console.error("Gemini Action Extraction Error:", error);
    return [];
  }
};
