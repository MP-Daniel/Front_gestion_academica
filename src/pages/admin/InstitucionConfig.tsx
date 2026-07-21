import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react'
import { Building2, Save, Upload, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import {
  obtenerInstitucion,
  actualizarInstitucion,
  subirSelloInstitucion,
  subirLogoInstitucion,
  subirFirmaRector,
  subirBanderaInstitucion,
} from '@/api/institucion.api'
import type { Institucion } from '@/types/institucion.types'
import { extraerMensajeError } from '@/api/axios'

export function InstitucionConfig() {
  const [institucion, setInstitucion] = useState<Institucion | null>(null)
  const [cargando, setCargando] = useState(true)
  const [errorCarga, setErrorCarga] = useState<string | null>(null)

  const [form, setForm] = useState({
    nombre: '',
    nit: '',
    codigoDane: '',
    resolucion: '',
    direccion: '',
    nombreRector: '',
  })
  const [guardandoTexto, setGuardandoTexto] = useState(false)
  const [errorTexto, setErrorTexto] = useState<string | null>(null)
  const [exitoTexto, setExitoTexto] = useState(false)

  // Estados de imágenes
  const [subiendoImagen, setSubiendoImagen] = useState<string | null>(null)
  const [errorImagen, setErrorImagen] = useState<string | null>(null)

  useEffect(() => {
    let vigente = true
    obtenerInstitucion()
      .then((data) => {
        if (vigente) {
          setInstitucion(data)
          setForm({
            nombre: data.nombre || '',
            nit: data.nit || '',
            codigoDane: data.codigoDane || '',
            resolucion: data.resolucion || '',
            direccion: data.direccion || '',
            nombreRector: data.nombreRector || '',
          })
          setCargando(false)
        }
      })
      .catch((err) => {
        if (vigente) {
          // 404 es esperado si no hay configuración
          const mensaje = extraerMensajeError(err)
          if (mensaje.includes('No se encontró') || err?.response?.status === 404) {
             setInstitucion(null)
          } else {
             setErrorCarga(mensaje)
          }
          setCargando(false)
        }
      })

    return () => {
      vigente = false
    }
  }, [])

  const manejarGuardarTexto = async (e: FormEvent) => {
    e.preventDefault()
    setGuardandoTexto(true)
    setErrorTexto(null)
    setExitoTexto(false)
    try {
      const data = await actualizarInstitucion(form)
      setInstitucion(data)
      setExitoTexto(true)
      setTimeout(() => setExitoTexto(false), 3000)
    } catch (err) {
      setErrorTexto(extraerMensajeError(err))
    } finally {
      setGuardandoTexto(false)
    }
  }

  const manejarSubirImagen = async (e: ChangeEvent<HTMLInputElement>, tipo: 'sello' | 'logo' | 'firma' | 'bandera') => {
    if (!e.target.files || e.target.files.length === 0) return
    const archivo = e.target.files[0]
    setSubiendoImagen(tipo)
    setErrorImagen(null)
    try {
      let data: Institucion
      if (tipo === 'sello') data = await subirSelloInstitucion(archivo)
      else if (tipo === 'logo') data = await subirLogoInstitucion(archivo)
      else if (tipo === 'firma') data = await subirFirmaRector(archivo)
      else data = await subirBanderaInstitucion(archivo)
      
      setInstitucion(data)
    } catch (err) {
      setErrorImagen(extraerMensajeError(err))
    } finally {
      setSubiendoImagen(null)
      // Limpiar input para permitir subir el mismo archivo de nuevo si falló
      e.target.value = ''
    }
  }

  if (cargando) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    )
  }

  if (errorCarga) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
        <p>Error al cargar configuración institucional: {errorCarga}</p>
      </div>
    )
  }

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-center gap-2">
        <Building2 className="text-brand-600" size={22} />
        <h2 className="text-2xl font-bold text-slate-900">Configuración Institucional</h2>
      </div>
      <p className="mb-6 text-sm text-slate-500">
        Datos básicos de la institución, utilizados en membretes, boletines y reportes oficiales.
      </p>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form
            onSubmit={manejarGuardarTexto}
            className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <Input
              label="Nombre de la Institución"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="NIT"
                value={form.nit}
                onChange={(e) => setForm({ ...form, nit: e.target.value })}
                required
              />
              <Input
                label="Código DANE"
                value={form.codigoDane}
                onChange={(e) => setForm({ ...form, codigoDane: e.target.value })}
              />
            </div>
            <Input
              label="Resolución de Aprobación"
              value={form.resolucion}
              onChange={(e) => setForm({ ...form, resolucion: e.target.value })}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Dirección"
                value={form.direccion}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              />
              <Input
                label="Nombre del Rector"
                value={form.nombreRector}
                onChange={(e) => setForm({ ...form, nombreRector: e.target.value })}
              />
            </div>

            {errorTexto && <p className="text-sm text-red-500">{errorTexto}</p>}
            {exitoTexto && <p className="text-sm text-green-600 font-medium">¡Datos actualizados con éxito!</p>}

            <div className="mt-2 flex justify-end">
              <Button type="submit" isLoading={guardandoTexto}>
                <Save size={18} />
                Guardar Datos
              </Button>
            </div>
          </form>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
          <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-2">Imágenes Oficiales</h3>
          {errorImagen && <p className="text-xs text-red-500">{errorImagen}</p>}
          
          <div className="flex flex-col gap-6 mt-2">
            <BotonSubirImagen
              etiqueta="Logo"
              url={institucion?.logoUrl}
              subiendo={subiendoImagen === 'logo'}
              alCambiar={(e) => manejarSubirImagen(e, 'logo')}
            />
            <BotonSubirImagen
              etiqueta="Sello"
              url={institucion?.selloUrl}
              subiendo={subiendoImagen === 'sello'}
              alCambiar={(e) => manejarSubirImagen(e, 'sello')}
            />
            <BotonSubirImagen
              etiqueta="Firma del Rector"
              url={institucion?.firmaRectorUrl}
              subiendo={subiendoImagen === 'firma'}
              alCambiar={(e) => manejarSubirImagen(e, 'firma')}
            />
            <BotonSubirImagen
              etiqueta="Bandera"
              url={institucion?.banderaUrl}
              subiendo={subiendoImagen === 'bandera'}
              alCambiar={(e) => manejarSubirImagen(e, 'bandera')}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function BotonSubirImagen({
  etiqueta,
  url,
  subiendo,
  alCambiar,
}: {
  etiqueta: string
  url?: string | null
  subiendo: boolean
  alCambiar: (e: ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-700">{etiqueta}</span>
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          {url ? (
            <img src={url} alt={etiqueta} className="h-full w-full object-contain p-1" />
          ) : (
            <ImageIcon className="text-slate-300" size={24} />
          )}
        </div>
        <div className="flex-1">
          <label className="relative flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-brand-700 transition-colors">
            {subiendo ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <>
                <Upload size={16} />
                <span>Cambiar</span>
              </>
            )}
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
              onChange={alCambiar}
              disabled={subiendo}
            />
          </label>
        </div>
      </div>
    </div>
  )
}
