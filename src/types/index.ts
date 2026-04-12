export type User = {
  id: string
  email: string
  name: string | null
  first_name: string | null
  last_name: string | null
  phone: string | null
  gender: string | null
  date_of_birth: string | null
  location: string | null
  timezone: string | null
  role: string | null
  github: string | null
  twitter: string | null
  instagram: string | null
  bio: string | null
  personal_website: string | null
  linkedin: string | null
  avatar_url: string | null
  weekly_tasks_completed: number
  streak: number
  created_at: string
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
  updated_at?: string | null;
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
