import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Chip,
  Alert,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import { Warning, TrendingUp, Shield, LocalFireDepartment } from '@mui/icons-material';

interface Risk {
  risk: string;
  probability: number;
}

interface RiskAnalysisProps {
  selectedTerritory?: string;
  playerName?: string;
}

export default function RiskAnalysis({ selectedTerritory, playerName }: RiskAnalysisProps) {
  const [riskData, setRiskData] = useState<Risk | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRiskData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/risk');
      if (!response.ok) {
        throw new Error('Failed to fetch risk data');
      }
      const data = await response.json();
      
      // Handle the nested structure from your backend
      if (data.risk && data.risk.risk && data.risk.probability !== undefined) {
        setRiskData(data.risk);
      } else {
        throw new Error('Invalid risk data format');
      }
    } catch (err) {
      console.error('Error fetching risk data:', err);
      setError('Nie udało się pobrać danych o ryzyku');
      setRiskData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskData();
  }, [selectedTerritory, playerName]); // Refresh when territory or player changes

  const getRiskLevel = (probability: number) => {
    if (probability >= 0.8) return { level: 'Bardzo wysokie', color: '#dc2626', icon: <LocalFireDepartment /> };
    if (probability >= 0.6) return { level: 'Wysokie', color: '#ea580c', icon: <Warning /> };
    if (probability >= 0.4) return { level: 'Średnie', color: '#ca8a04', icon: <TrendingUp /> };
    if (probability >= 0.2) return { level: 'Niskie', color: '#16a34a', icon: <Shield /> };
    return { level: 'Bardzo niskie', color: '#059669', icon: <Shield /> };
  };

  const formatRiskType = (riskType: string) => {
    const riskTranslations: Record<string, string> = {
      'sector_threat': 'Zagrożenie sektorowe',
      'economic_risk': 'Ryzyko ekonomiczne',
      'military_risk': 'Ryzyko militarne',
      'diplomatic_risk': 'Ryzyko dyplomatyczne',
      'resource_shortage': 'Niedobór zasobów',
      'rebellion_risk': 'Ryzyko buntu'
    };
    
    return riskTranslations[riskType] || riskType;
  };

  if (loading) {
    return (
      <Card elevation={3} sx={{ minHeight: 200 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Analizuję ryzyko...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card elevation={3} sx={{ minHeight: 200 }}>
        <CardContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="outlined" onClick={fetchRiskData} fullWidth>
            Spróbuj ponownie
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!riskData) {
    return (
      <Card elevation={3} sx={{ minHeight: 200 }}>
        <CardContent>
          <Typography variant="h6" color="text.secondary">
            Brak danych o ryzyku
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Kliknij przycisk poniżej, aby pobrać analizę ryzyka
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" onClick={fetchRiskData}>
            Pobierz analizę
          </Button>
        </CardActions>
      </Card>
    );
  }

  const riskLevel = getRiskLevel(riskData.probability);

  return (
    <Card elevation={3} sx={{ minHeight: 200 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {riskLevel.icon}
          <Typography variant="h6" component="div" color="primary">
            Analiza Ryzyka
          </Typography>
        </Box>
        
        <Typography variant="h5" component="div" sx={{ mb: 1, fontWeight: 'bold' }}>
          {formatRiskType(riskData.risk)}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Poziom prawdopodobieństwa:
            </Typography>
            <Typography variant="h6" sx={{ color: riskLevel.color, fontWeight: 'bold' }}>
              {(riskData.probability * 100).toFixed(1)}%
            </Typography>
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={riskData.probability * 100}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: riskLevel.color,
                borderRadius: 4,
              },
            }}
          />
        </Box>

        <Chip
          icon={riskLevel.icon}
          label={riskLevel.level}
          size="small"
          sx={{
            backgroundColor: riskLevel.color,
            color: 'white',
            fontWeight: 'bold'
          }}
        />

        {selectedTerritory && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Analiza dla: {selectedTerritory}
          </Typography>
        )}
        
        {playerName && (
          <Typography variant="body2" color="text.secondary">
            Gracz: {playerName}
          </Typography>
        )}
      </CardContent>
      
      <CardActions>
        <Button size="small" onClick={fetchRiskData}>
          Odśwież analizę
        </Button>
        <Button size="small" color="secondary">
          Szczegóły
        </Button>
      </CardActions>
    </Card>
  );
}