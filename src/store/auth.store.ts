import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Usuario } from '@/types/auth.types'

interface AuthState {
  token: string | null
  usuario: Usuario | null
  isAuthenticated: boolean
  setSesion: (token: string, usuario: Usuario) => void
  cerrarSesion: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      isAuthenticated: false,
      setSesion: (token, usuario) => set({ token, usuario, isAuthenticated: true }),
      cerrarSesion: () => set({ token: null, usuario: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' },
  ),
)
