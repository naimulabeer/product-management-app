"use client"

import { useAppSelector } from "@/lib/hooks"
import { useDispatch } from "react-redux"
import { logout } from "@/features/auth/authSlice"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Header() {
  const { token, email } = useAppSelector((s) => s.auth)
  const dispatch = useDispatch()
  const router = useRouter()

  const onLogout = async () => {
    try {
      await fetch("/api/session", { method: "DELETE" })
    } catch {}
    dispatch(logout())
    router.replace("/login")
  }

  return (
    <header className="w-full border-b border-ink/10 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-center text-ink">Product Management APP</Link>
        <div className="flex items-center gap-3">
          {token ? (
            <>
              <span className="text-sm text-pine">{email}</span>
              <Button variant="outline" onClick={onLogout}>Logout</Button>
            </>
          ) : (
            <Button asChild><Link href="/login">Login</Link></Button>
          )}
        </div>
      </div>
    </header>
  )
}
