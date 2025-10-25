# RiskIT Monorepo

Gra strategiczna Risk z backend C++ i frontend React/TypeScript.

## Struktura

- `backend/` -> C++ HTTP server (CMake + Ninja)
- `frontend/` -> React + TypeScript (Vite)
- `backend_mock/` -> Node.js mock server (development)

## Quick Start

### Standardowy Development (lokalnie)
```bash
# Zainstaluj zależności
make install

# Uruchom pełne środowisko dev (backend + frontend)
make dev

# Lub osobno:
make backend-dev    # Backend na porcie 8081
make frontend-dev   # Frontend na porcie 5173
```

### Docker Development
```bash
# Uruchom wszystko w Docker
make docker-up

# Z debuggerem C++ (gdbserver na porcie 7777)
make docker-debug

# Zatrzymaj
make docker-down
```

### Inne komendy
```bash
make help         # Pełna lista komend
make build        # Zbuduj backend + frontend
make test         # Podstawowe testy zdrowia
make clean        # Wyczyść build artifacts
```

## URLs w Development
- Frontend: http://localhost:5173
- Backend: http://localhost:8081
- Mock Backend: http://localhost:8080

## Prerequisites

### Lokalny development:
- Node.js 18+ + npm
- CMake 3.15+
- Ninja build system
- GCC/Clang z C++17
- nlohmann/json (Ubuntu: `apt install nlohmann-json3-dev`)

### Docker development:
- Docker + Docker Compose

## Architecture

Zobacz `ARCHITECTURE.md` dla szczegółowego planu rozwoju architektury gry.
