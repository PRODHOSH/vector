# 🚀 Vector OS: The Ultimate Student Operating System

Welcome to the deep-dive documentation for **Vector OS**. This document explains the complete architecture, data models, UI features, automated workflows, and future roadmap that makes this app the ultimate academic companion.

---

## 📑 Index
1. [Login & Onboarding Flow](#1-login--onboarding-flow)
2. [The Core Dashboard](#2-the-core-dashboard)
3. [Google Calendar Integration](#3-google-calendar-integration)
4. [Email Automations](#4-email-automations)
5. [Architecture & Database Schema](#5-architecture--database-schema)
6. [SEO, Analytics, & AI Optimization](#6-seo-analytics--ai-optimization)
7. [Setting Up Locally](#7-setting-up-locally)
8. [Future Roadmap](#8-future-roadmap)

---

## 1. Login & Onboarding Flow

We wanted signing up to be completely frictionless. Vector OS supports standard Email/Password authentication, but heavily promotes **Google OAuth** for a one-click login experience. 

> **Trust & Verification:** Our Google OAuth consent screen is officially verified in the Google Cloud Platform under the branding **"Vector"**, ensuring users see a trusted logo and domain when signing up.

*(Check out the login flow in action below)*  
![Login Flow](/public/readme/login-flow.mp4)

---

## 2. The Core Dashboard

The Home Page and Dashboard are the heart of Vector OS. The UI uses beautiful **shadcn/ui** components and an incredibly legible custom typography stack (`Plus Jakarta Sans`). 

When users first land on the dashboard, they are greeted by an **interactive product tour** (powered by `driver.js`). This automatically walks them through how to add a task, how to change statuses, and where to configure their settings.

Users can add, delete, and drag-and-drop tasks across a beautiful Kanban board. Everything updates instantly without page reloads thanks to our global **Zustand** state management and `framer-motion` animations. Hit `Cmd + K` anywhere to open our global search menu!

*(Check out the landing page and dashboard interactions below)*  
![Home Page Video](/public/readme/home-page.mp4)  
![Dashboard Video](/public/readme/dashboard.mp4)  

---

## 3. Google Calendar Integration

Because schools and colleges heavily rely on Google Calendar for scheduling classes and assignments, we built a native 2-way sync. 

By navigating to Settings, users can securely grant Vector OS permission to read their Google Calendar via the Google Calendar API. 

**Why is this a game changer?**
- As soon as a professor updates a syllabus deadline in Google Calendar, it automatically syncs into the Vector OS Kanban board.
- Students no longer have to manually copy dates from their university portals to their task lists. 
- It keeps the workflow simple, centralized, and impossible to forget.

*(Watch how easy it is to connect your calendar)*  
![Google Calendar Workflow](/public/readme/google-calendar-workflow.mp4)

---

## 4. Email Automations

To make sure students actually get credited for their hard work and never miss a deadline, Vector OS runs background cron jobs (via **Vercel Cron**) to send three distinct, humanized email templates. We explicitly avoided robotic "AI slop" copy; these emails read like a supportive mentor.

<div align="center">
  <table>
    <tr>
      <td align="center" width="33%">
        <img src="/public/readme/deadline-approaching-email.png" alt="Deadline Approaching" /><br>
        <b>🚨 Deadline Approaching</b><br>
        Sent 24 hours before a task is due so you have time to finish it.
      </td>
      <td align="center" width="33%">
        <img src="/public/readme/deadline-passed-email.png" alt="Deadline Passed" /><br>
        <b>💥 Deadline Overdue</b><br>
        A gentle nudge when a deadline slips by, helping you prioritize damage control.
      </td>
      <td align="center" width="33%">
        <img src="/public/readme/weekly-wrapup-email.png" alt="Weekly Wrap-up" /><br>
        <b>🎉 Weekly Wrap-up</b><br>
        Sent every Sunday to celebrate everything you accomplished, and list what's on deck for next week.
      </td>
    </tr>
  </table>
</div>

---

## 5. Architecture & Database Schema

Our tech stack is optimized for the modern edge: **Next.js 14 App Router, Tailwind CSS, Supabase (Postgres & Auth), Zustand, and Resend.**

### The Database
Our PostgreSQL schema is strictly protected by **Row Level Security (RLS)**. No user can read or modify another user's data. 

**Core Tables:**
- `profiles`: Stores user metadata and the `is_admin` flag.
- `tasks`: The central entity. Tracks `status` (todo, in_progress, done), `priority`, `due_date`, and external Google Calendar sync IDs.
- `user_integrations`: Securely stores encrypted OAuth refresh tokens.
- `admin_email_logs`: Tracks broadcast emails sent by administrators.

For a full look at the raw SQL schema, check out [`supabase/schema.sql`](./supabase/schema.sql).

For a complete overview of our backend APIs and Server Actions, check out our **Swagger UI Documentation** at [`vector.prodhosh.me/api-docs`](https://vector.prodhosh.me/api-docs) (or the raw `docs/openapi.yaml`).

---

## 6. SEO, Analytics, & AI Optimization

We treat this like a real production SaaS product:
- **SEO & OG:** Fully configured dynamic Meta Tags, OpenGraph images, and meta descriptions ensure links look beautiful when shared on iMessage, Twitter, or Discord.
- **Google Search Console:** The domain is indexed and visible on Google Search.
- **Analytics:** We use **Google Analytics** and **Vercel Analytics** to track page views and interactions privately.
- **AI-Bots:** We explicitly serve `/llms.txt` and `/llms-full.txt` at the root domain. This makes it incredibly easy for LLM agents (like ChatGPT or Perplexity) to crawl our documentation and understand the app context instantly.

---

## 7. Setting Up Locally

Want to run this yourself? It's simple:

1. Clone the repository.
2. Run `npm install`.
3. Create a Supabase project and run the queries inside `supabase/schema.sql` to initialize your tables.
4. Copy `.env.local.example` to `.env.local` and add your Supabase URL, Anon Key, and Google OAuth credentials.
5. Run `npm run dev` and open `http://localhost:3000`.

*(No need to run complex seed scripts; you can start adding tasks immediately!)*

---

## 8. Future Roadmap

We are constantly expanding the Vector OS ecosystem to simplify student workflows:
- **Notion & Alternative Calendars:** We plan to integrate Notion databases and Apple/Outlook calendars so no matter what tool your university uses, it syncs directly to Vector.
- **Google Cloud Admin API:** We are building a feature to use a GCP Service Account to securely pull live API usage stats (like Calendar Sync volume) directly into the Vector OS Admin Dashboard.
