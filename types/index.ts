export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: string;
  status: string;
  last_login_at?: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  accessible_modules?: string[];
  position?: string;
  phone_number?: string;
  city?: string;
  department?: string;
  bio?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  offer_letter_url?: string;
  preferences?: Record<string, boolean>;
  has_password?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  is_all_day?: boolean;
  location?: string;
  created_by: string;
  created_at: string;
  updated_at?: string;
  status?: string;
  recording_url?: string;
  calendar_event_attendees?: CalendarEventAttendee[];
}

export interface CalendarEventAttendee {
  event_id: string;
  profile_id: string;
  status: string;
  created_at: string;
}

export interface Task {
  id: string;
  project_id?: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  assigned_by: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  github_pr_url?: string;
  overdue_email_sent?: boolean;
  task_assignees?: TaskAssignee[];
  projects?: { id: string; name: string };
}

export interface TaskAssignee {
  task_id: string;
  profile_id: string;
  created_at: string;
}
