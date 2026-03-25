# ApexForge Studio — Next.js

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` from the example:
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your Render backend URL.

3. Run locally:
   ```bash
   npm run dev
   ```

## Deploy to Vercel

1. Push this folder to a new GitHub repo (or replace your existing frontend repo)
2. In Vercel → Import Project → select the repo
3. Framework: **Next.js** (auto-detected)
4. Add Environment Variable:
   - Key: `NEXT_PUBLIC_BACKEND_URL`
   - Value: your Render backend URL (e.g. `https://apexforge-backend.onrender.com`)
5. Deploy

## File Structure

```
app/
  layout.js        ← SEO metadata, fonts, analytics (replaces index.html)
  page.js          ← Home page
  admin/
    page.js        ← Admin route
  globals.css      ← Global styles

components/
  Navbar.js
  Hero.js          ← uses next/image for fast loading
  Portfolio.js     ← lightbox, Google Drive support, skeleton loader
  About.js
  WhyUs.js
  Footer.js
  AdminPage.js
  Logo.js
  CustomCursor.js
```

## Key improvements over CRA

- Fonts load non-blocking via `next/font` (saves ~1s FCP)
- Hero image uses `next/image` with `priority` — served as WebP, correct size
- All below-fold images lazy loaded automatically
- Server-rendered HTML — Google sees full content without running JS
- Automatic code splitting per route
