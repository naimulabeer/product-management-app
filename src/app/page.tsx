import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-dvh grid place-items-center p-6">
      <Card className="w-full max-w-md border-ink/10 shadow-sm">
        <CardHeader>
          <CardTitle className="text-ink">Product Management App</CardTitle>
        </CardHeader>
        <CardContent className="text-pine">
          Foundation ready: Tailwind, shadcn/ui, Redux Toolkit + RTK Query.
        </CardContent>
      </Card>
    </main>
  )
}
