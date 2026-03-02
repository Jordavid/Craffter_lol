import { motion } from "framer-motion";
import { COLORS } from "../constants/theme";

const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjMUEyMzMyIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNGMEU2RDIiPj88L3RleHQ+PC9zdmc+';

export default function ItemCard({item, onClick, isSelected, isCorrect, isIncorrect, disabled}) {
    const getItemImage = (item) => {
        
        const version = '16.3.1'; // Deberías obtener esto dinámicamente del backend
        if(!item?.id){
            return PLACEHOLDER_IMAGE;
        }
        return `http://ddragon.leagueoflegends.com/cdn/${version}/img/item/${item.id}.png`;
    };

    const getBorderColor = () => {
        if (isCorrect) return COLORS.successGreen;
        if (isIncorrect) return COLORS.errorRed;
        if (isSelected) return COLORS.accentGold;
        
        return COLORS.itemBorder;
    };

    const getBoxShadow = () => {
        if (isCorrect) return `0 0 25px ${COLORS.successGreen}`;
        if (isIncorrect) return `0 0 25px ${COLORS.errorRed}`;
        if (isSelected) return `0 0 30px ${COLORS.accentGold}`;

        return 'none';
    };

    return (
    <motion.div
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { scale: 1.1 }}
      animate={
        isIncorrect
          ? {
              x: [-5, 5, -5, 5, 0],
              transition: { duration: 0.3 },
            }
          : isSelected
          ? {
              scale: [1, 1.05, 1],
              transition: { repeat: Infinity, duration: 1 },
            }
          : {}
      }
      style={{
        ...styles.card,
        border: `3px solid ${getBorderColor()}`,
        boxShadow: getBoxShadow(),
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled && !isSelected && !isCorrect ? 0.5 : 1,
      }}
    >
      <img
        src={getItemImage(item)}
        alt={item?.name || 'Item'}
        style={styles.image}
        onError={(e) => {
          e.target.onError = null;
          e.target.src = PLACEHOLDER_IMAGE;
        }}
      />
    </motion.div>
  );
}

const styles = {
  card: {
    width: '64px',
    height: '64px',
    borderRadius: '8px',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    position: 'relative',
    userSelect: 'none',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
};