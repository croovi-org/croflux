export const BETA_LIMITS = {
  maxRoadmaps: 5,
  maxWords: 2500,
  maxDocs: 3,
} as const

export function validateInput(input: {
  strategy: string
  docCount: number
}): { valid: boolean; reason?: string } {
  // TODO: implement in later step
  return { valid: true }
}
