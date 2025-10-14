import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Chip, 
  Divider,
  Alert,
  Stack,
  List,
  ListItem,
  ListItemText,
  Slider,
} from '@mui/material';
import { 
  PlayArrow, 
  SkipNext,
  AttachMoney,
  Groups,
  Security,
  LocalFireDepartment,
  Clear,
} from '@mui/icons-material';
import type { Player, GameState, Action } from '../types/game';
import RiskAnalysis from './RiskAnalysis';

interface GameControllerProps {
  gameState: GameState;
  players: Player[];
  actionQueue: Action[];
  isSubmitting: boolean;
  draftAmount: number;
  onDraftAmountChange: (value: number) => void;
  onEndTurn: () => void;
  onChangePhase: (phase: 'draft' | 'attack' | 'fortify') => void;
  onClearActions: () => void;
}

export default function GameController({
  gameState,
  players,
  actionQueue,
  isSubmitting,
  draftAmount,
  onDraftAmountChange,
  onEndTurn,
  onChangePhase,
  onClearActions
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

      {/* Action Queue & Controls */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Kolejka Akcji</Typography>
          
          {/* Draft Phase Slider */}
          {gameState.phase === 'draft' && gameState.armiesToPlace > 0 && (
            <Box sx={{ mb: 2, px: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Liczba armii do rozmieszczenia:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Slider
                  value={draftAmount}
                  onChange={(_, newValue) => onDraftAmountChange(newValue as number)}
                  min={1}
                  max={Math.max(1, gameState.armiesToPlace)}
                  step={1}
                  marks
                  valueLabelDisplay="on"
                  sx={{ flex: 1 }}
                />
                <Chip 
                  label={`${draftAmount} / ${gameState.armiesToPlace}`} 
                  color="primary" 
                  size="small"
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                Kliknij na swoje terytorium aby dodać {draftAmount} {draftAmount === 1 ? 'armię' : 'armii'}
              </Typography>
            </Box>
          )}
          
          {actionQueue.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              {gameState.phase === 'draft' && 'Kliknij na swoje terytoria aby rozmieścić armie'}
              {gameState.phase === 'attack' && 'Wybierz swoje terytorium, potem terytorium przeciwnika do ataku'}
              {gameState.phase === 'fortify' && 'Przenieś armie między swoimi terytoriami'}
            </Alert>
          ) : (
            <>
              <List dense sx={{ mb: 2 }}>
                {actionQueue.map((action, idx) => (
                  <ListItem key={idx} sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        action.type === 'draft'
                          ? `🪖 Draft: +${action.armies} armii na ${action.territoryId}`
                          : action.type === 'attack'
                          ? `⚔️ Atak: ${action.from} → ${action.to} (${action.armies} armii)`
                          : `🛡️ Fortify: ${action.from} → ${action.to} (${action.armies} armii)`
                      }
                      primaryTypographyProps={{ fontSize: '0.875rem' }}
                    />
                  </ListItem>
                ))}
              </List>
              <Button
                fullWidth
                variant="outlined"
                color="error"
                size="small"
                startIcon={<Clear />}
                onClick={onClearActions}
                sx={{ mb: 1 }}
                disabled={isSubmitting}
              >
                Wyczyść kolejkę
              </Button>
            </>
          )}

          {/* Phase Controls */}
          <Stack spacing={1}>
            {gameState.phase === 'draft' && gameState.armiesToPlace === 0 && (
              <Button
                fullWidth
                variant="outlined"
                onClick={() => onChangePhase('attack')}
              >
                Przejdź do ataku
              </Button>
            )}
            
            {gameState.phase === 'attack' && (
              <Button
                fullWidth
                variant="outlined"
                onClick={() => onChangePhase('fortify')}
              >
                Przejdź do umocnienia
              </Button>
            )}

            {/* End Turn Button */}
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              onClick={onEndTurn}
              startIcon={<SkipNext />}
              disabled={isSubmitting || actionQueue.length === 0}
            >
              {isSubmitting ? 'Wysyłanie...' : `Zakończ turę (${actionQueue.length} akcji)`}
            </Button>
          </Stack>
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
            {gameState.phase === 'attack' && gameState.attackFromTerritory && selectedTerritory.id !== gameState.attackFromTerritory.id && (
              <Box sx={{ mt: 1 }}>
                <Alert severity="info" sx={{ py: 0 }}>
                  {selectedTerritory.owner !== gameState.currentPlayer 
                    ? 'Kliknij aby zaatakować'
                    : 'Wybierz terytorium przeciwnika'}
                </Alert>
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