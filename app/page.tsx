"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, LayoutGrid, CalendarDays, BarChart3, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { Integrations } from "@/components/ui/integrations-4-2";

export default function LandingPage() {
  return (
    <div className="bg-[#f9fafb] text-[#0a1b33] min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900 pb-24">
      {/* Main Hero Container */}
      <div className="relative w-full max-w-[1400px] mx-auto mt-4 md:mt-6 rounded-[48px] bg-white border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden h-[calc(100vh-2rem)] min-h-[600px] max-h-[850px] flex flex-col">
        {/* Background Video Layer */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none bg-slate-50">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105 transition-transform duration-1000 opacity-60 mix-blend-luminosity"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-white/30 mix-blend-overlay"></div>
        </div>

        {/* Top Navbar (Inside Hero) */}
        <nav className="relative z-20 w-full px-8 md:px-12 py-8 flex items-center justify-between shrink-0">
          <div className="flex items-center">
            <Image src="/vector-logo-text.png" alt="Vector Logo" width={120} height={40} className="object-contain" />
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 mr-4">
              <Link href="#" className="text-sm font-semibold text-slate-500 hover:text-[#0a1b33] transition-colors">Features</Link>
              <Link href="#" className="text-sm font-semibold text-slate-500 hover:text-[#0a1b33] transition-colors">Manifesto</Link>
            </div>
            <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-[#0a1b33] transition-colors">Log in</Link>
            <Link href="/login" className="bg-[#0a152d] text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#1a2b4b] transition-colors shadow-lg shadow-blue-900/20">
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Text Content */}
        <div className="relative z-20 flex-1 px-8 md:px-16 flex flex-col justify-center items-start text-left w-full md:w-[55%] pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/80 border border-blue-200/50 text-blue-700 text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-sm shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Vector OS is live
            </div>
            
            <h1 className="font-display text-[42px] md:text-[64px] font-semibold tracking-tight text-[#0a1b33] leading-[1.05] mb-6 max-w-2xl">
              Your academic life,<br />finally organized.
            </h1>
            
            <p className="font-sans text-[15px] md:text-[17px] text-[#64748b] max-w-lg leading-relaxed mb-10">
              Kanban boards, deadline tracking, and a smart calendar — all in one premium dashboard. 
              Built for students who want to stop losing track and start shipping work.
            </p>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/dashboard" className="inline-flex items-center justify-center bg-[#0a152d] text-white px-8 py-3.5 rounded-full text-[15px] font-medium hover:bg-black transition-colors shadow-xl shadow-slate-900/10 gap-2">
                Start for free
                <ChevronRight className="h-4 w-4 opacity-70" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Integrations Section */}
      <Integrations />

      {/* Features Section */}
      <div className="max-w-[1200px] mx-auto mt-32 px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4">Everything you need to succeed</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">Vector combines the best task management paradigms into one cohesive, lightning-fast application.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group rounded-[32px] bg-white border border-slate-200/60 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
              <LayoutGrid className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Kanban Boards</h3>
            <p className="text-slate-500 leading-relaxed text-sm">Visualize your workflow with drag-and-drop boards. Move assignments from To-Do to Done with satisfying speed.</p>
          </div>
          
          <div className="group rounded-[32px] bg-white border border-slate-200/60 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 transition-transform">
              <CalendarDays className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Calendar</h3>
            <p className="text-slate-500 leading-relaxed text-sm">Never miss a deadline. Your tasks automatically sync to a beautiful, unified calendar view.</p>
          </div>

          <div className="group rounded-[32px] bg-white border border-slate-200/60 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Analytics</h3>
            <p className="text-slate-500 leading-relaxed text-sm">Track your productivity trends, see how many tasks you&apos;ve completed, and stay motivated to do more.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full mt-32 border-t border-slate-200/60 pt-20 pb-8 flex flex-col items-center overflow-hidden">
        {/* Giant Watermark Logo */}
        <div className="w-full max-w-[1200px] mx-auto px-6 mb-16 flex justify-center pointer-events-none select-none opacity-[0.04]">
          <Image 
            src="/vector-logo-text.png" 
            alt="Vector" 
            width={1200} 
            height={400} 
            className="w-full h-auto object-contain" 
            unoptimized 
          />
        </div>
        
        {/* Bottom Links */}
        <div className="w-full max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Image src="/icon.png" alt="Vector" width={24} height={24} className="opacity-80" />
            <span className="font-semibold text-slate-800">Vector OS</span>
          </div>
          <p className="text-sm text-slate-400">© 2026 Vector. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-slate-400 font-medium">
            <Link href="#" className="hover:text-slate-800 transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-slate-800 transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-slate-800 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
