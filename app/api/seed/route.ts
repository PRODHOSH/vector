import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Sample tasks
  const sampleTasks = [
    {
      user_id: user.id,
      title: "Finish Calculus Assignment",
      description: "Complete chapters 4 and 5 problems from the textbook.",
      status: "todo",
      priority: "high",
      due_date: new Date(Date.now() + 86400000 * 2).toISOString(), // +2 days
    },
    {
      user_id: user.id,
      title: "Read Literature essay",
      description: "Read 'The Great Gatsby' chapters 1-3.",
      status: "in_progress",
      priority: "medium",
      due_date: new Date(Date.now() + 86400000 * 4).toISOString(), // +4 days
    },
    {
      user_id: user.id,
      title: "Submit CS Project",
      description: "Finalize the React application and deploy to Vercel.",
      status: "done",
      priority: "high",
      due_date: new Date(Date.now() - 86400000 * 1).toISOString(), // -1 day
    },
    {
      user_id: user.id,
      title: "Schedule study group",
      description: "Find a time for the physics study group to meet.",
      status: "todo",
      priority: "low",
      due_date: new Date(Date.now() + 86400000 * 7).toISOString(), // +7 days
    }
  ];

  const { error } = await supabase.from('tasks').insert(sampleTasks);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Successfully seeded tasks!' });
}
