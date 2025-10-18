# BitechX Product Management App

A modern, responsive product management app built with **Next.js (App Router)**, **Redux Toolkit + RTK Query**, **Tailwind CSS**, and **shadcn/ui**.  
Features include JWT auth, products CRUD, search, pagination, category filtering, details view, and a polished UI with **Montserrat**.

> Live: _add your Vercel/Netlify link here_  
> Repo: _add your public GitHub link here_

---

## ✨ Features

- **Auth**: POST `/auth` → stores JWT as `pma_token` (HTTP-only cookie via proxy).
- **Products**: list, search (debounced), paginate, details, create, edit, (simulated) delete.
- **Categories**: dropdown selector + optional list filtering.
- **Validations**: Zod + React Hook Form with inline errors.
- **UI/UX**: shadcn/ui components, beautiful layout, responsive, clear states.
- **Images**: universal **image proxy** (`/api/image?url=...`) to avoid whitelisting dozens of hosts.
- **Server-first**: `page.tsx` files are Server Components; client-only logic is isolated.
- **Type-safe**: strict TS, linted; no `any` in app code.

---

## 🧱 Tech Stack

- **Framework**: Next.js 15 (App Router, Route Handlers, RSC)
- **State**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS + shadcn/ui
- **Forms**: React Hook Form + Zod
- **Icons**: lucide-react
- **Font**: Montserrat (via `next/font`)
- **Deploy**: Vercel (recommended)

---

## 🔐 API (Upstream)

All routes require `Authorization: Bearer <jwt>` and `Content-Type: application/json`.

- Auth: `POST https://api.bitechx.com/auth` → `{ token }`
- Products:
  - `GET /products?offset&limit&categoryId`
  - `GET /products/search?searchedText=...`
  - `GET /products/:slug`
  - `POST /products`
  - `PUT /products/:id`
  - `DELETE /products/:id` _(simulated 200)_
- Categories:
  - `GET /categories?offset&limit`
  - `GET /categories/search?searchedText=...`

The app uses **Option B (server proxy)** so the browser never calls the upstream API directly.

---

## 🧭 Project Structure

```

src/
app/
api/
_utils/proxy.ts          # UPSTREAM + authHeaders + passThrough
auth/route.ts            # POST /api/auth → upstream /auth
products/route.ts        # GET/POST /api/products
products/[id]/route.ts   # PUT/DELETE /api/products/:id (await params)
products/by-slug/[slug]/route.ts # GET /api/products/:slug (await params)
categories/route.ts      # GET /api/categories
categories/search/route.ts # GET /api/categories/search
image/route.ts           # GET /api/image?url=... proxy for images
layout.tsx                 # Montserrat + Navbar + Providers
page.tsx                   # Hero homepage (server) w/ cookie check
login/page.tsx             # Login (server) → client form
products/
page.tsx                 # Products list (server) → client shell
[slug]/page.tsx          # Details (server) → client viewer
[slug]/edit/page.tsx     # Edit (server) → client form
new/page.tsx             # Create (server) → client form
components/
app/Navbar.tsx
products/
ProductsShell.tsx
ProductsTable.tsx
ProductsPagination.tsx
ProductDetailsClient.tsx
ProductFormClient.tsx
ConfirmDelete.tsx
ui/*                       # shadcn components
features/
auth/authSlice.ts
products/schemas.ts        # zod schemas & input/output types
lib/
apiError.ts                # RTK error extractor
hooks.ts                   # typed hooks for redux
services/
api.ts                     # base RTK Query api w/ prepareHeaders
productsApi.ts             # products endpoints (list/search/get/update/create/delete)
categoriesApi.ts           # categories endpoints
types/
product.ts
category.ts

public/
assets/homeBanner.png

````

---

## 🎨 Design System

- **Palette**:  
  `ink #0D1821` · `mist #EFF1F3` · `pine #4E6E5D` · `sand #AD8A64` · `clay #A44A3F`
- **Typography**: Montserrat (weights 300–700)
- **Components**: shadcn/ui with tokens mapped to the palette
- **Layout**: rounded corners, soft borders, shadows, clear spacing
- **Responsive**: mobile-first; list table becomes stacked cards on small screens

---

## ⚙️ Setup

### 1) Install

```bash
npm i
````

### 2) Dev

```bash
npm run dev
```

### 3) Lint & Typecheck

```bash
npm run lint
npm run build   # runs typecheck; you can add "tsc --noEmit" if you want separate
```

> If you must bypass ESLint in CI once, set in `next.config.js`:
>
> ```js
> eslint: { ignoreDuringBuilds: true }
> ```

---

## 🔑 Authentication Flow

1. Login form posts to **`/api/auth`** with your email (the one used in the application).
2. Server receives `{ token }` from upstream and sets **`pma_token`** cookie.
3. All proxy calls automatically attach `Authorization: Bearer <token>` via:

   * `authHeaders()` in route handlers (server)
   * `prepareHeaders` in RTK Query (client)

**Logout** clears the cookie (`DELETE /api/session`) and resets redux.

---

## 🖼 Image Handling

Product images may come from many hosts. Instead of whitelisting in `next.config`, we proxy:

```
/api/image?url=<https-encoded-url>
```

Then use it with `<Image src="/api/image?url=..." />`.
Fallback: for a single image, you can pass `unoptimized` to `next/image`.

---

## 🚀 Deploy (Vercel)

1. Push the repo to GitHub.
2. Import the project in Vercel → **Framework Preset: Next.js**.
3. Environment variables: *none required*. (Upstream URL is hardcoded: `https://api.bitechx.com` in `app/api/_utils/proxy.ts`.)

   * If you want to make it configurable:

     ```ts
     export const UPSTREAM = process.env.UPSTREAM ?? "https://api.bitechx.com"
     ```

     And add `UPSTREAM` in Vercel.

> **Next.js 15 notes**:
>
> * `cookies()` is **async** in RSC: `const store = await cookies()`.
> * **Dynamic route handlers** accept `context.params` as a **Promise**: `const { id } = await context.params`.

---

## 🧪 Testing (suggested)

* **Unit**: Vitest for reducers/helpers
* **E2E**: Playwright for critical flows (login, list/search, create/edit/delete)
* **CI**: GitHub Actions → `npm ci && npm run lint && npm run build && npm run test`

---

## 🛠 Troubleshooting

* **PostCSS error**:
  *“Use `@tailwindcss/postcss`”* → install and set `postcss.config.js` with `require("@tailwindcss/postcss")`.
* **PowerShell `npx` blocked**:
  `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` then reopen terminal.
* **next/image host errors**:
  Use the **image proxy** or add hosts to `next.config.(js|mjs)` → `images.remotePatterns`.
* **Type error: `cookies().get`**:
  Make component **async** and `await cookies()`.
* **Dynamic route params**:
  Use `context: { params: Promise<{ id: string }> }` and `await context.params`.
* **ESLint `no-explicit-any`**:
  Use `extractApiError`, RHF **input** types, `Controller` for complex fields, and avoid `as any`.

---

## 📌 Known Limitations

* Upstream **delete** is simulated; DB is not mutated.
* Products list API doesn’t return a **total**; we compute totals by fetching all (max 50).
* Category data is read-only (no endpoints to create/update categories).

---

## 🗺 Roadmap / Future Improvements

* Optimistic updates + offline caching.
* Role-based access control (RBAC).
* Dark mode & micro-animations (Framer Motion).
* Observability: error tracking, performance, usage analytics.
* E2E tests (Playwright) and preview deployments per PR.

---

## 🧾 License

MIT © Naimul Haq Abeer

