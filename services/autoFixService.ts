import { GoogleGenAI, Type } from "@google/genai";
import { AutoFixReport, ValidationIssue } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const AUTO_FIX_INSTRUCTION = `You are an expert in OpenAPI specifications. Your task is to fix the provided OpenAPI JSON based on a list of validation issues. Analyze the original spec and the issues, then provide a corrected version of the JSON. Only fix the specified issues. Do not add new fields or endpoints. Your response must be a JSON object containing the fixed specification and a brief summary of the changes you made.`;

const FIX_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    fixed_spec_json: {
      type: Type.OBJECT,
      description: 'The full, corrected OpenAPI specification as a JSON object.',
    },
    summary: {
      type: Type.STRING,
      description: 'A brief summary of the fixes applied.',
    },
    changes: {
        type: Type.ARRAY,
        description: "A list of changes made.",
        items: {
            type: Type.OBJECT,
            properties: {
                path: { type: Type.STRING, description: "JSON path to the changed element." },
                description: { type: Type.STRING, description: "Description of the change." },
            },
            required: ['path', 'description'],
        }
    }
  },
  required: ['fixed_spec_json', 'summary', 'changes'],
};

export async function autoFixSpec(
  originalSpec: string,
  issues: ValidationIssue[]
): Promise<AutoFixReport> {
  const prompt = `
Original OpenAPI Spec (as a JSON string):
\`\`\`json
${originalSpec}
\`\`\`

Validation Issues to fix:
${JSON.stringify(issues, null, 2)}

Please provide the corrected OpenAPI spec as a valid JSON object, along with a summary of your changes.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        systemInstruction: AUTO_FIX_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: FIX_RESPONSE_SCHEMA,
        temperature: 0.1,
      },
    });

    const jsonString = response.text;
    if (!jsonString) {
        throw new Error("Received empty response from AI for auto-fix.");
    }

    const parsedResponse = JSON.parse(jsonString);
    const fixedSpecString = JSON.stringify(parsedResponse.fixed_spec_json, null, 2);

    return {
      status: 'success', // Could be 'partial' if not all issues are fixed, but this is a simplification.
      summary: parsedResponse.summary,
      original_spec: originalSpec,
      fixed_spec: fixedSpecString,
      changes: parsedResponse.changes || [],
    };
  } catch (error) {
    console.error("Error during auto-fix:", error);
    return {
      status: 'failed',
      summary: 'The AI auto-fix process failed. Please review the spec manually.',
      original_spec: originalSpec,
      fixed_spec: originalSpec,
      changes: [],
    };
  }
}
