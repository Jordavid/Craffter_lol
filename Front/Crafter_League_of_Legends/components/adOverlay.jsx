import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COLORS } from '../constants/theme';

const AD_DURATION = 5;       // segundos totales del anuncio
const SKIP_AFTER  = 3;       // segundos hasta que aparece el botón skip

/**
 * AdOverlay — se muestra entre rondas.
 *
 * Props:
 *  visible   : boolean  — controla si se muestra
 *  onClose   : fn       — callback al cerrar (carga siguiente pregunta)
 *
 * Para integrar AdSense real, reemplaza el bloque <AdPlaceholder> por:
 *
 *   <ins className="adsbygoogle"
 *     style={{ display:'block', width:'728px', height:'90px' }}
 *     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
 *     data-ad-slot="XXXXXXXXXX"
 *     data-ad-format="auto"
 *     data-full-width-responsive="true" />
 *
 * y en el useEffect de abajo descomenta el push:
 *   (window.adsbygoogle = window.adsbygoogle || []).push({});
 */
export default function AdOverlay({ visible, onClose }) {
  const [countdown, setCountdown]   = useState(AD_DURATION);
  const [canSkip,   setCanSkip]     = useState(false);

  // Reiniciar estado cada vez que se muestra
  useEffect(() => {
    if (!visible) return;
    setCountdown(AD_DURATION);
    setCanSkip(false);

    // Descomentar si usas AdSense real:
    // (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, [visible]);

  // Contador regresivo
  useEffect(() => {
    if (!visible) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onClose();       // auto-cierre al llegar a 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible, onClose]);

  // Habilitar skip después de SKIP_AFTER segundos
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setCanSkip(true), SKIP_AFTER * 1000);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          style={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <motion.div
            style={styles.container}
            initial={{ scale: 0.88, y: 40, opacity: 0 }}
            animate={{ scale: 1,    y: 0,  opacity: 1 }}
            exit={{    scale: 0.88, y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            {/* ── Cabecera ── */}
            <div style={styles.header}>
              <span style={styles.adBadge}>PUBLICIDAD</span>
              <span style={styles.nextRound}>Siguiente ronda en {countdown}s</span>
            </div>

            {/* ── Barra de progreso ── */}
            <div style={styles.progressTrack}>
              <motion.div
                style={styles.progressBar}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: AD_DURATION, ease: 'linear' }}
              />
            </div>

            {/* ── Zona del anuncio ── */}
            <div style={styles.adZone}>
              {/*
                PLACEHOLDER — Reemplazar con el <ins> de AdSense en producción.
                El bloque tiene las dimensiones estándar 728×90 (leaderboard).
                En mobile puedes cambiar a 320×50.
              */}
              <AdPlaceholder />
            </div>

            {/* ── Botón skip ── */}
            <div style={styles.skipRow}>
              <AnimatePresence>
                {canSkip ? (
                  <motion.button
                    key="skip"
                    style={styles.skipBtn}
                    onClick={onClose}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{   opacity: 0, x: 12 }}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{  scale: 0.94 }}
                  >
                    Saltar →
                  </motion.button>
                ) : (
                  <motion.span
                    key="wait"
                    style={styles.waitText}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Podrás saltar en {countdown - (AD_DURATION - SKIP_AFTER)}s…
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Placeholder visual — eliminar en producción ─────────────────────── */
function AdPlaceholder() {
  return (
    <div style={ph.wrapper}>
      <div style={ph.inner}>
        <div style={ph.icon}>⚔️</div>
        <div style={ph.text}>
          <div style={ph.title}>Tu anuncio aquí</div>
          <div style={ph.sub}>728 × 90 · Google AdSense</div>
        </div>
        <div style={ph.badge}>AD</div>
      </div>
    </div>
  );
}

/* ─── Estilos ──────────────────────────────────────────────────────────── */
const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(5, 10, 20, 0.82)',
    backdropFilter: 'blur(6px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  container: {
    width: 'min(780px, 95vw)',
    backgroundColor: '#0E1A2E',
    border: '1px solid #2A3A54',
    borderRadius: '14px',
    boxShadow: '0 0 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(200,155,60,0.15)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 20px 10px',
    borderBottom: '1px solid #1E2D42',
  },
  adBadge: {
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    color: '#6B7A90',
    backgroundColor: '#141F30',
    border: '1px solid #2A3A54',
    borderRadius: '4px',
    padding: '2px 8px',
  },
  nextRound: {
    fontSize: '13px',
    color: COLORS.accentGold,
    fontWeight: 'bold',
    letterSpacing: '0.5px',
  },
  progressTrack: {
    height: '3px',
    backgroundColor: '#1A2840',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.accentGold,
    boxShadow: `0 0 8px ${COLORS.accentGold}`,
  },
  adZone: {
    padding: '24px 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '140px',
  },
  skipRow: {
    padding: '10px 20px 16px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTop: '1px solid #1E2D42',
    minHeight: '48px',
  },
  skipBtn: {
    background: 'transparent',
    border: `1px solid ${COLORS.accentGold}`,
    borderRadius: '6px',
    color: COLORS.accentGold,
    fontSize: '13px',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
    padding: '6px 18px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  waitText: {
    fontSize: '12px',
    color: '#4A5A70',
    fontStyle: 'italic',
  },
};

const ph = {
  wrapper: {
    width: '100%',
    maxWidth: '728px',
    height: '90px',
    backgroundColor: '#141F30',
    border: '1px dashed #2A3A54',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    width: '100%',
    padding: '0 24px',
  },
  icon: {
    fontSize: '28px',
    flexShrink: 0,
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#4A5A70',
  },
  sub: {
    fontSize: '11px',
    color: '#2A3A54',
    marginTop: '2px',
  },
  badge: {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#2A3A54',
    backgroundColor: '#0E1A2E',
    border: '1px solid #2A3A54',
    borderRadius: '3px',
    padding: '2px 6px',
    flexShrink: 0,
  },
};