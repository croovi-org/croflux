export type TaskWithOrder = {
  id: string
  milestoneid: string
  orderindex: number
  estimated_hours?: number
  difficulty: 'easy' | 'medium' | 'hard'
}

export type MilestoneWithOrder = {
  id: string
  orderindex: number
  isboss: boolean
  tasks: TaskWithOrder[]
}

export type DistributorInput = {
  milestones: MilestoneWithOrder[]
  startDate: Date
  endDate: Date
}

export type TaskDueDate = {
  taskid: string
  duedate: string // ISO date YYYY-MM-DD
}

const DIFFICULTY_WEIGHT = { easy: 0.25, medium: 0.55, hard: 1.0 }

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + Math.round(days))
  return result
}

function toISODate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function distributeDueDates(input: DistributorInput): TaskDueDate[] {
  const { milestones, startDate, endDate } = input
  const totalDays = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
  const sorted = [...milestones].sort((a, b) => a.orderindex - b.orderindex)
  const totalMilestones = sorted.length
  const result: TaskDueDate[] = []

  sorted.forEach((milestone, mi) => {
    // Each milestone gets an equal slice of the total timeline
    const milestoneStartDays = (mi / totalMilestones) * totalDays
    const milestoneEndDays = ((mi + 1) / totalMilestones) * totalDays
    const milestoneStart = addDays(startDate, milestoneStartDays)
    const milestoneEnd = addDays(startDate, milestoneEndDays)
    const milestoneDays = Math.max(1, Math.round(milestoneEndDays - milestoneStartDays))

    const tasks = [...milestone.tasks].sort((a, b) => a.orderindex - b.orderindex)
    if (tasks.length === 0) return

    // Compute cumulative weight to position tasks by difficulty
    const weights = tasks.map(t => DIFFICULTY_WEIGHT[t.difficulty] ?? 0.55)
    const totalWeight = weights.reduce((s, w) => s + w, 0)

    let cumulativeWeight = 0
    tasks.forEach((task, ti) => {
      cumulativeWeight += weights[ti]
      const taskRatio = cumulativeWeight / totalWeight
      const daysFromStart = Math.round(taskRatio * milestoneDays)
      let taskDate = addDays(milestoneStart, daysFromStart)

      // Clamp to endDate
      if (taskDate > milestoneEnd) taskDate = milestoneEnd
      if (taskDate > endDate) taskDate = endDate

      result.push({ taskid: task.id, duedate: toISODate(taskDate) })
    })
  })

  return result
}
