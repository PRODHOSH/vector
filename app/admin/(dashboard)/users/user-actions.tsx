"use client";

import { useState } from "react";
import { MoreHorizontal, Shield, ShieldOff, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { toggleUserRole, deleteUser, updateUser } from "./actions";

interface UserActionsProps {
  userId: string;
  isAdmin: boolean;
  currentUserId: string;
  initialName?: string;
  initialEmail?: string;
}

export function UserActions({ userId, isAdmin, currentUserId, initialName = "", initialEmail = "" }: UserActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState(initialName);
  const [editEmail, setEditEmail] = useState(initialEmail);
  const isSelf = userId === currentUserId;

  const handleToggleRole = async () => {
    setIsLoading(true);
    try {
      await toggleUserRole(userId, isAdmin);
      toast.success(`User is now ${!isAdmin ? 'an Admin' : 'a Student'}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update user role");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) return;
    
    setIsLoading(true);
    try {
      await deleteUser(userId);
      toast.success("User deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateUser(userId, { full_name: editName, email: editEmail });
      toast.success("User details updated successfully");
      setIsEditDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update the user's name or email address here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger 
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
          disabled={isLoading}
        >
          <span className="sr-only">Open menu</span>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
          </DropdownMenuGroup>
          
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
            Edit User
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(userId)}>
            Copy User ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          
          {!isSelf && (
            <>
              <DropdownMenuItem onClick={handleToggleRole}>
                {isAdmin ? (
                  <>
                    <ShieldOff className="mr-2 h-4 w-4" />
                    Remove Admin
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Make Admin
                  </>
                )}
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
