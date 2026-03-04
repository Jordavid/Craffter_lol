import { useCallback, useEffect, useState, useMemo } from 'react'
import './App.css'
import { storageService } from '../services/storageService';
import { GAME_CONFIG } from '../constants/theme';
import { gameService } from '../services/gameService';
import { useResponsive } from '../hooks/userResponsive';
import GameHeader from '../components/gameHeader';
import GameArena from '../components/gameArena';
import CraftingPanel from '../components/craftingPanel';
import FeedbackOverlay from '../components/feedbackOverlay';

function App() {
  const {layout} = useResponsive();

  const [gameData, setGameData] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [score, setScore] = useState(storageService.getScore());
  const [bestScore, setBestScore] = useState(storageService.getBestScore());
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.timePerQuestion);
  const [feedback, setFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const requiredSlots = useMemo(() => {
    return gameData?.correctComponents?.length || 2;
  }, [gameData?.correctComponents?.length]);

  const loadNewQuestion = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSelectedItems([]);
      setFeedback(null);
      setTimeLeft(GAME_CONFIG.timePerQuestion);

      const data = await gameService.getRandomItem();
      setGameData(data);
    } catch (err) {
      console.error('Error loading question:', err);
      setError('Error al cargar el juego. Verifica que el back este corriendo.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNewQuestion();
  }, [loadNewQuestion]);

  // TIMER: Se pausa automaticamente cuando los slots estan completos
  useEffect(() => {
    if (!gameData || feedback || timeLeft <= 0) return;
    if (selectedItems.length >= requiredSlots) return; // PAUSA cuando slots llenos

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameData, feedback, timeLeft, selectedItems.length, requiredSlots]);

  const handleTimeout = useCallback(() => {
    setFeedback({
      isCorrect: false,
      message: 'Tiempo Agotado',
      correctItems: gameData?.correctComponents || [],
    });
    storageService.resetStreak();
  }, [gameData]);

  const handleItemClick = useCallback((item) => {
    if (feedback) return;

    setSelectedItems((prev) => {
      const isInSlots = prev.some((s) => s.id === item.id);

      if (prev.length < requiredSlots) {
        // Hay espacio: siempre agregar (permite duplicados)
        return [...prev, item];
      } else if (isInSlots) {
        // Slots llenos y el item ya está: eliminar la última ocurrencia
        const lastIdx = prev.map((s) => s.id).lastIndexOf(item.id);
        return prev.filter((_, i) => i !== lastIdx);
      }
      // Slots llenos y el item no está: no hacer nada
      return prev;
    });
  }, [feedback, requiredSlots]);

  // SUBMIT: Sin bloqueo por feedback, solo verifica que haya items
  const handleSubmit = useCallback(async () => {
    if (selectedItems.length !== requiredSlots) return;

    try {
      const selectedIds = selectedItems.map((item) => item.id);
      const result = await gameService.validateAnswer(gameData.targetItem.id, selectedIds);

      if (result.isCorrect) {
        const newScore = score + GAME_CONFIG.pointsPerCorrect;
        setScore(newScore);
        storageService.setScore(newScore);
        storageService.incrementStreak();

        if (newScore > bestScore) setBestScore(newScore);

        setFeedback({ isCorrect: true, points: GAME_CONFIG.pointsPerCorrect });
        setTimeout(() => loadNewQuestion(), 2000);
      } else {
        const newScore = Math.max(0, score - GAME_CONFIG.pointsPerIncorrect);
        setScore(newScore);
        storageService.setScore(newScore);
        storageService.resetStreak();
        setFeedback({
          isCorrect: false,
          points: GAME_CONFIG.pointsPerIncorrect,
          correctItems: result.correctComponents || gameData.correctComponents,
        });
      }
    } catch (err) {
      console.error('Error validating answer:', err);
    }
  }, [selectedItems, gameData, score, bestScore, loadNewQuestion, requiredSlots]);

  const handleCloseFeedback = useCallback(() => {
    loadNewQuestion();
  }, [loadNewQuestion]);

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingText}>Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorText}>{error}</div>
        <button style={styles.retryButton} onClick={loadNewQuestion}>Reintentar</button>
      </div>
    );
  }

  if (!gameData) return null;

  return (
    <div style={styles.app} className='no-select'>
      <div style={{height: `${layout.headerHeight}px`, flexShrink: 0}}>
        <GameHeader timeLeft={timeLeft} score={score} bestScore={bestScore} />
      </div>

      <GameArena
        centralItem={gameData.targetItem}
        peripheralItems={gameData.options}
        selectedItems={selectedItems}
        onItemClick={handleItemClick}
        feedbackState={feedback}
      />

      <div style={{ height: `${layout.panelHeight}px`, position: 'relative', flexShrink: 0 }}>
        <CraftingPanel
          selectedItems={selectedItems}
          maxSlots={requiredSlots}
          onSubmit={handleSubmit}
          canSubmit={selectedItems.length === requiredSlots && !feedback}
        />
      </div>

      <FeedbackOverlay feedback={feedback} onClose={handleCloseFeedback} />
    </div>
  );
}

const styles = {
  app: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #0A1428 0%, #1A2332 100%)',
  },
  loadingContainer: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#0A1428',
  },
  loadingText: {
    fontSize: '22px',
    color: '#F0E6D2',
    fontWeight: 'bold',
  },
  errorContainer: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#0A1428',
    gap: '20px',
  },
  errorText: {
    fontSize: '16px',
    color: '#FF4444',
    textAlign: 'center',
    maxWidth: '80%',
  },
  retryButton: {
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#0A1428',
    backgroundColor: '#C89B3C',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default App;