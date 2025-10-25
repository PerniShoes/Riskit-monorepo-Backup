import { useState, useCallback } from 'react';
import type {
  Action,
  DraftAction,
  AttackAction,
  FortifyAction,
  TurnSubmitResponse,
  GameStateResponse,
} from '../types/game';
import { api } from '../services/api';

/**
 * Hook for managing game actions and API communication.
 * 
 * Provides:
 * - Action queue management
 * - Adding different action types
 * - Submitting turn to backend
 * - Clearing action queue
 */
export function useGameApi(gameId: string, playerId: number) {
  const [actionQueue, setActionQueue] = useState<Action[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  /**
   * Add a draft action to the queue.
   * If there's already a draft action for this territory, increment the army count.
   */
  const addDraftAction = useCallback((territoryId: string, armies: number) => {
    setActionQueue((prev) => {
      // Check if there's already a draft action for this territory
      const existingIndex = prev.findIndex(
        (action) => action.type === 'draft' && action.territoryId === territoryId
      );

      if (existingIndex !== -1) {
        // Update existing action by adding armies
        const updatedQueue = [...prev];
        const existingAction = updatedQueue[existingIndex] as DraftAction;
        updatedQueue[existingIndex] = {
          ...existingAction,
          armies: existingAction.armies + armies,
          timestamp: Date.now(), // Update timestamp
        };
        return updatedQueue;
      } else {
        // Add new action
        const action: DraftAction = {
          type: 'draft',
          timestamp: Date.now(),
          territoryId,
          armies,
        };
        return [...prev, action];
      }
    });
  }, []);

  /**
   * Add an attack action to the queue.
   * Multiple attacks from same source to same target will be queued separately
   * (each attack is a separate dice roll).
   */
  const addAttackAction = useCallback(
    (from: string, to: string, armies: number) => {
      const action: AttackAction = {
        type: 'attack',
        timestamp: Date.now(),
        from,
        to,
        armies,
      };
      setActionQueue((prev) => [...prev, action]);
    },
    []
  );

  /**
   * Add a fortify action to the queue.
   * If there's already a fortify action for this route, increment the army count.
   */
  const addFortifyAction = useCallback(
    (from: string, to: string, armies: number) => {
      setActionQueue((prev) => {
        // Check if there's already a fortify action for this route
        const existingIndex = prev.findIndex(
          (action) =>
            action.type === 'fortify' &&
            action.from === from &&
            action.to === to
        );

        if (existingIndex !== -1) {
          // Update existing action by adding armies
          const updatedQueue = [...prev];
          const existingAction = updatedQueue[existingIndex] as FortifyAction;
          updatedQueue[existingIndex] = {
            ...existingAction,
            armies: existingAction.armies + armies,
            timestamp: Date.now(), // Update timestamp
          };
          return updatedQueue;
        } else {
          // Add new action
          const action: FortifyAction = {
            type: 'fortify',
            timestamp: Date.now(),
            from,
            to,
            armies,
          };
          return [...prev, action];
        }
      });
    },
    []
  );

  /**
   * Remove an action from the queue
   */
  const removeAction = useCallback((index: number) => {
    setActionQueue((prev) => prev.filter((_, i) => i !== index));
  }, []);

  /**
   * Clear all actions from the queue
   */
  const clearActions = useCallback(() => {
    setActionQueue([]);
    setSubmitError(null);
  }, []);

  /**
   * Submit all queued actions to the backend
   */
  const submitTurn = useCallback(async (): Promise<TurnSubmitResponse | null> => {
    if (actionQueue.length === 0) {
      setSubmitError('No actions to submit');
      return null;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Actions are already sorted by timestamp as they were added chronologically
      const response = await api.submitTurn(gameId, playerId, actionQueue);
      
      if (response.success) {
        // Clear queue on successful submission
        setActionQueue([]);
      } else {
        setSubmitError('Turn submission failed');
      }
      
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSubmitError(errorMessage);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [gameId, playerId, actionQueue]);

  /**
   * Fetch current game state
   */
  const fetchGameState = useCallback(async (): Promise<GameStateResponse | null> => {
    try {
      return await api.getGameState(gameId);
    } catch (error) {
      console.error('Failed to fetch game state:', error);
      return null;
    }
  }, [gameId]);

  return {
    // State
    actionQueue,
    isSubmitting,
    submitError,
    
    // Actions
    addDraftAction,
    addAttackAction,
    addFortifyAction,
    removeAction,
    clearActions,
    
    // API calls
    submitTurn,
    fetchGameState,
  };
}
