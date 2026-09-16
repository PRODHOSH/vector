"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createTask, updateTaskStatus, deleteTask, updateTask } from "@/app/actions/task-actions";
import { CheckCircle2, Clock, Trash2, Plus, Edit2, Search, Circle, CircleDot, LayoutGrid, List } from "lucide-react";
import { PageTransition } from "@/components/ui/page-transition";
import { LoadingButton } from "@/components/ui/loading-button";
import { cn } from "@/lib/utils";
import { useAction } from "@/hooks/use-action";
import { useOptimistic, startTransition } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const COLUMNS = [
  { status: "To Do", dbStatus: "todo", icon: Circle, accent: "text-muted-foreground" },
  { status: "In Progress", dbStatus: "in_progress", icon: CircleDot, accent: "text-blue-500" },
  { status: "Done", dbStatus: "done", icon: CheckCircle2, accent: "text-emerald-500" },
] as const;

function columnFor(dbStatus: string) {
  const col = COLUMNS.find(c => c.dbStatus === dbStatus);
  return col ? col.status : "To Do";
}

function dbStatusFor(status: string) {
  const col = COLUMNS.find(c => c.status === status);
  return col ? col.dbStatus : "todo";
}

function isOverdue(task: any) {
  return !!task.due_date && task.status !== "done" && new Date(task.due_date) < new Date();
}

function toLocalDatetimeString(dateStr: string) {
  if (!dateStr) return "";
  const dateObj = new Date(dateStr);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())}T${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}`;
}

export function TasksClient({ initialTasks: tasks }: { initialTasks: any[] }) {
  const { loading: creatingTask, run: runCreateTask } = useAction();
  const { loading: updatingTask, run: runUpdateTask } = useAction();
  const { run: runStatusChange } = useAction();
  const { run: runDelete } = useAction();
  const [viewType, setViewType] = useState<"kanban" | "list">("kanban");
  const [search, setSearch] = useState("");
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTaskData, setEditTaskData] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [optimisticTasks, setOptimisticTaskStatus] = useOptimistic(
    tasks,
    (state, { taskId, status }: { taskId: string; status: string }) => {
      return state.map((t) => (t.id === taskId ? { ...t, status } : t));
    }
  );

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const dueDate = formData.get("due_date") as string;
    if (dueDate) {
      const d = new Date(dueDate);
      formData.set("dueDateISO", d.toISOString());
    }

    const ok = await runCreateTask(() => createTask(formData), "Task created");
    if (ok) {
      setIsCreateOpen(false);
      window.location.reload(); // Temporary until Server Actions perfectly refresh the nested client state
    }
  };

  const handleUpdateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editTaskData) return;
    const formData = new FormData(e.currentTarget);

    const dueDate = formData.get("due_date") as string;
    if (dueDate) {
      const d = new Date(dueDate);
      formData.set("dueDateISO", d.toISOString());
    }

    const ok = await runUpdateTask(() => updateTask(editTaskData.id, formData), "Task updated");
    if (ok) {
      setEditTaskData(null);
      window.location.reload();
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    const dbStatus = dbStatusFor(newStatus);
    startTransition(() => {
      setOptimisticTaskStatus({ taskId, status: dbStatus });
    });
    await runStatusChange(() => updateTaskStatus(taskId, newStatus), "Status updated");
  };

  const handleDelete = async (taskId: string) => {
    setDeletingId(taskId);
    await runDelete(() => deleteTask(taskId), "Task deleted");
    setDeletingId(null);
    window.location.reload();
  };

  const handleDrop = (status: string) => {
    setDragOverColumn(null);
    if (!draggedTaskId) return;
    const task = optimisticTasks.find((t) => t.id === draggedTaskId);
    if (task && columnFor(task.status) !== status) {
      handleStatusChange(draggedTaskId, status);
    }
    setDraggedTaskId(null);
  };

  const filteredTasks = useMemo(() => {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    return optimisticTasks.filter(task => {
      if (search && !task.title?.toLowerCase().includes(search.toLowerCase())) return false;
      
      // Auto-visibility: hide Done tasks older than 2 weeks by default unless searching
      if (!search && task.status === "done" && task.updated_at) {
        if (new Date(task.updated_at) < twoWeeksAgo) {
          return false;
        }
      }

      return true;
    });
  }, [optimisticTasks, search]);

  const tasksByColumn = useMemo(() => {
    const map: Record<string, any[]> = { "To Do": [], "In Progress": [], "Done": [] };
    filteredTasks.forEach((t) => {
      const col = columnFor(t.status);
      if (map[col]) map[col].push(t);
    });
    return map;
  }, [filteredTasks]);

  return (
    <PageTransition className="flex flex-col h-full gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-1 bg-muted p-1 rounded-lg">
            <Button variant={viewType === "kanban" ? "default" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewType("kanban")}><LayoutGrid className="h-4 w-4" /></Button>
            <Button variant={viewType === "list" ? "default" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewType("list")}><List className="h-4 w-4" /></Button>
          </div>
          <div className="relative w-full max-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks..." className="pl-8 h-8 text-sm" />
          </div>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger render={<Button />}>
            <Plus className="h-4 w-4 mr-2" /> New Task
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Task Title</Label>
                  <Input name="title" required placeholder="e.g. Finish math assignment" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Description</Label>
                  <Textarea name="description" placeholder="Add any details..." className="h-20 resize-none" />
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select name="priority" defaultValue="Medium">
                    <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="datetime-local" name="due_date" />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <LoadingButton type="submit" loading={creatingTask} loadingText="Creating...">Create Task</LoadingButton>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 border border-dashed border-border rounded-lg text-center bg-card">
          <CheckCircle2 className="h-8 w-8 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">{search ? "No matching tasks" : "No tasks yet"}</h3>
          <p className="text-muted-foreground max-w-md text-sm mb-6">
            {search ? `No tasks match "${search}".` : "No tasks have been created yet. Create one to get started."}
          </p>
          {!search && (
            <Button onClick={() => setIsCreateOpen(true)} className="rounded-full">
              <Plus className="h-4 w-4 mr-2" /> Create a Task
            </Button>
          )}
        </div>
      ) : viewType === "kanban" ? (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-x-auto min-h-[400px]">
          {COLUMNS.map(({ status, icon: Icon, accent }) => (
            <div
              key={status}
              onDragOver={(e) => { e.preventDefault(); setDragOverColumn(status); }}
              onDragLeave={() => setDragOverColumn((prev) => (prev === status ? null : prev))}
              onDrop={() => handleDrop(status)}
              className={cn(
                "flex flex-col gap-3 rounded-lg border border-border bg-muted/20 p-3 min-h-[300px] h-full max-h-[calc(100vh-14rem)] transition-colors",
                dragOverColumn === status && "border-primary/50 bg-primary/5"
              )}
            >
              <div className="flex items-center gap-2 px-1">
                <Icon className={cn("h-4 w-4", accent)} />
                <h3 className="text-sm font-semibold">{status}</h3>
                <Badge variant="secondary" className="ml-auto text-xs">{tasksByColumn[status]?.length || 0}</Badge>
              </div>

              <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-1 pb-2">
                {tasksByColumn[status]?.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => setDraggedTaskId(task.id)}
                    onDragEnd={() => setDraggedTaskId(null)}
                    onClick={() => setEditTaskData(task)}
                    className={cn(
                      "group flex flex-col gap-2 rounded-lg border border-border bg-card p-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer active:cursor-grabbing",
                      draggedTaskId === task.id && "opacity-40"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm leading-snug flex-1">{task.title}</h4>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 -mt-1 -mr-1">
                        <Button
                          variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground"
                          onClick={(e) => { e.stopPropagation(); setEditTaskData(task); }}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger render={<Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={(e) => e.stopPropagation()} />}>
                            <Trash2 className="h-3 w-3" />
                          </AlertDialogTrigger>
                          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Task</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;{task.title}&quot;? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <LoadingButton onClick={() => handleDelete(task.id)} loading={deletingId === task.id} loadingText="Deleting..." variant="destructive">
                                Delete
                              </LoadingButton>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"} className="text-[10px] h-5 capitalize">
                        {task.priority}
                      </Badge>
                      {task.due_date && (
                        <span className={cn(
                          "flex items-center gap-1 text-[11px]",
                          isOverdue(task) ? "text-red-600 dark:text-red-400 font-medium" : "text-muted-foreground"
                        )}>
                          <Clock className="h-3 w-3" />
                          {new Date(task.due_date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                          {isOverdue(task) && " · Overdue"}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-end pt-1">
                      {status !== "Done" && (
                        <Select value={status} onValueChange={(val) => val && handleStatusChange(task.id, val)}>
                          <SelectTrigger className="h-6 text-[10px] px-2 border-0 bg-muted w-auto" onClick={(e) => e.stopPropagation()}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {COLUMNS.map((c) => <SelectItem key={c.status} value={c.status}>{c.status}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                ))}
                {(!tasksByColumn[status] || tasksByColumn[status].length === 0) && (
                  <div className="text-xs text-muted-foreground text-center py-6 border border-dashed border-border rounded-lg bg-card/50">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 rounded-md border bg-card overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task Title</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map(task => (
                <TableRow key={task.id} className="cursor-pointer" onClick={() => setEditTaskData(task)}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>
                    <Badge variant={task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"} className="capitalize">
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {task.due_date ? (
                      <span className={cn("text-sm", isOverdue(task) ? "text-red-600 dark:text-red-400 font-medium" : "text-muted-foreground")}>
                        {new Date(task.due_date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <Select value={columnFor(task.status)} onValueChange={(val) => val && handleStatusChange(task.id, val)}>
                      <SelectTrigger className="h-8 text-xs w-[130px]" onClick={(e) => e.stopPropagation()}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {COLUMNS.map((c) => <SelectItem key={c.status} value={c.status}>{c.status}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={(e) => { e.stopPropagation(); setEditTaskData(task); }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={(e) => e.stopPropagation()} />}>
                          <Trash2 className="h-4 w-4" />
                        </AlertDialogTrigger>
                        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Task</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;{task.title}&quot;? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <LoadingButton onClick={() => handleDelete(task.id)} loading={deletingId === task.id} loadingText="Deleting..." variant="destructive">
                              Delete
                            </LoadingButton>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editTaskData} onOpenChange={(open) => !open && setEditTaskData(null)}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editTaskData && (
            <form onSubmit={handleUpdateTask} className="flex flex-col gap-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Task Title</Label>
                  <Input name="title" defaultValue={editTaskData.title} required />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Description</Label>
                  <Textarea name="description" defaultValue={editTaskData.description} className="h-32 resize-none" />
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select name="priority" defaultValue={editTaskData.priority.charAt(0).toUpperCase() + editTaskData.priority.slice(1)}>
                    <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="datetime-local" name="due_date" defaultValue={editTaskData.due_date ? toLocalDatetimeString(editTaskData.due_date) : ""} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border mt-4">
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(editTaskData.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  Last Updated: {new Date(editTaskData.updated_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <LoadingButton type="submit" loading={updatingTask} loadingText="Saving...">Save Changes</LoadingButton>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
