import { useState, useCallback, useEffect } from 'react';
import type { Territory, Player, GameState, GameLogEntry, AttackResult } from '../types/game';
import { TERRITORIES, CONTINENTS } from '../types/game';

const INITIAL_ARMIES_PER_PLAYER = 3;
const MIN_ARMIES_IN_TERRITORY = 1;

export function useGameLogic(players: Player[]) {
  const [gameState, setGameState] = useState<GameState>({
    territories: [],
    players: players,
    currentPlayer: 1,
    turn: 1,
    phase: 'draft',
    armiesToPlace: 5,
    gameLog: [],
    selectedTerritory: null,
    attackFromTerritory: null,
  });

  const initializeGame = useCallback(() => {
    console.log('Initializing game with', players.length, 'players');
    // Randomly distribute territories among players
    const shuffledTerritories = [...TERRITORIES].sort(() => Math.random() - 0.5);
    const playersCount = players.length;
    
    const initializedTerritories = shuffledTerritories.map((territory, index) => ({
      ...territory,
      owner: (index % playersCount) + 1,
      armies: INITIAL_ARMIES_PER_PLAYER,
    }));

    const initialLog: GameLogEntry = {
      turn: 1,
      player: 0,
      action: 'draft',
      message: 'Gra rozpoczęta! Terytoria zostały losowo rozdzielone.',
      timestamp: Date.now(),
    };

    console.log('Setting territories:', initializedTerritories.length);

    setGameState(prev => ({
      ...prev,
      territories: initializedTerritories,
      gameLog: [initialLog],
      armiesToPlace: calculateReinforcements(1, initializedTerritories),
    }));
  }, [players]);

  // Initialize game
  useEffect(() => {
    console.log('useGameLogic: players changed', players.length);
    if (players.length > 0 && gameState.territories.length === 0) {
      console.log('Initializing game...');
      initializeGame();
    }
  }, [players, initializeGame]);

  const calculateReinforcements = (playerId: number, territories: Territory[]) => {
    const playerTerritories = territories.filter(t => t.owner === playerId);
    const territoryBonus = Math.floor(playerTerritories.length / 3);
    const continentBonus = calculateContinentBonus(playerId, territories);
    return Math.max(3, territoryBonus + continentBonus);
  };

  const calculateContinentBonus = (playerId: number, territories: Territory[]) => {
    let bonus = 0;
    Object.entries(CONTINENTS).forEach(([continentName, continentData]) => {
      const continentTerritories = territories.filter(t => t.continent === continentName);
      const playerOwnedCount = continentTerritories.filter(t => t.owner === playerId).length;
      
      if (playerOwnedCount === continentTerritories.length) {
        bonus += continentData.bonus;
      }
    });
    return bonus;
  };

  const addToLog = useCallback((action: GameLogEntry['action'], message: string) => {
    const logEntry: GameLogEntry = {
      turn: gameState.turn,
      player: gameState.currentPlayer,
      action,
      message,
      timestamp: Date.now(),
    };

    setGameState(prev => ({
      ...prev,
      gameLog: [logEntry, ...prev.gameLog.slice(0, 19)], // Keep last 20 entries
    }));
  }, [gameState.turn, gameState.currentPlayer]);

  const selectTerritory = useCallback((territory: Territory) => {
    setGameState(prev => {
      const isOwnTerritory = territory.owner === prev.currentPlayer;
      
      if (prev.phase === 'draft') {
        // In draft phase, can only select own territories
        if (isOwnTerritory) {
          return { ...prev, selectedTerritory: territory, attackFromTerritory: null };
        }
        return prev;
      }
      
      if (prev.phase === 'attack') {
        // Attack phase logic
        if (!prev.attackFromTerritory) {
          // First selection - must be own territory with > 1 army
          if (isOwnTerritory && territory.armies > MIN_ARMIES_IN_TERRITORY) {
            return { ...prev, selectedTerritory: territory, attackFromTerritory: territory };
          }
        } else {
          // Second selection - must be enemy adjacent territory
          if (!isOwnTerritory && isAdjacent(prev.attackFromTerritory, territory)) {
            return { ...prev, selectedTerritory: territory };
          } else if (isOwnTerritory && territory.armies > MIN_ARMIES_IN_TERRITORY) {
            // Select new attacking territory
            return { ...prev, selectedTerritory: territory, attackFromTerritory: territory };
          }
        }
      }
      
      if (prev.phase === 'fortify') {
        if (isOwnTerritory) {
          return { ...prev, selectedTerritory: territory, attackFromTerritory: null };
        }
      }
      
      return { ...prev, selectedTerritory: territory };
    });
  }, []);

  const isAdjacent = (territory1: Territory, territory2: Territory): boolean => {
    return territory1.connections.includes(territory2.id);
  };

  const placeArmy = useCallback(() => {
    if (gameState.phase !== 'draft' || !gameState.selectedTerritory || gameState.armiesToPlace <= 0) {
      return;
    }

    if (gameState.selectedTerritory.owner !== gameState.currentPlayer) {
      return;
    }

    setGameState(prev => {
      const updatedTerritories = prev.territories.map(t =>
        t.id === prev.selectedTerritory?.id
          ? { ...t, armies: t.armies + 1 }
          : t
      );

      const newArmiesToPlace = prev.armiesToPlace - 1;
      
      return {
        ...prev,
        territories: updatedTerritories,
        armiesToPlace: newArmiesToPlace,
        phase: newArmiesToPlace === 0 ? 'attack' : prev.phase,
      };
    });

    addToLog('draft', `Umieszczono armię na ${gameState.selectedTerritory.name}`);
  }, [gameState, addToLog]);

  const rollDice = (count: number): number[] => {
    return Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1)
      .sort((a, b) => b - a); // Sort descending
  };

  const executeAttack = useCallback((): AttackResult | null => {
    if (gameState.phase !== 'attack' || !gameState.attackFromTerritory || !gameState.selectedTerritory) {
      return null;
    }

    const attacker = gameState.attackFromTerritory;
    const defender = gameState.selectedTerritory;

    if (attacker.owner !== gameState.currentPlayer || attacker.armies <= MIN_ARMIES_IN_TERRITORY) {
      return null;
    }

    if (defender.owner === gameState.currentPlayer) {
      return null;
    }

    // Calculate dice
    const attackerDice = Math.min(3, attacker.armies - 1);
    const defenderDice = Math.min(2, defender.armies);

    const attackerRolls = rollDice(attackerDice);
    const defenderRolls = rollDice(defenderDice);

    let attackerLosses = 0;
    let defenderLosses = 0;

    // Compare dice
    for (let i = 0; i < Math.min(attackerRolls.length, defenderRolls.length); i++) {
      if (attackerRolls[i] > defenderRolls[i]) {
        defenderLosses++;
      } else {
        attackerLosses++;
      }
    }

    const conquered = defender.armies - defenderLosses <= 0;

    setGameState(prev => {
      const updatedTerritories = prev.territories.map(t => {
        if (t.id === attacker.id) {
          return { ...t, armies: t.armies - attackerLosses };
        }
        if (t.id === defender.id) {
          if (conquered) {
            return { 
              ...t, 
              owner: prev.currentPlayer, 
              armies: Math.max(1, attackerDice - attackerLosses) 
            };
          } else {
            return { ...t, armies: t.armies - defenderLosses };
          }
        }
        return t;
      });

      return {
        ...prev,
        territories: updatedTerritories,
        selectedTerritory: conquered ? null : prev.selectedTerritory,
        attackFromTerritory: conquered ? null : prev.attackFromTerritory,
      };
    });

    const result: AttackResult = {
      success: conquered,
      attackerLosses,
      defenderLosses,
      conquered,
    };

    if (conquered) {
      addToLog('conquer', `${attacker.name} podbił ${defender.name}!`);
    } else {
      addToLog('attack', `Atak z ${attacker.name} na ${defender.name} - Straty: A:${attackerLosses}, D:${defenderLosses}`);
    }

    return result;
  }, [gameState, addToLog]);

  const endTurn = useCallback(() => {
    const currentPlayerName = players.find(p => p.id === gameState.currentPlayer)?.name || `Player${gameState.currentPlayer}`;
    addToLog('endTurn', `${currentPlayerName} kończy turę`);

    setGameState(prev => {
      const nextPlayer = prev.currentPlayer >= players.length ? 1 : prev.currentPlayer + 1;
      const nextTurn = nextPlayer === 1 ? prev.turn + 1 : prev.turn;
      const armiesToPlace = calculateReinforcements(nextPlayer, prev.territories);

      return {
        ...prev,
        currentPlayer: nextPlayer,
        turn: nextTurn,
        phase: 'draft',
        armiesToPlace,
        selectedTerritory: null,
        attackFromTerritory: null,
      };
    });
  }, [gameState, players, addToLog]);

  const changePhase = useCallback((newPhase: 'draft' | 'attack' | 'fortify') => {
    if (gameState.phase === 'draft' && gameState.armiesToPlace > 0 && newPhase !== 'draft') {
      return; // Cannot leave draft phase with armies to place
    }

    setGameState(prev => ({
      ...prev,
      phase: newPhase,
      selectedTerritory: null,
      attackFromTerritory: null,
    }));

    const currentPlayerName = players.find(p => p.id === gameState.currentPlayer)?.name || `Player${gameState.currentPlayer}`;
    addToLog('draft', `${currentPlayerName} przechodzi do fazy: ${newPhase}`);
  }, [gameState, players, addToLog]);

  const canAttack = useCallback((from: Territory, to: Territory): boolean => {
    return (
      from.owner === gameState.currentPlayer &&
      to.owner !== gameState.currentPlayer &&
      from.armies > MIN_ARMIES_IN_TERRITORY &&
      isAdjacent(from, to)
    );
  }, [gameState.currentPlayer]);

  const getValidTargets = useCallback((territory: Territory): Territory[] => {
    if (territory.owner !== gameState.currentPlayer || territory.armies <= MIN_ARMIES_IN_TERRITORY) {
      return [];
    }

    return gameState.territories.filter(t =>
      territory.connections.includes(t.id) && 
      t.owner !== gameState.currentPlayer
    );
  }, [gameState]);

  return {
    gameState,
    selectTerritory,
    placeArmy,
    executeAttack,
    endTurn,
    changePhase,
    canAttack,
    getValidTargets,
    initializeGame,
  };
}