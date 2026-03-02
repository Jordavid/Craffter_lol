// Paleta de colores según el documento de diseño
export const COLORS = {
  background: '#0A1428',
  accentGold: '#C89B3C',
  magicBlue: '#0BC6E3',
  progressGreen: '#00BFA5',
  panelDark: '#1A2332',
  textMain: '#F0E6D2',
  itemBorder: '#463714',
  successGreen: '#00FF88',
  errorRed: '#FF4444',
};

// Configuración del juego
export const GAME_CONFIG = {
  timePerQuestion: 15, // segundos
  pointsPerCorrect: 100,
  pointsPerIncorrect: 50,
  itemsInCircle: 14,
  circleRadius: 270,
  centralItemSize: 120,
  peripheralItemSize: 64,
  maxSlots: 2, // Cantidad de items que componen la receta
};

// API Configuration
export const API_CONFIG = {
  // Lee la variable de entorno, si no existe usa localhost
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  endpoints: {
    question: '/game/question',
    validate: '/game/validate',
  },
};