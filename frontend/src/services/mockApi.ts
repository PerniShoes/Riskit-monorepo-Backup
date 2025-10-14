/**
 * Mock API - For frontend development without backend
 * Returns fake data to simulate backend responses
 */

import type {
  Action,
  TurnSubmitResponse,
  NewGameResponse,
  GameStateResponse,
  Territory,
  GameLogEntry,
  AttackResultData,
  ActionResult,
} from '../types/game';
import { TERRITORIES } from '../types/game';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || false;

// Mock game state
let mockGameState: GameStateResponse = {
  gameId: 'mock-game-123',
  turn: 1,
  currentPlayer: 1,
  phase: 'draft',
  armiesToPlace: 5,
  territories: [],
  players: [],
};

/**
 * Initialize mock territories with random distribution
 */
function initializeMockTerritories(playerCount: number): Territory[] {
  const shuffled = [...TERRITORIES].sort(() => Math.random() - 0.5);
  
  return shuffled.map((territory, index) => ({
    ...territory,
    owner: (index % playerCount) + 1,
    armies: 3,
  }));
}

/**
 * Simulate dice roll
 */
function rollDice(count: number): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1)
    .sort((a, b) => b - a);
}

/**
 * Simulate attack result
 */
function simulateAttack(
  attackerArmies: number,
  defenderArmies: number
): AttackResultData {
  const attackerDice = rollDice(Math.min(attackerArmies, 3));
  const defenderDice = rollDice(Math.min(defenderArmies, 2));

  let attackerLosses = 0;
  let defenderLosses = 0;

  // Compare dice
  for (let i = 0; i < Math.min(attackerDice.length, defenderDice.length); i++) {
    if (attackerDice[i] > defenderDice[i]) {
      defenderLosses++;
    } else {
      attackerLosses++;
    }
  }

  const conquered = defenderArmies - defenderLosses <= 0;

  return {
    attackerDice,
    defenderDice,
    attackerLosses,
    defenderLosses,
    conquered,
  };
}

/**
 * Mock API implementation
 */
export const mockApi = {
  createGame: async (
    players: Array<{ name: string; color: string }>
  ): Promise<NewGameResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay

    mockGameState = {
      gameId: 'mock-game-' + Date.now(),
      turn: 1,
      currentPlayer: 1,
      phase: 'draft',
      armiesToPlace: 5,
      territories: initializeMockTerritories(players.length),
      players: players.map((p, index) => ({
        id: index + 1,
        name: p.name,
        color: p.color,
        gold: 0,
        army: { infantry: 0, tanks: 0 },
        territoriesCount: 0,
        continentsControlled: [],
      })),
    };

    return {
      success: true,
      gameId: mockGameState.gameId,
      initialState: {
        territories: mockGameState.territories,
        players: mockGameState.players,
        currentPlayer: mockGameState.currentPlayer,
        turn: mockGameState.turn,
        phase: mockGameState.phase,
        armiesToPlace: mockGameState.armiesToPlace,
        gameLog: [],
        selectedTerritory: null,
        attackFromTerritory: null,
      },
    };
  },

  getGameState: async (gameId: string): Promise<GameStateResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return { ...mockGameState, gameId };
  },

  submitTurn: async (
    _gameId: string,
    playerId: number,
    actions: Action[]
  ): Promise<TurnSubmitResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const results = actions.map((action, index) => {
      if (action.type === 'draft') {
        // Find territory and add armies
        const territory = mockGameState.territories.find(
          (t) => t.id === action.territoryId
        );
        
        if (territory && territory.owner === playerId) {
          territory.armies += action.armies;
          
          return {
            actionIndex: index,
            type: 'draft' as const,
            success: true,
            message: `Rozmieszczono ${action.armies} armii na ${territory.name}`,
            updatedTerritory: {
              id: territory.id,
              armies: territory.armies,
            },
          };
        }
        
        return {
          actionIndex: index,
          type: 'draft' as const,
          success: false,
          message: 'Błąd rozmieszczania armii',
          error: 'Territory not found or not owned',
        };
      }

      if (action.type === 'attack') {
        const fromTerritory = mockGameState.territories.find(
          (t) => t.id === action.from
        );
        const toTerritory = mockGameState.territories.find(
          (t) => t.id === action.to
        );

        if (
          fromTerritory &&
          toTerritory &&
          fromTerritory.owner === playerId &&
          toTerritory.owner !== playerId
        ) {
          const attackResult = simulateAttack(
            Math.min(action.armies, 3),
            toTerritory.armies
          );

          fromTerritory.armies -= attackResult.attackerLosses;
          toTerritory.armies -= attackResult.defenderLosses;

          if (attackResult.conquered) {
            toTerritory.owner = playerId;
            toTerritory.armies = action.armies - attackResult.attackerLosses;
            fromTerritory.armies -= action.armies - attackResult.attackerLosses;
          }

          return {
            actionIndex: index,
            type: 'attack' as const,
            success: true,
            message: attackResult.conquered
              ? `Podbito ${toTerritory.name}!`
              : `Atak na ${toTerritory.name} - nie udało się podbić`,
            attackResult,
            updatedTerritories: [
              { id: fromTerritory.id, armies: fromTerritory.armies },
              {
                id: toTerritory.id,
                armies: toTerritory.armies,
                owner: toTerritory.owner ?? undefined,
              },
            ],
          };
        }

        return {
          actionIndex: index,
          type: 'attack' as const,
          success: false,
          message: 'Błąd ataku',
          error: 'Invalid attack',
        };
      }

      if (action.type === 'fortify') {
        const fromTerritory = mockGameState.territories.find(
          (t) => t.id === action.from
        );
        const toTerritory = mockGameState.territories.find(
          (t) => t.id === action.to
        );

        if (
          fromTerritory &&
          toTerritory &&
          fromTerritory.owner === playerId &&
          toTerritory.owner === playerId &&
          fromTerritory.armies > action.armies
        ) {
          fromTerritory.armies -= action.armies;
          toTerritory.armies += action.armies;

          return {
            actionIndex: index,
            type: 'fortify' as const,
            success: true,
            message: `Przeniesiono ${action.armies} armii`,
            updatedTerritories: [
              { id: fromTerritory.id, armies: fromTerritory.armies },
              { id: toTerritory.id, armies: toTerritory.armies },
            ],
          };
        }

        return {
          actionIndex: index,
          type: 'fortify' as const,
          success: false,
          message: 'Błąd fortyfikacji',
          error: 'Invalid fortify',
        };
      }

      // Default case - should never happen with proper typing
      return {
        actionIndex: index,
        type: 'draft' as const,
        success: false,
        message: 'Unknown action type',
        error: 'Unknown action',
      };
    }) as ActionResult[];

    // Switch to next player
    mockGameState.currentPlayer =
      mockGameState.currentPlayer === mockGameState.players.length
        ? 1
        : mockGameState.currentPlayer + 1;
    mockGameState.turn++;
    mockGameState.phase = 'draft';
    mockGameState.armiesToPlace = 5;

    const gameLog: GameLogEntry[] = results
      .filter((r) => r.success)
      .map((r) => ({
        turn: mockGameState.turn - 1,
        player: playerId,
        action: r.type,
        message: r.message,
        timestamp: Date.now(),
      }));

    return {
      success: true,
      turnEnded: true,
      results,
      gameState: {
        territories: mockGameState.territories,
        players: mockGameState.players,
        currentPlayer: mockGameState.currentPlayer,
        turn: mockGameState.turn,
        phase: mockGameState.phase,
        armiesToPlace: mockGameState.armiesToPlace,
        gameLog: [],
        selectedTerritory: null,
        attackFromTerritory: null,
      },
      gameLog,
    };
  },

  healthCheck: async () => {
    return { status: 'MOCK_OK' };
  },
};

/**
 * Conditional export - use mock or real API based on environment
 */
export const isMockEnabled = USE_MOCK;

export default mockApi;
