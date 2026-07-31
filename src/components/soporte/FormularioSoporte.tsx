import { useState, type FormEvent } from 'react'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { extraerMensajeError } from '@/api/axios'
import { crearSolicitudSoporte } from '@/api/soporte.api'
import { ETIQUETA_CATEGORIA } from '@/lib/soporte'
import type { CategoriaSoporte, SolicitudSoporte } from '@/types/soporte.types'

const CLASE_CAMPO =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20'

const FORMULARIO_VACIO = { asunto: '', descripcion: '', categoria: 'PROBLEMA_TECNICO' as CategoriaSoporte }

interface FormularioSoporteProps {
  onCreada: (nueva: SolicitudSoporte) => void
}

export function FormularioSoporte({ onCreada }: FormularioSoporteProps) {
  const [formulario, setFormulario] = useState(FORMULARIO_VACIO)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const manejarEnviar = async (e: FormEvent) => {
    e.preventDefault()
    if (!formulario.asunto.trim() || !formulario.descripcion.trim()) {
      setError('El asunto y la descripción son obligatorios.')
      return
    }

    setEnviando(true)
    setError(null)
    try {
      const nueva = await crearSolicitudSoporte({
        asunto: formulario.asunto.trim(),
        descripcion: formulario.descripcion.trim(),
        categoria: formulario.categoria,
      })
      onCreada(nueva)
      setFormulario(FORMULARIO_VACIO)
    } catch (error) {
      setError(extraerMensajeError(error))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={manejarEnviar} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">Crear una solicitud</h3>
      <p className="mt-1 text-sm text-slate-500">
        Cuéntanos qué necesitas y un administrador te dará respuesta desde aquí mismo.
      </p>

      <div className="mt-4 flex flex-col gap-4">
        <Input
          label="Asunto"
          placeholder="Ej. No puedo descargar la plantilla de notas"
          value={formulario.asunto}
          onChange={(e) => setFormulario({ ...formulario, asunto: e.target.value })}
          maxLength={150}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Categoría</label>
          <select
            className={CLASE_CAMPO}
            value={formulario.categoria}
            onChange={(e) => setFormulario({ ...formulario, categoria: e.target.value as CategoriaSoporte })}
          >
            {Object.entries(ETIQUETA_CATEGORIA).map(([valor, etiqueta]) => (
              <option key={valor} value={valor}>
                {etiqueta}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Descripción</label>
          <textarea
            className={CLASE_CAMPO}
            rows={4}
            placeholder="Describe con el mayor detalle posible qué necesitas o qué problema tuviste."
            value={formulario.descripcion}
            onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })}
            maxLength={1000}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="w-fit">
          <Button type="submit" isLoading={enviando}>
            <Send size={16} />
            Enviar Solicitud
          </Button>
        </div>
      </div>
    </form>
  )
}
