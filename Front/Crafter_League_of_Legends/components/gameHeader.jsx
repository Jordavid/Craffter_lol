import { motion } from "framer-motion";
import { COLORS } from "../constants/theme";

export default function GameHeader({ timeLeft, score, bestScore}){
    const timePercentage = (timeLeft / 15) * 100;
    const isLowTime = timeLeft <= 5;

    return(
        <div style={styles.header}>
            {/* TITULO */}
            <motion.h1
                style={styles.title}
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
            >
                THE MASTER CRAFTER
                <span style={styles.subtitle}>DESAFIO DE RECETAS</span>
            </motion.h1>

            {/* Temporizador */}
            <div style={styles.timerContainer}>
                <div style={styles.timerLabel}>
                    TIME LEFT: <span style={{color: isLowTime ? COLORS.errorRed : COLORS.progressGreen}}>
                        {timeLeft}s
                    </span>
                </div>
                <div style={styles.progressBarContainer}>
                    <motion.div
                        style={{
                            ...styles.progressBar,
                            width: `${timePercentage}%`,
                            backgroundColor: isLowTime ? COLORS.errorRed : COLORS.progressGreen,
                        }}
                        animate={isLowTime ? {opacity: [1, 0.5, 1]} : {}}
                        transition={{repeat: Infinity, duration: 0.5 }}
                    ></motion.div>
                </div>
            </div>

            {/* Score */}
            <div style={styles.scoreContainer}>
                <div style={styles.score}>SCORE: {score}</div>
                <div style={styles.bestScore}>BEST: {bestScore}</div>
            </div>
        </div>
    );
}

const styles = {
  header: {
    position: 'relative',
    width: '100%',
    height: '100px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    background: `linear-gradient(180deg, ${COLORS.background} 0%, transparent 100%)`,
    zIndex: 10,
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: COLORS.accentGold,
    textAlign: 'left',
    lineHeight: '1.2',
    textShadow: `0 0 20px rgba(200, 155, 60, 0.5)`,
  },
  subtitle: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 'normal',
    color: COLORS.textMain,
    marginTop: '4px',
    opacity: 0.8,
  },
  timerContainer: {
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    textAlign: 'center',
  },
  timerLabel: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginBottom: '8px',
  },
  progressBarContainer: {
    width: '400px',
    height: '8px',
    backgroundColor: COLORS.panelDark,
    borderRadius: '4px',
    overflow: 'hidden',
    border: `1px solid ${COLORS.itemBorder}`,
  },
  progressBar: {
    height: '100%',
    transition: 'width 1s linear',
    boxShadow: `0 0 10px currentColor`,
  },
  scoreContainer: {
    textAlign: 'right',
  },
  score: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: COLORS.textMain,
  },
  bestScore: {
    fontSize: '14px',
    color: COLORS.textMain,
    opacity: 0.7,
    marginTop: '4px',
  },
};