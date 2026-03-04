# Notes App

Aplicación web para gestionar notas con soporte de categorías y filtros. Arquitectura SPA separada en frontend y backend independientes.

## Características

**_Fase 1_**

- Crear, editar y eliminar notas
- Archivar y desarchivar notas
- Listado de notas activas y archivadas

**_Fase 2_**

- Agregar y quitar categorías a notas
- Filtrar notas por categoría desde el sidebar

## Stack tecnológico

| Capa          | Tecnología                | Versión      |
| ------------- | ------------------------- | ------------ |
| Frontend      | React + TypeScript + Vite | 19 / 5.9 / 7 |
| Estilos       | Tailwind CSS              | 4            |
| HTTP client   | Axios                     | 1.13         |
| Enrutado      | React Router              | 7            |
| Backend       | NestJS + TypeScript       | 11 / 5.7     |
| ORM           | Prisma                    | 6            |
| Base de datos | PostgreSQL                | ≥ 14         |
| Runtime       | Node.js                   | ≥ 20.x       |

## Estructura del repositorio

```md
/
├── backend/ # API REST (NestJS) — puerto 3000
└── frontend/ # SPA (React + Vite) — puerto 5173
```

## Autenticación

> Esta app no requiere autenticación. No hay login ni usuario/contraseña.

## Inicio rápido

### Prerrequisitos

- Node.js ≥ 20.x con npm ≥ 10.x
- PostgreSQL ≥ 14 corriendo y accesible
- La API del backend debe ser accesible desde el frontend en `http://localhost:3000/api` (por defecto). Si necesitás cambiar la URL, creá `frontend/.env.local` con `VITE_API_URL=http://tu-host:puerto/api`

### Opción A — Script automático (Linux / macOS / Git Bash en Windows)

```bash
# Dar permisos de ejecución (solo la primera vez)
chmod +x start.sh

# Ejecutar
./start.sh
```

El script instala dependencias, genera el cliente Prisma, sincroniza el schema y arranca ambos servidores. Si `backend/.env` no existe, lo crea desde `.env.example` y pide confirmar las credenciales antes de continuar.

---

### Opción B — Manual

### 1. Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales de PostgreSQL:
#   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/notes_db"
#   DIRECT_URL="postgresql://USER:PASSWORD@localhost:5432/notes_db"

# Crear la base de datos (omitir si ya existe)
psql -U postgres -c "CREATE DATABASE notes_db;"

# Generar cliente Prisma y sincronizar el schema
npx prisma generate
npx prisma db push

# Iniciar en modo desarrollo
npm run start:dev
```

La API queda disponible en `http://localhost:3000`.  
Swagger UI en `http://localhost:3000/api/docs`.

### 2. Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Arquitectura del backend

El backend sigue una separación estricta en capas:

```md
Controller → Service → Repository → Prisma (PostgreSQL)
```

- **Controllers** — reciben las request HTTP y delegan al servicio
- **Services** — contienen la lógica de negocio
- **Repositories** — encapsulan el acceso a la base de datos vía Prisma
- **DTOs** — validan y tipan los datos de entrada con `class-validator`

## Endpoints principales

| Método | Ruta                               | Descripción                           |
| ------ | ---------------------------------- | ------------------------------------- |
| GET    | `/api/notes`                       | Notas activas (acepta `?categoryId=`) |
| GET    | `/api/notes/archived`              | Notas archivadas                      |
| POST   | `/api/notes`                       | Crear nota                            |
| PATCH  | `/api/notes/:id`                   | Editar nota                           |
| DELETE | `/api/notes/:id`                   | Eliminar nota                         |
| PATCH  | `/api/notes/:id/archive`           | Archivar / desarchivar                |
| GET    | `/api/categories`                  | Listar categorías                     |
| POST   | `/api/categories`                  | Crear categoría                       |
| POST   | `/api/notes/:id/categories/:catId` | Agregar categoría a nota              |
| DELETE | `/api/notes/:id/categories/:catId` | Quitar categoría de nota              |

La documentación completa está disponible en Swagger (`/api/docs`).
