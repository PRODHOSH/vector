"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Loader2, RefreshCw, XCircle } from "lucide-react";
import { useAction } from "@/hooks/use-action";

export function IntegrationsCard({ isConnected }: { isConnected: boolean }) {
  const [syncing, setSyncing] = useState(false);
  
  const handleConnect = () => {
    window.location.href = "/api/integrations/google";
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/calendar/sync");
      if (res.ok) {
        alert("Calendar synced successfully!");
        window.location.reload();
      } else {
        alert("Failed to sync calendar.");
      }
    } catch (e) {
      alert("Error syncing calendar.");
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("Are you sure you want to disconnect Google Calendar?")) return;
    setSyncing(true);
    try {
      const res = await fetch("/api/integrations/google/disconnect", { method: "POST" });
      if (res.ok) {
        window.location.reload();
      }
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-sm">Google Calendar</h3>
            <p className="text-sm text-muted-foreground">
              {isConnected ? "Connected to your Google account." : "Sync your tasks and events one-way."}
            </p>
          </div>
        </div>
        
        <div>
          {!isConnected ? (
            <Button variant="outline" size="sm" onClick={handleConnect}>
              Connect
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSync} disabled={syncing}>
                {syncing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Sync Now
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDisconnect} title="Disconnect" disabled={syncing}>
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
