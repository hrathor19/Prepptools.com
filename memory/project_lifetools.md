---
name: LifeTools project overview
description: LifeTools is a free online tools website built with Next.js 14 + Tailwind CSS in this working directory
type: project
---

A free, no-login tools website inspired by ilovepdf.com.

**Why:** User wanted a categorised life tools site with a blog that is super fast and lightweight.

**Stack:** Next.js 16 App Router · TypeScript · Tailwind CSS · Lucide React · No database (data in lib/*.ts files)

**Key data files:**
- `lib/tools-data.ts` — all tool metadata (slug, name, category, icon, tags) + helper functions
- `lib/blog-data.ts` — all blog post content inline (no CMS)

**Adding a new tool:** Add entry to `tools` array in `lib/tools-data.ts`, create `components/tools/MyTool.tsx`, register it in `components/tools/index.ts`.

**Adding a blog post:** Add entry to `blogPosts` array in `lib/blog-data.ts` with Markdown content.

**How to apply:** When the user wants to add tools/posts, point to the two data files above. Tool components live in `components/tools/`.
