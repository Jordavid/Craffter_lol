import { motion } from "framer-motion";
import { COLORS } from "../constants/theme";
import { useResponsive } from "../hooks/userResponsive";

export default function CentralItem({ item }) {
  const { layout } = useResponsive();
  const size = layout.centralItemSize;

  // Anillos proporcionales al tamaño del item central
  // Esto garantiza que SIEMPRE queden DENTRO del radio de los items periféricos
  // independientemente del layout activo
  const r1 = Math.round(size * 2.0);   // ej desktop: 240px
  const r2 = Math.round(size * 2.5);   // ej desktop: 300px
  const r3 = Math.round(size * 3.0);   // ej desktop: 360px (diámetro, radio = 180px)

  // El contenedor solo necesita envolver los anillos
  const containerSize = r3 + 20;

  if (!item) {
    return (
      <div style={{ width: containerSize, height: containerSize, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: '16px', color: COLORS.accentGold, fontWeight: 'bold' }}>...</div>
      </div>
    );
  }

  const imgUrl = `http://ddragon.leagueoflegends.com/cdn/16.3.1/img/item/${item?.id || '1001'}.png`;
  const nameFontSize = Math.max(10, size * 0.13);

  return (
    <div style={{ position: 'relative', width: containerSize, height: containerSize, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

      {/* Anillos giratorios — proporcionales al item, siempre dentro del círculo periférico */}
      <motion.div style={ring(r1)} animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }} />
      <motion.div style={ring(r2)} animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }} />
      <motion.div style={ring(r3)} animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }} />

      {/* Brillo de fondo */}
      <div style={{
        position: 'absolute',
        width: `${size * 1.6}px`,
        height: `${size * 1.6}px`,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(200,155,60,0.25) 0%, transparent 70%)`,
        filter: 'blur(14px)',
      }} />

      {/* Columna: imagen + nombre — el nombre SIEMPRE aparece debajo */}
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        zIndex: 1,
      }}>
        {/* Imagen del item */}
        <motion.div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '12px',
            overflow: 'hidden',
            border: `3px solid ${COLORS.accentGold}`,
            boxShadow: `0 0 28px ${COLORS.accentGold}`,
            flexShrink: 0,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
        >
          <img
            src={imgUrl}
            alt={item.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/120x120/1A2332/F0E6D2?text=?'; }}
          />
        </motion.div>

        {/* Nombre del item — DEBAJO de la imagen, centrado, nunca a la derecha */}
        <motion.div
          style={{
            maxWidth: `${r1 - 8}px`,      // nunca más ancho que el anillo interior
            textAlign: 'center',
            fontSize: `${nameFontSize}px`,
            fontWeight: 'bold',
            color: COLORS.accentGold,
            textShadow: `0 0 8px ${COLORS.accentGold}`,
            wordBreak: 'break-word',
            lineHeight: '1.2',
            pointerEvents: 'none',
          }}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {item.name}
        </motion.div>
      </div>
    </div>
  );
}

function ring(size) {
  return {
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    border: '2px solid #C89B3C',
    borderRadius: '50%',
    opacity: 0.7,
  };
}