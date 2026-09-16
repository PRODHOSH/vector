"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CalendarIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  CheckSquareIcon,
  PlusIcon,
} from "lucide-react"

export type SearchItems = {
  tasks: { id: string; title: string }[]
}

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

export const OPEN_COMMAND_MENU_EVENT = "open-command-menu"

export function CommandMenu({ searchItems }: { searchItems?: SearchItems }) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    const openFromEvent = () => setOpen(true)

    document.addEventListener("keydown", down)
    window.addEventListener(OPEN_COMMAND_MENU_EVENT, openFromEvent)
    return () => {
      document.removeEventListener("keydown", down)
      window.removeEventListener(OPEN_COMMAND_MENU_EVENT, openFromEvent)
    }
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {!!searchItems?.tasks.length && (
            <CommandGroup heading="Tasks">
              {searchItems.tasks.map((t) => (
                <CommandItem key={t.id} value={t.title} onSelect={() => runCommand(() => router.push(`/dashboard/tasks?focus=${t.id}`))}>
                  <CheckSquareIcon className="mr-2 h-4 w-4" />
                  <span>{t.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!!searchItems?.tasks.length && <CommandSeparator />}

          <CommandGroup heading="Create">
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/tasks?new=1"))}>
              <PlusIcon className="mr-2 h-4 w-4" />
              <span>New Task</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
              <LayoutDashboardIcon className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/tasks"))}>
              <CheckSquareIcon className="mr-2 h-4 w-4" />
              <span>Tasks</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/calendar"))}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings"))}>
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
