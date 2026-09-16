"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  CalendarIcon,
  FolderOpenIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UsersIcon,
  CheckSquareIcon,
  FileTextIcon,
  MegaphoneIcon,
  BookOpenIcon,
  UsersRoundIcon,
  BarChart3Icon,
  ShieldCheckIcon,
  PlusIcon,
} from "lucide-react"

export type SearchItems = {
  tasks: { id: string; title: string }[]
  projects: { id: string; name: string }[]
  contacts: { id: string; full_name: string }[]
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

const ELEVATED_ROLES = ["CEO & Founder", "Admin", "C-Suite"]

export const OPEN_COMMAND_MENU_EVENT = "open-command-menu"

export function CommandMenu({ role, searchItems }: { role?: string; searchItems?: SearchItems }) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const isElevated = role ? ELEVATED_ROLES.includes(role) : false

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
                <CommandItem key={t.id} value={t.title} onSelect={() => runCommand(() => router.push(`/tasks?focus=${t.id}`))}>
                  <CheckSquareIcon className="mr-2 h-4 w-4" />
                  <span>{t.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!!searchItems?.projects.length && (
            <CommandGroup heading="Projects">
              {searchItems.projects.map((p) => (
                <CommandItem key={p.id} value={p.name} onSelect={() => runCommand(() => router.push(`/projects?focus=${p.id}`))}>
                  <FolderOpenIcon className="mr-2 h-4 w-4" />
                  <span>{p.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!!searchItems?.contacts.length && (
            <CommandGroup heading="Contacts">
              {searchItems.contacts.map((c) => (
                <CommandItem key={c.id} value={c.full_name} onSelect={() => runCommand(() => router.push(`/crm?focus=${c.id}`))}>
                  <UsersIcon className="mr-2 h-4 w-4" />
                  <span>{c.full_name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {(!!searchItems?.tasks.length || !!searchItems?.projects.length || !!searchItems?.contacts.length) && <CommandSeparator />}

          <CommandGroup heading="Create">
            <CommandItem onSelect={() => runCommand(() => router.push("/tasks?new=1"))}>
              <PlusIcon className="mr-2 h-4 w-4" />
              <span>New Task</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/projects?new=1"))}>
              <PlusIcon className="mr-2 h-4 w-4" />
              <span>New Project</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/crm?new=1"))}>
              <PlusIcon className="mr-2 h-4 w-4" />
              <span>New Contact</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/documents?new=1"))}>
              <PlusIcon className="mr-2 h-4 w-4" />
              <span>New Document</span>
            </CommandItem>
            {isElevated && (
              <CommandItem onSelect={() => runCommand(() => router.push("/announcements?new=1"))}>
                <PlusIcon className="mr-2 h-4 w-4" />
                <span>New Announcement</span>
              </CommandItem>
            )}
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
              <LayoutDashboardIcon className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/announcements"))}>
              <MegaphoneIcon className="mr-2 h-4 w-4" />
              <span>Announcements</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/team"))}>
              <UsersRoundIcon className="mr-2 h-4 w-4" />
              <span>Team Directory</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/tasks"))}>
              <CheckSquareIcon className="mr-2 h-4 w-4" />
              <span>Tasks</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/calendar"))}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/projects"))}>
              <FolderOpenIcon className="mr-2 h-4 w-4" />
              <span>Projects</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/crm"))}>
              <UsersIcon className="mr-2 h-4 w-4" />
              <span>CRM</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/knowledge"))}>
              <BookOpenIcon className="mr-2 h-4 w-4" />
              <span>Knowledge Book</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/documents"))}>
              <FileTextIcon className="mr-2 h-4 w-4" />
              <span>Documents</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/settings"))}>
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>

          {isElevated && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Leadership">
                {/* Sprints module temporarily disabled — re-enable when ready (see also
                    sidebar-nav.tsx and mobile-nav.tsx, which have matching commented entries).
                <CommandItem onSelect={() => runCommand(() => router.push("/sprints"))}>
                  <CalendarRangeIcon className="mr-2 h-4 w-4" />
                  <span>Sprints</span>
                </CommandItem>
                */}
                <CommandItem onSelect={() => runCommand(() => router.push("/analytics"))}>
                  <BarChart3Icon className="mr-2 h-4 w-4" />
                  <span>Analytics</span>
                </CommandItem>
                <CommandItem onSelect={() => runCommand(() => router.push("/admin"))}>
                  <ShieldCheckIcon className="mr-2 h-4 w-4" />
                  <span>Admin Console</span>
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}
