export interface User {
  id: string;
  name: string;
  email: string;
  weekly_tasks_completed: number;
  streak: number;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  idea: string;
  strategy: string;
  created_at: string;
}

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  is_boss: boolean;
  order_index: number;
  created_at: string;
  tasks?: Task[];
}

export interface Task {
  id: string;
  milestone_id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  task_completed: boolean;
  timestamp: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  created_at: string;
}
