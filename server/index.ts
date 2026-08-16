import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { conectar, RAIZ } from './db/conexion'
import { hacerRespaldo } from './db/respaldo'
import { rutasDatos } from './rutas/datos'
import { rutasEventos } from './rutas/eventos'
import { rutasIglesias } from './rutas/iglesias'
import { rutasPagos } from './rutas/pagos'
import { rutasPersonas } from './rutas/personas'

export const PUERTO = Number(process.env.PORT ?? 5177)
const DIST = join(RAIZ, 'dist')

export function crearApp() {
  const app = new Hono()

  const api = new Hono()
  api.route('/', rutasDatos)
  api.route('/', rutasEventos)
  api.route('/', rutasIglesias)
  api.route('/', rutasPersonas)
  api.route('/', rutasPagos)
  app.route('/api', api)

  app.onError((err, c) => {
    console.error('[tesorera]', err)
    return c.json(
      { error: 'Algo salió mal al guardar. Vuelve a intentarlo; tus datos anteriores están a salvo.' },
      500,
    )
  })

  // En producción el mismo servidor entrega el frontend compilado.
  if (existsSync(DIST)) {
    app.use('/assets/*', serveStatic({ root: './dist' }))
    app.use('/*', serveStatic({ root: './dist' }))
    app.get('*', (c) => {
      const html = readFileSync(join(DIST, 'index.html'), 'utf8')
      return c.html(html)
    })
  }

  return app
}

export function arrancarServidor() {
  conectar()
  const respaldo = hacerRespaldo()
  if (respaldo) console.log(`Respaldo guardado: ${respaldo.nombre}`)

  const app = crearApp()
  return new Promise<void>((resolve) => {
    serve({ fetch: app.fetch, port: PUERTO }, () => {
      console.log(`Tesorera lista en http://localhost:${PUERTO}`)
      resolve()
    })
  })
}

// `npm run dev:servidor` entra por aquí. `npm start` pasa por arrancar.ts.
const esEntradaDirecta = process.argv[1]?.endsWith('index.ts') || process.argv[1]?.endsWith('index.js')
if (esEntradaDirecta) {
  arrancarServidor()
}
