// // import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// // ─── Types ───────────────────────────────────────────────────────
// interface User {
//   id: string
//   name: string
//   email: string
//   role: 'RIDER' | 'DRIVER'
// }

// interface AuthContextType {
//   user: User | null
//   token: string | null
//   loading: boolean
//   login: (email: string, password: string) => Promise<void>
//   register: (data: RegisterData) => Promise<void>
//   logout: () => void
//   isDriver: boolean
//   isRider: boolean
// }

// interface RegisterData {
//   name: string
//   email: string
//   phone: string
//   password: string
//   role: 'RIDER' | 'DRIVER'
// }

// // ─── Context ─────────────────────────────────────────────────────
// const AuthContext = createContext<AuthContextType | null>(null)

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
//   const [loading, setLoading] = useState(true)

//   // ── On mount: verify token still valid ──
//   useEffect(() => {
//     const stored = localStorage.getItem('token')
//     if (!stored) { setLoading(false); return }

//     fetch(`${API}/auth/me`, {
//       headers: { Authorization: `Bearer ${stored}` },
//     })
//       .then(r => r.ok ? r.json() : null)
//       .then(data => {
//         if (data) {
//           setUser(data)
//           setToken(stored)
//           // Store driverId if driver (needed for bid matching)
//           if (data.driver?.id) localStorage.setItem('driverId', data.driver.id)
//         } else {
//           // Token expired/invalid — clear everything
//           localStorage.removeItem('token')
//           localStorage.removeItem('driverId')
//           setToken(null)
//         }
//       })
//       .catch(() => {
//         localStorage.removeItem('token')
//         setToken(null)
//       })
//       .finally(() => setLoading(false))
//   }, [])

//   // ── Login ──
//   const login = async (email: string, password: string) => {
//     const res = await fetch(`${API}/auth/login`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email, password }),
//     })
//     const data = await res.json()
//     if (!res.ok) throw new Error(data.message ?? 'Login failed')

//     localStorage.setItem('token', data.token ?? data.access_token)
//     if (data.user?.driver?.id) localStorage.setItem('driverId', data.user.driver.id)

//     setToken(data.token ?? data.access_token)
//     setUser(data.user)
//   }

//   // ── Register ──
//   const register = async (formData: RegisterData) => {
//     const res = await fetch(`${API}/auth/register`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(formData),
//     })
//     const data = await res.json()
//     if (!res.ok) throw new Error(data.message ?? 'Registration failed')

//     localStorage.setItem('token', data.token ?? data.access_token)
//     setToken(data.token ?? data.access_token)
//     setUser(data.user)
//   }

//   // ── Logout ──
//   const logout = () => {
//     localStorage.removeItem('token')
//     localStorage.removeItem('driverId')
//     setToken(null)
//     setUser(null)
//   }

//   return (
//     <AuthContext.Provider value={{
//       user, token, loading,
//       login, register, logout,
//       isDriver: user?.role === 'DRIVER',
//       isRider: user?.role === 'RIDER',
//     }}>
//       {children}
//     </AuthContext.Provider>
//   )
// }

// // ─── Hook ────────────────────────────────────────────────────────
// export function useAuth() {
//   const ctx = useContext(AuthContext)
//   if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
//   return ctx
// }