# Development Scripts
scripts/
├── setup-dev.sh           # Konfiguracja środowiska dev
├── build-all.sh          # Build wszystkich komponentów  
├── run-tests.sh          # Uruchomienie testów
└── deploy.sh             # Deployment script (przyszłość)

# Game Logic (do implementacji)
backend/src/game/
├── GameEngine.hpp/cpp    # Silnik gry Risk
├── Territory.hpp/cpp     # Model terytorium
├── Player.hpp/cpp        # Model gracza  
├── Move.hpp/cpp          # Model ruchu
└── GameState.hpp/cpp     # Stan gry

# Game API Endpoints (do implementacji)  
backend/src/endpoints/
├── GameEndpoint.hpp/cpp     # /api/game/*
├── TerritoryEndpoint.hpp/cpp # /api/territories
└── MoveEndpoint.hpp/cpp     # /api/move

# Frontend Game Components (do rozwinięcia)
frontend/src/
├── components/game/
│   ├── GameBoard.tsx        # Główna plansza
│   ├── TerritoryCard.tsx    # Pojedyncze terytorium
│   ├── PlayerDashboard.tsx  # Panel gracza
│   └── GameLobby.tsx        # Lista/tworzenie gier
├── hooks/
│   ├── useGameState.ts      # Zarządzanie stanem gry
│   ├── useWebSocket.ts      # Real-time komunikacja
│   └── useGameActions.ts    # Akcje gracza
├── services/
│   ├── gameApi.ts          # HTTP calls do backend
│   └── websocketService.ts # WebSocket handling
└── types/
    ├── Game.ts             # TypeScript typy gry
    └── Player.ts           # TypeScript typy gracza

# Docker & Deployment
├── docker-compose.yml          # Standard dev setup
├── docker-compose.debug.yml    # Z debuggerem
├── docker-compose.prod.yml     # Production setup
└── k8s/                        # Kubernetes manifests (przyszłość)
    ├── backend-deployment.yaml
    ├── frontend-deployment.yaml  
    └── ingress.yaml

# Monitoring & Logs (przyszłość)
monitoring/
├── prometheus.yml
├── grafana-dashboard.json
└── docker-compose.monitoring.yml