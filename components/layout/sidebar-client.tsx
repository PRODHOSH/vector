"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SidebarNav } from "./sidebar-nav";
import { useSidebar } from "@/hooks/use-sidebar";
import { cn } from "@/lib/utils";
import { Menu, Settings, ShieldCheck, LogOut, Mail } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface SidebarClientProps {
  profile: { full_name: string; role: string; avatar_url?: string; accessible_modules?: string[]; position?: string; is_elevated?: boolean };
  email: string | undefined;
  initials: string;
}

// Desktop-only rail — mobile navigation (including Settings/Log Out) lives
// entirely in MobileNav's bottom bar + "More" sheet.
export function SidebarClient({ profile, email, initials }: SidebarClientProps) {
  const { isOpen, toggle } = useSidebar();
  const router = useRouter();
  const isElevated = !!profile.is_elevated;

  const handleLogout = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
      return;
    }
    router.push("/login");
    router.refresh();
  };

  return (
    <div
      className={cn(
        "hidden md:flex flex-col h-full bg-background/80 backdrop-blur-xl border-r border-border transition-all duration-300 z-40 supports-backdrop-filter:bg-background/60",
        isOpen ? "w-64" : "w-16"
      )}
    >
      <div className={cn("flex h-14 shrink-0 items-center border-b border-border", isOpen ? "px-4 justify-between" : "px-0 justify-center")}>
        {isOpen && (
          <Link href="/" className="flex items-center min-w-0 pt-1">
            <Logo width={160} height={48} className="h-10 w-auto object-contain shrink-0" />
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          data-mobile-tap-target
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          className="h-8 w-8 text-sidebar-foreground shrink-0"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto py-4 flex flex-col gap-1">
        <SidebarNav accessibleModules={profile.accessible_modules} isElevated={isElevated} />
        
        <div className="px-2 flex flex-col gap-1 pt-1">
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200",
              isOpen ? "gap-4 px-4 py-3 text-base font-medium" : "justify-center p-3"
            )}
            title="Settings"
          >
            <Settings className={cn("shrink-0", isOpen ? "h-5 w-5" : "h-6 w-6")} />
            {isOpen && <span>Settings</span>}
          </Link>
          {isElevated && (
            <>
            </>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center rounded-md text-destructive hover:bg-destructive/10 transition-colors",
              isOpen ? "gap-4 px-4 py-3 text-base font-medium" : "justify-center p-3"
            )}
            title="Log Out"
          >
            <LogOut className={cn("shrink-0", isOpen ? "h-5 w-5" : "h-6 w-6")} />
            {isOpen && <span>Log Out</span>}
          </button>
        </div>
      </div>
      <div className="border-t border-border p-4 shrink-0">
        <div
          title={email}
          className={cn(
            "flex w-full items-center rounded-md",
            isOpen ? "gap-3 px-3 py-2" : "justify-center py-2 px-0"
          )}
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={profile.avatar_url || ""} />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {isOpen && (
            <div className="flex flex-col truncate text-left flex-1 min-w-0">
              <span className="text-sm font-medium truncate">{profile?.full_name}</span>
              <span className="text-xs text-muted-foreground truncate">{profile?.position || email}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
