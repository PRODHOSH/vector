import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Vector",
  description: "Privacy Policy for Vector OS.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-blue-100 selection:text-blue-900">
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/vector-logo-text.png" alt="Vector" width={100} height={28} className="object-contain" unoptimized />
          </Link>
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-black transition-colors inline-flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          <p><strong>Last Updated: September 16, 2026</strong></p>
          
          <h2 className="text-xl font-semibold text-black mt-10 mb-4">1. Introduction</h2>
          <p>Welcome to Vector OS ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and share your information when you use our task management platform.</p>

          <h2 className="text-xl font-semibold text-black mt-10 mb-4">2. Information We Collect</h2>
          <p>We collect personal information that you voluntarily provide to us when you register on the application, express an interest in obtaining information about us or our products and services, or otherwise when you contact us.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Personal Information:</strong> Email address, name, and password.</li>
            <li><strong>Task Data:</strong> Content, titles, priorities, and deadlines of the tasks you create.</li>
            <li><strong>Integration Data:</strong> If you connect third-party services (like Google Calendar), we may receive access tokens to sync your data.</li>
          </ul>

          <h2 className="text-xl font-semibold text-black mt-10 mb-4">3. How We Use Your Information</h2>
          <p>We use the information we collect or receive to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Facilitate account creation and logon process.</li>
            <li>Provide and operate the Vector OS platform.</li>
            <li>Sync your tasks with external calendars (if enabled).</li>
            <li>Send you administrative information and notifications regarding your tasks.</li>
          </ul>

          <h2 className="text-xl font-semibold text-black mt-10 mb-4">4. Sharing Your Information</h2>
          <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We do not sell your personal data to third parties.</p>

          <h2 className="text-xl font-semibold text-black mt-10 mb-4">5. Data Security</h2>
          <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process, including secure databases hosted via Supabase.</p>

          <h2 className="text-xl font-semibold text-black mt-10 mb-4">6. Contact Us</h2>
          <p>If you have questions or comments about this notice, you may email us at privacy@vector.prodhosh.me.</p>
        </div>
      </main>

      <footer className="border-t border-slate-100 py-10 mt-20">
        <div className="max-w-4xl mx-auto px-6 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} Vector OS. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
