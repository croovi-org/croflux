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
  milestoneid: string
  title: string
  completed: boolean
  orderindex: number
  estimated_hours?: number
  due_date?: string
  difficulty: "easy" | "medium" | "hard"
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
    milestone.tasks.map((task, taskIndex) => ({
      id: crypto.randomUUID(),
      milestoneid: milestones[milestoneIndex].id,
      title: task.title,
      completed: false,
      orderindex: taskIndex + 1,
      estimated_hours: typeof task.estimated_hours === "number" ? task.estimated_hours : undefined,
      difficulty:
        task.difficulty === "easy" || task.difficulty === "hard"
          ? task.difficulty
          : "medium",
    })),
  )

  return {
    phase,
    milestones,
    tasks,
  }
}
