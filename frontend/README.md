# Notes App — Frontend

SPA construida con **React** y **Vite**.

## Requisitos

| Herramienta | Versión |
|-------------|---------|
| Node.js     | >= 20.x |
| npm         | >= 10.x |

## Configuración

```bash
# 1. Instalar dependencias
npm install

# 2. (Opcional) Configurar la URL del backend
#    Por defecto apunta a http://localhost:3000/api
#    Crear .env.local para sobreescribir:
echo "VITE_API_URL=http://localhost:3000/api" > .env.local
```

## Ejecución

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build
npm run preview
```

La app corre en `http://localhost:5173`.

## Tecnologías

- **React** 19
- **TypeScript** 5.9
- **Vite** 7
- **Tailwind CSS** 4
- **React Router** 7
- **Axios** 1.13
