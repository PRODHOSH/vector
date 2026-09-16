"use client";

import { useTransition, useCallback } from "react";
import { toast } from "sonner";

/**
 * Wraps an async action with loading state + error toasting + startTransition.
 * Usage:
 *   const { run, loading } = useAction();
 *   await run(() => deleteContact(id), "Contact deleted");
 */
export function useAction() {
  const [isPending, startTransition] = useTransition();

  const run = useCallback(
    (
      fn: () => Promise<unknown>,
      successMsg?: string,
      errorMsg?: string
    ) => {
      return new Promise<boolean>((resolve) => {
        startTransition(async () => {
          try {
            const res = await fn();
            
            // Handle gracefully returned errors to avoid Next.js error obfuscation in Server Actions
            if (res && typeof res === "object" && "error" in res && typeof (res as { error: unknown }).error === "string") {
              toast.error(errorMsg ?? (res as { error: string }).error);
              resolve(false);
              return;
            }

            if (successMsg) toast.success(successMsg);
            resolve(true);
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Something went wrong";
            toast.error(errorMsg ?? msg);
            resolve(false);
          }
        });
      });
    },
    []
  );

  return { loading: isPending, run };
}
