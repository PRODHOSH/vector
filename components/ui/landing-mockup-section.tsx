"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function LandingMockupSection() {
  return (
    <section className="relative w-full max-w-[1400px] mx-auto pt-16 pb-32 px-4 overflow-visible">
      <div className="relative w-full max-w-5xl mx-auto flex items-end justify-center min-h-[400px] md:min-h-[600px]">
        {/* Glow behind the mockups */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        
        {/* Tablet / Fold (Left) */}
        <motion.div
          initial={{ opacity: 0, x: 50, y: 30 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute z-20 w-[32%] md:w-[28%] max-w-[320px] left-[2%] md:left-[2%] -bottom-[5%] md:-bottom-[8%]"
        >
          <div className="relative w-full pb-[130%] drop-shadow-2xl hover:-translate-y-2 transition-transform duration-500">
            <Image 
              src="/mockup/galaxy-fold.png" 
              alt="Vector on Galaxy Fold" 
              fill 
              className="object-contain object-bottom"
              priority
            />
          </div>
        </motion.div>

        {/* Laptop (Center) */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-[85%] md:w-[80%] max-w-[900px] mb-[5%]"
        >
          <div className="relative w-full pb-[65%] drop-shadow-[0_30px_60px_rgba(0,0,0,0.2)] hover:-translate-y-1 transition-transform duration-500">
            <Image 
              src="/mockup/macbook.png" 
              alt="Vector on MacBook" 
              fill 
              className="object-contain object-bottom"
              priority
            />
          </div>
        </motion.div>

        {/* Mobile (Right) */}
        <motion.div
          initial={{ opacity: 0, x: -50, y: 40 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="absolute z-30 w-[22%] md:w-[18%] max-w-[200px] right-[2%] md:right-[5%] -bottom-[2%] md:-bottom-[5%]"
        >
          <div className="relative w-full pb-[200%] drop-shadow-2xl hover:-translate-y-2 transition-transform duration-500">
            <Image 
              src="/mockup/mobile.png" 
              alt="Vector on Mobile" 
              fill 
              className="object-contain object-bottom"
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* Cool Description & Social Proof */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mt-24 md:mt-32 text-center max-w-4xl mx-auto space-y-10"
      >
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">
            Join thousands of highly effective students
          </h2>
          <p className="text-lg text-slate-500 font-medium">
            Seamlessly sync your workload across every device you own. Never miss a deadline again.
          </p>
        </div>
        
        <div className="pt-6 flex flex-wrap items-center justify-center gap-x-12 md:gap-x-16 gap-y-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
           <span className="font-display font-extrabold text-2xl tracking-tighter uppercase">VIT</span>
           <span className="font-serif italic font-bold text-2xl">Harvard</span>
           <span className="font-display font-black text-2xl tracking-widest uppercase">IIT</span>
           <span className="font-serif font-medium text-2xl tracking-wider uppercase">MIT</span>
           <span className="font-sans font-bold text-2xl tracking-tight uppercase">NIT</span>
        </div>
      </motion.div>
    </section>
  );
}
