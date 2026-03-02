import { motion, AnimatePresence } from 'framer-motion';
import { COLORS } from '../constants/theme';

export default function FeedbackOverlay({ feedback, onClose }) {
  if (!feedback) return null;

  const isCorrect = feedback.isCorrect;

  return (
    <AnimatePresence>
      <motion.div
        style={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          style={{
            ...styles.messageContainer,
            backgroundColor: isCorrect
              ? 'rgba(0, 255, 136, 0.1)'
              : 'rgba(255, 68, 68, 0.1)',
            border: `2px solid ${isCorrect ? COLORS.successGreen : COLORS.errorRed}`,
          }}
          initial={{ scale: 0.5, y: -50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.5, y: 50 }}
          transition={{ type: 'spring', duration: 0.5 }}
        >
          {/* Icono */}
          <div
            style={{
              ...styles.icon,
              color: isCorrect ? COLORS.successGreen : COLORS.errorRed,
            }}
          >
            {isCorrect ? '✓' : '✗'}
          </div>

          {/* Mensaje */}
          <div style={styles.message}>
            {isCorrect ? (
              <>
                <div style={styles.title}>¡CORRECTO!</div>
                <div style={styles.points}>+{feedback.points} puntos</div>
              </>
            ) : (
              <>
                <div style={styles.title}>INCORRECTO</div>
                <div style={styles.subtitle}>
                  Los items correctos son:
                </div>
                <div style={styles.correctItems}>
                  {feedback.correctItems?.map((item, index) => (
                    <span key={`${item.id}-${index}`}>
                      {item.name}
                      {index < feedback.correctItems.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Botón continuar */}
          {!isCorrect && (
            <motion.button
              style={styles.button}
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              CONTINUAR
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(5px)',
  },
  messageContainer: {
    padding: '40px',
    borderRadius: '16px',
    textAlign: 'center',
    minWidth: '400px',
    boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)',
  },
  icon: {
    fontSize: '64px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textShadow: '0 0 20px currentColor',
  },
  message: {
    marginBottom: '20px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginBottom: '10px',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: '16px',
    color: COLORS.textMain,
    marginBottom: '10px',
    opacity: 0.8,
  },
  points: {
    fontSize: '24px',
    color: COLORS.successGreen,
    fontWeight: 'bold',
  },
  correctItems: {
    fontSize: '18px',
    color: COLORS.accentGold,
    fontWeight: 'bold',
    marginTop: '10px',
  },
  button: {
    padding: '12px 32px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: COLORS.background,
    backgroundColor: COLORS.accentGold,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    textTransform: 'uppercase',
    boxShadow: `0 4px 20px rgba(200, 155, 60, 0.4)`,
  },
};