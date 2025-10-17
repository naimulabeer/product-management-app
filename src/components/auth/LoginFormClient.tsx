"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLoginMutation } from "@/services/authApi"
import { useAppDispatch } from "@/lib/hooks"
import { setAuthenticating, setCredentials } from "@/features/auth/authSlice"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
})
type FormValues = z.infer<typeof schema>

export default function LoginFormClient() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [login, { isLoading }] = useLoginMutation()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
    mode: "onChange",
  })

  const onSubmit = async (values: FormValues) => {
    setServerError(null)
    try {
      dispatch(setAuthenticating(true))
      const res = await login({ email: values.email }).unwrap()

      // save to redux (for client fetches)
      dispatch(setCredentials({ token: res.token, email: values.email }))

      // save to cookie (so server pages can guard/redirect)
      await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: res.token, email: values.email }),
      })

      router.replace("/products")
    } catch (e: any) {
      setServerError(e?.data?.message || "Authentication failed")
    } finally {
      dispatch(setAuthenticating(false))
    }
  }

  return (
    <Card className="w-full max-w-md border-ink/10">
      <CardHeader>
        <CardTitle className="text-ink">Sign in</CardTitle>
        <CardDescription>Use the same email you used on your application.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-sm text-clay">{form.formState.errors.email.message}</p>
            )}
          </div>

          {serverError ? <p className="text-sm text-clay">{serverError}</p> : null}

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
