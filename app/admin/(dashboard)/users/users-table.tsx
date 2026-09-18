"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { UserActions } from "./user-actions";
import { format } from "date-fns";
import { Search } from "lucide-react";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  updated_at: string;
}

interface UsersTableProps {
  initialProfiles: Profile[];
  currentUserId: string;
}

export function UsersTable({ initialProfiles, currentUserId }: UsersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredProfiles = initialProfiles.filter((profile) => {
    // Search filter
    const matchesSearch = 
      (profile.full_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (profile.email?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (profile.id.toLowerCase().includes(searchQuery.toLowerCase()));

    // Role filter
    const matchesRole = 
      roleFilter === "all" ? true :
      roleFilter === "admin" ? profile.is_admin === true :
      roleFilter === "student" ? profile.is_admin === false : true;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full sm:w-[180px]">
          <Select value={roleFilter} onValueChange={(val) => setRoleFilter(val || "all")}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="student">Students</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-border">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">User</th>
                <th scope="col" className="px-6 py-4 font-medium">Role</th>
                <th scope="col" className="px-6 py-4 font-medium">Joined / Updated</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProfiles.map((profile) => (
                <tr key={profile.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile.avatar_url || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {profile.full_name?.substring(0, 1).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium text-foreground">
                      {profile.full_name || "Unknown User"}
                      <div className="text-xs text-muted-foreground font-normal">
                        {profile.email || `ID: ${profile.id.split('-')[0]}...`}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {profile.is_admin ? (
                      <Badge variant="default" className="bg-primary/10 text-primary hover:bg-primary/20 border-0">Admin</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground hover:bg-secondary/80 border-0">Student</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {format(new Date(profile.updated_at), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <UserActions 
                      userId={profile.id} 
                      isAdmin={profile.is_admin} 
                      currentUserId={currentUserId} 
                      initialName={profile.full_name || ""}
                      initialEmail={profile.email || ""}
                    />
                  </td>
                </tr>
              ))}
              {(!filteredProfiles || filteredProfiles.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
