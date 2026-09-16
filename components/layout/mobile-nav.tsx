"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, CheckSquare, FolderKanban, Users, MoreHorizontal,
  Megaphone, UsersRound, Calendar, BookOpen, FileText, Settings,
  BarChart3, Lightbulb, LogOut, FileStack, MessageCircle, Mail
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const coreNav = [
  { name: "Home", href: "/", icon: LayoutDashboard, module: "dashboard" },
  { name: "Tasks", href: "/tasks", icon: CheckSquare, module: "tasks" },
  { name: "Projects", href: "/projects", icon: FolderKanban, module: "projects" },
  { name: "Team", href: "/team", icon: Users, module: "team" },
];

const moreNav = [
  { name: "Chats", href: "/chats", icon: MessageCircle, module: "chats" },
  { name: "Email Sender", href: "/email-sender", icon: Mail, module: "email-sender" },
  { name: "Announcements", href: "/announcements", icon: Megaphone, module: "announcements" },
  { name: "Idea Board", href: "/ideas", icon: Lightbulb, module: "ideas" },
  { name: "CRM", href: "/crm", icon: UsersRound, module: "crm" },
  { name: "Calendar", href: "/calendar", icon: Calendar, module: "calendar" },
  { name: "Sprints", href: "/sprints", icon: FolderKanban, module: "sprints" },
  { name: "Knowledge Book", href: "/knowledge", icon: BookOpen, module: "knowledge" },
  { name: "Documents", href: "/documents", icon: FileText, module: "documents" },
  { name: "Analytics", href: "/analytics", icon: BarChart3, module: "analytics" },
  { name: "PDF Maker", href: "/pdf-maker", icon: FileStack, module: "pdf-maker" },
];

const ELEVATED_ROLES = ["CEO & Founder", "Admin", "C-Suite"];
const ADMIN_ROLES = ["CEO & Founder", "Admin"];
// Pages always visible to everyone, mirroring sidebar-nav.tsx
const ALWAYS_VISIBLE = ["dashboard", "announcements", "team"];

export function MobileNav({ role, accessibleModules = [] }: { role?: string; accessibleModules?: string[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);
  const isElevated = role ? ELEVATED_ROLES.includes(role) : false;
  const isAdmin = role ? ADMIN_ROLES.includes(role) : false;

  const canSee = (moduleName: string) => {
    // PDF Maker defaults to Admin/Founder only, not the broader elevated
    // (C-Suite) bypass — everyone else needs an explicit grant.
    if (moduleName === "pdf-maker") return isAdmin || accessibleModules.includes(moduleName);
    return isElevated || ALWAYS_VISIBLE.includes(moduleName) || accessibleModules.includes(moduleName);
  };

  const visibleCore = coreNav.filter((item) => canSee(item.module));
  const visibleMore = moreNav.filter((item) => canSee(item.module));

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));
  const moreIsActive = visibleMore.some((item) => isActive(item.href));

  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
      return;
    }
    setMoreOpen(false);
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-md">
        <nav className="bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl shadow-primary/5 rounded-full safe-bottom overflow-hidden">
          <div className="flex items-center justify-between px-2 py-1.5">
            {visibleCore.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  data-mobile-tap-target
                  className={cn(
                    "relative flex flex-col items-center justify-center w-16 h-12 rounded-full transition-all duration-300",
                    active ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0 transition-transform duration-300 z-10", active ? "scale-110 -translate-y-0.5" : "scale-100")} />
                  <span className={cn("text-[9px] font-medium absolute bottom-1 transition-all duration-300 z-10", active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              data-mobile-tap-target
              className={cn(
                "relative flex flex-col items-center justify-center w-16 h-12 rounded-full transition-all duration-300",
                moreIsActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <MoreHorizontal className={cn("h-5 w-5 shrink-0 transition-transform duration-300 z-10", moreIsActive ? "scale-110 -translate-y-0.5" : "scale-100")} />
              <span className={cn("text-[9px] font-medium absolute bottom-1 transition-all duration-300 z-10", moreIsActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")}>
                More
              </span>
            </button>
          </div>
        </nav>
      </div>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-8 max-h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>More</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-3 gap-2 px-4">
            {visibleMore.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMoreOpen(false)}
                data-mobile-tap-target
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-xl border border-border p-4 text-center transition-colors",
                  isActive(item.href) ? "border-primary/40 bg-primary/5 text-primary" : "text-foreground hover:bg-muted/50"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs font-medium leading-tight">{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="border-t border-border mt-4 pt-4 px-4 flex flex-col gap-1">
            {isAdmin && (
              <Link
                href="/pdf-maker"
                onClick={() => setMoreOpen(false)}
                data-mobile-tap-target
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted/50 transition-colors"
              >
                <FileStack className="h-5 w-5 shrink-0" />
                <span>PDF Maker</span>
              </Link>
            )}
            <Link
              href="/settings"
              onClick={() => setMoreOpen(false)}
              data-mobile-tap-target
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md hover:bg-muted/50 transition-colors"
            >
              <Settings className="h-5 w-5 shrink-0" />
              <span>Settings</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              data-mobile-tap-target
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span>Log Out</span>
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
