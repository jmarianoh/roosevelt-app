# Roosevelt · Tesorería — Frontend

Interfaz web (React + Vite) para revisar las cartolas del Edificio Roosevelt, cargar documentos mensuales y registrar conciliaciones. Requiere el backend: [roosevelt-api](https://github.com/jmarianoh/roosevelt-api).

## Desarrollo

Node.js 22 o posterior.

```sh
npm install
npm run dev
```

Abre http://127.0.0.1:5173. Vite redirige `/api` a `http://127.0.0.1:3001`, así que levanta antes la API.

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — verificación de tipos y build en `dist/`
- `npm run check` — solo verificación de tipos
