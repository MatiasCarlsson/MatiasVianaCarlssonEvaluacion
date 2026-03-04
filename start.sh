#!/usr/bin/env bash
set -euo pipefail

# Colores 
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
info()    { echo -e "${GREEN}[✔]${NC} $1"; }
warning() { echo -e "${YELLOW}[!]${NC} $1"; }
error()   { echo -e "${RED}[✘]${NC} $1"; exit 1; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo ""
echo "  Notes App — Setup & Start"
echo "────────────────────────────────────────"

# 1. Verificar Node.js 
command -v node >/dev/null 2>&1 || error "Node.js no encontrado. Instalá Node.js >= 20."
NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
[ "$NODE_VERSION" -ge 20 ] || error "Se requiere Node.js >= 20. Versión actual: $(node -v)"
info "Node.js $(node -v) detectado"

# 2. Configurar .env del backend 
BACKEND_DIR="$SCRIPT_DIR/backend"
ENV_FILE="$BACKEND_DIR/.env"
ENV_EXAMPLE="$BACKEND_DIR/.env.example"

if [ ! -f "$ENV_FILE" ]; then
  if [ -f "$ENV_EXAMPLE" ]; then
    cp "$ENV_EXAMPLE" "$ENV_FILE"
    info ".env creado desde .env.example en backend/"
  else
    error "No se encontró backend/.env ni backend/.env.example"
  fi
else
  info "backend/.env encontrado"
fi

# 3. Verificar puertos disponibles 
free_port() {
  local port=$1
  local pid
  local os
  os="$(uname 2>/dev/null || echo 'Windows')"

  if [[ "$os" == "Linux" || "$os" == "Darwin" ]]; then
    # Linux / macOS
    pid=$(lsof -ti tcp:"$port" 2>/dev/null || true)
  else
    # Windows / Git Bash
    pid=$(netstat -ano 2>/dev/null | grep ":$port " | grep LISTENING | awk '{print $NF}' | head -1 || true)
  fi

  if [ -n "$pid" ]; then
    warning "El puerto $port ya está en uso (PID $pid)."
    read -rp "  ¿Querés cerrarlo para continuar? [s/N] " kill_confirm
    if [[ "$kill_confirm" =~ ^[sS]$ ]]; then
      if [[ "$os" == "Linux" || "$os" == "Darwin" ]]; then
        kill -9 "$pid" 2>/dev/null && info "Puerto $port liberado." || error "No se pudo liberar el puerto $port. Cerrálo manualmente y volvé a ejecutar."
      else
        taskkill //PID "$pid" //F >/dev/null 2>&1 && info "Puerto $port liberado." || error "No se pudo liberar el puerto $port. Cerrálo manualmente y volvé a ejecutar."
      fi
    else
      error "Puerto $port ocupado. Cerrálo manualmente y volvé a ejecutar el script."
    fi
  fi
}

free_port 3000
free_port 5173

# ─── 4. Instalar dependencias del backend 
info "Instalando dependencias del backend..."
cd "$BACKEND_DIR"
npm install --silent

# ─── 5. Generar cliente Prisma y sincronizar schema 
info "Generando cliente Prisma..."
npx prisma generate

info "Sincronizando schema con la base de datos..."
npx prisma db push || error "Falló prisma db push. Verificá que la base de datos esté corriendo y las credenciales en backend/.env sean correctas."

# 6. Instalar dependencias del frontend 
info "Instalando dependencias del frontend..."
cd "$SCRIPT_DIR/frontend"
npm install --silent

# 7. Iniciar ambos servidores 
echo ""
echo "────────────────────────────────────────"
info "Iniciando servidores..."
echo ""
echo "  Backend  →  http://localhost:3000"
echo "  Swagger  →  http://localhost:3000/api/docs"
echo "  Frontend →  http://localhost:5173"
echo ""
echo "  Presioná Ctrl+C para detener ambos procesos."
echo "────────────────────────────────────────"
echo ""

# Matar ambos procesos al salir con Ctrl+C
trap 'echo ""; info "Deteniendo servidores..."; kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null; exit 0' SIGINT SIGTERM

cd "$BACKEND_DIR"
npm run start:dev &
BACKEND_PID=$!

cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

wait "$BACKEND_PID" "$FRONTEND_PID"
