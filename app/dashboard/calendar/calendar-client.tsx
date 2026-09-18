"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock, Plus, CheckCircle2, ChevronLeft, ChevronRight, Circle, CircleDot } from "lucide-react";
import { PageTransition } from "@/components/ui/page-transition";
import { LoadingButton } from "@/components/ui/loading-button";
import { cn } from "@/lib/utils";
import { useAction } from "@/hooks/use-action";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { createTask } from "@/app/actions/task-actions";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getStatusIcon(status: string) {
  switch (status) {
    case "done": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case "in_progress": return <CircleDot className="h-4 w-4 text-blue-500" />;
    default: return <Circle className="h-4 w-4 text-muted-foreground" />;
  }
}

export function CalendarClient({ tasks }: { tasks: any[] }) {
  const { loading: creatingTask, run: runCreateTask } = useAction();
  const [isScheduling, setIsScheduling] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const today = useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    
    if (date && time) {
      const start = new Date(`${date}T${time}`);
      formData.set("dueDateISO", start.toISOString());
    }

    const ok = await runCreateTask(() => createTask(formData), "Task created");
    if (ok) {
      setIsScheduling(false);
      window.location.reload();
    }
  };

  const allItems = useMemo(() => {
    return tasks.filter(t => t.due_date).map((t) => ({ type: "task" as const, date: new Date(t.due_date), data: t }));
  }, [tasks]);

  const itemsByDay = useMemo(() => {
    const map = new Map<string, typeof allItems>();
    allItems.forEach((item) => {
      const key = item.date.toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    });
    return map;
  }, [allItems]);

  // Build the visible grid: full weeks covering the viewed month
  const gridDays = useMemo(() => {
    const firstOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const start = new Date(firstOfMonth);
    start.setDate(start.getDate() - start.getDay());
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  }, [viewDate]);

  const goToMonth = (offset: number) => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const agendaItems = selectedDay
    ? (itemsByDay.get(selectedDay.toDateString()) || []).sort((a, b) => a.date.getTime() - b.date.getTime())
    : allItems.filter((i) => {
        if (i.data.status === "done") return false;
        return i.date >= today;
      }).sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 8);

  return (
    <PageTransition className="flex flex-col h-full gap-6">
      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        {/* Month grid */}
        <div className="flex-1 flex flex-col border border-border rounded-lg bg-card overflow-hidden h-fit">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-display font-semibold">
              {viewDate.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
            </h2>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={() => { setViewDate(new Date(today.getFullYear(), today.getMonth(), 1)); setSelectedDay(null); }}>
                Today
              </Button>
              <Button variant="ghost" size="icon" onClick={() => goToMonth(-1)}><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => goToMonth(1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="overflow-x-auto hide-scrollbar w-full">
            <div className="min-w-[600px] md:min-w-full flex flex-col h-full">
              <div className="grid grid-cols-7 border-b border-border bg-muted/20">
                {WEEKDAYS.map((d, i) => (
                  <div key={i} className="p-2 text-center text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 flex-1">
                {gridDays.map((day, i) => {
                  const inMonth = day.getMonth() === viewDate.getMonth();
                  const isToday = sameDay(day, today);
                  const isSelected = selectedDay && sameDay(day, selectedDay);
                  const dayItems = itemsByDay.get(day.toDateString()) || [];

                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDay(isSelected ? null : day)}
                      className={cn(
                        "flex flex-col items-start gap-1 p-2 min-h-[7rem] sm:min-h-[8rem] border-b border-r border-border text-left transition-colors relative overflow-hidden",
                        !inMonth && "bg-muted/10 text-muted-foreground/50",
                        isSelected && "bg-primary/5",
                        !isSelected && "hover:bg-muted/30"
                      )}
                    >
                      <span className={cn(
                        "flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium mb-1",
                        isToday ? "bg-primary text-primary-foreground font-semibold shadow-sm" : "text-muted-foreground"
                      )}>
                        {day.getDate()}
                      </span>
                      <div className="flex flex-col gap-1 w-full">
                        {dayItems.slice(0, 3).map((item, idx) => (
                          <div
                            key={idx}
                            className={cn(
                              "px-1.5 py-0.5 text-[10px] sm:text-[11px] leading-tight rounded-sm w-full truncate border",
                              item.data.status === "done" 
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400" 
                                : item.data.status === "in_progress" 
                                  ? "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400" 
                                  : "bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400"
                            )}
                            title={item.data.title}
                          >
                            {item.data.title}
                          </div>
                        ))}
                        {dayItems.length > 3 && (
                          <div className="text-[10px] text-muted-foreground font-medium pl-1 mt-0.5">
                            +{dayItems.length - 3} more
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Agenda sidebar */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
          <Dialog open={isScheduling} onOpenChange={setIsScheduling}>
            <DialogTrigger render={<Button className="w-full" />}>
              <Plus className="h-4 w-4 mr-2" /> Add Task
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add a Task</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-1.5">
                  <Label className="text-sm">Task Title</Label>
                  <Input name="title" required placeholder="e.g. Finish physics lab report" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm">Description</Label>
                  <Textarea name="description" placeholder="Any notes..." className="resize-none h-20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm">Priority</Label>
                    <Select name="priority" defaultValue="Medium">
                      <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5"></div>
                  <div className="space-y-1.5">
                    <Label className="text-sm">Due Date</Label>
                    <Input type="date" name="date" required defaultValue={selectedDay ? `${selectedDay.getFullYear()}-${String(selectedDay.getMonth() + 1).padStart(2, '0')}-${String(selectedDay.getDate()).padStart(2, '0')}` : undefined} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm">Time</Label>
                    <Input type="time" name="time" required />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <LoadingButton type="submit" loading={creatingTask} loadingText="Adding..." className="w-full sm:w-auto px-8">Add Task</LoadingButton>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[600px]">
            <h3 className="text-sm font-semibold text-muted-foreground">
              {selectedDay ? selectedDay.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }) : "Upcoming Deadlines"}
            </h3>
            {agendaItems.length === 0 ? (
              <div className="text-center p-6 border border-dashed border-border bg-card rounded-lg text-sm text-muted-foreground">
                {selectedDay ? "Nothing due on this day." : "No upcoming deadlines!"}
              </div>
            ) : (
              agendaItems.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setSelectedItem(item)}
                  className={`p-3 rounded-lg border flex gap-3 cursor-pointer transition-colors bg-card hover:bg-muted/40`}
                >
                  <div className="mt-0.5 shrink-0">
                    {getStatusIcon(item.data.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-foreground truncate">{item.data.title}</h4>
                    {item.data.description && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5 opacity-80">
                        {item.data.description}
                      </p>
                    )}
                    <div className="text-xs text-muted-foreground flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {dateFormatter.format(item.date)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Item Modal */}
        <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
          <DialogContent>
            {selectedItem && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedItem.data.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4 text-sm">
                  {selectedItem.data.description && (
                    <div className="p-3 bg-muted/50 rounded-md whitespace-pre-wrap text-muted-foreground border">
                      {selectedItem.data.description}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                    <div>
                      <span className="font-semibold text-muted-foreground block mb-1">Status</span>
                      <span className="flex items-center gap-1.5 capitalize">
                        {getStatusIcon(selectedItem.data.status)}
                        {selectedItem.data.status.replace("_", " ")}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-muted-foreground block mb-1">Due Date & Time</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {dateFormatter.format(selectedItem.date)}
                      </span>
                    </div>

                    <div>
                      <span className="font-semibold text-muted-foreground block mb-1">Priority</span>
                      <span className="capitalize">{selectedItem.data.priority}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
