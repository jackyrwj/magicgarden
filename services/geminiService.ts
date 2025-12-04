import { GoogleGenAI, Type, Modality } from "@google/genai";
import { WordItem } from "../types";

// Helper to get API key safely
const getApiKey = () => process.env.API_KEY || '';

// Initialize client
const createClient = () => new GoogleGenAI({ apiKey: getApiKey() });

export const generateWordList = async (theme: string): Promise<WordItem[]> => {
  const ai = createClient();
  
  // Using Flash 2.5 for speed and low cost
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate a list of 5 simple, distinct Chinese words suitable for a 5-year-old child related to the theme "${theme}". 
    Include the Chinese character (simplified), Pinyin, English meaning, a relevant Emoji, and a very simple example sentence in Chinese.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            character: { type: Type.STRING },
            pinyin: { type: Type.STRING },
            english: { type: Type.STRING },
            emoji: { type: Type.STRING },
            sentence: { type: Type.STRING },
          },
          required: ["character", "pinyin", "english", "emoji", "sentence"],
        },
      },
    },
  });

  const text = response.text;
  if (!text) return [];
  try {
    return JSON.parse(text) as WordItem[];
  } catch (e) {
    console.error("Failed to parse word list", e);
    return [];
  }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
  const ai = createClient();

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: {
        parts: [{ text: text }],
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' }, // Puck is often friendly/higher pitch
          },
        },
      },
    });

    // The audio data is in the first candidate's first part
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("TTS generation failed:", error);
    return null;
  }
};