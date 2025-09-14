export interface Territory {
  id: string;
  name: string;
  continent: string;
  armies: number;
  owner: number | null; // player id
  position: { x: number; y: number };
  connections: string[]; // connected territory IDs
}

export interface GameState {
  territories: Territory[];
  players: Player[];
  currentPlayer: number;
  turn: number;
  phase: 'draft' | 'attack' | 'fortify';
  armiesToPlace: number;
  gameLog: GameLogEntry[];
  selectedTerritory: Territory | null;
  attackFromTerritory: Territory | null;
}

export interface GameLogEntry {
  turn: number;
  player: number;
  action: 'draft' | 'attack' | 'fortify' | 'conquer' | 'endTurn';
  message: string;
  timestamp: number;
}

export interface AttackResult {
  success: boolean;
  attackerLosses: number;
  defenderLosses: number;
  conquered: boolean;
}

export interface Player {
  id: number;
  name: string;
  color: string;
  gold: number;
  army: {
    infantry: number;
    tanks: number;
  };
  territoriesCount: number;
  continentsControlled: string[];
}

// Definicja kontinentów i terytoriów dla uproszczonej mapy Risk
export const CONTINENTS = {
  'Europa': {
    color: '#3b82f6',
    bonus: 5,
    territories: ['Wielka_Brytania', 'Skandynavia', 'Ukraina', 'Europa_Zachodnia', 'Europa_Poludniowa', 'Islandia', 'Europa_Polnocna']
  },
  'Azja': {
    color: '#10b981',
    bonus: 7,
    territories: ['Syberia', 'Chiny', 'Mongolia', 'Japonia', 'Indie', 'Bliski_Wschod', 'Afganistan', 'Azja_Poludniowo_Wschodnia', 'Irkuck', 'Jakuck', 'Kamchatka', 'Ural']
  },
  'Ameryka_Polnocna': {
    color: '#f59e0b',
    bonus: 5,
    territories: ['Alaska', 'Kanada_Zachodnia', 'Kanada_Wschodnia', 'Grenlandia', 'Stany_Zachodnie', 'Stany_Wschodnie', 'Ameryka_Srodkowa']
  },
  'Ameryka_Poludniowa': {
    color: '#ef4444',
    bonus: 2,
    territories: ['Wenezuela', 'Peru', 'Brazylia', 'Argentyna']
  },
  'Afryka': {
    color: '#8b5cf6',
    bonus: 3,
    territories: ['Afryka_Polnocna', 'Egipt', 'Kongo', 'Afryka_Wschodnia', 'Afryka_Poludniowa', 'Madagaskar']
  },
  'Australia': {
    color: '#06b6d4',
    bonus: 2,
    territories: ['Indonesia', 'Nowa_Gwinea', 'Australia_Wschodnia', 'Australia_Zachodnia']
  }
};

export const TERRITORIES: Territory[] = [
  // Europa
  { id: 'Wielka_Brytania', name: 'Wielka Brytania', continent: 'Europa', armies: 0, owner: null, position: { x: 100, y: 150 }, connections: ['Islandia', 'Skandynavia', 'Europa_Zachodnia', 'Europa_Polnocna'] },
  { id: 'Skandynavia', name: 'Skandynavia', continent: 'Europa', armies: 0, owner: null, position: { x: 180, y: 80 }, connections: ['Wielka_Brytania', 'Ukraina', 'Europa_Polnocna'] },
  { id: 'Ukraina', name: 'Ukraina', continent: 'Europa', armies: 0, owner: null, position: { x: 220, y: 130 }, connections: ['Skandynavia', 'Ural', 'Afganistan', 'Bliski_Wschod', 'Europa_Poludniowa', 'Europa_Polnocna'] },
  { id: 'Europa_Zachodnia', name: 'Europa Zachodnia', continent: 'Europa', armies: 0, owner: null, position: { x: 140, y: 180 }, connections: ['Wielka_Brytania', 'Europa_Polnocna', 'Europa_Poludniowa', 'Afryka_Polnocna'] },
  { id: 'Europa_Poludniowa', name: 'Europa Południowa', continent: 'Europa', armies: 0, owner: null, position: { x: 180, y: 200 }, connections: ['Europa_Zachodnia', 'Europa_Polnocna', 'Ukraina', 'Bliski_Wschod', 'Egipt', 'Afryka_Polnocna'] },
  { id: 'Europa_Polnocna', name: 'Europa Północna', continent: 'Europa', armies: 0, owner: null, position: { x: 180, y: 150 }, connections: ['Wielka_Brytania', 'Skandynavia', 'Ukraina', 'Europa_Poludniowa', 'Europa_Zachodnia'] },
  { id: 'Islandia', name: 'Islandia', continent: 'Europa', armies: 0, owner: null, position: { x: 60, y: 100 }, connections: ['Wielka_Brytania', 'Grenlandia'] },

  // Azja
  { id: 'Ural', name: 'Ural', continent: 'Azja', armies: 0, owner: null, position: { x: 280, y: 120 }, connections: ['Ukraina', 'Syberia', 'Chiny', 'Afganistan'] },
  { id: 'Syberia', name: 'Syberia', continent: 'Azja', armies: 0, owner: null, position: { x: 340, y: 80 }, connections: ['Ural', 'Jakuck', 'Irkuck', 'Mongolia', 'Chiny'] },
  { id: 'Jakuck', name: 'Jakuck', continent: 'Azja', armies: 0, owner: null, position: { x: 400, y: 60 }, connections: ['Syberia', 'Irkuck', 'Kamchatka'] },
  { id: 'Irkuck', name: 'Irkuck', continent: 'Azja', armies: 0, owner: null, position: { x: 380, y: 100 }, connections: ['Syberia', 'Jakuck', 'Kamchatka', 'Mongolia'] },
  { id: 'Kamchatka', name: 'Kamchatka', continent: 'Azja', armies: 0, owner: null, position: { x: 440, y: 80 }, connections: ['Jakuck', 'Irkuck', 'Mongolia', 'Japonia', 'Alaska'] },
  { id: 'Mongolia', name: 'Mongolia', continent: 'Azja', armies: 0, owner: null, position: { x: 360, y: 140 }, connections: ['Syberia', 'Irkuck', 'Kamchatka', 'Chiny', 'Japonia'] },
  { id: 'Chiny', name: 'Chiny', continent: 'Azja', armies: 0, owner: null, position: { x: 340, y: 180 }, connections: ['Ural', 'Syberia', 'Mongolia', 'Afganistan', 'Indie', 'Azja_Poludniowo_Wschodnia'] },
  { id: 'Japonia', name: 'Japonia', continent: 'Azja', armies: 0, owner: null, position: { x: 420, y: 160 }, connections: ['Mongolia', 'Kamchatka'] },
  { id: 'Afganistan', name: 'Afganistan', continent: 'Azja', armies: 0, owner: null, position: { x: 280, y: 160 }, connections: ['Ukraina', 'Ural', 'Chiny', 'Indie', 'Bliski_Wschod'] },
  { id: 'Bliski_Wschod', name: 'Bliski Wschód', continent: 'Azja', armies: 0, owner: null, position: { x: 240, y: 200 }, connections: ['Ukraina', 'Afganistan', 'Indie', 'Europa_Poludniowa', 'Egipt', 'Afryka_Wschodnia'] },
  { id: 'Indie', name: 'Indie', continent: 'Azja', armies: 0, owner: null, position: { x: 300, y: 220 }, connections: ['Afganistan', 'Chiny', 'Bliski_Wschod', 'Azja_Poludniowo_Wschodnia'] },
  { id: 'Azja_Poludniowo_Wschodnia', name: 'Azja Południowo-Wschodnia', continent: 'Azja', armies: 0, owner: null, position: { x: 360, y: 240 }, connections: ['Chiny', 'Indie', 'Indonesia'] },

  // Ameryka Północna
  { id: 'Alaska', name: 'Alaska', continent: 'Ameryka_Polnocna', armies: 0, owner: null, position: { x: 20, y: 80 }, connections: ['Kamchatka', 'Kanada_Zachodnia', 'Stany_Zachodnie'] },
  { id: 'Grenlandia', name: 'Grenlandia', continent: 'Ameryka_Polnocna', armies: 0, owner: null, position: { x: 140, y: 40 }, connections: ['Islandia', 'Kanada_Wschodnia', 'Kanada_Zachodnia'] },
  { id: 'Kanada_Zachodnia', name: 'Kanada Zachodnia', continent: 'Ameryka_Polnocna', armies: 0, owner: null, position: { x: 60, y: 120 }, connections: ['Alaska', 'Grenlandia', 'Kanada_Wschodnia', 'Stany_Zachodnie'] },
  { id: 'Kanada_Wschodnia', name: 'Kanada Wschodnia', continent: 'Ameryka_Polnocna', armies: 0, owner: null, position: { x: 100, y: 120 }, connections: ['Grenlandia', 'Kanada_Zachodnia', 'Stany_Wschodnie', 'Stany_Zachodnie'] },
  { id: 'Stany_Zachodnie', name: 'Stany Zachodnie', continent: 'Ameryka_Polnocna', armies: 0, owner: null, position: { x: 60, y: 160 }, connections: ['Alaska', 'Kanada_Zachodnia', 'Kanada_Wschodnia', 'Stany_Wschodnie', 'Ameryka_Srodkowa'] },
  { id: 'Stany_Wschodnie', name: 'Stany Wschodnie', continent: 'Ameryka_Polnocna', armies: 0, owner: null, position: { x: 100, y: 160 }, connections: ['Kanada_Wschodnia', 'Stany_Zachodnie', 'Ameryka_Srodkowa'] },
  { id: 'Ameryka_Srodkowa', name: 'Ameryka Środkowa', continent: 'Ameryka_Polnocna', armies: 0, owner: null, position: { x: 80, y: 200 }, connections: ['Stany_Zachodnie', 'Stany_Wschodnie', 'Wenezuela'] },

  // Ameryka Południowa
  { id: 'Wenezuela', name: 'Wenezuela', continent: 'Ameryka_Poludniowa', armies: 0, owner: null, position: { x: 100, y: 240 }, connections: ['Ameryka_Srodkowa', 'Peru', 'Brazylia'] },
  { id: 'Peru', name: 'Peru', continent: 'Ameryka_Poludniowa', armies: 0, owner: null, position: { x: 80, y: 280 }, connections: ['Wenezuela', 'Brazylia', 'Argentyna'] },
  { id: 'Brazylia', name: 'Brazylia', continent: 'Ameryka_Poludniowa', armies: 0, owner: null, position: { x: 120, y: 280 }, connections: ['Wenezuela', 'Peru', 'Argentyna', 'Afryka_Polnocna'] },
  { id: 'Argentyna', name: 'Argentyna', continent: 'Ameryka_Poludniowa', armies: 0, owner: null, position: { x: 100, y: 320 }, connections: ['Peru', 'Brazylia'] },

  // Afryka
  { id: 'Afryka_Polnocna', name: 'Afryka Północna', continent: 'Afryka', armies: 0, owner: null, position: { x: 160, y: 240 }, connections: ['Europa_Zachodnia', 'Europa_Poludniowa', 'Egipt', 'Afryka_Wschodnia', 'Kongo', 'Brazylia'] },
  { id: 'Egipt', name: 'Egipt', continent: 'Afryka', armies: 0, owner: null, position: { x: 200, y: 240 }, connections: ['Europa_Poludniowa', 'Bliski_Wschod', 'Afryka_Polnocna', 'Afryka_Wschodnia'] },
  { id: 'Afryka_Wschodnia', name: 'Afryka Wschodnia', continent: 'Afryka', armies: 0, owner: null, position: { x: 220, y: 280 }, connections: ['Bliski_Wschod', 'Egipt', 'Afryka_Polnocna', 'Kongo', 'Afryka_Poludniowa', 'Madagaskar'] },
  { id: 'Kongo', name: 'Kongo', continent: 'Afryka', armies: 0, owner: null, position: { x: 180, y: 300 }, connections: ['Afryka_Polnocna', 'Afryka_Wschodnia', 'Afryka_Poludniowa'] },
  { id: 'Afryka_Poludniowa', name: 'Afryka Południowa', continent: 'Afryka', armies: 0, owner: null, position: { x: 200, y: 340 }, connections: ['Kongo', 'Afryka_Wschodnia', 'Madagaskar'] },
  { id: 'Madagaskar', name: 'Madagaskar', continent: 'Afryka', armies: 0, owner: null, position: { x: 240, y: 340 }, connections: ['Afryka_Wschodnia', 'Afryka_Poludniowa'] },

  // Australia
  { id: 'Indonesia', name: 'Indonesia', continent: 'Australia', armies: 0, owner: null, position: { x: 360, y: 280 }, connections: ['Azja_Poludniowo_Wschodnia', 'Nowa_Gwinea', 'Australia_Zachodnia'] },
  { id: 'Nowa_Gwinea', name: 'Nowa Gwinea', continent: 'Australia', armies: 0, owner: null, position: { x: 420, y: 300 }, connections: ['Indonesia', 'Australia_Wschodnia', 'Australia_Zachodnia'] },
  { id: 'Australia_Wschodnia', name: 'Australia Wschodnia', continent: 'Australia', armies: 0, owner: null, position: { x: 440, y: 340 }, connections: ['Nowa_Gwinea', 'Australia_Zachodnia'] },
  { id: 'Australia_Zachodnia', name: 'Australia Zachodnia', continent: 'Australia', armies: 0, owner: null, position: { x: 400, y: 340 }, connections: ['Indonesia', 'Nowa_Gwinea', 'Australia_Wschodnia'] }
];