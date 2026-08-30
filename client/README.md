# AI Vernacular Classroom (Vite + React)

This is a Vite + plain React (JavaScript) conversion of the original
Next.js + TypeScript app. The **UI is unchanged** — same Tailwind classes,
same layout, same components.

## Run it

```bash
npm install
npm run dev
```

## What changed under the hood

- **Routing**: Next.js file-based routing (`app/`) → `react-router-dom`
  routes declared in `src/App.jsx`. `next/link`'s `<Link href>` became
  `<Link to>`; `next/navigation`'s `useSearchParams` became
  `react-router-dom`'s `useSearchParams` (same `.get()` API).
- **TypeScript → JavaScript**: all `.tsx`/`.ts` files became `.jsx`/`.js`,
  with type annotations removed. No behavior changes.
- **Server API routes**: the original `app/api/*/route.ts` handlers used
  Prisma (SQLite) and Google's Gemini API with a server-side secret key.
  A pure client-side app has no server runtime and can't safely hold that
  key, so these were replaced with local stub functions in
  `src/lib/api.js` + `src/lib/ai-service.js` that return the **exact same
  "demo mode" data** the original app already used whenever no
  `GEMINI_API_KEY` was configured — so the UI/UX is identical to running
  the Next.js app without a key. The curriculum lessons that used to come
  from Prisma/SQLite now live as a static array in
  `src/lib/curriculum-data.js`.

### Wiring up a real backend later

If you want live Gemini-powered translation/worksheets/flashcards again,
stand up a small backend (Express, etc.) that exposes the same endpoints
and holds the `GEMINI_API_KEY` server-side, then swap the function bodies
in `src/lib/api.js` for `fetch()` calls to that backend.
