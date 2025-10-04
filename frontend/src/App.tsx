import { useEffect, useState } from 'react'
import './App.css'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import RiskMap from './components/RiskMap'
import GameController from './components/GameController'
import { useGameLogic } from './hooks/useGameLogic'
import type { Territory, Player } from './types/game'

const theme = createTheme()

const playerColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];


function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const {
    gameState,
    selectTerritory,
    placeArmy,
    executeAttack,
    endTurn,
    changePhase
  } = useGameLogic(players);

  useEffect(() => {
      fetch('/api/state')
          .then((r) => r.json())
          .then((data) => {
              console.log("Fetched state:", data);

              if (!data || !Array.isArray(data.players)) {
                  console.error("Invalid /api/state response: expected { players: Player[] }, got:", data);
                  setPlayers([]);
                  return;
              }

              // Add colors and missing properties to players
              const playersWithColors: Player[] = data.players.map((player: Player, index: number) => ({
                  ...player,
                  color: playerColors[index % playerColors.length],
                  territoriesCount: 0,
                  continentsControlled: []
              }));

              setPlayers(playersWithColors);
          })
          .catch((err) => {
              console.error("Failed to fetch /api/state:", err);
              setPlayers([]);
          });


      // Lookup cheatsheet of post and get

      //const playerData = {
      //    id: 10,
      //    name: "John Doe",
      //    color: "red",
      //    gold: 100,
      //    army: { infantry: 50, tanks: 5 },
      //    territoriesCount: 0,
      //    continentsControlled: ["Europe"]
      //};

      //fetch("/api/player", {
      //    method: "POST",
      //    headers: { "Content-Type": "application/json" },
      //    body: JSON.stringify(playerData),
      //})
      //    .then(async (res) => {
      //        const text = await res.text(); // read raw response text
      //        let data;
      //        try {
      //            data = JSON.parse(text); // try parsing as JSON
      //        } catch {
      //            data = text; // fallback to raw text if not JSON
      //        }

      //        if (!res.ok) {
      //            // Log failure details
      //            console.error("Request failed:", res.status, res.statusText);
      //            console.error("Response body:", data);
      //        } else {
      //            console.log("Success:", data);
      //        }
      //    })
      //    .catch((err) => {
      //        console.error("Fetch error:", err);
      //    });

      //fetch(`/api/player/10`)
  }, []);


    const showPlayer = (id: number) => {
        setLoading(true);

        fetch(`/api/player/${id}`)
            .then(async (res) => {
                const text = await res.text(); // read raw response text
                let data: object | string;
                try {
                    data = JSON.parse(text); // try parsing as JSON
                } catch (err) {
                    console.error("Failed to parse JSON:", err, "Raw response:", text);
                    data = text; // fallback to raw text
                }

                if (!res.ok) {
                    console.error("Request failed:", res.status, res.statusText);
                    console.error("Response body:", data);
                } else {
                    if (typeof data === "object") {
                        const playerWithColor = {
                            ...data,
                            color: playerColors[(id - 1) % playerColors.length],
                            territoriesCount: 0,
                            continentsControlled: []
                        };
                        console.log(`Selected player (id: ${id}):`, playerWithColor);
                    } else {
                        console.error("Expected JSON object but got:", data);
                    }
                }
            })
            .catch((err) => console.error("Fetch error:", err))
            .finally(() => setLoading(false));
    };



  const handleTerritoryClick = (territory: Territory) => {
    selectTerritory(territory);
  };

  const handleAttack = () => {
    const result = executeAttack();
    if (result) {
      console.log("Attack result:", result);
    }
  };

  if (!gameStarted) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="md">
          <Box sx={{ my: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'white', textAlign: 'center', textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}>
              RiskIT — Podbój Świata
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ color: 'white', textAlign: 'center', mb: 3 }}>
              Strategiczna gra o podboju świata
            </Typography>

            {/* Game Rules */}
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
                  <li><strong>🪖 DRAFT</strong> - Otrzymujesz armie i rozmieszczasz je na swoich terytoriach</li>
                  <li><strong>⚔️ ATTACK</strong> - Atakujesz sąsiednie terytoria przeciwników</li>
                  <li><strong>🛡️ FORTIFY</strong> - Przesuwasz armie między swoimi terytoriami</li>
                </ul>
              </Typography>
              <Typography variant="body2">
                <strong>💡 Wskazówki:</strong> Kontroluj całe kontynenty aby otrzymać bonus armii! Im więcej terytoriów posiadasz, tym więcej armii otrzymujesz każdą turę.
              </Typography>
            </Paper>

            {/* Players Selection */}
            <Paper elevation={4} sx={{ p: 3, mb: 3, bgcolor: 'rgba(255,255,255,0.95)' }}>
              <Typography variant="h6" gutterBottom>
                👥 Wybierz swojego gracza:
              </Typography>
              {players.length === 0 ? (
                <Typography color="text.secondary">Ładowanie graczy...</Typography>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 2 }}>
                  {players.map((p) => (
                    <Button 
                      key={p.id} 
                      variant="contained" 
                      onClick={() => showPlayer(p.id)}
                      sx={{ 
                        backgroundColor: p.color,
                        p: 2,
                        '&:hover': {
                          backgroundColor: p.color,
                          opacity: 0.8,
                          transform: 'scale(1.02)'
                        },
                        transition: 'all 0.2s ease',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }}
                    >
                      <Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                          {p.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                          💰 {p.gold} złota
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                          🪖 {p.army.infantry} piechoty | 🚗 {p.army.tanks} czołgów
                        </Typography>
                      </Box>
                    </Button>
                  ))}
                </Box>
              )}
            </Paper>

            {loading && (
              <Paper elevation={2} sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.95)' }}>
                <Typography>Ładowanie danych gracza...</Typography>
              </Paper>
            )}
            
            <Box sx={{ textAlign: 'center' }}>
              <Button 
                sx={{ mt: 2 }} 
                variant="contained" 
                color="success" 
                size="large" 
                onClick={() => setGameStarted(true)}
                disabled={players.length === 0}
                startIcon="🚀"
              >
                Rozpocznij Grę!
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  // Widok gry
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
            gap: 2
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              🌍 RiskIT — Podbój Świata
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip 
              icon={<span>🎯</span>} 
              label={`Tura: ${gameState.turn || 1}`} 
              color="primary" 
              variant="filled"
            />
            <Chip 
              icon={<span>⏱️</span>} 
              label={`Faza: ${gameState.phase.toUpperCase()}`} 
              color="secondary" 
              variant="filled"
            />
            <Chip 
              icon={<span>👤</span>} 
              label={`Gracz: ${gameState.currentPlayer + 1}`} 
              color="warning" 
              variant="filled"
            />
            <Button 
              variant="outlined" 
              color="error" 
              onClick={() => setGameStarted(false)}
              size="small"
            >
              Menu Główne
            </Button>
          </Box>
        </Paper>

        {/* Game Phase Instructions */}
        <Paper elevation={2} sx={{ p: 2, mb: 2, bgcolor: 'rgba(255,255,255,0.9)' }}>
          <Typography variant="h6" gutterBottom>
            {gameState.phase === 'draft' && '🪖 Faza DRAFT - Rozmieść swoje armie'}
            {gameState.phase === 'attack' && '⚔️ Faza ATTACK - Atakuj terytoria przeciwników'}
            {gameState.phase === 'fortify' && '🛡️ Faza FORTIFY - Przenoś armie między terytoriami'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {gameState.phase === 'draft' && `Masz ${gameState.armiesToPlace} armii do rozmieszczenia. Kliknij na swoje terytoria aby je rozmieścić.`}
            {gameState.phase === 'attack' && 'Wybierz swoje terytorium z co najmniej 2 armiami, następnie wybierz sąsiednie terytorium przeciwnika do ataku.'}
            {gameState.phase === 'fortify' && 'Możesz przesunąć armie między swoimi sąsiadującymi terytoriami. Musi zostać co najmniej 1 armia na każdym terytorium.'}
          </Typography>
          {gameState.selectedTerritory && (
            <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
              🎯 Wybrane terytorium: {gameState.selectedTerritory.name} ({gameState.selectedTerritory.armies} armii)
            </Typography>
          )}
        </Paper>
        
        <Box sx={{ display: 'flex', gap: 3, my: 2 }}>
          {/* Główna mapa */}
          <Box sx={{ flex: 2 }}>
            <Paper elevation={4} sx={{ p: 2, borderRadius: 2 }} className="risk-map-container">
              <RiskMap 
                gameState={gameState}
                players={gameState.players}
                onTerritoryClick={handleTerritoryClick}
              />
            </Paper>
          </Box>

          {/* Panel kontrolny */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <GameController
              gameState={gameState}
              players={gameState.players}
              onPlaceArmy={placeArmy}
              onAttack={handleAttack}
              onEndTurn={endTurn}
              onChangePhase={changePhase}
            />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App
