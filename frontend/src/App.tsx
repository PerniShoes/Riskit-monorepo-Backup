import { useEffect, useState, useMemo } from 'react';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import RiskMap from './components/RiskMap';
import GameController from './components/GameController';
import { useGameLogic } from './hooks/useGameLogic';
import { useGameApi } from './hooks/useGameApi';
import { mockApi } from './services/mockApi';
import type { Player, TurnSubmitResponse, AttackAction, ActionResult, GameState } from './types/game';

const theme = createTheme();

const playerColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

// Mock game setup
const MOCK_GAME_ID = 'game-123';
const MOCK_PLAYER_ID = 1;

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [turnResults, setTurnResults] = useState<ActionResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [draftAmount, setDraftAmount] = useState(1); // Slider value for draft phase

  // UI state management (selections, etc.)
  const {
    gameState,
    selectedTerritory,
    attackFromTerritory,
    updateGameState,
    selectTerritory,
    clearSelections,
  } = useGameLogic();

  // API & Action queue management
  const {
    actionQueue,
    isSubmitting,
    submitError,
    addDraftAction,
    addAttackAction,
    // addFortifyAction, // TODO: will be used when fortify UI is implemented
    clearActions,
    submitTurn,
  } = useGameApi(MOCK_GAME_ID, MOCK_PLAYER_ID);

  // Calculate optimistic game state preview based on action queue
  const gameStateWithPreview = useMemo(() => {
    if (!gameState) return null;

    // Clone territories for preview
    const previewTerritories = gameState.territories.map((t) => ({ ...t }));
    let remainingArmies = gameState.armiesToPlace;

    // Apply draft actions to preview
    actionQueue.forEach((action) => {
      if (action.type === 'draft') {
        const territory = previewTerritories.find((t) => t.id === action.territoryId);
        if (territory) {
          territory.armies += action.armies;
          remainingArmies -= action.armies;
        }
      }
      // TODO: Add preview for attack results (more complex - needs simulation)
      // TODO: Add preview for fortify actions
    });

    return {
      ...gameState,
      territories: previewTerritories,
      armiesToPlace: Math.max(0, remainingArmies),
    };
  }, [gameState, actionQueue]);

  // Initialize game on mount
  useEffect(() => {
    const initGame = async () => {
        try {

            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            interface Territory {
                id: string;
                name: string;
                armies: number;
                ownerId: number;
            }
            // Initial territories
            const territories: Territory[] = [
                {
                    id: "Alaska",
                    name: "Alaska",
                    armies: 9,
                    ownerId: 1,
                },
                {
                    id: "Northwest Territory",
                    name: "Northwest Territory",
                    armies: 12,
                    ownerId: 2,
                },
                {
                    id: "Ukraine",
                    name: "Ukraine",
                    armies: 4,
                    ownerId: 1,
                },
                {
                    id: "Afghanistan",
                    name: "Afghanistan",
                    armies: 2,
                    ownerId: 2,
                },
                {
                    id: "Egypt",
                    name: "Egypt",
                    armies: 6,
                    ownerId: 3,
                },
                {
                    id: "East Africa",
                    name: "East Africa",
                    armies: 0,
                    ownerId: 3,
                },
            ];
            const mapData = {
                territories, // Moze sie innaczej nazywac, ale trzeba zmienic w MapManager
            };
            // POST to map containing territories (initial map state)
            const mapResponse = await fetch("/api/map", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(mapData),
            })
            console.log("Map response:", await mapResponse.json());
            fetch("/api/map") // Sprawdza stan mapy przed atakami

            const attacks: AttackAction[] = [
                {
                    type: 'attack',             // Nie czytam
                    timestamp: Date.now(),      // Nie czytam
                    from: 'Alaska',             // Czytam
                    to: 'Northwest Territory',  // Czytam
                    armies: 3,                  // Czytam
                },
                {
                    type: 'attack',
                    timestamp: Date.now(),
                    from: 'Ukraine',
                    to: 'Afghanistan',
                    armies: 5,
                },
                {
                    type: 'attack',
                    timestamp: Date.now(),
                    from: 'Egypt',
                    to: 'East Africa',
                    armies: 2,
                },
                {
                    type: 'attack',
                    timestamp: Date.now(),
                    from: 'Alaska',
                    to: 'Northwest Territory',
                    armies: 3,
                },
                {
                    type: 'attack',
                    timestamp: Date.now(),
                    from: 'Alaska',
                    to: 'Northwest Territory',
                    armies: 3,
                },
                {
                    type: 'attack',
                    timestamp: Date.now(),
                    from: 'Alaska',
                    to: 'Northwest Territory',
                    armies: 5,
                },
            ];

            const attackData = {
                attacks, // "Attack history" array. (attacks moze sie innaczej nazywac, ale trzeba zmienic w StateManager.cpp linijka 93 i 95)
            };
            // mozliwe param: attack/draft/fortify (tylko attack napisany)
            const attackResponse = await fetch("/api/state/attack", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(attackData),
            })
            console.log("Attack response:", await attackResponse.json());
            fetch("/api/map") // Sprawdza stan mapy po attakach
            ////////////////////////////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////////////////////////////

            // Use mock API for now
        const newGameResponse = await mockApi.createGame([
          { name: 'Gracz 1', color: playerColors[0] },
          { name: 'Gracz 2', color: playerColors[1] },
          { name: 'Gracz 3', color: playerColors[2] },
        ]);

        console.log('Game created:', newGameResponse);

        // Fetch initial game state
        const initialState = await mockApi.getGameState(MOCK_GAME_ID);
        console.log('Initial state:', initialState);

        if (initialState) {
          // GameStateResponse doesn't have nested gameState property
          const gameStateData: GameState = {
            turn: initialState.turn,
            currentPlayer: initialState.currentPlayer,
            phase: initialState.phase,
            armiesToPlace: initialState.armiesToPlace,
            territories: initialState.territories,
            players: initialState.players,
            gameLog: [],
            selectedTerritory: null,
            attackFromTerritory: null,
          };
          updateGameState(gameStateData);
          setPlayers(initialState.players);
        }
      } catch (error) {
        console.error('Failed to initialize game:', error);
      }
    };

    initGame();
  }, [updateGameState]);

  // Auto-adjust draft amount when armiesToPlace changes (using preview state)
  useEffect(() => {
    if (gameStateWithPreview && gameStateWithPreview.phase === 'draft') {
      // Reset slider to min of current value or remaining armies in preview
      const maxArmies = Math.max(1, gameStateWithPreview.armiesToPlace);
      setDraftAmount((prev) => Math.min(prev, maxArmies));
    }
  }, [gameStateWithPreview?.armiesToPlace, gameStateWithPreview?.phase]);

  // Handle territory clicks based on current phase
  const handleTerritoryClick = (territory: typeof selectedTerritory) => {
    if (!territory || !gameState || !gameStateWithPreview) return;

    selectTerritory(territory);

    // Auto-queue actions based on phase and selections
    if (gameState.phase === 'draft') {
      // Draft: clicking own territory queues armies based on slider value
      if (territory.owner === gameState.currentPlayer) {
        const amountToAdd = Math.min(draftAmount, gameStateWithPreview.armiesToPlace);
        if (amountToAdd > 0) {
          addDraftAction(territory.id, amountToAdd);
        }
      }
    } else if (gameState.phase === 'attack') {
      // Attack: if we have both attacker and defender selected, queue attack
      if (attackFromTerritory && territory.owner !== gameState.currentPlayer) {
        const attackingArmies = Math.min(3, attackFromTerritory.armies - 1);
        addAttackAction(attackFromTerritory.id, territory.id, attackingArmies);
      }
    }
  };

  // Handle fortify action (currently unused - will be needed for fortify UI)
  // const handleFortify = (fromId: string, toId: string, count: number) => {
  //   addFortifyAction(fromId, toId, count);
  // };

  // Handle end turn - submit all queued actions
  const handleEndTurn = async () => {
    if (actionQueue.length === 0) {
      console.warn('No actions to submit');
      return;
    }

    setShowResults(false);
    setTurnResults([]);

    const response: TurnSubmitResponse | null = await submitTurn();

    if (response && response.success) {
      console.log('Turn submitted successfully:', response);
      setTurnResults(response.results);
      setShowResults(true);

      // Update game state with new state from backend
      if (response.gameState) {
        updateGameState(response.gameState);
      }

      // Clear selections
      clearSelections();
    } else {
      console.error('Turn submission failed:', submitError);
    }
  };

  // Handle phase change
  const handleChangePhase = (newPhase: 'draft' | 'attack' | 'fortify') => {
    if (!gameState) return;

    if (gameState.phase === 'draft' && gameState.armiesToPlace > 0) {
      console.warn('Cannot leave draft phase with armies remaining');
      return;
    }

    // Just update UI phase - actual phase transition happens on backend after turn submit
    clearSelections();
    console.log(`Changing to phase: ${newPhase}`);
  };

  // Clear turn results
  const closeTurnResults = () => {
    setShowResults(false);
    setTurnResults([]);
  };

  if (!gameStarted || !gameState) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="md">
          <Box sx={{ my: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ color: 'white', textAlign: 'center', textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}
            >
              RiskIT — Podbój Świata
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ color: 'white', textAlign: 'center', mb: 3 }}>
              Strategiczna gra o podboju świata (REFACTORED VERSION)
            </Typography>

            <Paper elevation={4} sx={{ p: 3, mb: 3, bgcolor: 'rgba(255,255,255,0.95)' }}>
              <Typography variant="h5" gutterBottom color="primary">
                📋 Jak grać w RiskIT?
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Cel gry:</strong> Podbij wszystkie terytoria na świecie i zostań jedynym władcą!
              </Typography>
              <Typography variant="body2" component="div" sx={{ mb: 2 }}>
                <strong>Fazy tury:</strong>
                <ul style={{ marginLeft: 20 }}>
                  <li>
                    <strong>🪖 DRAFT</strong> - Otrzymujesz armie i rozmieszczasz je na swoich terytoriach
                  </li>
                  <li>
                    <strong>⚔️ ATTACK</strong> - Atakujesz sąsiednie terytoria przeciwników
                  </li>
                  <li>
                    <strong>🛡️ FORTIFY</strong> - Przesuwasz armie między swoimi terytoriami
                  </li>
                </ul>
              </Typography>
            </Paper>

            <Box sx={{ textAlign: 'center' }}>
              <Button
                sx={{ mt: 2 }}
                variant="contained"
                color="success"
                size="large"
                onClick={() => setGameStarted(true)}
              >
                🚀 Rozpocznij Grę!
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  // Game view
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" className="fade-in-up">
        {/* Top Navigation Bar */}
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mb: 2,
            bgcolor: 'rgba(255,255,255,0.95)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              🌍 RiskIT — Podbój Świata
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip icon={<span>🎯</span>} label={`Tura: ${gameState.turn}`} color="primary" variant="filled" />
            <Chip
              icon={<span>⏱️</span>}
              label={`Faza: ${gameState.phase.toUpperCase()}`}
              color="secondary"
              variant="filled"
            />
            <Chip
              icon={<span>👤</span>}
              label={`Gracz: ${gameState.currentPlayer}`}
              color="warning"
              variant="filled"
            />
            <Chip label={`Akcje w kolejce: ${actionQueue.length}`} color="info" variant="outlined" />
            <Chip 
              label={`Pozostało armii: ${gameStateWithPreview?.armiesToPlace || 0}`} 
              color="success" 
              variant="outlined" 
            />
            <Button variant="outlined" color="error" onClick={() => setGameStarted(false)} size="small">
              Menu Główne
            </Button>
          </Box>
        </Paper>

        {/* Turn Results Display */}
        {showResults && turnResults.length > 0 && (
          <Alert severity="info" onClose={closeTurnResults} sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              📊 Wyniki tury:
            </Typography>
            {turnResults.map((result, idx) => (
              <Typography key={idx} variant="body2">
                • {result.message}
              </Typography>
            ))}
          </Alert>
        )}

        {/* Submit Error Display */}
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => clearActions()}>
            Błąd: {submitError}
          </Alert>
        )}

        {/* Game Phase Instructions */}
        <Paper elevation={2} sx={{ p: 2, mb: 2, bgcolor: 'rgba(255,255,255,0.9)' }}>
          <Typography variant="h6" gutterBottom>
            {gameState.phase === 'draft' && '🪖 Faza DRAFT - Rozmieść swoje armie'}
            {gameState.phase === 'attack' && '⚔️ Faza ATTACK - Atakuj terytoria przeciwników'}
            {gameState.phase === 'fortify' && '🛡️ Faza FORTIFY - Przenoś armie między terytoriami'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {gameState.phase === 'draft' &&
              `Masz ${gameStateWithPreview?.armiesToPlace || 0} armii do rozmieszczenia. Kliknij na swoje terytoria aby dodać akcje do kolejki.`}
            {gameState.phase === 'attack' &&
              'Wybierz swoje terytorium z co najmniej 2 armiami, następnie kliknij na sąsiednie terytorium przeciwnika.'}
            {gameState.phase === 'fortify' && 'Przesuń armie między swoimi sąsiadującymi terytoriami.'}
          </Typography>
          {selectedTerritory && (
            <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
              🎯 Wybrane: {selectedTerritory.name} ({selectedTerritory.armies} armii)
            </Typography>
          )}
        </Paper>

        <Box sx={{ display: 'flex', gap: 3, my: 2 }}>
          {/* Main map */}
          <Box sx={{ flex: 2 }}>
            <Paper elevation={4} sx={{ p: 2, borderRadius: 2 }} className="risk-map-container">
              <RiskMap 
                gameState={gameStateWithPreview || gameState} 
                players={players} 
                onTerritoryClick={handleTerritoryClick} 
              />
            </Paper>
          </Box>

          {/* Control panel */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <GameController
              gameState={gameStateWithPreview || gameState}
              players={players}
              actionQueue={actionQueue}
              isSubmitting={isSubmitting}
              draftAmount={draftAmount}
              onDraftAmountChange={setDraftAmount}
              onEndTurn={handleEndTurn}
              onChangePhase={handleChangePhase}
              onClearActions={clearActions}
            />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
