"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const features = [
  {
    num: "01",
    label: "Drag & Drop",
    title: "Kanban Engine",
    className: "md:col-span-2 bg-zinc-100 text-black",
    pillClass: "bg-black text-white -rotate-2 hover:rotate-0",
  },
  {
    num: "02",
    label: "Automated Sync",
    title: "Smart Calendar",
    className: "bg-zinc-900 text-white",
    pillClass: "bg-white text-black rotate-2 hover:rotate-0",
  },
  {
    num: "03",
    label: "Data Driven",
    title: "Analytics Hub",
    className: "bg-white border border-zinc-200 text-black",
    pillClass: "bg-black text-white -rotate-1 hover:rotate-0",
  },
  {
    num: "04",
    label: "Zero Lag",
    title: "Instant Velocity",
    className: "bg-zinc-50 border border-zinc-200 text-black",
    pillClass: "bg-black text-white rotate-1 hover:rotate-0",
  },
  {
    num: "05",
    label: "Distraction Free",
    title: "Monochrome UI",
    className: "bg-black text-white",
    pillClass: "bg-white text-black -rotate-2 hover:rotate-0",
  },
];

export function NoveltyBento() {
  return (
    <section className="w-full max-w-[1200px] mx-auto px-6 mt-32 mb-16">
      <div className="bg-white rounded-[40px] border border-zinc-200/60 p-8 md:p-12 shadow-sm">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          <div className="max-w-md">
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-[#0a1b33] leading-[1.1]">
              Premium features,<br />
              <span className="text-zinc-400">built-in as standard.</span>
            </h2>
            <div className="flex items-center gap-4 mt-6">
              <span className="text-sm font-semibold text-black bg-zinc-100 px-3 py-1 rounded-full">For Students</span>
              <span className="text-sm font-semibold text-black bg-zinc-100 px-3 py-1 rounded-full">100% Free</span>
            </div>
          </div>
          <div className="max-w-xs text-sm text-zinc-500 leading-relaxed font-medium">
            Vector combines the absolute best task management paradigms into one cohesive, lightning-fast application. Say goodbye to bloated interfaces.
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px]">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={cn(
                "relative rounded-3xl p-8 flex flex-col justify-between overflow-hidden group",
                feature.className
              )}
            >
              {/* Giant Number Background */}
              <div className={cn(
                "absolute -right-4 -top-8 font-display text-[160px] font-bold leading-none tracking-tighter opacity-10 select-none transition-transform duration-700 group-hover:scale-110",
                feature.className.includes("text-white") ? "text-white" : "text-black"
              )}>
                {feature.num}
              </div>

              {/* Content */}
              <div className="relative z-10 flex-1 flex flex-col justify-end items-start h-full">
                <span className="text-sm font-semibold mb-3 opacity-70 tracking-wide uppercase">
                  {feature.label}
                </span>
                <div 
                  className={cn(
                    "px-6 py-3 rounded-full font-bold text-lg md:text-xl shadow-lg transition-all duration-300 backdrop-blur-sm cursor-default",
                    feature.pillClass
                  )}
                >
                  {feature.title}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
