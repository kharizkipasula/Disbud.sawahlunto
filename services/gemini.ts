
import { GoogleGenAI } from "@google/genai";

/**
 * Mak Itam - Sawahlunto Digital Heritage Guide.
 * Supports Multimodal (Text + Image) analysis.
 */
export const askHeritageGuide = async (question: string, imageBase64?: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const parts: any[] = [{ text: question }];
    
    if (imageBase64) {
      // Remove data:image/jpeg;base64, prefix if present
      const base64Data = imageBase64.split(',')[1] || imageBase64;
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        systemInstruction: `You are 'Mak Itam', a knowledgeable and friendly digital heritage guide for Sawahlunto City, West Sumatra, Indonesia. 
        
        Your primary role is to answer questions and analyze images provided by users.
        
        If an image is provided:
        1. Identify the location, building, artifact, or cultural element shown (e.g., Ombilin Mines, Songket pattern, Goedang Ransoem).
        2. Explain its historical significance in the context of Sawahlunto.
        3. If it is NOT related to Sawahlunto, politely say so but offer a fun fact about Sawahlunto heritage instead.

        Tone: Welcoming, educational, and respectful of Minangkabau culture.
        Keep your answers concise (under 150 words).`,
        temperature: 0.7,
      }
    });

    return response.text || "I apologize, I couldn't find an answer in my archives right now.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to consult the archives. Please try again later.");
  }
};

/**
 * Generates translations for CMS content using Gemini.
 */
export const generateTranslation = async (text: string, targetLang: 'en' | 'id'): Promise<string> => {
    if (!text) return '';
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const target = targetLang === 'en' ? 'English' : 'Indonesian';

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Translate the following text to ${target}. Return ONLY the translated text, no preamble or quotes:
            
            "${text}"`,
        });
        return response.text?.trim() || '';
    } catch (error) {
        console.error("Translation Error:", error);
        return text;
    }
};
