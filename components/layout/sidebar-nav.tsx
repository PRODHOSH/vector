"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CheckSquare, Calendar, Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/use-sidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, module: "dashboard" },
  { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare, module: "tasks" },
  { name: "Calendar", href: "/dashboard/calendar", icon: Calendar, module: "calendar" },
];

export function SidebarNav({ accessibleModules = ["dashboard", "tasks", "calendar"], isElevated }: { accessibleModules?: string[], isElevated?: boolean }) {
  const pathname = usePathname();
  const { isOpen } = useSidebar();
  
  const filteredNavigation = navigation.filter(
    (item) => accessibleModules.includes(item.module) || (item.module === "settings" && isElevated)
  );

  const renderItem = (item: { name: string; href: string; icon: React.ElementType }) => {
    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
    const linkEl = (
      <Link
        key={item.name}
        href={item.href}
        className={cn(
          "flex items-center rounded-md transition-all duration-200",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          isOpen ? "gap-4 px-4 py-3 text-base font-medium" : "justify-center p-3",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
            : "text-sidebar-foreground"
        )}
      >
        <item.icon className={cn("shrink-0", isOpen ? "h-5 w-5" : "h-6 w-6")} />
        {isOpen && <span>{item.name}</span>}
      </Link>
    );
    if (!isOpen) {
      return (
        <Tooltip key={item.name}>
          <TooltipTrigger render={linkEl} />
          <TooltipContent side="right" className="ml-2">{item.name}</TooltipContent>
        </Tooltip>
      );
    }
    return linkEl;
  };

  return (
    <TooltipProvider delay={0}>
      <nav className="flex flex-col gap-1 px-2">
        <div className="flex-1 grid content-start gap-1">
          {navigation.map(renderItem)}
        </div>
      </nav>
    </TooltipProvider>
  );
}
