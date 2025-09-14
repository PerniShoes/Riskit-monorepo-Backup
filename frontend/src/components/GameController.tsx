import { useMemo } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Chip, 
  Divider,
  Alert,
  Stack
} from '@mui/material';
import { 
  PlayArrow, 
  SkipNext,
  AttachMoney,
  Groups,
  Security,
  LocalFireDepartment
} from '@mui/icons-material';
import type { Player, GameState } from '../types/game';
import RiskAnalysis from './RiskAnalysis';

interface GameControllerProps {
  gameState: GameState;
  players: Player[];
  onPlaceArmy: () => void;
  onAttack: () => void;
  onEndTurn: () => void;
  onChangePhase: (phase: 'draft' | 'attack' | 'fortify') => void;
}

export default function GameController({
  gameState,
  players,
  onPlaceArmy,
  onAttack,
  onEndTurn,
  onChangePhase
}: GameControllerProps) {
  const currentPlayerData = players.find(p => p.id === gameState.currentPlayer);
  const selectedTerritory = gameState.selectedTerritory;

  const calculatePlayerStats = (playerId: number) => {
    const playerTerritories = gameState.territories.filter(t => t.owner === playerId);
    const totalArmies = playerTerritories.reduce((sum, t) => sum + t.armies, 0);
    
    return {
      territories: playerTerritories.length,
      armies: totalArmies,
      continents: 0 // TODO: Calculate continent control
    };
  };

  const canPlaceArmy = useMemo(() => {
    return (
      gameState.phase === 'draft' &&
      gameState.armiesToPlace > 0 &&
      selectedTerritory &&
      selectedTerritory.owner === gameState.currentPlayer
    );
  }, [gameState.phase, gameState.armiesToPlace, selectedTerritory, gameState.currentPlayer]);

  const canAttack = useMemo(() => {
    return (
      gameState.phase === 'attack' &&
      gameState.attackFromTerritory &&
      selectedTerritory &&
      selectedTerritory.owner !== gameState.currentPlayer &&
      gameState.attackFromTerritory.connections.includes(selectedTerritory.id)
    );
  }, [gameState.phase, gameState.attackFromTerritory, selectedTerritory, gameState.currentPlayer]);

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'draft': return '#10b981';
      case 'attack': return '#ef4444';
      case 'fortify': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'draft': return <Groups />;
      case 'attack': return <LocalFireDepartment />;
      case 'fortify': return <Security />;
      default: return <PlayArrow />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300 }}>
      {/* Current Player & Turn Info */}
      <Card elevation={3} sx={{ bgcolor: currentPlayerData?.color || '#6b7280', color: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {currentPlayerData?.name}
            </Typography>
            <Typography variant="h6">
              Tura {gameState.turn}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip
              icon={getPhaseIcon(gameState.phase)}
              label={gameState.phase.toUpperCase()}
              size="small"
              sx={{ 
                bgcolor: getPhaseColor(gameState.phase), 
                color: 'white',
                fontWeight: 'bold'
              }}
            />
            {gameState.phase === 'draft' && (
              <Chip 
                label={`${gameState.armiesToPlace} armii do rozmieszczenia`} 
                size="small" 
                color="success"
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
              />
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Player Stats */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Statystyki Gracza</Typography>
          {currentPlayerData && (
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoney fontSize="small" />
                <Typography>Złoto: {currentPlayerData.gold}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Groups fontSize="small" />
                <Typography>Piechota: {currentPlayerData.army.infantry}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security fontSize="small" />
                <Typography>Czołgi: {currentPlayerData.army.tanks}</Typography>
              </Box>
              <Divider />
              {(() => {
                const stats = calculatePlayerStats(gameState.currentPlayer);
                return (
                  <>
                    <Typography variant="body2">Terytoria: {stats.territories}</Typography>
                    <Typography variant="body2">Łącznie armii: {stats.armies}</Typography>
                    <Typography variant="body2">Kontynenty: {stats.continents}</Typography>
                  </>
                );
              })()}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Game Phase Controls */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Akcje</Typography>
          
          {gameState.phase === 'draft' && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                Rozmieść {gameState.armiesToPlace} armii na swoich terytoriach
              </Alert>
              <Button
                fullWidth
                variant="contained"
                color="success"
                disabled={!canPlaceArmy}
                onClick={onPlaceArmy}
                sx={{ mb: 1 }}
              >
                Umieść armię ({selectedTerritory?.name || 'wybierz terytorium'})
              </Button>
              {gameState.armiesToPlace === 0 && (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => onChangePhase('attack')}
                >
                  Przejdź do ataku
                </Button>
              )}
            </Box>
          )}

          {gameState.phase === 'attack' && (
            <Box>
              <Alert severity="warning" sx={{ mb: 2 }}>
                {!gameState.attackFromTerritory 
                  ? 'Wybierz swoje terytorium z armią > 1'
                  : 'Teraz wybierz sąsiednie terytorium przeciwnika'
                }
              </Alert>
              <Stack spacing={1}>
                <Button
                  fullWidth
                  variant="contained"
                  color="error"
                  disabled={!canAttack}
                  onClick={onAttack}
                  startIcon={<LocalFireDepartment />}
                >
                  {canAttack ? `Atakuj ${selectedTerritory?.name}!` : 'Wybierz cel ataku'}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => onChangePhase('fortify')}
                >
                  Przejdź do umocnienia
                </Button>
              </Stack>
            </Box>
          )}

          {gameState.phase === 'fortify' && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                Przenieś armie między swoimi terytoriami (opcjonalne)
              </Alert>
              <Stack spacing={1}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  startIcon={<Security />}
                >
                  Umocnij pozycje
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={onEndTurn}
                  startIcon={<SkipNext />}
                >
                  Zakończ turę
                </Button>
              </Stack>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Selected Territory Info */}
      {selectedTerritory && (
        <Card>
          <CardContent>
            <Typography variant="h6" color="primary">
              Wybrane: {selectedTerritory.name}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {selectedTerritory.continent}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography variant="body2">
                Armie: {selectedTerritory.armies}
              </Typography>
              <Chip
                size="small"
                label={selectedTerritory.owner 
                  ? players.find(p => p.id === selectedTerritory.owner)?.name || 'Nieznany'
                  : 'Neutralny'}
                color={selectedTerritory.owner === gameState.currentPlayer ? 'success' : 'default'}
              />
            </Box>
            
            {/* Attack info */}
            {gameState.phase === 'attack' && gameState.attackFromTerritory && (
              <Box sx={{ mt: 1 }}>
                {gameState.attackFromTerritory.id === selectedTerritory.id ? (
                  <Alert severity="info" sx={{ py: 0 }}>
                    Źródło ataku - wybierz cel
                  </Alert>
                ) : canAttack ? (
                  <Alert severity="warning" sx={{ py: 0 }}>
                    Gotowy do ataku!
                  </Alert>
                ) : (
                  <Alert severity="error" sx={{ py: 0 }}>
                    Nie można zaatakować
                  </Alert>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* All Players Status */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Wszyscy gracze</Typography>
          <Stack spacing={1}>
            {players.map((player) => {
              const stats = calculatePlayerStats(player.id);
              return (
                <Box
                  key={player.id}
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: player.id === gameState.currentPlayer ? 'action.selected' : 'transparent',
                    border: player.id === gameState.currentPlayer ? `2px solid ${player.color}` : '1px solid transparent'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          bgcolor: player.color
                        }}
                      />
                      <Typography variant="body2" fontWeight={player.id === gameState.currentPlayer ? 'bold' : 'normal'}>
                        {player.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {stats.territories} terytoriów
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </CardContent>
      </Card>

      {/* Game Log */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Historia gry</Typography>
          <Box sx={{ maxHeight: 150, overflowY: 'auto' }}>
            {gameState.gameLog.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Brak wydarzeń...
              </Typography>
            ) : (
              gameState.gameLog.slice(0, 10).map((log, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 0.5, fontSize: '0.8rem' }}>
                  T{log.turn}: {log.message}
                </Typography>
              ))
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Risk Analysis */}
      <RiskAnalysis 
        selectedTerritory={selectedTerritory?.name}
        playerName={currentPlayerData?.name}
      />
    </Box>
  );
}