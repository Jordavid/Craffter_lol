import { motion } from "framer-motion";
import { COLORS } from "../constants/theme";

export default function CentralItem({ item }){

    if(!item) {
        return (
            <div style={styles.container}>
                <div style={styles.loadingContainer}>
                    <div style={styles.loadingText}>Loading...</div>
                </div>
            </div>
        )
    }

    const getItemImage = (item) => {
        const version = '16.3.1';
        return `http://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item?.id || '1001'}.png`;

    };

    return (
    <div style={styles.container}>
      {/* Anillos concÃ©ntricos animados */}
      <motion.div
        style={{ ...styles.ring, width: '280px', height: '280px' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        style={{ ...styles.ring, width: '320px', height: '320px' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        style={{ ...styles.ring, width: '360px', height: '360px' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />

      {/* Brillo de fondo */}
      <div style={styles.glow} />

      {/* Item central */}
      <motion.div
        style={styles.itemContainer}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
      >
        <img
          src={getItemImage(item)}
          alt={item.name}
          style={styles.image}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/120x120/1A2332/F0E6D2?text=?';
          }}
        />
      </motion.div>

      {/* Nombre del item */}
      <motion.div
        style={styles.itemName}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {item.name}
      </motion.div>
    </div>
  );
}


const styles = {
  container: {
    position: 'relative',
    width: '400px',
    height: '400px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    border: `2px solid ${COLORS.accentGold}`,
    borderRadius: '50%',
    opacity: 0.7,
  },
  glow: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: `radial-gradient(circle, ${COLORS.accentGold}40 0%, transparent 70%)`,
    filter: 'blur(20px)',
  },
  itemContainer: {
    position: 'relative',
    width: '120px',
    height: '120px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: `3px solid ${COLORS.accentGold}`,
    boxShadow: `0 0 40px ${COLORS.accentGold}`,
    zIndex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  itemName: {
    position: 'absolute',
    bottom: '104px',
    left: '24%',
    transform: 'translateX(-50%)',
    width: '220px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: COLORS.accentGold,
    textAlign: 'center',
    textShadow: `0 0 10px ${COLORS.accentGold}`,
    whiteSpace: 'normal',
    wordBreak: 'break-word',
    lineHeight: '1.3',
    zIndex: 2,
  },
  loadingContainer:{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  loadingText:{
    fontSize: '20px',
    color: COLORS.accentGold,
    fontWeight: 'bold',
    textShadow: `0 0 10px ${COLORS.accentGold}`,
  }
};