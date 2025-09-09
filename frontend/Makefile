# Makefile for frontend development convenience (use inside WSL)

.PHONY: build-backend run-backend stop-backend restart-backend start reset-backend dev install

BUILD_DIR=../backend/build
BINARY=$(BUILD_DIR)/riskit_server
LOG=../backend/backend.log
PID=../backend/backend.pid

build-backend:
	@echo "Configuring and building backend (Ninja)..."
	cd .. && rm -rf backend/build && cmake -S backend -B backend/build -G Ninja && cmake --build backend/build

run-backend: build-backend
	@echo "Starting backend in background..."
	@nohup $(BINARY) > $(LOG) 2>&1 & echo $$! > $(PID) || true
	@sleep 0.2
	@echo "Backend started, PID=$$(cat $(PID))"

stop-backend:
	@echo "Stopping backend if running..."
	-@kill $$(cat $(PID)) 2>/dev/null || true
	-@pkill -f riskit_server 2>/dev/null || true
	-@rm -f $(PID)

restart-backend: stop-backend run-backend

reset-backend:
	@echo "Removing build and rebuilding backend"
	cd .. && rm -rf backend/build && cmake -S backend -B backend/build -G Ninja && cmake --build backend/build
	$(MAKE) run-backend

start: run-backend dev

install:
	@echo "Installing frontend dependencies..."
	npm install

dev:
	@echo "Starting frontend dev (in this terminal)"
	npm run dev
