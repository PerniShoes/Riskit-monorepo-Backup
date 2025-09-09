

import { useState } from 'react';
import Box from '@mui/material/Box';
import PersonIcon from '@mui/icons-material/Person';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const MAP_ROWS = 5;
const MAP_COLS = 8;

function getColor(x: number, y: number, selected: boolean, player: number) {
  if (selected) return player === 1 ? '#38bdf8' : '#f87171';
  if ((x + y) % 2 === 0) return '#a7f3d0';
  if (x === 3 && y === 2) return '#fbbf24';
  return '#bae6fd';
}

type Move = {
  turn: number;
  player: number;
  from: [number, number];
  to: [number, number];
};

export default function GameMap() {
  // Pozycje graczy
  const [positions, setPositions] = useState<[
    { x: number; y: number },
    { x: number; y: number }
  ]>([
    { x: 0, y: 0 },
    { x: MAP_COLS - 1, y: MAP_ROWS - 1 }
  ]);
  const [activePlayer, setActivePlayer] = useState(1); // 1 lub 2
  const [turn, setTurn] = useState(1);
  const [history, setHistory] = useState<Move[]>([]);

  const handleClick = (x: number, y: number) => {
    const idx = activePlayer - 1;
    const from = [positions[idx].x, positions[idx].y] as [number, number];
    const to = [x, y] as [number, number];
    // Przesuń aktywnego gracza
    setPositions((prev) => {
      const next = [...prev];
      next[idx] = { x, y };
      return next as [typeof prev[0], typeof prev[1]];
    });
    setHistory((prev) => [...prev, { turn, player: activePlayer, from, to }]);
  };

  const nextTurn = () => {
    setActivePlayer(activePlayer === 1 ? 2 : 1);
    setTurn((t) => t + 1);
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Tura: {turn} &nbsp;|&nbsp; Aktywny gracz: <span style={{ color: activePlayer === 1 ? '#0ea5e9' : '#ef4444', fontWeight: 600 }}>Player{activePlayer}</span>
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateRows: `repeat(${MAP_ROWS}, 40px)`,
          gridTemplateColumns: `repeat(${MAP_COLS}, 40px)`,
          gap: 1,
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
          background: '#e0e7ff',
          borderRadius: 2,
          position: 'relative',
        }}
      >
        {Array.from({ length: MAP_ROWS * MAP_COLS }).map((_, i) => {
          const x = i % MAP_COLS;
          const y = Math.floor(i / MAP_COLS);
          const isPlayer1 = positions[0].x === x && positions[0].y === y;
          const isPlayer2 = positions[1].x === x && positions[1].y === y;
          return (
            <Box
              key={i}
              sx={{
                width: 36,
                height: 36,
                background: getColor(x, y, isPlayer1 || isPlayer2, isPlayer1 ? 1 : isPlayer2 ? 2 : 0),
                border: '1.5px solid #0ea5e9',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 500,
                color: '#334155',
                cursor: 'pointer',
                transition: 'background 0.3s',
                boxShadow: (isPlayer1 || isPlayer2) ? '0 0 8px #0ea5e9' : undefined,
                position: 'relative',
              }}
              onClick={() => handleClick(x, y)}
            >
              {isPlayer1 ? <PersonIcon sx={{ color: '#0ea5e9', fontSize: 24, transition: 'transform 0.3s', transform: 'scale(1.2)' }} />
                : isPlayer2 ? <MilitaryTechIcon sx={{ color: '#ef4444', fontSize: 22, transition: 'transform 0.3s', transform: 'scale(1.1)' }} />
                : `${x},${y}`}
            </Box>
          );
        })}
      </Box>
      <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={nextTurn}>
        Następna tura
      </Button>
      <Typography variant="h6" sx={{ mt: 2 }}>Historia ruchów</Typography>
      <Box sx={{ maxHeight: 120, overflowY: 'auto', mb: 2 }}>
        {history.length === 0 && <Typography fontSize={14}>Brak ruchów</Typography>}
        {history.map((m, idx) => (
          <Typography key={idx} fontSize={14}>
            Tura {m.turn}: Player{m.player} przesunął z ({m.from[0]},{m.from[1]}) na ({m.to[0]},{m.to[1]})
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
