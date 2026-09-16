"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

// Opens a create dialog when the page is reached via ?new=1 (e.g. from the
// command palette's "New Task" / "New Project" entries), then strips the
// param so back/forward navigation or a refresh doesn't re-trigger it.
export function useAutoOpenOnQueryParam(open: () => void) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      open();
      router.replace(pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
}
