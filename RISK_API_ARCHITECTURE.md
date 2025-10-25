# Risk Game - Frontend-Backend API Architecture

## 🎯 Zasada podziału odpowiedzialności

### **FRONTEND** (React + TypeScript)
- ✅ Renderowanie mapy i UI
- ✅ Wyświetlanie stanu gry
- ✅ Obsługa interakcji użytkownika (kliknięcia, wybór terytoriów)
- ✅ Walidacja podstawowa (czy gracz kliknął swoje terytorium)
- ✅ Animacje i efekty wizualne
- ❌ **BRAK** logiki gry (przeliczanie ataków, walidacja ruchów)
- ❌ **BRAK** przechowywania stanu gry

### **BACKEND** (C++)
- ✅ **WSZYSTKIE** mechaniki gry Risk
- ✅ Walidacja wszystkich akcji graczy
- ✅ Przeliczanie ataków (rzuty kostkami)
- ✅ Zarządzanie turami i fazami
- ✅ Obliczanie wzmocnień (reinforcements)
- ✅ Przechowywanie stanu gry
- ✅ Zarządzanie graczami
- ✅ Historia ruchów (game log)

---

## 📡 API Endpoints

### 1. **Game State Management**

#### `GET /api/state`
**Cel**: Pobranie aktualnego stanu gry

**Response**:
```json
{
  "gameId": "uuid-game-123",
  "turn": 5,
  "currentPlayer": 2,
  "phase": "attack",
  "territories": [
    {
      "id": "Polska",
      "owner": 1,
      "armies": 5,
      "continent": "Europa"
    }
  ],
  "players": [
    {
      "id": 1,
      "name": "Gracz 1",
      "color": "#ff0000",
      "territoriesCount": 12,
      "armiesCount": 45,
      "cards": 3
    }
  ],
  "armiesToPlace": 0
}
```

#### `POST /api/state/new`
**Cel**: Rozpoczęcie nowej gry

**Request**:
```json
{
  "players": [
    { "name": "Gracz 1", "color": "#ff0000" },
    { "name": "Gracz 2", "color": "#00ff00" }
  ],
  "initialDistribution": "random"
}
```

**Response**:
```json
{
  "gameId": "uuid-game-123",
  "initialState": { /* pełny stan jak w GET /api/state */ }
}
```

---

### 2. **Draft Phase (Rozmieszczanie armii)**

#### `POST /api/draft/place`
**Cel**: Rozmieszczenie armii na terytorium

**Request**:
```json
{
  "gameId": "uuid-game-123",
  "territoryId": "Polska",
  "armies": 1
}
```

**Response**:
```json
{
  "success": true,
  "territory": {
    "id": "Polska",
    "armies": 6
  },
  "armiesToPlace": 4,
  "message": "Rozmieszczono 1 armię na Polska"
}
```

#### `GET /api/draft/reinforcements`
**Cel**: Obliczenie dostępnych wzmocnień dla aktualnego gracza

**Response**:
```json
{
  "total": 5,
  "breakdown": {
    "territories": 4,
    "continents": 1,
    "cards": 0
  }
}
```

---

### 3. **Attack Phase (Atak)**

#### `POST /api/attack/execute`
**Cel**: Wykonanie ataku z jednego terytorium na drugie

**Request**:
```json
{
  "gameId": "uuid-game-123",
  "from": "Polska",
  "to": "Niemcy",
  "attackingArmies": 3
}
```

**Response**:
```json
{
  "success": true,
  "attackResult": {
    "attackerDice": [6, 5, 3],
    "defenderDice": [4, 2],
    "attackerLosses": 0,
    "defenderLosses": 2,
    "conquered": true
  },
  "updatedTerritories": [
    {
      "id": "Polska",
      "armies": 1
    },
    {
      "id": "Niemcy",
      "owner": 1,
      "armies": 3
    }
  ],
  "message": "Atak udany! Podbito Niemcy",
  "playerEliminated": false
}
```

#### `GET /api/attack/possible`
**Cel**: Sprawdzenie możliwych ataków dla aktualnego gracza

**Query**: `?territoryId=Polska`

**Response**:
```json
{
  "from": "Polska",
  "possibleTargets": [
    {
      "id": "Niemcy",
      "owner": 2,
      "armies": 2,
      "canAttack": true
    },
    {
      "id": "Czechy",
      "owner": 3,
      "armies": 5,
      "canAttack": true
    }
  ]
}
```

---

### 4. **Fortify Phase (Fortyfikacja)**

#### `POST /api/fortify/move`
**Cel**: Przeniesienie armii między swoimi terytoriami

**Request**:
```json
{
  "gameId": "uuid-game-123",
  "from": "Polska",
  "to": "Ukraina",
  "armies": 3
}
```

**Response**:
```json
{
  "success": true,
  "updatedTerritories": [
    {
      "id": "Polska",
      "armies": 2
    },
    {
      "id": "Ukraina",
      "armies": 8
    }
  ],
  "message": "Przeniesiono 3 armie z Polska do Ukraina"
}
```

---

### 5. **Turn Management**

#### `POST /api/turn/end`
**Cel**: Zakończenie tury aktualnego gracza

**Request**:
```json
{
  "gameId": "uuid-game-123"
}
```

**Response**:
```json
{
  "success": true,
  "nextPlayer": 2,
  "nextPhase": "draft",
  "turn": 6,
  "reinforcements": 7,
  "message": "Tura gracza 1 zakończona. Kolej gracza 2"
}
```

#### `GET /api/turn/current`
**Cel**: Informacje o aktualnej turze

**Response**:
```json
{
  "turn": 5,
  "currentPlayer": 1,
  "phase": "attack",
  "timeRemaining": 120
}
```

---

### 6. **Player Management**

#### `GET /api/player/:id`
**Cel**: Szczegółowe informacje o graczu

**Response**:
```json
{
  "id": 1,
  "name": "Gracz 1",
  "color": "#ff0000",
  "territoriesCount": 15,
  "totalArmies": 52,
  "continents": ["Europa"],
  "cards": 3,
  "isAlive": true
}
```

#### `GET /api/player/:id/territories`
**Cel**: Lista terytoriów gracza

**Response**:
```json
{
  "playerId": 1,
  "territories": [
    {
      "id": "Polska",
      "armies": 5,
      "continent": "Europa",
      "connections": ["Niemcy", "Czechy", "Ukraina"]
    }
  ]
}
```

---

### 7. **Map Information**

#### `GET /api/map`
**Cel**: Mapa gry (statyczna, do inicjalizacji)

**Response**:
```json
{
  "territories": [
    {
      "id": "Polska",
      "name": "Polska",
      "continent": "Europa",
      "position": { "x": 250, "y": 180 },
      "connections": ["Niemcy", "Czechy", "Ukraina", "Litwa"]
    }
  ],
  "continents": {
    "Europa": {
      "bonus": 5,
      "territories": ["Polska", "Niemcy", "Francja", "..."]
    }
  }
}
```

---

### 8. **Game Log**

#### `GET /api/log`
**Cel**: Historia akcji w grze

**Query**: `?limit=20`

**Response**:
```json
{
  "log": [
    {
      "turn": 5,
      "player": 1,
      "action": "attack",
      "from": "Polska",
      "to": "Niemcy",
      "result": "conquered",
      "timestamp": 1634567890,
      "message": "Gracz 1 podbił Niemcy z Polska"
    }
  ]
}
```

---

### 9. **Risk Analysis (AI/Statystyki)**

#### `GET /api/risk/analysis`
**Cel**: Analiza ryzyka dla danego terytorium

**Query**: `?territoryId=Polska`

**Response**:
```json
{
  "territoryId": "Polska",
  "threatLevel": "medium",
  "enemyNeighbors": 2,
  "totalEnemyArmies": 12,
  "strategicValue": 8,
  "recommendations": [
    "Wzmocnij obronę - silni sąsiedzi",
    "Rozważ atak na Niemcy (słabe 2 armie)"
  ]
}
```

---

## 🔄 Przykładowy flow gry

### **Rozpoczęcie gry**
```
Frontend → POST /api/state/new
Backend → Inicjalizuje grę, losuje terytoria
Backend → Response z gameId i początkowym stanem
Frontend → Renderuje mapę z podziałem terytoriów
```

### **Faza Draft**
```
Frontend → User klika terytorium "Polska"
Frontend → POST /api/draft/place { territoryId: "Polska", armies: 1 }
Backend → Waliduje (czy swoje terytorium, czy ma armie)
Backend → Aktualizuje stan, zmniejsza armiesToPlace
Backend → Response z nowym stanem terytorium
Frontend → Aktualizuje wyświetlanie
```

### **Faza Attack**
```
Frontend → User wybiera "Polska" (własne)
Frontend → User wybiera "Niemcy" (wrogie, sąsiad)
Frontend → POST /api/attack/execute { from: "Polska", to: "Niemcy", armies: 3 }
Backend → Rzuca kostkami dla obu stron
Backend → Oblicza straty
Backend → Sprawdza czy conquered
Backend → Aktualizuje ownership jeśli tak
Backend → Response z wynikiem ataku
Frontend → Animuje walkę + pokazuje wynik
Frontend → Aktualizuje mapę
```

### **Zakończenie tury**
```
Frontend → User klika "Zakończ turę"
Frontend → POST /api/turn/end
Backend → Waliduje czy wszystkie fazy ukończone
Backend → Przełącza na następnego gracza
Backend → Oblicza reinforcements dla nowego gracza
Backend → Response z nowym stanem tury
Frontend → Aktualizuje UI, pokazuje nowego gracza
```

---

## 🗂️ Frontend - Struktura do refactoru

### **Usunąć z frontendu:**
- ❌ `useGameLogic.ts` - cała logika gry
- ❌ Funkcje: `placeArmy()`, `attack()`, `fortify()`, `endTurn()`
- ❌ Obliczenia: `calculateReinforcements()`, `calculateContinentBonus()`
- ❌ Zarządzanie stanem gry lokalnie

### **Zostawić/dodać na frontendzie:**
- ✅ `useGameApi.ts` - hook do komunikacji z API
- ✅ `GameMap.tsx` - renderowanie mapy
- ✅ `GameController.tsx` - UI kontroli (przyciski)
- ✅ `TerritoryCard.tsx` - karta wybranego terytorium
- ✅ Funkcje UI: `selectTerritory()`, `showAttackAnimation()`

### **Nowa struktura frontendu:**
```
src/
├── hooks/
│   ├── useGameApi.ts          # API calls do backendu
│   └── useGameState.ts         # Zarządzanie stanem z API
├── components/
│   ├── GameMap.tsx             # Mapa + terytoria
│   ├── GameController.tsx      # Kontrolki gry
│   ├── TerritoryInfo.tsx       # Info o wybranym terytorium
│   ├── PlayerPanel.tsx         # Panel graczy
│   ├── GameLog.tsx             # Historia akcji
│   └── AttackAnimation.tsx     # Animacje
├── services/
│   └── api.ts                  # Axios calls
└── types/
    └── game.ts                 # TypeScript types
```

---

## 🎮 Backend - Co dodać/zmienić

### **Istniejące endpointy:**
- `HealthEndpoint` ✅ 
- `PlayerEndpoint` ⚠️ (rozbudować)
- `StateEndpoint` ⚠️ (rozbudować)
- `MapEndpoint` ⚠️ (rozbudować)
- `RiskEndpoint` ⚠️ (rozbudować)

### **Nowe endpointy do dodania:**
- `DraftEndpoint` - Faza rozmieszczania
- `AttackEndpoint` - Faza ataku
- `FortifyEndpoint` - Faza fortyfikacji
- `TurnEndpoint` - Zarządzanie turami

### **Backend Systems (obecne):**
- `StateManager` - Zarządzanie fazami ✅
- `PlayerManager` - Zarządzanie graczami ✅
- `MapManager` - Zarządzanie mapą ✅

### **Nowe systemy do dodania:**
- `GameLogic` - Główna logika gry Risk
- `CombatSystem` - Mechanika walki (kostki)
- `TerritoryManager` - Zarządzanie terytoriami
- `ReinforcementCalculator` - Obliczanie wzmocnień

---

## 📝 Mock Data (do testów frontendu)

Frontend może używać mock data jeśli backend nie ma jeszcze endpointu:

```typescript
// src/services/mockApi.ts
export const mockGameState = {
  gameId: "mock-game-1",
  turn: 1,
  currentPlayer: 1,
  phase: "draft",
  territories: [ /* ... */ ],
  players: [ /* ... */ ]
};

export const mockAttack = (from: string, to: string) => {
  return {
    success: true,
    attackResult: {
      attackerDice: [6, 5, 4],
      defenderDice: [3, 2],
      attackerLosses: 0,
      defenderLosses: 2,
      conquered: true
    }
  };
};
```

---

## 🚀 Plan implementacji

### **Faza 1: Refactor Frontendu**
1. Stwórz `useGameApi.ts` z wszystkimi wywołaniami API
2. Usuń logikę z `useGameLogic.ts`, zostaw tylko stan UI
3. Podłącz komponenty do nowego API hooka
4. Dodaj mock responses dla testów

### **Faza 2: Rozbudowa Backendu**
1. Rozbuduj `StateEndpoint` - GET/POST game state
2. Dodaj `AttackEndpoint` - POST attack execution
3. Dodaj `DraftEndpoint` - POST place armies
4. Dodaj `TurnEndpoint` - POST end turn
5. Implementuj `CombatSystem` - dice rolling
6. Implementuj `ReinforcementCalculator`

### **Faza 3: Integracja**
1. Podmień mocks na prawdziwe API calls
2. Testy end-to-end
3. Debugging i fixes

---

## ✅ Checklist implementacji

- [ ] Frontend: Utworzenie `useGameApi.ts`
- [ ] Frontend: Refactor `GameController.tsx` 
- [ ] Frontend: Mock API responses
- [ ] Backend: `POST /api/state/new`
- [ ] Backend: `GET /api/state`
- [ ] Backend: `POST /api/draft/place`
- [ ] Backend: `POST /api/attack/execute`
- [ ] Backend: `POST /api/turn/end`
- [ ] Backend: `CombatSystem` implementation
- [ ] Integration testing
