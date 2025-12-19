import { GoogleGenAI } from "@google/genai";

// We use this to simulate "Smart Search" or "File Categorization"
export const askGeminiAboutFiles = async (query: string) => {
  try {
    // Correctly initialize GoogleGenAI using a named parameter with process.env.API_KEY directly.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User is searching for files in an Android File Manager. Query: "${query}". 
      Suggest 3 likely categories or search filters to improve results. Return JSON format.`,
    });
    // Accessing .text as a property as specified in the guidelines.
    return response.text;
  } catch (error) {
    console.error("Gemini service error:", error);
    return null;
  }
};