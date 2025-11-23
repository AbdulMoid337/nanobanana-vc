import { GoogleGenAI } from "@google/genai";

// Initialize the client
// The API key must be available in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash-image';

/**
 * Generates/Edits an image based on a source image and a text prompt.
 * 
 * @param base64Image The source image in base64 format (without the data URL prefix if possible, but the API handles pure base64).
 * @param mimeType The mime type of the source image.
 * @param prompt The text instruction for the edit/generation.
 * @returns The base64 data of the generated image.
 */
export const generateMarketingAsset = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
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
      // Note: gemini-2.5-flash-image doesn't strictly require imageConfig for edits, 
      // but we omit specific aspect ratios to let it infer or maintain context unless specified in prompt.
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
    
    // If we only got text back (e.g., a refusal or description), throw an error or handle it.
    // Sometimes the model explains why it couldn't generate the image.
    const textPart = parts.find(p => p.text);
    if (textPart && textPart.text) {
        throw new Error(`Model returned text instead of image: ${textPart.text}`);
    }

    throw new Error("No image data found in response.");

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    throw new Error(error.message || "Failed to generate asset.");
  }
};