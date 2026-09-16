import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service | Vector",
  description: "Terms of Service for Vector OS.",
};

export default function TermsPage() {
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
        <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
          <p><strong>Last Updated: September 16, 2026</strong></p>
          
          <h2 className="text-xl font-semibold text-black mt-10 mb-4">1. Agreement to Terms</h2>
          <p>By accessing or using Vector OS, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>

          <h2 className="text-xl font-semibold text-black mt-10 mb-4">2. Description of Service</h2>
          <p>Vector OS provides a task management and organization platform designed for students. The service includes Kanban boards, calendar integrations, and task tracking features.</p>

          <h2 className="text-xl font-semibold text-black mt-10 mb-4">3. User Accounts</h2>
          <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
          <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.</p>

          <h2 className="text-xl font-semibold text-black mt-10 mb-4">4. Acceptable Use</h2>
          <p>You agree not to use the Service:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>In any way that violates any applicable national or international law or regulation.</li>
            <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service.</li>
            <li>To attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Service or the server on which the Service is stored.</li>
          </ul>

          <h2 className="text-xl font-semibold text-black mt-10 mb-4">5. Termination</h2>
          <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

          <h2 className="text-xl font-semibold text-black mt-10 mb-4">6. Changes to Terms</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>

          <h2 className="text-xl font-semibold text-black mt-10 mb-4">7. Contact Us</h2>
          <p>If you have any questions about these Terms, or any issues with the platform, please contact us at <a href="mailto:support@prodhosh.me" className="text-blue-600 hover:underline">support@prodhosh.me</a>.</p>
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
