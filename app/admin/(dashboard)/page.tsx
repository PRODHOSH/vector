import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/server-admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, CheckSquare, Mail, Activity, CheckCircle2, XCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminChart } from "./admin-chart";
import { format, subDays } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const adminClient = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch Admin Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  // Metrics
  const { count: usersCount } = await adminClient
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: tasksCount } = await adminClient
    .from("tasks")
    .select("*", { count: "exact", head: true });

  const { count: emailsCount } = await adminClient
    .from("admin_email_logs")
    .select("*", { count: "exact", head: true });

  // Recent Email Logs
  const { data: emailLogs } = await adminClient
    .from("admin_email_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  // Mock Chart Data (Since this is a demo, we'll generate realistic-looking recent growth data)
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      name: format(date, 'MMM dd'),
      users: Math.floor(Math.random() * 15) + 2, // Random growth data
    };
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 rounded-2xl border border-primary/10">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20 shadow-sm">
            <AvatarImage src={profile?.avatar_url || ""} />
            <AvatarFallback className="text-xl bg-primary/20 text-primary">
              {profile?.full_name?.substring(0, 1).toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back, {profile?.full_name?.split(' ')[0] || "Admin"}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening on your platform today.
            </p>
          </div>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:border-primary/50 transition-colors shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{usersCount || 0}</div>
            <p className="text-xs text-muted-foreground pt-1 flex items-center gap-1">
              <Activity className="h-3 w-3 text-emerald-500" /> 
              <span className="text-emerald-500 font-medium">+2%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:border-primary/50 transition-colors shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks Created</CardTitle>
            <div className="h-8 w-8 rounded-full bg-violet-500/10 flex items-center justify-center">
              <CheckSquare className="h-4 w-4 text-violet-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tasksCount || 0}</div>
            <p className="text-xs text-muted-foreground pt-1">Across all users</p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Mail className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{emailsCount || 0}</div>
            <p className="text-xs text-muted-foreground pt-1">System-wide notifications</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* User Growth Chart */}
        <AdminChart data={chartData} />

        {/* Recent Email Logs Table */}
        <Card className="col-span-1 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle>Recent Emails</CardTitle>
            <CardDescription>Latest notifications sent by admins.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              {emailLogs && emailLogs.length > 0 ? (
                emailLogs.map((log) => (
                  <div key={log.id} className="flex items-start justify-between border-b border-border last:border-0 pb-4 last:pb-0">
                    <div className="space-y-1 overflow-hidden pr-4">
                      <p className="text-sm font-medium leading-none truncate">{log.subject}</p>
                      <p className="text-xs text-muted-foreground truncate">{log.to_email}</p>
                      <p className="text-xs text-muted-foreground/60">
                        {format(new Date(log.created_at), "MMM d, h:mm a")}
                      </p>
                    </div>
                    <div>
                      {log.status === "success" ? (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-2 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Sent
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 px-2 flex items-center gap-1">
                          <XCircle className="h-3 w-3" /> Failed
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No emails have been sent yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
