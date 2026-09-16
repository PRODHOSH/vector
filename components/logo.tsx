"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

interface LogoProps {
  width: number;
  height: number;
  className?: string;
}

// Dedicated light/dark PNG assets instead of a CSS invert filter — guarantees
// correct contrast regardless of browser/timing quirks around the .dark class.
export function Logo({ width, height, className }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- standard next-themes hydration-mismatch guard
  useEffect(() => setMounted(true), []);

  // Before mount we don't know the resolved theme yet — default to the dark
  // variant since that's this app's defaultTheme, avoiding a flash of the
  // wrong asset for most users.
  const isLight = mounted && resolvedTheme === "light";

  return (
    <Image
      src="/vector-dashboard-logo.png"
      alt="Vector"
      width={width}
      height={height}
      className={className}
      unoptimized
    />
  );
}
