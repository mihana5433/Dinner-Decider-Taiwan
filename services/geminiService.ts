import { GoogleGenAI } from "@google/genai";
import { LatLng, RecommendationResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = "gemini-2.5-flash";

export const getAIRecommendation = async (
  prompt: string,
  location?: LatLng
): Promise<RecommendationResult> => {
  
  const systemInstruction = `
    You are a knowledgeable Taiwanese local food guide. 
    The user is looking for dinner suggestions in Taiwan.
    
    If the user provides a specific food name (e.g., "Beef Noodle Soup"), find the best rated places nearby using Google Maps.
    If the user provides a mood (e.g., "something spicy"), suggest a specific type of food first, then find places nearby.
    
    Your response format should be:
    1. A friendly opening greeting.
    2. A clear recommendation of WHAT to eat.
    3. A brief reason why.
    4. The list of specific places found via Google Maps tools.
    
    Keep the tone friendly, appetizing, and helpful. Language: Traditional Chinese (Taiwan).
    Structure the output with clear headings using Markdown.
  `;

  const tools = [{ googleMaps: {} }];
  
  let toolConfig = undefined;
  if (location) {
    toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: location.latitude,
          longitude: location.longitude
        }
      }
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        tools: tools,
        toolConfig: toolConfig,
      },
    });

    const text = response.text || "抱歉，我現在無法提供建議。請稍後再試。";
    
    // Extract map chunks if available
    const mapChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      text,
      mapChunks,
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("無法連接到 AI 服務，請檢查網路或 API 金鑰。");
  }
};
