"use client"

import { Provider, useDispatch } from "react-redux"
import { store } from "@/store/store"
import { Toaster } from "@/components/ui/toaster"
import { useEffect } from "react"
import { hydrateFromStorage, loadAuthFromStorage } from "@/features/auth/authSlice"

function Hydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(hydrateFromStorage(loadAuthFromStorage()))
  }, [dispatch])
  return <>{children}</>
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <Hydrator>
        {children}
        <Toaster />
      </Hydrator>
    </Provider>
  )
}
