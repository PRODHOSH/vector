"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

// Opens an item (e.g. an edit dialog) when the page is reached via ?focus=<id>
// (from global command palette search results), then strips the param.
export function useFocusItem<T extends { id: string }>(items: T[], onFound: (item: T) => void) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const focusId = searchParams.get("focus");
    if (!focusId) return;
    const item = items.find((i) => i.id === focusId);
    if (item) onFound(item);
    router.replace(pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
}
