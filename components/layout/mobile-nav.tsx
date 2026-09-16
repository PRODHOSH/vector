"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, CheckSquare, Calendar, Settings, MoreHorizontal, LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const coreNav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) => pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

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
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-sm">
        <nav className="bg-background/90 backdrop-blur-xl border border-border shadow-2xl rounded-full safe-bottom overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2">
            {coreNav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  data-mobile-tap-target
                  className={cn(
                    "relative flex flex-col items-center justify-center w-14 h-12 rounded-full transition-all duration-300",
                    active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0 transition-transform duration-300 z-10", active ? "scale-110 -translate-y-1" : "scale-100")} />
                  <span className={cn("text-[10px] font-medium absolute bottom-0.5 transition-all duration-300 z-10", active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2")}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              data-mobile-tap-target
              className="relative flex flex-col items-center justify-center w-14 h-12 rounded-full transition-all duration-300 text-muted-foreground hover:text-foreground"
            >
              <MoreHorizontal className="h-5 w-5 shrink-0 transition-transform duration-300 z-10 scale-100" />
              <span className="text-[10px] font-medium absolute bottom-0.5 opacity-0 translate-y-2 transition-all duration-300 z-10">
                More
              </span>
            </button>
          </div>
        </nav>
      </div>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-8">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="mt-4 flex flex-col gap-1">
            <Link
              href="/dashboard/settings"
              onClick={() => setMoreOpen(false)}
              data-mobile-tap-target
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-muted/50 transition-colors"
            >
              <Settings className="h-5 w-5 shrink-0" />
              <span>Settings</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              data-mobile-tap-target
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
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
