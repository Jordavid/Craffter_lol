import { motion, AnimatePresence } from 'framer-motion';
import { COLORS } from '../constants/theme';
import { useResponsive } from '../hooks/userResponsive';

const PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMUEyMzMyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzIiIGZpbGw9IiNGMEU2RDIiPj88L3RleHQ+PC9zdmc+';

export default function CraftingPanel({ selectedItems, maxSlots, onSubmit, canSubmit }) {
  const { layout } = useResponsive();
  const { slotSize, panelHeight } = layout;
  const filled = selectedItems.length === maxSlots;

  const imgUrl = (item) =>
    `http://ddragon.leagueoflegends.com/cdn/16.3.1/img/item/${item.id}.png`;

  const labelSize = Math.max(10, slotSize * 0.17);
  const btnPad   = slotSize <= 65 ? '6px 22px' : '10px 38px';
  const btnSize  = slotSize <= 65 ? '12px' : '15px';

  return (
    <motion.div
      style={{ ...styles.panel, height: `${panelHeight}px` }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div style={{ ...styles.label, fontSize: `${labelSize}px` }}>Crafting Slots</div>

      <div style={styles.slots}>
        {Array.from({ length: maxSlots }).map((_, i) => {
          const item = selectedItems[i];
          return (
            <div key={i} style={{ width: slotSize, height: slotSize, position: 'relative' }}>
              <AnimatePresence mode="wait">
                {item ? (
                  <motion.div
                    key={item.id}
                    style={styles.filled}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                  >
                    <img
                      src={imgUrl(item)}
                      alt={item.name}
                      style={styles.img}
                      onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER; }}
                    />
                  </motion.div>
                ) : (
                  <motion.div key="empty" style={styles.empty} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <span style={{ fontSize: `${slotSize * 0.3}px`, color: '#463714', fontWeight: 'bold' }}>
                      {i + 1}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {filled && (
        <button
          onClick={onSubmit}
          style={{
            ...styles.btn,
            padding: btnPad,
            fontSize: btnSize,
            backgroundColor: canSubmit ? COLORS.accentGold : '#555',
          }}
        >
          CRAFT ITEM
        </button>
      )}
    </motion.div>
  );
}

const styles = {
  panel: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(26, 35, 50, 0.97)',
    borderTop: '2px solid #463714',
    borderRadius: '12px 12px 0 0',
    padding: '10px 20px 8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  label: {
    color: '#F0E6D2',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  slots: {
    display: 'flex',
    gap: '12px',
    marginBottom: '8px',
  },
  filled: {
    width: '100%',
    height: '100%',
    border: '3px solid #C89B3C',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 0 16px #C89B3C',
  },
  empty: {
    width: '100%',
    height: '100%',
    border: '2px dashed #463714',
    borderRadius: '8px',
    backgroundColor: 'rgba(70,55,20,0.2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  btn: {
    fontWeight: 'bold',
    color: '#0A1428',
    border: 'none',
    borderRadius: '8px',
    letterSpacing: '1px',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(200,155,60,0.4)',
    transition: 'all 0.2s ease',
  },
};