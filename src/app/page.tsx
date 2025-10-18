import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cookies } from "next/headers"

export default async function HomePage() {
   const cookieStore = await cookies();
  const isAuthed = Boolean(cookieStore.get("pma_token")?.value);

  return (
    <main className="relative">
      {/* subtle gradient backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_30%_at_50%_0%,rgba(164,74,63,0.08),transparent_70%),radial-gradient(40%_30%_at_0%_60%,rgba(78,110,93,0.08),transparent_70%),radial-gradient(40%_30%_at_100%_60%,rgba(173,138,100,0.08),transparent_70%)]" />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 md:py-16 grid md:grid-cols-2 gap-8 items-center">
        {/* Copy */}
        <div className="space-y-5">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-ink">
            Product Management App
          </h1>
          <p className="text-lg text-ink/75">
            Fast, polished CRUD for BitechX: browse, search, create, edit, and manage products with
            a clean, responsive UI — all powered by Next.js, RTK Query, and shadcn.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/products">Open Products</Link>
            </Button>
             {!isAuthed && (
              <Button asChild variant="outline">
                <Link href="/login">Sign in</Link>
              </Button>
            )}
          </div>

          {/* Feature chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="inline-flex items-center rounded-full border border-ink/10 bg-white px-3 py-1 text-xs text-ink/70">JWT Auth</span>
            <span className="inline-flex items-center rounded-full border border-ink/10 bg-white px-3 py-1 text-xs text-ink/70">Search & Pagination</span>
            <span className="inline-flex items-center rounded-full border border-ink/10 bg-white px-3 py-1 text-xs text-ink/70">Create / Edit / Delete</span>
            <span className="inline-flex items-center rounded-full border border-ink/10 bg-white px-3 py-1 text-xs text-ink/70">Responsive UI</span>
          </div>
        </div>

        {/* Banner */}
        <Card className="md:ml-auto border-ink/10 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <Image
              src="/homeBanner.jpg"
              alt="BitechX banner"
              width={1280}
              height={720}
              priority
              className="h-full w-full object-cover"
            />
          </CardContent>
        </Card>
      </section>

      {/* Lower teaser */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-14">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white border border-ink/10 p-5">
            <h3 className="font-semibold text-ink">Clean CRUD</h3>
            <p className="text-sm text-ink/70 mt-1">Create, edit, details, and delete flows with inline validation.</p>
          </div>
          <div className="rounded-2xl bg-white border border-ink/10 p-5">
            <h3 className="font-semibold text-ink">Real-time Search</h3>
            <p className="text-sm text-ink/70 mt-1">Debounced search + paginated list, category filter, and cache.</p>
          </div>
          <div className="rounded-2xl bg-white border border-ink/10 p-5">
            <h3 className="font-semibold text-ink">Beautiful UI</h3>
            <p className="text-sm text-ink/70 mt-1">Palette-driven design using shadcn/ui and Tailwind.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
