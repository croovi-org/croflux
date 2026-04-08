import type { AIRoadmapResponse } from "@/lib/ai/aiClient"

export type ParsedPhase = {
  id: string
  project_id: string
  title: string
  order_index: number
}

export type ParsedMilestone = {
  id: string
  project_id: string
  phase_id: string
  title: string
  is_boss: boolean
  order_index: number
}

export type ParsedTask = {
  id: string
  milestone_id: string
  title: string
  completed: boolean
}

export type ParsedRoadmapDB = {
  phase: ParsedPhase
  milestones: ParsedMilestone[]
  tasks: ParsedTask[]
}

export function parseRoadmapToDB(
  roadmap: AIRoadmapResponse,
  projectId: string,
): ParsedRoadmapDB {
  const phase: ParsedPhase = {
    id: crypto.randomUUID(),
    project_id: projectId,
    title: "Execution",
    order_index: 1,
  }

  const milestones: ParsedMilestone[] = roadmap.milestones.map((milestone, index) => ({
    id: crypto.randomUUID(),
    project_id: projectId,
    phase_id: phase.id,
    title: milestone.title,
    is_boss: milestone.is_boss ?? false,
    order_index: index + 1,
  }))

  const tasks: ParsedTask[] = roadmap.milestones.flatMap((milestone, milestoneIndex) =>
    milestone.tasks.map((task) => ({
      id: crypto.randomUUID(),
      milestone_id: milestones[milestoneIndex].id,
      title: task.title,
      completed: false,
    })),
  )

  return {
    phase,
    milestones,
    tasks,
  }
}
