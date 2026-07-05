// Estado global de autenticación y sesión de usuario utilizando Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Usuario } from '@/types/auth.types';

interface AuthState {
    token: string | null;
    usuario: Usuario | null;
    setAuth: (token: string, usuario: Usuario ) => void;
    cerrarSesion: () => void;

}

export const useAuthStore = create<AuthState>()(
    persist((set) => ({
        token: null,
        usuario: null,
        setAuth: (token, usuario) => set({ token, usuario }),
        cerrarSesion: () => set({ token: null, usuario: null }),
    }),
    {
        name: 'auth', // Nombre de la clave en el almacenamiento local
    }
   )
)
