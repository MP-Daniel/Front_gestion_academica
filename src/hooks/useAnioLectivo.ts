import { useAnioLectivoStore } from '@/store/anioLectivo.store'

export function useAnioLectivo() {
  const anios = useAnioLectivoStore((estado) => estado.anios)
  const anioSeleccionadoId = useAnioLectivoStore((estado) => estado.anioSeleccionadoId)
  const cargando = useAnioLectivoStore((estado) => estado.cargando)
  const cargarAnios = useAnioLectivoStore((estado) => estado.cargarAnios)
  const seleccionarAnio = useAnioLectivoStore((estado) => estado.seleccionarAnio)

  const anioActivo = anios.find((anio) => anio.activo) ?? null
  const anioSeleccionado = anios.find((anio) => anio.id === anioSeleccionadoId) ?? anioActivo

  return {
    anios,
    anioActivo,
    anioSeleccionado,
    cargando,
    cargarAnios,
    seleccionarAnio,
    soloLectura: Boolean(
      anioSeleccionado && anioActivo && anioSeleccionado.id !== anioActivo.id,
    ),
  }
}
