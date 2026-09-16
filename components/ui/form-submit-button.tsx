"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// For forms bound directly via <form action={serverAction}> (no client onSubmit
// handler), where the server action itself calls redirect(). useFormStatus is
// the only way to get pending/loading feedback in that case.
export function FormSubmitButton({ children, loadingText, className, ...props }: React.ComponentProps<typeof Button> & { loadingText?: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className={cn("relative", className)} {...props}>
      {pending && <Loader2 className="h-4 w-4 mr-2 animate-spin shrink-0" />}
      {pending && loadingText ? loadingText : children}
    </Button>
  );
}
