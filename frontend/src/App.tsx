import { useEffect, useState } from 'react'
import './App.css'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'
import GameMap from './components/GameMap'

const theme = createTheme()



type Player = {
  id: number;
  name: string;
  gold: number;
  army: { infantry: number; tanks: number };
};

type Move = {
  turn: number;
  action: string;
  value: string;
};

const demoMoves: Move[] = [
  { turn: 1, action: 'Recruit', value: '+50 infantry' },
  { turn: 2, action: 'Attack', value: 'Player2' },
  { turn: 3, action: 'Upgrade', value: '+2 tanks' },
];

const demoRanking = [
  { name: 'Player1', score: 1200 },
  { name: 'Player2', score: 950 },
  { name: 'Player3', score: 800 },
];


function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selected, setSelected] = useState<Player | null>(null);
  const [loading, setLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    fetch('/api/state')
      .then((r) => r.json())
      .then((data) => setPlayers(data.players))
      .catch(() => setPlayers([]));
  }, []);

  const showPlayer = (id: number) => {
    setLoading(true);
    fetch(`/api/player/${id}`)
      .then((r) => r.json())
      .then((data) => setSelected(data))
      .catch(() => setSelected(null))
      .finally(() => setLoading(false));
  };

  if (!gameStarted) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          <Box sx={{ my: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom color="primary">
              RiskIT — Game Menu
            </Typography>
            <Typography variant="h6" gutterBottom>
              Wybierz gracza, aby zobaczyć szczegóły:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
              {players.map((p) => (
                <Button key={p.id} variant="contained" onClick={() => showPlayer(p.id)}>
                  {p.name}
                </Button>
              ))}
            </Box>
            {loading && <Typography>Ładowanie...</Typography>}
            {selected && (
              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h5">{selected.name}</Typography>
                  <Typography>Gold: {selected.gold}</Typography>
                  <Typography>Infantry: {selected.army.infantry}</Typography>
                  <Typography>Tanks: {selected.army.tanks}</Typography>
                </CardContent>
              </Card>
            )}
            <Button sx={{ mt: 4 }} variant="contained" color="success" size="large" onClick={() => setGameStarted(true)}>
              Graj
            </Button>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  // Widok gry
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, my: 4 }}>
          {/* Mapka */}
          <Paper elevation={4} sx={{ flex: 2, minHeight: 400, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#e0e7ff,#f0fdfa)' }}>
            <Typography variant="h4" color="primary" sx={{ mb: 2 }}>MAPA</Typography>
            <GameMap />
            <Button sx={{ mt: 3 }} variant="outlined" color="secondary" onClick={() => setGameStarted(false)}>
              Cofnij
            </Button>
          </Paper>
          {/* Minipanel */}
          <Paper elevation={2} sx={{ flex: 1, p: 2, minWidth: 300, background: '#f8fafc' }}>
            <Typography variant="h5" gutterBottom>Statystyki gracza</Typography>
            {selected ? (
              <>
                <Typography>Gold: {selected.gold}</Typography>
                <Typography>Infantry: {selected.army.infantry}</Typography>
                <Typography>Tanks: {selected.army.tanks}</Typography>
              </>
            ) : <Typography color="text.secondary">Wybierz gracza w menu</Typography>}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Historia ruchów</Typography>
            <Box sx={{ maxHeight: 120, overflowY: 'auto', mb: 2 }}>
              {demoMoves.map((m) => (
                <Typography key={m.turn} fontSize={14}>Tura {m.turn}: {m.action} ({m.value})</Typography>
              ))}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Ranking</Typography>
            <Box>
              {demoRanking.map((r, i) => (
                <Typography key={r.name} fontSize={14}>{i + 1}. {r.name} — {r.score} pkt</Typography>
              ))}
            </Box>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App
