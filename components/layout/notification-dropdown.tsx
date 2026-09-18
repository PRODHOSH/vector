"use client";

import { useEffect, useState } from "react";
import { Bell, CalendarClock, CheckSquare, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'approaching' | 'overdue';
  is_read: boolean;
  link: string;
  created_at: string;
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function iconFor(type: string) {
  switch (type) {
    case 'overdue': return AlertCircle;
    case 'approaching': return CalendarClock;
    default: return CheckSquare;
  }
}

export function NotificationDropdown() {
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    const fetchAndDeriveNotifications = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: tasks } = await supabase
        .from("tasks")
        .select("id, title, due_date, status")
        .eq("user_id", user.id)
        .neq("status", "done")
        .not("due_date", "is", null);

      if (!tasks) return;

      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const derived: NotificationItem[] = [];

      tasks.forEach(task => {
        const dueDate = new Date(task.due_date);
        
        if (dueDate < now) {
          derived.push({
            id: `overdue_${task.id}`,
            title: "Task Overdue",
            message: task.title,
            type: "overdue",
            is_read: false,
            link: "/dashboard/tasks",
            created_at: task.due_date
          });
        } else if (dueDate < tomorrow) {
          derived.push({
            id: `approaching_${task.id}`,
            title: "Deadline Approaching",
            message: task.title,
            type: "approaching",
            is_read: false,
            link: "/dashboard/tasks",
            created_at: new Date().toISOString() // Just show current time for approaching
          });
        }
      });

      // Sort by urgency (overdue first, then approaching closest to deadline)
      derived.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

      // Filter by local storage
      const dismissed: string[] = JSON.parse(localStorage.getItem('vector_dismissed_notifs') || '[]');
      
      const activeNotifs = derived.filter(n => !dismissed.includes(n.id));
      
      // Keep only top 4
      const top4 = activeNotifs.slice(0, 4);
      
      setItems(top4);
      setUnreadCount(top4.length);
    };
    
    fetchAndDeriveNotifications();
  }, []);

  const handleMarkAsRead = (id: string, url: string) => {
    const dismissed = JSON.parse(localStorage.getItem('vector_dismissed_notifs') || '[]');
    dismissed.push(id);
    localStorage.setItem('vector_dismissed_notifs', JSON.stringify(dismissed));
    
    setItems(prev => prev.filter(i => i.id !== id));
    setUnreadCount(prev => Math.max(0, prev - 1));
    if (url) router.push(url);
  };

  const handleMarkAllAsRead = () => {
    const dismissed = JSON.parse(localStorage.getItem('vector_dismissed_notifs') || '[]');
    items.forEach(i => dismissed.push(i.id));
    localStorage.setItem('vector_dismissed_notifs', JSON.stringify(dismissed));
    
    setItems([]);
    setUnreadCount(0);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        data-mobile-tap-target
        className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive animate-pulse" />
        )}
        <span className="sr-only">Notifications</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Notifications</p>
                <p className="text-xs text-muted-foreground">
                  {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
                </p>
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-primary hover:underline font-medium cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        {items.length > 0 ? (
          <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
            {items.map((item) => {
              const Icon = iconFor(item.type);
              const isOverdue = item.type === 'overdue';
              return (
                <DropdownMenuItem
                  key={item.id}
                  className={`flex items-start gap-3 p-3 cursor-pointer mb-1 last:mb-0 transition-colors hover:bg-accent ${isOverdue ? 'bg-destructive/5' : 'bg-primary/5'}`}
                  onClick={() => handleMarkAsRead(item.id, item.link)}
                >
                  <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${isOverdue ? 'text-destructive' : 'text-primary'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex w-full items-center justify-between gap-2 mb-1">
                      <span className={`text-sm font-semibold ${isOverdue ? 'text-destructive' : 'text-foreground'}`}>{item.title}</span>
                      <span className="text-xs text-muted-foreground shrink-0">{timeAgo(item.created_at)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.message}</p>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        ) : (
          <div className="p-6 text-center flex flex-col items-center justify-center gap-2">
            <CheckSquare className="h-8 w-8 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No new notifications</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
