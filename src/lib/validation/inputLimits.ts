export const INPUT_LIMITS = {
  MAX_WORDS: 2500,
  MAX_DOCS: 3,
  MAX_DOC_WORDS: 8000,
  MAX_TOTAL_WORDS: 12000,
} as const

export type InputDocument = {
  name: string
  size: number
}

export type ValidateInputLimitsParams = {
  text?: string
  documents?: InputDocument[]
  notionWordCount?: number
}

export type InputValidationStats = {
  textWords: number
  docWords: number
  notionWords: number
  totalWords: number
  docCount: number
}

export type InputValidationResult = {
  valid: boolean
  errors: string[]
  stats: InputValidationStats
}

export function countWords(text: string): number {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).length
}

export function estimateDocumentWords(fileSizeBytes: number): number {
  if (!Number.isFinite(fileSizeBytes) || fileSizeBytes <= 0) return 0
  return Math.round(fileSizeBytes / 6)
}

export function validateInputLimits(
  params: ValidateInputLimitsParams,
): InputValidationResult {
  const textWords = countWords(params.text ?? "")
  const documents = params.documents ?? []
  const notionWords =
    typeof params.notionWordCount === "number" && Number.isFinite(params.notionWordCount)
      ? Math.max(0, Math.round(params.notionWordCount))
      : 0

  const docCount = documents.length
  const hasOversizedDocument = documents.some(
    (doc) => estimateDocumentWords(doc.size) > INPUT_LIMITS.MAX_DOC_WORDS,
  )
  const docWords = documents.reduce((sum, doc) => sum + estimateDocumentWords(doc.size), 0)
  const totalWords = textWords + docWords + notionWords

  const errors: string[] = []

  if (textWords > INPUT_LIMITS.MAX_WORDS) {
    errors.push("text exceeds word limit")
  }

  if (docCount > INPUT_LIMITS.MAX_DOCS) {
    errors.push("too many documents uploaded")
  }

  if (hasOversizedDocument) {
    errors.push("document too large")
  }

  if (totalWords > INPUT_LIMITS.MAX_TOTAL_WORDS) {
    errors.push("total input size too large")
  }

  return {
    valid: errors.length === 0,
    errors,
    stats: {
      textWords,
      docWords,
      notionWords,
      totalWords,
      docCount,
    },
  }
}
