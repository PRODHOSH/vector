"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateProfile } from "@/app/actions/profile-actions";
import { Loader2, Upload } from "lucide-react";

export function SettingsForm({ initialName, initialAvatar }: { initialName: string, initialAvatar: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>(initialAvatar);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarPreview(url);
    }
  };

  const actionWithLoading = async (formData: FormData) => {
    setIsLoading(true);
    try {
      await updateProfile(formData);
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form action={actionWithLoading} className="space-y-6">
      <div className="flex flex-col gap-3">
        <Label>Profile Picture</Label>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border bg-background">
            <AvatarImage src={avatarPreview} />
            <AvatarFallback>{initialName.substring(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <Label htmlFor="avatar" className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
              <Upload className="h-4 w-4" />
              Upload Image
            </Label>
            <Input id="avatar" name="avatar" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input id="full_name" name="full_name" defaultValue={initialName} required />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </form>
  );
}
