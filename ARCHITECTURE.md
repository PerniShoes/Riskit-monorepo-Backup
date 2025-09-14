# Architektura RiskIT - Rekomendacje i Plan Rozwoju

## Obecny Stan
Projekt ma solidne fundamenty z czystą architekturą:
- **Backend**: C++ z wzorcem Endpoint + abstrakcja HTTP servera
- **Frontend**: React/TypeScript z Material-UI
- **Komunikacja**: REST API przez proxy Vite

## Główne Rekomendacje Architektoniczne

### 1. Struktura Gry Risk - Model Danych
```cpp
// Nowe klasse do dodania w backend/src/game/
class Territory {
    std::string name;
    int playerId;
    int armyCount;
    std::vector<std::string> neighbors;
};

class GameState {
    std::map<std::string, Territory> territories;
    std::vector<Player> players;
    int currentPlayerTurn;
    GamePhase phase; // DEPLOY, ATTACK, FORTIFY
    std::vector<Move> gameHistory;
};

class GameEngine {
    GameState state;
    bool isValidMove(const Move& move);
    GameResult processMove(const Move& move);
    void nextPhase();
};
```

### 2. Backend - Rozszerzenie Endpointów
**Nowe endpointy do dodania:**
- `/api/game/create` - tworzenie nowej gry
- `/api/game/{id}/join` - dołączanie gracza 
- `/api/game/{id}/move` - wykonanie ruchu
- `/api/game/{id}/state` - pobranie stanu gry
- `/api/territories` - lista terytoriów i sąsiadów
- `/api/game/{id}/history` - historia ruchów

### 3. Współbieżność i Stanowość
**Problem**: Obecny server nie jest thread-safe ani stateful
**Rozwiązanie**:
```cpp
class GameManager {
    static GameManager& getInstance();
    std::mutex gamesMutex;
    std::map<std::string, std::shared_ptr<GameEngine>> activeGames;
    
    std::shared_ptr<GameEngine> getGame(const std::string& gameId);
    std::string createGame();
    bool joinGame(const std::string& gameId, const Player& player);
};
```

### 4. Persistence (Opcjonalnie)
**Opcja A**: SQLite dla prostoty
**Opcja B**: JSON files dla dev, później PostgreSQL
**Opcja C**: Redis dla session storage

### 5. Frontend - Komponenty Gry
```
src/components/
├── game/
│   ├── GameBoard.tsx       # Główna plansza
│   ├── TerritoryCard.tsx   # Pojedyncze terytorium
│   ├── PlayerPanel.tsx     # Panel gracza
│   ├── MoveHistory.tsx     # Historia ruchów
│   └── GameLobby.tsx       # Lobby/lista gier
├── ui/
│   ├── Button.tsx
│   ├── Modal.tsx
│   └── LoadingSpinner.tsx
└── hooks/
    ├── useGameState.ts
    ├── useWebSocket.ts     # Dla real-time
    └── useGameActions.ts
```

### 6. Real-time Communication
**WebSocket integration**:
- Backend: Dodać WebSocket server obok HTTP
- Frontend: Hook do subskrypcji zmian stanu gry
- Events: `gameStateChanged`, `playerJoined`, `moveExecuted`

### 7. Testowanie
```
tests/
├── backend/
│   ├── unit/
│   │   ├── test_game_engine.cpp
│   │   └── test_endpoints.cpp
│   └── integration/
│       └── test_full_game.cpp
└── frontend/
    ├── components/
    └── e2e/
```

## Implementacja Dockera z Debuggerem

### Debugging C++ w Dockerze
```bash
# Uruchom kontener z debuggerem
make docker-debug

# Podłącz GDB z hosta
gdb
(gdb) target remote localhost:7777
(gdb) continue
```

### Development Workflow
```bash
# Standardowy development
make dev

# Z Dockerem
make docker-up

# Debugging w Dockerze  
make docker-debug
```

## Plan Implementacji (Kolejność)

1. **Faza 1**: Docker setup ✅
   - Dockerfiles
   - docker-compose
   - Makefile w root

2. **Faza 2**: Podstawowa logika gry
   - GameEngine klasa
   - Territory i GameState
   - Nowe endpointy

3. **Faza 3**: Frontend komponenty
   - GameBoard component
   - Integracja z nowymi API
   - UI/UX improvements

4. **Faza 4**: Real-time features
   - WebSocket integration
   - Live game updates
   - Multi-player support

5. **Faza 5**: Production ready
   - Persistence
   - Authentication
   - Load balancing
   - Monitoring

## Skalowanie w Przyszłości

### Mikroserwisy (gdy potrzebne):
- **Game Service**: C++ (silnik gry)
- **Player Service**: Node.js/Go (user management)  
- **Match Service**: Go/Rust (matchmaking)
- **Notification Service**: WebSocket hub

### Infrastructure:
- **Database**: PostgreSQL + Redis
- **Message Queue**: RabbitMQ/Apache Kafka
- **Load Balancer**: nginx/Traefik
- **Monitoring**: Prometheus + Grafana

## Immediate Next Steps
1. Przetestuj Docker setup: `make docker-up`
2. Zaimplementuj podstawowy GameEngine
3. Dodaj `/api/game` endpointy
4. Stwórz GameBoard component
5. Dodaj WebSocket support