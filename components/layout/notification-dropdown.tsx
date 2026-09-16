"use client";

import { useEffect, useState } from "react";
import { Bell, CheckSquare, CalendarClock, Megaphone, Lightbulb, User } from "lucide-react";
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
  type: string;
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
    case 'task': return CheckSquare;
    case 'event': return CalendarClock;
    case 'idea': return Lightbulb;
    case 'mention': return User;
    default: return Megaphone;
  }
}

export function NotificationDropdown() {
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    const supabase = createClient();
    
    // Fetch initial notifications
    const fetchNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
        
      if (data) setItems(data);
    };
    
    fetchNotifications();

    // Subscribe to real-time changes
    const channel = supabase.channel('realtime_notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications'
      }, (payload) => {
        const newNotif = payload.new as NotificationItem;
        setItems(prev => [newNotif, ...prev]);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'notifications'
      }, (payload) => {
        const updated = payload.new as NotificationItem;
        setItems(prev => prev.map(item => item.id === updated.id ? updated : item));
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const unreadCount = items.filter(i => !i.is_read).length;

  const handleMarkAsRead = async (id: string, url: string) => {
    const supabase = createClient();
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, is_read: true } : i));
    if (url) router.push(url);
  };

  const handleMarkAllAsRead = async () => {
    if (!userId) return;
    const supabase = createClient();
    await supabase.from("notifications").update({ is_read: true }).eq("profile_id", userId);
    setItems(prev => prev.map(i => ({ ...i, is_read: true })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        data-mobile-tap-target
        className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 w-9"
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
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Mark all read
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
              return (
                <DropdownMenuItem
                  key={item.id}
                  className={`flex items-start gap-2.5 p-3 cursor-pointer ${!item.is_read ? 'bg-primary/5 border-l-2 border-primary' : ''}`}
                  onClick={() => handleMarkAsRead(item.id, item.link)}
                >
                  <Icon className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className={`text-sm ${!item.is_read ? 'font-semibold' : 'font-medium'}`}>{item.title}</span>
                      <span className="text-xs text-muted-foreground shrink-0">{timeAgo(item.created_at)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.message}</p>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No notifications yet!
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
