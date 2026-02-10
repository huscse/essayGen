export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function calculateReadingTime(wordCount: number): number {
  // Average reading speed: 200-250 words per minute
  const wordsPerMinute = 225;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function createEssayResult(text: string) {
  const wordCount = countWords(text);
  const readingTime = calculateReadingTime(wordCount);
  
  return {
    text,
    wordCount,
    readingTime
  };
}
