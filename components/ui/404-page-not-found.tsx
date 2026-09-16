"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  const router = useRouter();
  
  return (
    <section className="bg-[#f9fafb] text-[#0a1b33] font-sans min-h-screen flex items-center justify-center">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full sm:w-10/12 md:w-8/12 text-center flex flex-col items-center">
            <div
              className="bg-[url('https://cdn.21st.dev/assets/mirror/35/354f63f88b57aceea4536df0c0cff0c3592aa46fe887ff910751fefc12f3e76c.gif')] h-[250px] sm:h-[350px] md:h-[400px] w-full max-w-[600px] bg-center bg-no-repeat bg-contain"
              aria-hidden="true"
            >
              <h1 className="text-center text-[#0a1b33] text-6xl sm:text-7xl md:text-8xl pt-6 sm:pt-8 font-display font-bold">
                404
              </h1>
            </div>

            <div className="mt-[-50px]">
              <h3 className="text-2xl sm:text-3xl font-display font-semibold mb-4 text-[#0a1b33]">
                Looks like you're lost
              </h3>
              <p className="mb-6 sm:mb-8 text-slate-500 max-w-md mx-auto">
                The page you are looking for is not available or has been moved!
              </p>

              <Button
                variant="default"
                onClick={() => router.push("/")}
                className="bg-[#0a152d] text-white hover:bg-black rounded-full px-8 py-6 text-sm font-medium shadow-xl shadow-slate-900/10"
              >
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
