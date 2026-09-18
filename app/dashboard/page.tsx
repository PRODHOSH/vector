import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus, CheckSquare, CalendarClock } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format, isToday, isFuture } from "date-fns";
import { PageTransition, StaggerGrid, AnimatedCard } from "@/components/ui/page-transition";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const fullName = profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || "Student";
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || "";

  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const allTasks = tasks || [];
  const pendingCount = allTasks.filter(t => t.status === "todo" || t.status === "in_progress").length;
  
  const completedTodayCount = allTasks.filter(t => {
    if (t.status !== "done") return false;
    return isToday(new Date(t.updated_at));
  }).length;

  const upcomingDeadlinesCount = allTasks.filter(t => {
    if (t.status === "done" || !t.due_date) return false;
    return isFuture(new Date(t.due_date));
  }).length;

  const recentTasks = allTasks.slice(0, 5);

  return (
    <PageTransition className="flex flex-col gap-8">
      <PageHeader 
        eyebrow="Overview"
        title={
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
              <AvatarImage src={avatarUrl} alt={fullName} />
              <AvatarFallback className="text-lg">{fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>Welcome back, {fullName}</span>
          </div>
        }
        description="Here is what is happening with your tasks today."
        actions={
          <Link href="/dashboard/tasks" className={buttonVariants()}>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Link>
        }
      />

      <div id="dashboard-main-content">
        <StaggerGrid className="grid gap-6 md:grid-cols-3">
          <AnimatedCard>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-display">{pendingCount}</div>
              </CardContent>
            </Card>
          </AnimatedCard>
          <AnimatedCard>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-display">{completedTodayCount}</div>
              </CardContent>
            </Card>
          </AnimatedCard>
          <AnimatedCard>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-display text-blue-500 dark:text-blue-400">{upcomingDeadlinesCount}</div>
              </CardContent>
            </Card>
          </AnimatedCard>
        </StaggerGrid>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Tasks</CardTitle>
            </div>
            <Link href="/dashboard/tasks" className={buttonVariants({ variant: "ghost" })}>View all</Link>
          </CardHeader>
          
          <CardContent className="p-0">
            {recentTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center border-t border-dashed">
                <CheckSquare className="h-8 w-8 text-muted-foreground mb-3 opacity-20" />
                <p className="text-muted-foreground text-sm">No tasks found. Create one to get started!</p>
              </div>
            ) : (
              <div className="flex flex-col border-t">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b p-4 last:border-0 gap-2 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <input 
                        type="checkbox" 
                        checked={task.status === "done"} 
                        readOnly
                        className="h-4 w-4 rounded border-gray-300 pointer-events-none opacity-70" 
                      />
                      <span className={`font-medium truncate ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>
                        {task.title}
                      </span>
                    </div>
                    {task.due_date && (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground ml-7 sm:ml-0 shrink-0">
                        <CalendarClock className="h-3.5 w-3.5" />
                        {format(new Date(task.due_date), "MMM d, yyyy")}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
