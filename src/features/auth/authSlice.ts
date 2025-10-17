import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type AuthState = {
  token: string | null
  email: string | null
  status: "idle" | "authenticating"
}

const initialState: AuthState = {
  token: null,
  email: null,
  status: "idle",
}

const STORAGE_KEY = "pma_auth" // product-management-app

const save = (state: AuthState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: state.token, email: state.email }))
  } catch {}
}

export const loadAuthFromStorage = (): { token: string | null; email: string | null } => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { token: null, email: null }
    const parsed = JSON.parse(raw)
    return { token: parsed?.token ?? null, email: parsed?.email ?? null }
  } catch {
    return { token: null, email: null }
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticating: (state, action: PayloadAction<boolean>) => {
      state.status = action.payload ? "authenticating" : "idle"
    },
    setCredentials: (state, action: PayloadAction<{ token: string; email: string }>) => {
      state.token = action.payload.token
      state.email = action.payload.email
      state.status = "idle"
      save(state)
    },
    hydrateFromStorage: (state, action: PayloadAction<{ token: string | null; email: string | null }>) => {
      state.token = action.payload.token
      state.email = action.payload.email
    },
    logout: (state) => {
      state.token = null
      state.email = null
      state.status = "idle"
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {}
    },
  },
})

export const { setCredentials, logout, hydrateFromStorage, setAuthenticating } = authSlice.actions
export const authReducer = authSlice.reducer
