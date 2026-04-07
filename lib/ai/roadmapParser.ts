export type RoadmapTask = {
  title: string
}

export type RoadmapMilestone = {
  title: string
  is_boss: boolean
  order_index: number
  tasks: RoadmapTask[]
}

export type RoadmapJSON = {
  project_name: string
  milestones: RoadmapMilestone[]
}

export function parseRoadmap(raw: string): RoadmapJSON {
  // TODO: implement in later step
  return { project_name: '', milestones: [] }
}
