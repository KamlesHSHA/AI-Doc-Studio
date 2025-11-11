export interface ReadabilityStats {
    fleschReadingEase: number;
    gradeLevel: number;
    wordCount: number;
    sentenceCount: number;
}

// Simple word counter
function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Simple sentence counter
function countSentences(text: string): number {
    if (!text) return 0;
    const sentenceEndings = text.match(/[.!?]+/g);
    return sentenceEndings ? sentenceEndings.length : 1;
}

// Flesch Reading Ease formula
export function calculateReadability(text: string): ReadabilityStats {
    if (!text || text.trim() === '') {
        return { fleschReadingEase: 0, gradeLevel: 0, wordCount: 0, sentenceCount: 0 };
    }
    const wordCount = countWords(text);
    const sentenceCount = countSentences(text);
    // Simple syllable count approximation
    const syllableCount = (text.toLowerCase().match(/[aeiouy]{1,2}/g) || []).length;

    if (wordCount === 0 || sentenceCount === 0) {
        return { fleschReadingEase: 0, gradeLevel: 0, wordCount: 0, sentenceCount: 0 };
    }

    const avgWordsPerSentence = wordCount / sentenceCount;
    const avgSyllablesPerWord = syllableCount / wordCount;

    const fleschReadingEase = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
    const gradeLevel = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;
    
    return {
        fleschReadingEase: Math.round(fleschReadingEase * 10) / 10,
        gradeLevel: Math.round(gradeLevel * 10) / 10,
        wordCount,
        sentenceCount
    };
}
