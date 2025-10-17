"use client"

import { useAppSelector } from "@/lib/hooks"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = useAppSelector((s) => s.auth.token)
  const router = useRouter()

  useEffect(() => {
    if (!token) router.replace("/login")
  }, [token, router])

  if (!token) return null
  return <>{children}</>
}
