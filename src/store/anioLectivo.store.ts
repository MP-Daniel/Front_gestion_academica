import { create } from 'zustand'
import { listarAniosLectivos } from '@/api/aniosLectivos.api'
import type { AnioLectivo } from '@/types/anioLectivo.types'

interface AnioLectivoState {
  anios: AnioLectivo[]
  anioSeleccionadoId: number | null
  cargando: boolean
  cargarAnios: () => Promise<void>
  seleccionarAnio: (id: number) => void
}

export const useAnioLectivoStore = create<AnioLectivoState>((set, get) => ({
  anios: [],
  anioSeleccionadoId: null,
  cargando: false,
  cargarAnios: async () => {
    set({ cargando: true })
    try {
      const anios = await listarAniosLectivos()
      const activo = anios.find((anio) => anio.activo)
      set({
        anios,
        anioSeleccionadoId: get().anioSeleccionadoId ?? activo?.id ?? anios[0]?.id ?? null,
      })
    } finally {
      set({ cargando: false })
    }
  },
  seleccionarAnio: (id) => set({ anioSeleccionadoId: id }),
}))
