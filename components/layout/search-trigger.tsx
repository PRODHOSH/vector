"use client";

import { Search } from "lucide-react";
import { OPEN_COMMAND_MENU_EVENT } from "./command-menu";

export function SearchTrigger() {
  const open = () => window.dispatchEvent(new Event(OPEN_COMMAND_MENU_EVENT));

  return (
    <>
      {/* Compact icon-only trigger for narrow viewports — the full pill below is hidden here */}
      <button
        type="button"
        onClick={open}
        data-mobile-tap-target
        aria-label="Search Sindra OS"
        className="md:hidden inline-flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors h-9 w-9"
      >
        <Search className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={open}
        className="hidden md:flex relative w-full max-w-md items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors md:w-[300px] lg:w-[400px]"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left truncate">Search Sindra OS...</span>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
          ⌘K
        </kbd>
      </button>
    </>
  );
}
