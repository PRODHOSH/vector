"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/utils/supabase/client";
import { Logo } from "@/components/logo";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleOAuthLogin = async (provider: "google" | "github") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      setEmailSent(true);
      toast.success("Check your email to confirm your account!");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/settings/password`,
    });
    setIsLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password reset link sent to your email!");
      setIsResetMode(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white font-sans text-black overflow-hidden">
      <div 
        className={`flex w-full min-h-screen transition-all duration-700 ease-in-out ${activeTab === "signin" && !isResetMode ? "flex-col lg:flex-row" : "flex-col lg:flex-row-reverse"}`}
      >
        {/* Visual Branding Panel */}
        <div 
          className="hidden lg:flex lg:w-1/2 relative bg-zinc-50 border-r border-zinc-200 p-12 flex-col justify-between overflow-hidden"
        >
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none bg-white">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover scale-105"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent"></div>
          </div>

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center text-sm font-semibold text-zinc-500 hover:text-black transition-colors mb-12 bg-white/50 px-3 py-1.5 rounded-full backdrop-blur-sm w-fit">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            
            <div className="mt-20">
              <h1 className="font-display text-5xl font-bold tracking-tight text-black leading-tight mb-6 drop-shadow-sm">
                {isResetMode ? "Reset Password." : activeTab === "signin" ? "Welcome to Vector." : "Join Vector OS."}
              </h1>
              <p className="text-lg text-black/70 max-w-md leading-relaxed font-medium drop-shadow-sm">
                {isResetMode
                  ? "Don't worry, we'll help you get back into your account and manage your tasks."
                  : activeTab === "signin" 
                  ? "Log in to manage your tasks, track your deadlines, and unlock your academic potential."
                  : "Create an account to start managing your tasks, tracking deadlines, and unlocking your academic potential."}
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center mt-auto">
            <Image src="/vector-logo-text.png" alt="Vector" width={140} height={40} className="object-contain" unoptimized />
          </div>
        </div>

        {/* Authentication Forms Panel */}
        <div 
          className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24 bg-white z-10 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)] lg:shadow-none"
        >
          <div className="mx-auto w-full max-w-sm">
            {/* Mobile Back Button & Logo */}
            <div className="flex lg:hidden items-center justify-between mb-10">
              <Link href="/" className="inline-flex items-center text-sm font-semibold text-zinc-500 hover:text-black transition-colors">
                <ChevronLeft className="mr-1 h-4 w-4" />
                Home
              </Link>
              <Image src="/vector-logo-text.png" alt="Vector" width={120} height={32} className="object-contain" unoptimized />
            </div>

            <div className="mb-8">
              <h2 className="font-display text-3xl font-bold tracking-tight mb-2 text-black">
                {isResetMode ? "Forgot Password" : "Get Started"}
              </h2>
              <p className="text-zinc-500 text-sm">
                {isResetMode ? "Enter your email to receive a password reset link." : "Sign in to your account or create a new one."}
              </p>
            </div>

            {emailSent ? (
              <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 text-center animate-in fade-in zoom-in duration-300">
                <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-zinc-200">
                  <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-black mb-2">Check your email</h3>
                <p className="text-zinc-500 text-sm mb-6">We sent a confirmation link to <strong>{email}</strong>. Please click the link to activate your account.</p>
                <Button onClick={() => setEmailSent(false)} variant="outline" className="w-full rounded-full border-zinc-200 bg-white text-black hover:bg-zinc-100 dark:bg-white dark:text-black dark:border-zinc-200 dark:hover:bg-zinc-100">
                  Back to login
                </Button>
              </div>
            ) : isResetMode ? (
              <form onSubmit={handleResetPassword} className="space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="space-y-2">
                  <Label htmlFor="email-reset" className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">Email Address</Label>
                  <Input 
                    id="email-reset" 
                    type="email" 
                    placeholder="you@example.com" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl bg-white border-zinc-200 focus-visible:ring-black text-black placeholder:text-zinc-400 dark:bg-white dark:border-zinc-200 dark:text-black dark:placeholder:text-zinc-400" 
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-full bg-black text-white hover:bg-zinc-800 dark:bg-black dark:text-white dark:hover:bg-zinc-800 font-semibold shadow-lg shadow-black/10 mt-2 transition-all border-none">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Send Reset Link <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button type="button" onClick={() => setIsResetMode(false)} variant="outline" className="w-full h-12 rounded-full border-zinc-200 bg-white text-black hover:bg-zinc-100 dark:bg-white dark:text-black dark:border-zinc-200 dark:hover:bg-zinc-100 mt-2">
                  Back to login
                </Button>
              </form>
            ) : (
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "signin" | "signup")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-zinc-100 dark:bg-zinc-100 p-1 rounded-full">
                  <TabsTrigger value="signin" className="rounded-full text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-black text-zinc-500 dark:text-zinc-500 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black data-[state=active]:shadow-sm transition-all">Sign In</TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-full text-sm font-semibold data-[state=active]:bg-white data-[state=active]:text-black text-zinc-500 dark:text-zinc-500 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black data-[state=active]:shadow-sm transition-all">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="space-y-6">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="you@example.com" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 rounded-xl bg-white border-zinc-200 focus-visible:ring-black text-black placeholder:text-zinc-400 dark:bg-white dark:border-zinc-200 dark:text-black dark:placeholder:text-zinc-400" 
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">Password</Label>
                        <button type="button" onClick={() => setIsResetMode(true)} className="text-xs font-semibold text-black hover:underline cursor-pointer">Forgot?</button>
                      </div>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 rounded-xl bg-white border-zinc-200 focus-visible:ring-black text-black placeholder:text-zinc-400 dark:bg-white dark:border-zinc-200 dark:text-black dark:placeholder:text-zinc-400" 
                      />
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-full bg-black text-white hover:bg-zinc-800 dark:bg-black dark:text-white dark:hover:bg-zinc-800 font-semibold shadow-lg shadow-black/10 mt-2 transition-all border-none">
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Sign In <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="space-y-6">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">Full Name</Label>
                      <Input 
                        id="name" 
                        type="text" 
                        placeholder="John Doe" 
                        required 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="h-12 rounded-xl bg-white border-zinc-200 focus-visible:ring-black text-black placeholder:text-zinc-400 dark:bg-white dark:border-zinc-200 dark:text-black dark:placeholder:text-zinc-400" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-up" className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">Email Address</Label>
                      <Input 
                        id="email-up" 
                        type="email" 
                        placeholder="you@example.com" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 rounded-xl bg-white border-zinc-200 focus-visible:ring-black text-black placeholder:text-zinc-400 dark:bg-white dark:border-zinc-200 dark:text-black dark:placeholder:text-zinc-400" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-up" className="text-xs font-bold text-zinc-500 dark:text-zinc-500 uppercase tracking-wider">Password</Label>
                      <Input 
                        id="password-up" 
                        type="password" 
                        placeholder="••••••••" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-12 rounded-xl bg-white border-zinc-200 focus-visible:ring-black text-black placeholder:text-zinc-400 dark:bg-white dark:border-zinc-200 dark:text-black dark:placeholder:text-zinc-400" 
                      />
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-full bg-black text-white hover:bg-zinc-800 dark:bg-black dark:text-white dark:hover:bg-zinc-800 font-semibold shadow-lg shadow-black/10 mt-2 transition-all border-none">
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Create Account <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>

                {/* Shared OAuth Section */}
                <div className="mt-8 relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-200 dark:border-zinc-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 font-semibold text-zinc-400 dark:text-zinc-400">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <Button variant="outline" onClick={() => handleOAuthLogin("google")} className="h-11 rounded-xl bg-white text-black border-zinc-200 hover:bg-zinc-100 dark:bg-white dark:text-black dark:border-zinc-200 dark:hover:bg-zinc-100 font-semibold transition-all">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" onClick={() => handleOAuthLogin("github")} className="h-11 rounded-xl bg-white text-black border-zinc-200 hover:bg-zinc-100 dark:bg-white dark:text-black dark:border-zinc-200 dark:hover:bg-zinc-100 font-semibold transition-all">
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    GitHub
                  </Button>
                </div>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
