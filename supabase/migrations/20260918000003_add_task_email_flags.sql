-- Add email notification flags to tasks
ALTER TABLE public.tasks
ADD COLUMN reminder_sent_at timestamp with time zone,
ADD COLUMN overdue_notified_at timestamp with time zone;
