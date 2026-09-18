"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, Users, Mail, Search } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

export function EmailForm({ users }: { users: Profile[] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [fromName, setFromName] = useState("Vector Admin");
  const [fromEmail, setFromEmail] = useState("internal@prodhosh.me");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  // Combobox state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Extract the current search term (the last part of the comma-separated string)
  const currentSearchTerm = to.split(",").pop()?.trim() || "";

  // Filter users based on current search term
  const filteredUsers = users.filter(user => 
    user.email && (
      user.email.toLowerCase().includes(currentSearchTerm.toLowerCase()) || 
      (user.full_name && user.full_name.toLowerCase().includes(currentSearchTerm.toLowerCase()))
    )
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserSelect = (email: string) => {
    const parts = to.split(",");
    parts.pop(); // Remove the partial typed search term
    const newTo = parts.length > 0 ? `${parts.join(",")}, ${email}, ` : `${email}, `;
    setTo(newTo);
    setIsDropdownOpen(false);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          fromName,
          fromEmail,
          to, 
          subject, 
          message 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      toast.success("Email sent successfully!");
      setTo("");
      setSubject("");
      setMessage("");
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-border shadow-sm overflow-visible">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" />
          Compose Email
        </CardTitle>
        <CardDescription>
          Send customizable emails to single or multiple users.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSendEmail} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromName">From Name</Label>
              <Input 
                id="fromName" 
                type="text" 
                required 
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                className="bg-zinc-50/50 dark:bg-zinc-900/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fromEmail">From Email</Label>
              <Input 
                id="fromEmail" 
                type="email" 
                required 
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                className="bg-zinc-50/50 dark:bg-zinc-900/50"
              />
            </div>
          </div>

          <div className="space-y-2 relative" ref={dropdownRef}>
            <Label htmlFor="to">To (Comma separated for multiple)</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                id="to" 
                type="text" 
                placeholder="Search users or type multiple emails..." 
                required 
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="pl-9 bg-zinc-50/50 dark:bg-zinc-900/50 transition-shadow focus-visible:ring-primary/20"
                autoComplete="off"
              />
            </div>
            
            {/* Custom Dropdown */}
            {isDropdownOpen && currentSearchTerm && (
              <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95">
                <div className="max-h-60 overflow-y-auto p-1 space-y-1">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <button
                        key={user.id}
                        type="button"
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground text-left transition-colors"
                        onClick={() => handleUserSelect(user.email || "")}
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={user.avatar_url || ""} />
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                            {user.full_name?.substring(0, 1).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col overflow-hidden">
                          <span className="font-medium truncate">{user.full_name || "Unknown"}</span>
                          <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-sm text-center text-muted-foreground">
                      No matching users. Press send to use custom email.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input 
              id="subject" 
              type="text" 
              placeholder="Important Account Update" 
              required 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-zinc-50/50 dark:bg-zinc-900/50"
            />
          </div>
          
          <div className="space-y-2 flex-1 flex flex-col min-h-[400px]">
            <Label htmlFor="message" className="font-semibold">Message</Label>
            <Textarea 
              id="message" 
              placeholder="Type your message here... (Markdown supported)" 
              required 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none flex-1 bg-zinc-50/50 dark:bg-zinc-900/50 font-mono text-sm leading-relaxed p-4"
            />
          </div>
          
          <div className="pt-4 border-t border-border mt-4">
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto px-8 h-12 font-semibold transition-all">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {isLoading ? "Sending Email..." : "Send Email"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
