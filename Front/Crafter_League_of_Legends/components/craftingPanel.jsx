import { motion, AnimatePresence } from 'framer-motion';
import { COLORS } from '../constants/theme';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjMUEyMzMyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzIiIGZpbGw9IiNGMEU2RDIiPj88L3RleHQ+PC9zdmc+';

export default function CraftingPanel({ selectedItems = [], maxSlots, onSubmit, canSubmit }) {
  const slotsLlenos = selectedItems.length === maxSlots;

  const getItemImage = (item) => {
    const version = '16.3.1';
    return `http://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.id}.png`;
  };

  return (
    <motion.div
      style={styles.panel}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div style={styles.label}>Crafting Slots</div>

      <div style={styles.slotsContainer}>
        {Array.from({ length: maxSlots }).map((_, index) => {
          const item = selectedItems[index];
          return (
            <div key={index} style={styles.slot}>
              <AnimatePresence mode="wait">
                {item ? (
                  <motion.div
                    key={item.id}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    style={styles.itemWrapper}
                  >
                    <img
                      src={getItemImage(item)}
                      alt={item.name}
                      style={styles.itemImage}
                      onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER_IMAGE; }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={styles.emptySlot}
                  >
                    <span style={styles.slotNumber}>{index + 1}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Boton CRAFT ITEM - siempre clickeable cuando slots llenos */}
      {slotsLlenos && (
        <button
          onClick={onSubmit}
          style={{
            ...styles.craftButton,
            backgroundColor: canSubmit ? COLORS.accentGold : '#666',
            cursor: 'pointer',
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
    bottom: 0,
    left: 0,
    right: 0,
    height: '230px',
    backgroundColor: 'rgba(26, 35, 50, 0.95)',
    borderTop: `2px solid #463714`,
    borderRadius: '12px 12px 0 0',
    padding: '16px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backdropFilter: 'blur(10px)',
  },
  label: {
    fontSize: '14px',
    color: '#F0E6D2',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  slotsContainer: {
    display: 'flex',
    gap: '16px',
    marginBottom: '12px',
  },
  slot: {
    width: '80px',
    height: '80px',
    position: 'relative',
  },
  emptySlot: {
    width: '100%',
    height: '100%',
    border: `2px dashed #463714`,
    borderRadius: '8px',
    backgroundColor: 'rgba(70, 55, 20, 0.2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotNumber: {
    fontSize: '24px',
    color: '#463714',
    fontWeight: 'bold',
  },
  itemWrapper: {
    width: '100%',
    height: '100%',
    border: `3px solid ${COLORS.accentGold}`,
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: `0 0 20px ${COLORS.accentGold}`,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  craftButton: {
    padding: '10px 40px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#0A1428',
    border: 'none',
    borderRadius: '8px',
    letterSpacing: '1px',
    boxShadow: '0 4px 20px rgba(200, 155, 60, 0.4)',
    transition: 'all 0.2s ease',
  },
};