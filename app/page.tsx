"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, LayoutGrid, CalendarDays, BarChart3, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { LandingMockupSection } from "@/components/ui/landing-mockup-section";
import { Integrations } from "@/components/ui/integrations-4-2";
import { NoveltyBento } from "@/components/ui/novelty-bento";
import { LandingScrollSection } from "@/components/ui/landing-scroll-section";

export default function LandingPage() {
  return (
    <div className="bg-[#f9fafb] text-[#0a1b33] min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
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

      {/* Device Mockup Showcase Section */}
      <LandingMockupSection />

      {/* Sticky Scroll Section */}
      <LandingScrollSection />

      {/* Novelty Bento Section */}
      <NoveltyBento />

      {/* Integrations Section */}
      <div className="mt-24 mb-12">
        <Integrations />
      </div>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200/60 pt-20 overflow-hidden flex flex-col relative z-10">
        <div className="w-full max-w-[1400px] mx-auto px-8 md:px-12 flex flex-col gap-12 z-20">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8">
            <div className="md:col-span-2 space-y-6">
              <Image src="/vector-logo-text.png" alt="Vector" width={140} height={40} className="object-contain" />
              <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                The ultimate operating system for students. Organize your assignments, master your schedule, and take control of your academic life.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900">Product</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Tasks</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Calendar</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Integrations</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900">Resources</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Student Guides</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Community</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Blog</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900">Company</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li><Link href="#" className="hover:text-blue-600 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 pb-4 border-t border-slate-100">
            <p className="text-sm text-slate-400">© 2026 Vector OS. All rights reserved.</p>
            <div className="flex gap-4 text-sm text-slate-400 mt-4 md:mt-0 relative z-20">
              <Link href="#" className="hover:text-slate-800 transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-slate-800 transition-colors">GitHub</Link>
            </div>
          </div>
        </div>

        {/* Giant Watermark Logo - Absolute Bottom inside Footer */}
        <div className="absolute bottom-0 left-0 w-full flex justify-center items-end pointer-events-none select-none z-0 overflow-hidden">
          <Image 
            src="/vector-logo-text.png" 
            alt="Vector" 
            width={2400} 
            height={800} 
            className="w-[120%] md:w-full max-w-[2000px] h-auto object-contain opacity-[0.03] translate-y-[30%]" 
            unoptimized 
          />
        </div>
      </footer>
    </div>
  );
}
