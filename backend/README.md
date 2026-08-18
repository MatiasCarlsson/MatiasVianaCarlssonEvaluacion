# Notes API — Backend

REST API construida con **NestJS** con persistencia local en archivo **JSON** (sin base de datos externa).

## Requisitos

| Herramienta | Versión |
| ----------- | ------- |
| Node.js     | >= 20.x |
| pnpm        | >= 9.x  |

## Configuración

```bash
# 1. Instalar dependencias
pnpm install

# 2. Copiar y configurar variables de entorno
cp .env.example .env
```

No se necesita migrar ni generar nada: el archivo JSON se crea automáticamente en el primer arranque.

### Variables de entorno (`.env`)

| Variable       | Descripción                                              |
| -------------- | -------------------------------------------------------- |
| `JSON_DB_PATH` | Ruta del archivo JSON (default `./data/data.json`)      |
| `PORT`         | Puerto del servidor (default `3000`)                    |

## Ejecución

```bash
# Desarrollo (watch mode)
pnpm run start:dev

# Producción
pnpm run build
pnpm run start:prod
```

El servidor corre en `http://localhost:3000`.  
Documentación Swagger disponible en `http://localhost:3000/api/docs`.

## Persistencia

- Los datos se guardan en `backend/data/data.json` (notas, categorías y relaciones).
- Las escrituras se serializan con un lock en memoria para evitar corrupción por escrituras concurrentes.
- En entornos como Render, el filesystem es **efímero**: los datos se pierden en cada redeploy/reinicio salvo que montes un **Persistent Disk** (plan de pago) y apuntes `JSON_DB_PATH` a esa ruta (ej. `/var/data/data.json`).

## Tecnologías

- **NestJS** 11 — framework principal
- **TypeScript** 5.7
- **class-validator / class-transformer** — validación de DTOs
- **Swagger** (@nestjs/swagger 11) — documentación de la API
- **File system (Node)** — persistencia en JSON
