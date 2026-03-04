import { motion } from "framer-motion";
import { COLORS } from "../constants/theme";
import { useResponsive } from "../hooks/userResponsive";

export default function GameHeader({ timeLeft, score, bestScore }) {
  const { layout, isMobile } = useResponsive();
  const timePercentage = (timeLeft / 30) * 100;
  const isLowTime = timeLeft <= 5;
  const barColor = isLowTime ? COLORS.errorRed : COLORS.progressGreen;

  // ── MÓVIL: layout de 2 filas ──────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ ...styles.headerBase, height: `${layout.headerHeight}px`, padding: '7px 12px 5px' }}>

        {/* Fila 1: Título | Score — ambos nowrap para que nunca wrappeen */}
        <div style={styles.mobileRow1}>
          <div style={styles.mobileTitleWrapper}>
            <div style={{ ...styles.mobileTitle, fontSize: `${layout.titleFontSize}px` }}>
              THE MASTER CRAFTER
            </div>
            <div style={{ ...styles.mobileSubtitle, fontSize: `${layout.subtitleFontSize}px` }}>
              DESAFÍO DE RECETAS
            </div>
          </div>

          {/* Score siempre visible — ancho fijo para no ser desplazado */}
          <div style={{ ...styles.mobileScore, minWidth: '64px' }}>
            <div style={{ fontSize: `${layout.scoreFontSize}px`, fontWeight: 'bold', color: COLORS.textMain }}>
              {score}
            </div>
            <div style={{ fontSize: '9px', color: COLORS.accentGold }}>SCORE</div>
            <div style={{ fontSize: '9px', color: COLORS.textMain, opacity: 0.65 }}>B: {bestScore}</div>
          </div>
        </div>

        {/* Fila 2: Barra de tiempo */}
        <div style={styles.mobileTimerRow}>
          <span style={{ fontSize: '11px', color: COLORS.textMain, whiteSpace: 'nowrap', marginRight: '6px' }}>
            TIME: <span style={{ color: barColor, fontWeight: 'bold' }}>{timeLeft}s</span>
          </span>
          <div style={{ ...styles.barTrack, flex: 1, height: '6px' }}>
            <motion.div
              style={{ ...styles.barFill, width: `${timePercentage}%`, backgroundColor: barColor }}
              animate={isLowTime ? { opacity: [1, 0.3, 1] } : {}}
              transition={{ repeat: Infinity, duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    );
  }

  // ── TABLET / LANDSCAPE / DESKTOP ─────────────────────────────────────────
  // CLAVE: grid-template-columns con ancho FIJO para el timer (no "auto")
  // Esto garantiza que la columna del score siempre tenga espacio (1fr)
  return (
    <div
      style={{
        ...styles.headerBase,
        height: `${layout.headerHeight}px`,
        display: 'grid',
        gridTemplateColumns: `1fr ${layout.timerBarWidth + 32}px 1fr`,
        alignItems: 'center',
        gap: '8px',
        padding: '8px 24px',
      }}
    >
      {/* Columna izquierda: Título */}
      <motion.div
        style={styles.titleCol}
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div style={{ ...styles.title, fontSize: `${layout.titleFontSize}px` }}>
          THE MASTER CRAFTER
        </div>
        <div style={{ ...styles.subtitle, fontSize: `${layout.subtitleFontSize}px` }}>
          DESAFÍO DE RECETAS
        </div>
      </motion.div>

      {/* Columna central: Temporizador — ancho exacto definido en grid */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ ...styles.timerLabel, fontSize: `${Math.max(11, layout.titleFontSize * 0.47)}px` }}>
          TIME LEFT: <span style={{ color: barColor }}>{timeLeft}s</span>
        </div>
        <div style={{ ...styles.barTrack, width: `${layout.timerBarWidth}px`, margin: '0 auto' }}>
          <motion.div
            style={{ ...styles.barFill, width: `${timePercentage}%`, backgroundColor: barColor }}
            animate={isLowTime ? { opacity: [1, 0.3, 1] } : {}}
            transition={{ repeat: Infinity, duration: 0.5 }}
          />
        </div>
      </div>

      {/* Columna derecha: Score — siempre presente en su 1fr */}
      <div style={styles.scoreCol}>
        <div style={{ fontSize: `${layout.scoreFontSize}px`, fontWeight: 'bold', color: COLORS.textMain, whiteSpace: 'nowrap' }}>
          SCORE: {score}
        </div>
        <div style={{ fontSize: `${layout.subtitleFontSize}px`, color: COLORS.textMain, opacity: 0.7, whiteSpace: 'nowrap' }}>
          BEST: {bestScore}
        </div>
      </div>
    </div>
  );
}

const styles = {
  headerBase: {
    width: '100%',
    flexShrink: 0,
    zIndex: 10,
    background: 'linear-gradient(180deg, #0A1428 0%, transparent 100%)',
  },

  // Desktop / tablet / landscapeShort
  titleCol: {
    minWidth: 0,         // permite que el 1fr se comprima sin desbordarse
    overflow: 'hidden',
  },
  title: {
    fontWeight: 'bold',
    color: '#C89B3C',
    lineHeight: '1.15',
    textShadow: '0 0 20px rgba(200,155,60,0.5)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  subtitle: {
    display: 'block',
    fontWeight: 'normal',
    color: '#F0E6D2',
    opacity: 0.8,
    whiteSpace: 'nowrap',
  },
  timerLabel: {
    fontWeight: 'bold',
    color: '#F0E6D2',
    marginBottom: '4px',
    whiteSpace: 'nowrap',
  },
  barTrack: {
    height: '8px',
    backgroundColor: '#1A2332',
    borderRadius: '4px',
    overflow: 'hidden',
    border: '1px solid #463714',
  },
  barFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 1s linear',
    boxShadow: '0 0 8px currentColor',
  },
  scoreCol: {
    textAlign: 'right',
    minWidth: 0,
    overflow: 'hidden',
  },

  // Mobile
  mobileRow1: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: '4px',
  },
  mobileTitleWrapper: {
    flex: 1,
    minWidth: 0,       // permite que se comprima sin romper el layout
    overflow: 'hidden',
    marginRight: '8px',
  },
  mobileTitle: {
    fontWeight: 'bold',
    color: '#C89B3C',
    lineHeight: '1.1',
    textShadow: '0 0 12px rgba(200,155,60,0.5)',
    whiteSpace: 'nowrap',       // nunca wrappea
    overflow: 'hidden',
    textOverflow: 'ellipsis',   // "..." si no cabe
  },
  mobileSubtitle: {
    color: '#F0E6D2',
    opacity: 0.75,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  mobileScore: {
    textAlign: 'right',
    flexShrink: 0,   // el score NUNCA se encoge
  },
  mobileTimerRow: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: '4px',
  },
};