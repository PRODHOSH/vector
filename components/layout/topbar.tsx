import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationDropdown } from "./notification-dropdown";
import { SearchTrigger } from "@/components/layout/search-trigger";

export function Topbar() {
  return (
    <header className="flex h-14 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60 px-6 lg:px-8 z-30 sticky top-0">
      <div className="flex flex-1 items-center gap-4">
        <SearchTrigger />
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationDropdown />
      </div>
    </header>
  );
}
