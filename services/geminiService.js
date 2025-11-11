import { GoogleGenAI } from "@google/genai";
import { RESPONSE_SCHEMA, GENERATE_DRAFTS_INSTRUCTION } from "../constants.js";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function cleanJsonString(jsonString) {
    let cleaned = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');
    return cleaned;
}

export async function generateRawDrafts(n_api, audiences) {
  const dynamicSchema = { ...RESPONSE_SCHEMA };
  dynamicSchema.required = audiences.map(a => {
    if (a === 'Beginner') return 'beginner_doc';
    if (a === 'Quick Start Developer') return 'quick_start_doc';
    if (a === 'Security Analyst') return 'security_doc';
    return '';
  }).filter(Boolean);


  try {
    const prompt = `Based on this N_API object, generate documentation for the following audiences: ${audiences.join(', ')}.\n\nN_API:\n${JSON.stringify(n_api, null, 2)}`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        systemInstruction: GENERATE_DRAFTS_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: dynamicSchema,
        temperature: 0.3,
      },
    });

    const jsonString = response.text;
    
    if (!jsonString) {
        throw new Error('Received an empty response from the API.');
    }
    
    try {
        const cleanedString = cleanJsonString(jsonString);
        const parsedJson = JSON.parse(cleanedString);
        return parsedJson;
    } catch (e) {
        console.error("Failed to parse JSON response:", jsonString);
        throw new Error("The API returned an invalid JSON format.");
    }

  } catch (error) {
    console.error("Error generating raw drafts with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
}
