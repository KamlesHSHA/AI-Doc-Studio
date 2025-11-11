import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const AUTO_FIX_INSTRUCTION = `You are an expert in API specifications. Your task is to fix the provided API specification JSON based on a list of validation issues. Analyze the original spec and the issues, then provide a corrected version. Only fix the specified issues. Do not add new fields or endpoints. Your response must be a JSON object containing the fixed specification as a JSON-formatted string, and a brief summary of the changes you made. If the input is an OpenAPI spec, ensure the output is also a valid OpenAPI spec.`;

const FIX_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    fixed_spec_string: {
      type: Type.STRING,
      description: 'The full, corrected API specification as a JSON-formatted string.',
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
  required: ['fixed_spec_string', 'summary', 'changes'],
};

export async function autoFixSpec(
  originalSpec,
  issues
) {
  const prompt = `
Original API Spec (as a JSON string):
\`\`\`json
${originalSpec}
\`\`\`

Validation Issues to fix:
${JSON.stringify(issues, null, 2)}

Please provide the corrected API spec as a valid JSON-formatted string, along with a summary of your changes.
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
    
    let fixedSpecString = originalSpec;
    let finalStatus = "success";
    let summary = parsedResponse.summary;

    try {
        const fixedSpecObject = JSON.parse(parsedResponse.fixed_spec_string);
        fixedSpecString = JSON.stringify(fixedSpecObject, null, 2);
    } catch (e) {
        console.error("AI auto-fix returned a non-JSON string for the spec:", parsedResponse.fixed_spec_string);
        finalStatus = 'partial';
        summary += " (Warning: The corrected spec returned by the AI was not valid JSON.)";
        fixedSpecString = parsedResponse.fixed_spec_string;
    }

    return {
      status: finalStatus,
      summary: summary,
      original_spec: originalSpec,
      fixed_spec: fixedSpecString,
      changes: parsedResponse.changes || [],
    };
  } catch (error) {
    console.error("Error during auto-fix:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      status: 'failed',
      summary: `The AI auto-fix process failed: ${errorMessage}`,
      original_spec: originalSpec,
      fixed_spec: originalSpec,
      changes: [],
    };
  }
}
