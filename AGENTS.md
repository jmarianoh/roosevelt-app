# AGENTS.md — roosevelt-app

Frontend del sistema de tesorería del Edificio Roosevelt. React 18, Vite 6 y TypeScript 5.7 en modo estricto. El backend está en el repo hermano [roosevelt-api](https://github.com/jmarianoh/roosevelt-api), y sus contratos están en `server/index.ts`.

## Comandos

```sh
npm ci            # instalar dependencias (Node.js 22 o posterior)
npm run dev       # http://127.0.0.1:5173, redirige /api a http://127.0.0.1:3001
npm run check     # verificación de tipos
npm run build     # tipos y build de producción en dist/
```

No hay tests automatizados ni linter. Antes de dar un cambio por terminado, ejecuta `npm run check` y `npm run build`, y prueba el flujo afectado en el navegador con la API levantada.

## Estructura

```
src/
  main.tsx        arranque: StrictMode, ToastProvider, SessionProvider
  App.tsx         compuerta de sesión: carga, AuthScreen o AppShell
  style.css       todos los estilos, en un solo archivo
  types/api.ts    tipos de las respuestas de la API
  lib/            cliente HTTP (api.ts), formato y apertura de documentos
  config/         tabla de páginas y constantes
  context/        Toast, Session y Dashboard
  hooks/          hooks compartidos entre funcionalidades
  components/     layout/ (AppShell, Sidebar, Topbar...) y ui/ (piezas reutilizables)
  features/       auth, summary, statements, expenses, review, upload, activity, settings
```

## Convenciones

- Un componente por archivo, en PascalCase y con exportación nombrada.
- La lógica con estado va en hooks `useX` junto a su funcionalidad. Las funciones puras van en archivos `.ts` sin React, como `features/upload/parseReportCover.ts`.
- Código compartido por varias funcionalidades: `components/`, `hooks/` o `lib/`. El resto vive dentro de su carpeta en `features/`.
- No uses `any`. Cuando cambie una respuesta de la API, actualiza `types/api.ts`.
- Todas las llamadas HTTP pasan por `api<T>()` en `lib/api.ts`.
- Reporta errores al usuario con `useToast()`. Para acciones asíncronas usa `useBusyAction`.
- Los textos de interfaz van en español. Los montos se muestran con `clp` y las fechas con `dateCL`.
- 2 espacios y comillas simples.
- No agregues dependencias sin que te lo pidan. La navegación es por estado interno (`page` en `AppShell`, páginas en `config/pages.ts`), sin router ni librería de caché.
- `pdfjs-dist` y `tesseract.js` se cargan con import dinámico. Mantenlos así, porque pesan mucho.

## Dónde vive el estado

- `ToastProvider` y `SessionProvider` envuelven toda la app. `DashboardProvider` se monta solo con sesión iniciada, así que al cerrar sesión se descartan sus datos.
- `AppShell` es dueño de `page`, del menú móvil, de `useExpenseReview` y de `useMonthlyUpload`, y los pasa por props como "controllers" (`ReturnType<typeof useHook>`).
  - El modal de revisión se abre desde Resumen y desde Egresos, por eso vive sobre ambas páginas.
  - Los archivos, el OCR y el borrador del informe deben sobrevivir al cambiar de página. No los muevas a estado local de `UploadPage`.
- Búsqueda y filtros son estado local de cada página y no se comparten entre ellas.

## Puntos delicados

- `lib/api.ts` solo envía `content-type: application/json` si hay cuerpo no `FormData`. Fastify responde 400 a un JSON vacío, y `FormData` define su propio tipo.
- En `/api/dashboard`, `pending` viene en la raíz de la respuesta, no dentro de `summary`.
- En los candidatos de conciliación, `used` puede ser número o booleano. Conviértelo con `Boolean()` antes de renderizar, porque un `0` suelto aparece en pantalla.
- Quedan valores fijos, conservados a propósito: en `config/constants.ts`, el período inicial `2026-10`, el documento de respaldo `23` y los nombres de beneficiarios. En `features/summary/SummaryPage.tsx`, el texto "31 de octubre" del aviso.
- En `style.css` no hay módulos. Antes de renombrar una clase, búscala en todo `src/`.

## Datos y despliegue

- Nunca subas cartolas, PDF de egresos, respaldos ni archivos `.env`. Para probar usa datos sintéticos.
- Producción: el `Dockerfile` compila la app y la sirve con nginx en Dokploy. `nginx.conf.template` redirige `/api/` a `BACKEND_HOST:BACKEND_PORT`.
