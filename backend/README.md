# Notes API — Backend

REST API construida con **NestJS** y **Prisma** sobre PostgreSQL.

## Requisitos

| Herramienta | Versión |
| ----------- | ------- |
| Node.js     | >= 20.x |
| npm         | >= 10.x |
| PostgreSQL  | >= 14   |

## Configuración

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales de la base de datos DATABASE_URL y DIRECT_URL

# 3. Generar el cliente de Prisma
npx prisma generate

# 4. Aplicar migraciones / sincronizar el schema
npx prisma db push
```

### Variables de entorno (`.env`)

| Variable       | Descripción                                   |
| -------------- | --------------------------------------------- |
| `DATABASE_URL` | Cadena de conexión principal de Prisma        |
| `DIRECT_URL`   | URL directa (igual a `DATABASE_URL` en local) |

Formato: `postgresql://USER:PASSWORD@HOST:5432/DB_NAME`

## Ejecución

```bash
# Desarrollo (watch mode)
npm run start:dev

# Producción
npm run build
npm run start:prod
```

El servidor corre en `http://localhost:3000`.  
Documentación Swagger disponible en `http://localhost:3000/api/docs`.

## Tecnologías

- **NestJS** 11 — framework principal
- **Prisma** 6 — ORM
- **TypeScript** 5.7
- **class-validator / class-transformer** — validación de DTOs
- **Swagger** (@nestjs/swagger 11) — documentación de la API
