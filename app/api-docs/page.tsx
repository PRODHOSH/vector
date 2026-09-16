"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/vector-logo-text.png"
                alt="Vector"
                width={100}
                height={28}
                className="object-contain"
                unoptimized
              />
            </Link>
            <span className="text-slate-300">|</span>
            <span className="text-sm font-semibold text-slate-600 tracking-wide uppercase">
              API Docs
            </span>
            <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-mono">
              v1.0.0
            </span>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-slate-500 hover:text-black transition-colors inline-flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Swagger UI */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <SwaggerUI url="/api/openapi" docExpansion="list" />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 mt-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-slate-400">
          &copy; {new Date().getFullYear()} Vector OS &mdash; API Documentation &mdash;{" "}
          <a
            href="mailto:support@prodhosh.me"
            className="hover:text-slate-600 transition-colors"
          >
            support@prodhosh.me
          </a>
        </div>
      </footer>

      {/* Override Swagger UI styling to match Vector OS theme */}
      <style>{`
        .swagger-ui .topbar { display: none; }
        .swagger-ui .info .title { font-family: inherit; }
        .swagger-ui .btn.execute { background: #111111; border-color: #111111; }
        .swagger-ui .btn.execute:hover { background: #333333; border-color: #333333; }
        .swagger-ui .opblock.opblock-get .opblock-summary-method { background: #0369a1; }
        .swagger-ui .opblock.opblock-post .opblock-summary-method { background: #15803d; }
        .swagger-ui .opblock.opblock-delete .opblock-summary-method { background: #b91c1c; }
        .swagger-ui .scheme-container { background: #f9fafb; box-shadow: none; border: 1px solid #e2e8f0; border-radius: 8px; }
        .swagger-ui select, .swagger-ui input[type=text], .swagger-ui textarea { border-radius: 6px; }
        .swagger-ui .model-box { border-radius: 8px; }
      `}</style>
    </div>
  );
}
