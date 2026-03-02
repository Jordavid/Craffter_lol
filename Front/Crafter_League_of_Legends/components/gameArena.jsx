import { motion } from 'framer-motion';
import ItemCard from './itemCard';
import CentralItem from './centralItem';
import { GAME_CONFIG } from '../constants/theme';

export default function GameArena({
  centralItem,
  peripheralItems,
  selectedItems,
  onItemClick,
  feedbackState,
}) {
  const CIRCLE_OFFSET_Y = -20; // Ajuste vertical para centrar mejor los items en el círculo

  // Calcular posición circular de cada item
  const getCircularPosition = (index, total) => {
    const angle = (360 / total) * index;
    const angleRad = (angle * Math.PI) / 180;
    const x = GAME_CONFIG.circleRadius * Math.cos(angleRad);
    const y = GAME_CONFIG.circleRadius * Math.sin(angleRad);
    return { x, y, angle };
  };

  const isItemSelected = (item) => {
    return selectedItems.some((selected) => selected.id === item.id);
  };

  const getItemFeedback = (item) => {
    if (!feedbackState) return { isCorrect: false, isIncorrect: false };

    const isCorrect = feedbackState.correctItems?.some((correct) => correct.id === item.id);
    const isIncorrect =
      !isCorrect && selectedItems.some((selected) => selected.id === item.id);

    return { isCorrect, isIncorrect };
  };

  return (
    <div style={styles.arena}>
      {/* Item Central */}
      <div style={styles.centralContainer}>
        <CentralItem item={centralItem} />
      </div>

      {/* Items Periféricos en Círculo */}
      {peripheralItems?.map((item, index) => {
        const position = getCircularPosition(index, peripheralItems.length);
        const { isCorrect, isIncorrect } = getItemFeedback(item);

        return (
          <motion.div
            key={item?.id || `peripheral-item-${index}`}
            style={{
              ...styles.peripheralItem,
              left: `calc(50% + ${position.x}px - 32px)`,
              top: `calc(50% + ${position.y + CIRCLE_OFFSET_Y}px - 32px)`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: index * 0.05,
              type: 'spring',
              stiffness: 200,
            }}
          >
            <ItemCard
              item={item}
              onClick={() => onItemClick(item)}
              isSelected={isItemSelected(item)}
              isCorrect={isCorrect}
              isIncorrect={isIncorrect}
              disabled={!!feedbackState}
            />
          </motion.div>
        );
      })}

      {/* Partículas mágicas de fondo */}
      <div style={styles.particles}>
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            style={{
              ...styles.particle,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
            animate={{
              y: [0, -100, -200],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 5 + Math.random() * 5,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </div>
  );
}


const styles = {
  arena: {
    position: 'relative',
    width: '100%',
    height: 'calc(100vh - 260px)', // 100px header + 180px panel
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  centralContainer: {
    position: 'absolute',
    left: '50%',
    top: 'calc(50% - 20px)',
    transform: 'translate(-50%, -50%)',
    zIndex: 2,
  },
  peripheralItem: {
    position: 'absolute',
    zIndex: 1,
  },
  particles: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 0,
  },
  particle: {
    position: 'absolute',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: '#0BC6E3',
    boxShadow: '0 0 10px #0BC6E3',
  },
};