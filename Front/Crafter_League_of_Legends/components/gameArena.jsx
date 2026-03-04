import { motion } from 'framer-motion';
import ItemCard from './itemCard';
import CentralItem from './centralItem';
import { useResponsive } from '../hooks/userResponsive';

// Partículas generadas una sola vez para evitar re-renders
const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  left: `${(i * 2.5 + Math.sin(i * 1.7) * 15 + 50) % 100}%`, // distribución uniforme
  size: 2 + (i % 3),           // 2, 3, o 4 px
  duration: 6 + (i % 7),       // 6–12 segundos por ciclo
  delay: (i * 0.37) % 6,       // escalonadas para que nunca salgan todas juntas
  opacity: 0.5 + (i % 5) * 0.1, // 0.5–0.9
}));

export default function GameArena({
  centralItem,
  peripheralItems,
  selectedItems,
  onItemClick,
  feedbackState,
}) {
  const { layout, width, height } = useResponsive();
  const { headerHeight, panelHeight, centralItemSize } = layout;

  const arenaH = height - headerHeight - panelHeight;
  const arenaW = width;

  const total = peripheralItems?.length || 1;
  const baseItemSize = layout.peripheralItemSize;
  const halfItem = baseItemSize / 2;

  const r3Radius = Math.round(centralItemSize * 3.0) / 2;

  const maxRadiusByHeight = Math.floor(arenaH / 2 - halfItem - 20);
  const maxRadiusByWidth  = Math.floor(arenaW / 2 - halfItem - 20);
  const maxRadius = Math.min(maxRadiusByHeight, maxRadiusByWidth, layout.circleRadius);

  const minRadiusByRing = Math.ceil(r3Radius + halfItem + 12);
  const GAP = 8;
  const minRadiusForSpacing = (baseItemSize + GAP) / (2 * Math.sin(Math.PI / total));
  const minRadius = Math.max(minRadiusByRing, minRadiusForSpacing);

  let effectiveRadius = Math.max(maxRadius, minRadius);
  let effectiveItemSize = baseItemSize;

  if (maxRadius < minRadius) {
    const maxItemSizeBySpacing = maxRadius * 2 * Math.sin(Math.PI / total) - GAP;
    const maxHalfByRing = maxRadius - r3Radius - 12;
    const maxItemSizeByRing = maxHalfByRing * 2;
    effectiveItemSize = Math.max(24, Math.floor(Math.min(maxItemSizeBySpacing, maxItemSizeByRing)));
    effectiveRadius = maxRadius;
  }

  const halfEffective = effectiveItemSize / 2;

  const getCircularPosition = (index) => {
    const angle = (360 / total) * index - 90;
    const rad = (angle * Math.PI) / 180;
    return {
      x: effectiveRadius * Math.cos(rad),
      y: effectiveRadius * Math.sin(rad),
    };
  };

  const isItemSelected = (item) => selectedItems.some((s) => s.id === item.id);

  const getItemFeedback = (item) => {
    if (!feedbackState) return { isCorrect: false, isIncorrect: false };
    const isCorrect = feedbackState.correctItems?.some((c) => c.id === item.id);
    const isIncorrect = !isCorrect && selectedItems.some((s) => s.id === item.id);
    return { isCorrect, isIncorrect };
  };

  return (
    <div style={{ ...styles.arena, height: `${arenaH}px` }}>

      {/* ── Partículas mágicas ── */}
      <div style={styles.particles}>
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            style={{
              position: 'absolute',
              bottom: 0,
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: '50%',
              backgroundColor: '#0BC6E3',
              boxShadow: `0 0 ${p.size * 3}px #0BC6E3, 0 0 ${p.size * 6}px rgba(11,198,227,0.4)`,
            }}
            animate={{
              // Recorren toda la altura de la arena (arenaH) más un poco más
              y: [0, -(arenaH + 20)],
              opacity: [0, p.opacity, p.opacity, 0],
              // Oscilación horizontal suave para que no sean líneas rectas
              x: [0, 8, -6, 10, 0],
            }}
            transition={{
              y: {
                repeat: Infinity,
                duration: p.duration,
                delay: p.delay,
                ease: 'linear',
              },
              opacity: {
                repeat: Infinity,
                duration: p.duration,
                delay: p.delay,
                times: [0, 0.1, 0.85, 1],
              },
              x: {
                repeat: Infinity,
                duration: p.duration * 0.6,
                delay: p.delay,
                ease: 'easeInOut',
              },
            }}
          />
        ))}
      </div>

      {/* ── Item central ── */}
      <div style={styles.centralContainer}>
        <CentralItem item={centralItem} />
      </div>

      {/* ── Items periféricos en círculo ── */}
      {peripheralItems?.map((item, index) => {
        const pos = getCircularPosition(index);
        const { isCorrect, isIncorrect } = getItemFeedback(item);

        return (
          <motion.div
            key={item?.id || `item-${index}`}
            style={{
              ...styles.peripheralItem,
              width: `${effectiveItemSize}px`,
              height: `${effectiveItemSize}px`,
              left: `calc(50% + ${pos.x}px - ${halfEffective}px)`,
              top: `calc(50% + ${pos.y}px - ${halfEffective}px)`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.04, type: 'spring', stiffness: 200 }}
          >
            <ItemCard
              item={item}
              onClick={() => onItemClick(item)}
              isSelected={isItemSelected(item)}
              isCorrect={isCorrect}
              isIncorrect={isIncorrect}
              disabled={!!feedbackState}
              size={effectiveItemSize}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

const styles = {
  arena: {
    position: 'relative',
    width: '100%',
    flexShrink: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  centralContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 2,
  },
  peripheralItem: {
    position: 'absolute',
    zIndex: 3,
  },
  particles: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 0,
    overflow: 'hidden',
  },
};