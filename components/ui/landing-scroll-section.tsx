"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "01",
    title: "Clear your mind with Tasks",
    description: "The fastest way to get tasks out of your head. Kanban boards, list views, and seamless priority tracking.",
    visual: (
      <div className="w-full h-full flex items-center justify-start relative pl-4 md:pl-12">
        {/* Desktop Image */}
        <div className="relative z-10 w-[600px] md:w-[900px] lg:w-[1100px] shrink-0 max-w-none shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] rounded-2xl overflow-hidden border border-slate-200/20">
          <Image src="/home-section/tasks-dashboard-laptop.png" alt="Tasks Desktop" width={1600} height={1000} className="w-full h-auto object-cover rounded-2xl" />
        </div>
      </div>
    ),
  },
  {
    id: "02",
    title: "Master your schedule",
    description: "A smart calendar that automatically syncs your deadlines. Never miss another literature essay or calculus exam.",
    visual: (
      <div className="w-full h-full flex items-center justify-start relative pl-4 md:pl-12">
        {/* Desktop Image */}
        <div className="relative z-10 w-[600px] md:w-[900px] lg:w-[1100px] shrink-0 max-w-none shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] rounded-2xl overflow-hidden border border-slate-200/20">
          <Image src="/home-section/calendar-dashboard-laptop.png" alt="Calendar Desktop" width={1600} height={1000} className="w-full h-auto object-cover rounded-2xl" />
        </div>
      </div>
    ),
  },
  {
    id: "03",
    title: "Customize everything",
    description: "Adjust settings, manage your profile, and tweak your experience to perfectly match your study habits.",
    visual: (
      <div className="w-full h-full flex items-center justify-start relative pl-4 md:pl-12">
        {/* Desktop Image */}
        <div className="relative z-10 w-[600px] md:w-[900px] lg:w-[1100px] shrink-0 max-w-none shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] rounded-2xl overflow-hidden border border-slate-200/20">
          <Image src="/home-section/settings-dashboard-laptop.png" alt="Settings Desktop" width={1600} height={1000} className="w-full h-auto object-cover rounded-2xl" />
        </div>
      </div>
    ),
  }
];

export function LandingScrollSection() {
  const [activeFeature, setActiveFeature] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const elements = containerRef.current.querySelectorAll('.feature-text-block');
      const viewportHeight = window.innerHeight;
      
      let closestIndex = 0;
      let minDistance = Infinity;

      elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const distanceToCenter = Math.abs(rect.top + rect.height / 2 - viewportHeight / 2);
        
        if (distanceToCenter < minDistance) {
          minDistance = distanceToCenter;
          closestIndex = index;
        }
      });

      if (closestIndex !== activeFeature) {
        setActiveFeature(closestIndex);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeFeature]);

  return (
    <section className="w-full max-w-[1200px] mx-auto px-6 py-24" ref={containerRef}>
      <div className="flex flex-col md:flex-row gap-12 lg:gap-24">
        {/* Left Side: Scrolling Content */}
        <div className="w-full md:w-1/2 flex flex-col">
          {features.map((feature, idx) => (
            <div 
              key={feature.id} 
              className={cn(
                "feature-text-block min-h-[50vh] flex flex-col justify-center transition-opacity duration-500",
                activeFeature === idx ? "opacity-100" : "opacity-30"
              )}
            >
              <div className="text-[#0a1b33]/20 font-display text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                {feature.id}
              </div>
              <h3 className="text-[#0a1b33] text-3xl md:text-4xl font-semibold tracking-tight mb-4 leading-tight">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-md">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Right Side: Sticky Visual */}
        <div className="hidden md:block w-full md:w-1/2">
          <div className="sticky top-32 h-[600px] w-full rounded-3xl transition-all duration-700 ease-in-out">
            {features.map((feature, idx) => (
              <div
                key={feature.id}
                className={cn(
                  "absolute inset-0 transition-all duration-700 ease-in-out",
                  activeFeature === idx ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0 pointer-events-none"
                )}
              >
                {feature.visual}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
