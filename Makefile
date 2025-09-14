# Makefile for RiskIT Monorepo Development (WSL/Linux)
# Centralized commands for full-stack development

.PHONY: help install build dev start stop clean reset docker-up docker-down docker-debug frontend-dev backend-dev test

# Directories
BACKEND_DIR = backend
FRONTEND_DIR = frontend
BUILD_DIR = $(BACKEND_DIR)/build
BINARY = $(BUILD_DIR)/riskit_server
LOG = $(BACKEND_DIR)/backend.log
PID = $(BACKEND_DIR)/backend.pid

# Default target
help:
	@echo "RiskIT Monorepo Development Commands"
	@echo "==================================="
	@echo "Setup:"
	@echo "  install          - Install all dependencies (frontend npm + backend deps)"
	@echo ""
	@echo "Development:"
	@echo "  dev              - Start full development environment (backend + frontend)"
	@echo "  frontend-dev     - Start only frontend dev server"
	@echo "  backend-dev      - Build and start only backend"
	@echo "  start            - Alias for dev"
	@echo ""
	@echo "Building:"
	@echo "  build            - Build both backend and frontend"
	@echo "  build-backend    - Build only C++ backend (Ninja)"
	@echo "  build-frontend   - Build only frontend (production)"
	@echo ""
	@echo "Docker:"
	@echo "  docker-up        - Start all services with Docker Compose"
	@echo "  docker-debug     - Start with debug setup (gdbserver)"
	@echo "  docker-down      - Stop all Docker services"
	@echo ""
	@echo "Maintenance:"
	@echo "  stop             - Stop running backend processes"
	@echo "  clean            - Clean build artifacts"
	@echo "  reset            - Clean and rebuild everything"
	@echo "  test             - Run basic health checks"

# Installation
install:
	@echo "Installing dependencies..."
	@echo "Frontend (npm):"
	cd $(FRONTEND_DIR) && npm install
	@echo "Backend dependencies should be installed via apt/vcpkg (see Dockerfile)"

# Building
build: build-backend build-frontend

build-backend:
	@echo "Building C++ backend with Ninja..."
	rm -rf $(BUILD_DIR)
	cmake -S $(BACKEND_DIR) -B $(BUILD_DIR) -G Ninja -DCMAKE_BUILD_TYPE=Debug
	cmake --build $(BUILD_DIR)

build-frontend:
	@echo "Building frontend for production..."
	cd $(FRONTEND_DIR) && npm run build

# Development servers
dev: backend-dev frontend-dev

backend-dev: build-backend
	@echo "Starting C++ backend in background..."
	@nohup $(BINARY) > $(LOG) 2>&1 & echo $$! > $(PID)
	@sleep 1
	@if [ -f $(PID) ]; then \
		echo "Backend started, PID=$$(cat $(PID))"; \
		echo "Logs: tail -f $(LOG)"; \
	else \
		echo "Failed to start backend"; \
		exit 1; \
	fi

frontend-dev:
	@echo "Starting frontend dev server..."
	@echo "Will proxy /api requests to http://localhost:8081"
	cd $(FRONTEND_DIR) && npm run dev

start: dev

# Process management
stop:
	@echo "Stopping backend processes..."
	-@if [ -f $(PID) ]; then kill $$(cat $(PID)) 2>/dev/null; fi
	-@pkill -f riskit_server 2>/dev/null || true
	-@rm -f $(PID)
	@echo "Backend stopped"

# Docker operations
docker-up:
	@echo "Starting Docker Compose services..."
	@if ! docker info > /dev/null 2>&1; then \
		echo "❌ Docker is not running or accessible"; \
		echo "WSL Docker solutions:"; \
		echo "  1. Install Docker Desktop for Windows"; \
		echo "  2. Or try: sudo dockerd --iptables=false &"; \
		echo "  3. Or use local development: make dev"; \
		exit 1; \
	fi
	docker compose up --build -d
	@echo "Services available at:"
	@echo "  Frontend: http://localhost:5173"
	@echo "  Backend:  http://localhost:8081"
	@echo "  Mock:     http://localhost:8080"

docker-debug:
	@echo "Starting Docker Compose with debug setup..."
	@if ! docker info > /dev/null 2>&1; then \
		echo "❌ Docker is not running. See 'make docker-up' for solutions"; \
		exit 1; \
	fi
	docker compose -f docker-compose.debug.yml up --build -d
	@echo "Debug setup available:"
	@echo "  Frontend: http://localhost:5173"
	@echo "  Backend:  http://localhost:8081"
	@echo "  GDB:      localhost:7777 (gdbserver)"

docker-down:
	@echo "Stopping Docker services..."
	@if docker info > /dev/null 2>&1; then \
		docker compose down; \
		docker compose -f docker-compose.debug.yml down 2>/dev/null || true; \
	else \
		echo "Docker not running - nothing to stop"; \
	fi

# Maintenance
clean:
	@echo "Cleaning build artifacts..."
	rm -rf $(BUILD_DIR)
	rm -f $(LOG) $(PID)
	cd $(FRONTEND_DIR) && rm -rf dist node_modules/.vite

reset: stop clean build
	@echo "Full reset completed"

# Testing
test: build-backend
	@echo "Running basic health checks..."
	@echo "Starting backend temporarily..."
	@nohup $(BINARY) > $(LOG) 2>&1 & echo $$! > $(PID)
	@sleep 2
	@if curl -s -f http://localhost:8081/api/health > /dev/null; then \
		echo "✓ Backend health check passed"; \
	else \
		echo "✗ Backend health check failed"; \
		cat $(LOG) | tail -10; \
		exit 1; \
	fi
	@$(MAKE) stop

# Info
info:
	@echo "System Information:"
	@echo "=================="
	@echo "OS: $$(uname -a)"
	@echo "Node: $$(node --version 2>/dev/null || echo 'Not installed')"
	@echo "npm: $$(npm --version 2>/dev/null || echo 'Not installed')"
	@echo "CMake: $$(cmake --version 2>/dev/null | head -1 || echo 'Not installed')"
	@echo "GCC: $$(gcc --version 2>/dev/null | head -1 || echo 'Not installed')"
	@echo "Docker: $$(docker --version 2>/dev/null || echo 'Not installed')"