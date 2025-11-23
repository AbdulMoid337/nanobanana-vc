'use server';

import { GoogleGenAI } from "@google/genai";
import { auth } from '@clerk/nextjs/server';

// Initialize the client server-side
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-2.5-flash-image';

export async function generateMarketingAssetAction(
  base64Image: string,
  mimeType: string,
  prompt: string
) {
  // Verify authentication
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: Please sign in to generate assets.");
  }

  try {
    // Strip header if present (e.g., "data:image/png;base64,")
    const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Iterate through parts to find the image
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts) {
      throw new Error("No content generated.");
    }

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return part.inlineData.data;
      }
    }
    
    const textPart = parts.find(p => p.text);
    if (textPart && textPart.text) {
        throw new Error(`Model returned text instead of image: ${textPart.text}`);
    }

    throw new Error("No image data found in response.");

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    throw new Error(error.message || "Failed to generate asset.");
  }
}