# Risk Game - Batch Actions API (Uproszczona Architektura)

## 🎯 Koncepcja: Wszystko w jednym POST

Zamiast wielu małych requestów, **jeden duży request z tablicą akcji**.

---

## 📡 Główne API Endpoints

### 1. **POST /api/turn/submit** 🎮
**Cel**: Wysłanie WSZYSTKICH akcji z jednej tury gracza

**Request Body**:
```json
{
  "gameId": "uuid-game-123",
  "playerId": 1,
  "actions": [
    {
      "type": "draft",
      "timestamp": 1634567890123,
      "territoryId": "Torun",
      "armies": 3
    },
    {
      "type": "attack",
      "timestamp": 1634567890456,
      "from": "Torun",
      "to": "Warszawa",
      "armies": 5
    },
    {
      "type": "attack",
      "timestamp": 1634567890789,
      "from": "Warszawa",
      "to": "Krakow",
      "armies": 3
    },
    {
      "type": "fortify",
      "timestamp": 1634567891000,
      "from": "Gdansk",
      "to": "Torun",
      "armies": 2
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "turnEnded": true,
  "results": [
    {
      "actionIndex": 0,
      "type": "draft",
      "success": true,
      "updatedTerritory": {
        "id": "Torun",
        "armies": 8
      },
      "message": "Rozmieszczono 3 armie na Torun"
    },
    {
      "actionIndex": 1,
      "type": "attack",
      "success": true,
      "attackResult": {
        "attackerDice": [6, 5, 4],
        "defenderDice": [3, 2],
        "attackerLosses": 0,
        "defenderLosses": 2,
        "conquered": true
      },
      "updatedTerritories": [
        { "id": "Torun", "armies": 3 },
        { "id": "Warszawa", "owner": 1, "armies": 5 }
      ],
      "message": "Podbito Warszawa! Gracz 2 stracił terytorium"
    },
    {
      "actionIndex": 2,
      "type": "attack",
      "success": false,
      "error": "Niewystarczająco armii w Warszawa do ataku",
      "remainingState": {
        "from": "Warszawa",
        "armies": 1
      }
    },
    {
      "actionIndex": 3,
      "type": "fortify",
      "success": true,
      "updatedTerritories": [
        { "id": "Gdansk", "armies": 3 },
        { "id": "Torun", "armies": 5 }
      ],
      "message": "Przeniesiono 2 armie z Gdansk do Torun"
    }
  ],
  "gameState": {
    "turn": 6,
    "currentPlayer": 2,
    "phase": "draft",
    "armiesToPlace": 7,
    "territories": [
      {
        "id": "Torun",
        "owner": 1,
        "armies": 5,
        "continent": "Europa"
      }
      /* ... pozostałe terytoria */
    ],
    "players": [
      {
        "id": 1,
        "territoriesCount": 15,
        "totalArmies": 52
      },
      {
        "id": 2,
        "territoriesCount": 12,
        "totalArmies": 38
      }
    ]
  },
  "gameLog": [
    {
      "turn": 5,
      "player": 1,
      "message": "Gracz 1 podbił Warszawa",
      "timestamp": 1634567890456
    }
  ]
}
```

**Błędy** (jeśli cała tura niepoprawna):
```json
{
  "success": false,
  "error": "VALIDATION_ERROR",
  "message": "Nie Twoja kolej! Aktualny gracz: 2",
  "currentGameState": { /* ... */ }
}
```

---

### 2. **GET /api/state** 🎲
**Cel**: Pobranie aktualnego stanu gry (do odświeżenia UI)

**Response**:
```json
{
  "gameId": "uuid-game-123",
  "turn": 5,
  "currentPlayer": 1,
  "phase": "draft",
  "armiesToPlace": 5,
  "territories": [
    {
      "id": "Torun",
      "name": "Toruń",
      "continent": "Europa",
      "owner": 1,
      "armies": 5,
      "connections": ["Warszawa", "Gdansk", "Bydgoszcz"]
    }
    /* ... */
  ],
  "players": [
    {
      "id": 1,
      "name": "Gracz 1",
      "color": "#ff0000",
      "territoriesCount": 15,
      "totalArmies": 52,
      "isActive": true,
      "isEliminated": false
    }
  ]
}
```

---

### 3. **POST /api/game/new** 🆕
**Cel**: Rozpoczęcie nowej gry

**Request**:
```json
{
  "players": [
    { "name": "Gracz 1", "color": "#ff0000" },
    { "name": "Gracz 2", "color": "#00ff00" },
    { "name": "Gracz 3", "color": "#0000ff" }
  ],
  "settings": {
    "initialDistribution": "random",
    "map": "europe"
  }
}
```

**Response**:
```json
{
  "success": true,
  "gameId": "uuid-game-123",
  "initialState": {
    /* pełny stan jak w GET /api/state */
  }
}
```

---

### 4. **GET /api/map** 🗺️
**Cel**: Pobranie definicji mapy (statyczne dane)

**Response**:
```json
{
  "territories": [
    {
      "id": "Torun",
      "name": "Toruń",
      "continent": "Europa",
      "position": { "x": 250, "y": 180 },
      "connections": ["Warszawa", "Gdansk", "Bydgoszcz"]
    }
  ],
  "continents": {
    "Europa": {
      "bonus": 5,
      "color": "#3b82f6",
      "territories": ["Torun", "Warszawa", "Gdansk", "..."]
    },
    "Azja": {
      "bonus": 7,
      "color": "#10b981",
      "territories": ["..."]
    }
  }
}
```

---

### 5. **GET /api/player/:id** 👤
**Cel**: Szczegóły gracza

**Response**:
```json
{
  "id": 1,
  "name": "Gracz 1",
  "color": "#ff0000",
  "territoriesCount": 15,
  "totalArmies": 52,
  "continents": ["Europa"],
  "cards": 2,
  "isEliminated": false,
  "territories": [
    {
      "id": "Torun",
      "armies": 5
    }
  ]
}
```

---

### 6. **GET /api/analysis** 📊
**Cel**: Analiza Risk / AI suggestions

**Query**: `?territoryId=Torun`

**Response**:
```json
{
  "territoryId": "Torun",
  "threatLevel": "medium",
  "enemyNeighbors": [
    {
      "id": "Warszawa",
      "owner": 2,
      "armies": 3,
      "threat": "medium"
    }
  ],
  "strategicValue": 7,
  "recommendations": [
    "Wzmocnij obronę - wróg ma 3 armie w Warszawa",
    "Rozważ atak na Warszawa (słaba obrona)"
  ]
}
```

---

## 🎮 Typy akcji (action.type)

### **1. draft** (Rozmieszczanie armii)
```json
{
  "type": "draft",
  "timestamp": 1634567890123,
  "territoryId": "Torun",
  "armies": 3
}
```

### **2. attack** (Atak)
```json
{
  "type": "attack",
  "timestamp": 1634567890456,
  "from": "Torun",
  "to": "Warszawa",
  "armies": 5
}
```

### **3. fortify** (Fortyfikacja)
```json
{
  "type": "fortify",
  "timestamp": 1634567891000,
  "from": "Gdansk",
  "to": "Torun",
  "armies": 2
}
```

---

## 🔄 Frontend Flow

### **Rozpoczęcie gry**
```typescript
// 1. Gracz tworzy nową grę
const response = await fetch('/api/game/new', {
  method: 'POST',
  body: JSON.stringify({
    players: [
      { name: 'Gracz 1', color: '#ff0000' },
      { name: 'Gracz 2', color: '#00ff00' }
    ]
  })
});

const { gameId, initialState } = await response.json();

// 2. Frontend renderuje mapę z initialState
renderMap(initialState.territories);
```

### **Gra - zbieranie akcji**
```typescript
// Frontend LOKALNIE przechowuje akcje w trakcie tury
const actionsQueue = [];

// Gracz klika "rozmieść armię"
actionsQueue.push({
  type: 'draft',
  timestamp: Date.now(),
  territoryId: 'Torun',
  armies: 1
});

// Gracz klika "atakuj"
actionsQueue.push({
  type: 'attack',
  timestamp: Date.now(),
  from: 'Torun',
  to: 'Warszawa',
  armies: 5
});

// Itd...
```

### **Koniec tury - submit wszystkiego**
```typescript
// Gracz klika "Zakończ turę"
const response = await fetch('/api/turn/submit', {
  method: 'POST',
  body: JSON.stringify({
    gameId: currentGameId,
    playerId: currentPlayer,
    actions: actionsQueue
  })
});

const result = await response.json();

// Backend przetwarza WSZYSTKIE akcje i zwraca wyniki
result.results.forEach((actionResult, index) => {
  if (actionResult.success) {
    console.log(`Akcja ${index}: ${actionResult.message}`);
    if (actionResult.type === 'attack') {
      showAttackAnimation(actionResult.attackResult);
    }
  } else {
    console.error(`Akcja ${index} nie powiodła się: ${actionResult.error}`);
  }
});

// Aktualizuj UI z nowym stanem
updateGameState(result.gameState);
```

---

## 🖥️ Backend - Co musi zrobić

### **Endpoint: POST /api/turn/submit**

**Pseudo-kod backendu**:
```cpp
Response TurnEndpoint::HPOST() {
    // 1. Parse JSON
    auto json = parseBody();
    string gameId = json["gameId"];
    int playerId = json["playerId"];
    auto actions = json["actions"]; // array
    
    // 2. Walidacja
    if (!validateGameId(gameId)) {
        return errorResponse("Nieprawidłowy gameId");
    }
    
    if (!isPlayerTurn(playerId)) {
        return errorResponse("Nie Twoja kolej!");
    }
    
    // 3. Sortuj akcje według timestamp
    std::sort(actions.begin(), actions.end(), 
        [](const auto& a, const auto& b) {
            return a["timestamp"] < b["timestamp"];
        });
    
    // 4. Wykonaj akcje PO KOLEI
    vector<ActionResult> results;
    for (int i = 0; i < actions.size(); i++) {
        auto action = actions[i];
        ActionResult result;
        result.actionIndex = i;
        result.type = action["type"];
        
        if (action["type"] == "draft") {
            result = executeDraft(action);
        }
        else if (action["type"] == "attack") {
            result = executeAttack(action);
        }
        else if (action["type"] == "fortify") {
            result = executeFortify(action);
        }
        
        results.push_back(result);
        
        // Jeśli akcja nie powiodła się, kontynuuj (lub przerwij - do decyzji)
        if (!result.success) {
            // Można tutaj zdecydować czy przerwać czy kontynuować
        }
    }
    
    // 5. Zakończ turę, przełącz gracza
    endTurn();
    
    // 6. Zwróć wyniki + nowy stan
    json response;
    response["success"] = true;
    response["results"] = results;
    response["gameState"] = getCurrentGameState();
    response["gameLog"] = getRecentGameLog(10);
    
    return Response(200, response.dump());
}
```

---

## 🏗️ Backend - Struktura klas

### **Nowe klasy do dodania:**

```cpp
// TurnEndpoint.hpp
class TurnEndpoint : public EndpointBase {
public:
    Response HPOST() override; // Submit turn
    
private:
    ActionResult executeDraft(const json& action);
    ActionResult executeAttack(const json& action);
    ActionResult executeFortify(const json& action);
};

// GameLogic.hpp (nowa klasa - główna logika)
class GameLogic {
public:
    ActionResult draft(int playerId, string territoryId, int armies);
    ActionResult attack(int playerId, string from, string to, int armies);
    ActionResult fortify(int playerId, string from, string to, int armies);
    
    AttackResult rollDice(int attackerArmies, int defenderArmies);
    int calculateReinforcements(int playerId);
    bool checkVictory(int playerId);
};

// CombatSystem.hpp (mechanika walki)
class CombatSystem {
public:
    AttackResult executeCombat(int attackerDice, int defenderDice);
    vector<int> rollDice(int count);
    
private:
    std::random_device rd;
    std::mt19937 gen;
};
```

---

## 📦 Zalety tego podejścia

✅ **Jeden request** zamiast wielu (mniej obciążenia)
✅ **Wszystkie akcje atomowo** - albo wszystkie się udadzą albo żadna
✅ **Timestamp** zapewnia kolejność akcji
✅ **Prostszy frontend** - zbiera akcje i wysyła na koniec
✅ **Backend ma pełną kontrolę** - walidacja, przeliczenia
✅ **Łatwiej debugować** - cała tura w jednym logu
✅ **Rollback łatwiejszy** - jeśli coś się nie uda

---

## 📝 Frontend - Nowa struktura

```typescript
// src/hooks/useGameApi.ts
export function useGameApi() {
  const [actionsQueue, setActionsQueue] = useState<Action[]>([]);
  
  const addAction = (action: Action) => {
    setActionsQueue(prev => [...prev, {
      ...action,
      timestamp: Date.now()
    }]);
  };
  
  const submitTurn = async () => {
    const response = await fetch('/api/turn/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gameId: gameId,
        playerId: currentPlayer,
        actions: actionsQueue
      })
    });
    
    const result = await response.json();
    
    // Wyczyść kolejkę
    setActionsQueue([]);
    
    return result;
  };
  
  return { addAction, submitTurn, actionsQueue };
}
```

---

## 🚀 Plan implementacji

### **Faza 1: Backend Core**
1. ✅ Utworzyć `TurnEndpoint.cpp/hpp`
2. ✅ Utworzyć `GameLogic.cpp/hpp`
3. ✅ Utworzyć `CombatSystem.cpp/hpp`
4. ✅ Implementacja `POST /api/turn/submit`
5. ✅ Implementacja mechaniki: draft, attack, fortify
6. ✅ Testy jednostkowe

### **Faza 2: Frontend Refactor**
1. ✅ Utworzyć `useGameApi.ts`
2. ✅ Usunąć logikę z `useGameLogic.ts`
3. ✅ Mock API dla testów
4. ✅ Kolejkowanie akcji w UI
5. ✅ Animacje wyników ataku

### **Faza 3: Integracja**
1. ✅ Połączenie frontend → backend
2. ✅ End-to-end testy
3. ✅ Debugging

---

## ✅ Czy to lepsze rozwiązanie?

**TAK!** 🎉 Bo:
- 🎯 **Prostsze** - jeden endpoint zamiast pięciu
- ⚡ **Szybsze** - mniej HTTP requestów
- 🔒 **Bezpieczniejsze** - backend waliduje całą turę
- 🎮 **Realistyczne** - gra Risk to tury, nie pojedyncze akcje
- 📦 **Łatwiejsze do rozbudowy** - dodanie nowego typu akcji to tylko nowy "type"

---

Czy ta architektura Ci pasuje? 🚀
