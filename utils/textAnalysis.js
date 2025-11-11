function countWords(text) {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

function countSentences(text) {
    if (!text) return 0;
    const sentenceEndings = text.match(/[.!?]+/g);
    return sentenceEndings ? sentenceEndings.length : 1;
}

export function calculateReadability(text) {
    if (!text || text.trim() === '') {
        return { fleschReadingEase: 0, gradeLevel: 0, wordCount: 0, sentenceCount: 0 };
    }
    const wordCount = countWords(text);
    const sentenceCount = countSentences(text);
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
