import { useState, useCallback } from 'react';
import type { Territory, GameState } from '../types/game';

/**
 * Simplified game logic hook - manages only UI state.
 * All game logic (combat, reinforcements, etc.) is handled by the backend.
 * 
 * This hook only tracks:
 * - Current game state (from backend)
 * - UI selections (which territory is selected)
 * - Current phase for UI purposes
 */
export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);
  const [attackFromTerritory, setAttackFromTerritory] = useState<Territory | null>(null);

  /**
   * Update game state from backend response
   */
  const updateGameState = useCallback((newState: GameState) => {
    setGameState(newState);
    // Clear selections when game state updates
    setSelectedTerritory(null);
    setAttackFromTerritory(null);
  }, []);

  /**
   * Select a territory (for draft, attack source, or fortify)
   */
  const selectTerritory = useCallback((territory: Territory) => {
    const phase = gameState?.phase;
    const currentPlayer = gameState?.currentPlayer;
    
    if (!phase || currentPlayer === undefined) return;

    const isOwnTerritory = territory.owner === currentPlayer;
    
    if (phase === 'draft') {
      // In draft phase, can only select own territories
      if (isOwnTerritory) {
        setSelectedTerritory(territory);
        setAttackFromTerritory(null);
      }
    } else if (phase === 'attack') {
      // Attack phase logic
      if (!attackFromTerritory) {
        // First selection - must be own territory with > 1 army
        if (isOwnTerritory && territory.armies > 1) {
          setSelectedTerritory(territory);
          setAttackFromTerritory(territory);
        }
      } else {
        // Second selection - must be enemy adjacent territory
        const isAdjacent = attackFromTerritory.connections.includes(territory.id);
        if (!isOwnTerritory && isAdjacent) {
          setSelectedTerritory(territory);
        } else if (isOwnTerritory && territory.armies > 1) {
          // Select new attacking territory
          setSelectedTerritory(territory);
          setAttackFromTerritory(territory);
        }
      }
    } else if (phase === 'fortify') {
      if (isOwnTerritory) {
        setSelectedTerritory(territory);
      }
    }
  }, [gameState, attackFromTerritory]);

  /**
   * Clear territory selections
   */
  const clearSelections = useCallback(() => {
    setSelectedTerritory(null);
    setAttackFromTerritory(null);
  }, []);

  /**
   * Get valid attack targets for a territory
   */
  const getValidTargets = useCallback((territory: Territory): Territory[] => {
    if (!gameState || territory.owner !== gameState.currentPlayer || territory.armies <= 1) {
      return [];
    }

    return gameState.territories.filter(t =>
      territory.connections.includes(t.id) && 
      t.owner !== gameState.currentPlayer
    );
  }, [gameState]);

  /**
   * Check if an attack is valid
   */
  const canAttack = useCallback((from: Territory, to: Territory): boolean => {
    if (!gameState) return false;
    
    const isAdjacent = from.connections.includes(to.id);
    return (
      from.owner === gameState.currentPlayer &&
      to.owner !== gameState.currentPlayer &&
      from.armies > 1 &&
      isAdjacent
    );
  }, [gameState]);

  return {
    gameState,
    selectedTerritory,
    attackFromTerritory,
    updateGameState,
    selectTerritory,
    clearSelections,
    getValidTargets,
    canAttack,
  };
}