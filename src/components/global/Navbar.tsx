"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/hooks"
import { useDispatch } from "react-redux"
import { logout } from "@/features/auth/authSlice"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"
import clsx from "clsx"

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const active = pathname === href || (href !== "/" && pathname.startsWith(href))
  return (
    <Link
      href={href}
      className={clsx(
        "px-3 py-2 rounded-xl text-sm transition-colors",
        active
          ? "bg-pine text-white"
          : "text-ink/80 hover:text-ink hover:bg-ink/5"
      )}
    >
      {children}
    </Link>
  )
}

export default function Navbar() {
  const { token, email } = useAppSelector((s) => s.auth)
  const dispatch = useDispatch()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const onLogout = async () => {
    try {
      await fetch("/api/session", { method: "DELETE" })
    } catch {}
    dispatch(logout())
    router.replace("/login")
  }

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-ink/10 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-pine text-white font-semibold">Bx</span>
            <span className="font-semibold text-ink">BitechX</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">Products</NavLink>
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-2">
            {token ? (
              <>
                <span className="text-sm text-pine">{email}</span>
                <Button variant="outline" onClick={onLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost"><Link href="/login">Login</Link></Button>
                <Button asChild><Link href="/products">Open App</Link></Button>
              </>
            )}
          </div>

          {/* Mobile */}
          <button
            className="md:hidden inline-flex items-center justify-center rounded-xl p-2 text-ink/80 hover:bg-ink/5"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div className="md:hidden border-t border-ink/10 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-2">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">Products</NavLink>
            <div className="h-px bg-ink/10 my-2" />
            {token ? (
              <>
                <span className="text-sm text-pine">{email}</span>
                <Button variant="outline" onClick={onLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost"><Link href="/login">Login</Link></Button>
                <Button asChild><Link href="/products">Open App</Link></Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
