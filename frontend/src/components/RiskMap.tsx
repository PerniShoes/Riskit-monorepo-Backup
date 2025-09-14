import { useState, useMemo } from 'react';
import { Box, Typography, Button, Card, CardContent, Chip, Tooltip, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { Territory, Player, GameState } from '../types/game';
import { CONTINENTS } from '../types/game';

const MapContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '500px',
  height: '400px',
  backgroundColor: '#1e3a8a',
  backgroundImage: 'linear-gradient(45deg, #1e3a8a 25%, transparent 25%), linear-gradient(-45deg, #1e3a8a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e3a8a 75%), linear-gradient(-45deg, transparent 75%, #1e3a8a 75%)',
  backgroundSize: '20px 20px',
  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
  borderRadius: theme.spacing(2),
  border: '3px solid #facc15',
  overflow: 'hidden',
  margin: '0 auto',
  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
}));

const TerritoryButton = styled(Button)<{ 
  ownercolor?: string; 
  isselected?: string;
  ishighlighted?: string;
}>(({ ownercolor, isselected, ishighlighted }) => ({
  position: 'absolute',
  minWidth: '35px',
  width: '35px',
  height: '35px',
  padding: '0',
  borderRadius: '50%',
  fontSize: '10px',
  fontWeight: 'bold',
  border: `2px solid ${ownercolor || '#6b7280'}`,
  backgroundColor: ownercolor || '#9ca3af',
  color: '#ffffff',
  textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    zIndex: 10,
    boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
  },
  ...(isselected === 'true' && {
    transform: 'scale(1.2)',
    boxShadow: `0 0 20px ${ownercolor || '#6b7280'}`,
    zIndex: 15,
  }),
  ...(ishighlighted === 'true' && {
    border: '3px solid #fbbf24',
    animation: 'pulse 1s infinite',
  }),
  '@keyframes pulse': {
    '0%': {
      boxShadow: `0 0 0 0 ${ownercolor || '#6b7280'}`,
    },
    '70%': {
      boxShadow: `0 0 0 10px rgba(251, 191, 36, 0)`,
    },
    '100%': {
      boxShadow: `0 0 0 0 rgba(251, 191, 36, 0)`,
    },
  },
}));

const ConnectionLine = styled('line')({
  stroke: '#374151',
  strokeWidth: 2,
  strokeDasharray: '5,5',
  opacity: 0.6,
});

interface RiskMapProps {
  gameState: GameState;
  players: Player[];
  onTerritoryClick?: (territory: Territory) => void;
}

const playerColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

export default function RiskMap({ 
  gameState, 
  players, 
  onTerritoryClick
}: RiskMapProps) {
  const [hoveredTerritory, setHoveredTerritory] = useState<Territory | null>(null);
  
  const territories = gameState.territories;
  const selectedTerritory = gameState.selectedTerritory;
  const attackFromTerritory = gameState.attackFromTerritory;

  // Calculate continent control for display
  const continentControl = useMemo(() => {
    const control: Record<string, { owner: number | null; territories: number; controlled: number }> = {};
    
    Object.entries(CONTINENTS).forEach(([continentName]) => {
      const continentTerritories = territories.filter(t => t.continent === continentName);
      const owners = continentTerritories.reduce((acc, t) => {
        if (t.owner) {
          acc[t.owner] = (acc[t.owner] || 0) + 1;
        }
        return acc;
      }, {} as Record<number, number>);
      
      const maxOwnerEntry = Object.entries(owners).reduce<{ owner: number | null; count: number }>((max, [owner, count]) => 
        count > max.count ? { owner: parseInt(owner), count } : max, 
        { owner: null, count: 0 }
      );

      control[continentName] = {
        owner: maxOwnerEntry.count === continentTerritories.length ? maxOwnerEntry.owner : null,
        territories: continentTerritories.length,
        controlled: maxOwnerEntry.count
      };
    });
    
    return control;
  }, [territories]);

  const handleTerritoryClick = (territory: Territory) => {
    if (onTerritoryClick) {
      onTerritoryClick(territory);
    }
  };

  const getPlayerColor = (playerId: number | null) => {
    if (!playerId || playerId > players.length) return '#6b7280';
    const player = players.find(p => p.id === playerId);
    return player?.color || playerColors[playerId - 1] || '#6b7280';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <MapContainer>
        {/* SVG for connections */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        >
          {territories.map(territory =>
            territory.connections.map(connectionId => {
              const connectedTerritory = territories.find(t => t.id === connectionId);
              if (!connectedTerritory) return null;
              
              return (
                <ConnectionLine
                  key={`${territory.id}-${connectionId}`}
                  x1={territory.position.x}
                  y1={territory.position.y}
                  x2={connectedTerritory.position.x}
                  y2={connectedTerritory.position.y}
                />
              );
            })
          )}
        </svg>

        {/* Territory buttons */}
        {territories.map((territory) => (
          <Tooltip
            key={territory.id}
            title={
              <Box>
                <Typography variant="subtitle2">{territory.name}</Typography>
                <Typography variant="body2">Kontynent: {territory.continent}</Typography>
                <Typography variant="body2">Armie: {territory.armies}</Typography>
                <Typography variant="body2">
                  Właściciel: {territory.owner ? players.find(p => p.id === territory.owner)?.name || 'Nieznany' : 'Neutralny'}
                </Typography>
                {gameState.phase === 'attack' && attackFromTerritory && territory.owner !== gameState.currentPlayer && (
                  <Typography variant="body2" color="warning.main">
                    {attackFromTerritory.connections.includes(territory.id) ? '🎯 Można zaatakować!' : '❌ Za daleko'}
                  </Typography>
                )}
              </Box>
            }
            placement="top"
            arrow
          >
            <TerritoryButton
              ownercolor={getPlayerColor(territory.owner)}
              isselected={(selectedTerritory?.id === territory.id).toString()}
              ishighlighted={(
                (gameState.phase === 'attack' && attackFromTerritory?.connections.includes(territory.id) && territory.owner !== gameState.currentPlayer) ||
                (gameState.phase === 'draft' && territory.owner === gameState.currentPlayer && selectedTerritory?.id === territory.id)
              ).toString()}
              style={{
                left: territory.position.x - 17.5,
                top: territory.position.y - 17.5,
                zIndex: selectedTerritory?.id === territory.id ? 15 : 5,
              }}
              onClick={() => handleTerritoryClick(territory)}
              onMouseEnter={() => setHoveredTerritory(territory)}
              onMouseLeave={() => setHoveredTerritory(null)}
            >
              {territory.armies || 0}
            </TerritoryButton>
          </Tooltip>
        ))}
      </MapContainer>

      {/* Continent Control Panel */}
      <Paper elevation={2} sx={{ p: 2, backgroundColor: '#f8fafc' }}>
        <Typography variant="h6" gutterBottom>Kontrola Kontynentów</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {Object.entries(continentControl).map(([continentName, control]) => (
            <Chip
              key={continentName}
              label={`${continentName} (${control.controlled}/${control.territories})`}
              color={control.owner ? 'primary' : 'default'}
              size="small"
              sx={{
                backgroundColor: control.owner ? getPlayerColor(control.owner) : undefined,
                color: control.owner ? '#ffffff' : undefined,
              }}
            />
          ))}
        </Box>
      </Paper>

      {/* Selected Territory Info */}
      {selectedTerritory && (
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" color="primary">
              {selectedTerritory.name}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {selectedTerritory.continent} • {selectedTerritory.armies} armii
            </Typography>
            <Typography variant="body2">
              Właściciel: {selectedTerritory.owner 
                ? players.find(p => p.id === selectedTerritory.owner)?.name || 'Nieznany'
                : 'Neutralny'}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Połączenia: {selectedTerritory.connections.map(id => 
                territories.find(t => t.id === id)?.name
              ).join(', ')}
            </Typography>
            
            {/* Game Phase Info */}
            {gameState.phase === 'draft' && selectedTerritory.owner === gameState.currentPlayer && (
              <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                ✅ Możesz umieścić tutaj armię
              </Typography>
            )}
            
            {gameState.phase === 'attack' && attackFromTerritory && (
              <Box sx={{ mt: 1 }}>
                {attackFromTerritory.id === selectedTerritory.id ? (
                  <Typography variant="body2" color="info.main">
                    🗡️ Wybrane jako źródło ataku
                  </Typography>
                ) : selectedTerritory.owner !== gameState.currentPlayer && attackFromTerritory.connections.includes(selectedTerritory.id) ? (
                  <Typography variant="body2" color="warning.main">
                    🎯 Cel ataku! Kliknij ponownie aby zaatakować
                  </Typography>
                ) : (
                  <Typography variant="body2" color="error.main">
                    ❌ Nie można zaatakować z {territories.find(t => t.id === attackFromTerritory.id)?.name}
                  </Typography>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Hovered Territory Info */}
      {hoveredTerritory && hoveredTerritory.id !== selectedTerritory?.id && (
        <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
          <Card elevation={6} sx={{ minWidth: 200 }}>
            <CardContent sx={{ p: 1.5 }}>
              <Typography variant="subtitle2" color="primary">
                {hoveredTerritory.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {hoveredTerritory.continent}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}