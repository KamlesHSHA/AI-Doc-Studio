import { GoogleGenAI } from "@google/genai";
import { calculateReadability } from "../utils/textAnalysis.js";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const QUALITY_CHECK_INSTRUCTION = `You are a quality assurance AI for technical documentation. Analyze the provided document content for clarity, consistency, accuracy, and tone. Provide a quality score from 0 to 100 and a list of actionable suggestions for improvement. The audience is {AUDIENCE}.`;


export async function analyzeDocumentQuality(
    rawDrafts,
    finalizedOutput
) {
    if (finalizedOutput.beginner_doc_final) {
        const content = finalizedOutput.beginner_doc_final.sections.map(s => s.content).join('\n');
        const readability = calculateReadability(content);
        finalizedOutput.meta.warnings.push(`Beginner doc readability (Flesch-Kincaid Grade Level): ${readability.gradeLevel}`);
    }
    
    finalizedOutput.meta.warnings.push("Quality analysis is a simplified placeholder.");

    return finalizedOutput;
}
