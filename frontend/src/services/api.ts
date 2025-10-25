/**
 * API Service - Communication with Risk backend
 * Base URL configurable via environment variables
 */

import type {
  Action,
  TurnSubmitRequest,
  TurnSubmitResponse,
  NewGameRequest,
  NewGameResponse,
  GameStateResponse,
  Player,
} from '../types/game';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Fetch wrapper with error handling
 */
async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP Error: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

/**
 * API Methods
 */
export const api = {
  /**
   * Create a new game
   */
  createGame: async (
    players: Array<{ name: string; color: string }>
  ): Promise<NewGameResponse> => {
    const request: NewGameRequest = {
      players,
      settings: {
        initialDistribution: 'random',
        map: 'world',
      },
    };

    return apiCall<NewGameResponse>('/api/game/new', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  /**
   * Get current game state
   */
  getGameState: async (gameId: string): Promise<GameStateResponse> => {
    return apiCall<GameStateResponse>(`/api/state?gameId=${gameId}`);
  },

  /**
   * Submit turn with all actions
   */
  submitTurn: async (
    gameId: string,
    playerId: number,
    actions: Action[]
  ): Promise<TurnSubmitResponse> => {
    const request: TurnSubmitRequest = {
      gameId,
      playerId,
      actions,
    };

    return apiCall<TurnSubmitResponse>('/api/turn/submit', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  /**
   * Get player details
   */
  getPlayer: async (playerId: number): Promise<Player> => {
    return apiCall<Player>(`/api/player/${playerId}`);
  },

  /**
   * Get map data (static)
   */
  getMap: async () => {
    return apiCall('/api/map');
  },

  /**
   * Health check
   */
  healthCheck: async (): Promise<{ status: string }> => {
    return apiCall('/api/health');
  },
};

export default api;
