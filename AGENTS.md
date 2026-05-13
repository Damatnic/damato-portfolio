<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# damato-portfolio maintainer notes

**Stack:** Next.js 16 · TypeScript · Tailwind v4 · lucide-react · recharts · @vercel/analytics · resend

**Key conventions:**
- Tailwind v4 uses `@tailwindcss/postcss`, not v3's config file
- OG images are static `.png` files in route directories — Next.js file conventions
- The Olympic medals dashboard page uses `useMemo` + `useState` (client component), everything else is server components
- Color palette: `stone-950` bg, `stone-100` text, accent via CSS var `--accent`

**Key data files:**
- `src/lib/projects.ts` — `projects[]` (3 flagship) + `sideProjects[]` (3 "Also Built"). Edit descriptions here.
- `src/data/olympic-medals.json` — 1,343 medal records for the interactive dashboard

**Adding a new project:**
1. Add entry to `projects[]` or `sideProjects[]` in `src/lib/projects.ts`
2. If flagship project with detail page: create `src/app/projects/<slug>/page.tsx`
3. Update OG image if needed

**Analytics system:**
- `ClickTracker.tsx` fires on every pageview + link click
- Posts to `/api/track` which logs and optionally writes to KV
- Dashboard at `/admin/analytics?secret=<ANALYTICS_SECRET>`
- See Obsidian → System → About Nick → `damato-data Portfolio.md` for full docs

**Deployment:** `vercel --prod` from project root. Live at https://damato-data.vercel.app. Vercel project: astral-productions/damato-portfolio.

**Build checks before shipping:**
```bash
npm run build
npx tsc --noEmit
```

**Related local projects:** python-mastery, sql-mastery (see their AGENTS.md)