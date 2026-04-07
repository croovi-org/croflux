export const STRATEGY_TEXT_WORD_LIMIT = 1200;
export const STRATEGY_TEXT_WARNING_THRESHOLD = 900;
export const FILE_WORD_LIMIT = 5000;
export const FILE_PAGE_LIMIT = 10;
export const NOTION_WORD_LIMIT = 6000;
export const ROADMAP_GENERATION_LIMIT = 5;
export const FILE_SIZE_LIMIT_BYTES = 5 * 1024 * 1024;
export const FILE_PAGE_WORD_ESTIMATE = 500;

export function countWords(text: string) {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function normalizePlainText(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function truncateToWordLimit(text: string, maxWords: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) {
    return {
      text: text.trim(),
      totalWords: words.length,
      usedWords: words.length,
      truncated: false,
    };
  }

  return {
    text: words.slice(0, maxWords).join(" "),
    totalWords: words.length,
    usedWords: maxWords,
    truncated: true,
  };
}

export function estimatePages(wordCount: number) {
  if (wordCount <= 0) return 0;
  return Math.ceil(wordCount / FILE_PAGE_WORD_ESTIMATE);
}
