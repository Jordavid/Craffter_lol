import { useState, useEffect } from 'react';

// Breakpoints
const BP = {
  mobile: 600,      // < 600px ancho → móvil portrait
  tablet: 1024,     // 600–1023px ancho → tablet
  desktop: 1280,    // >= 1280px ancho → siempre desktop (sin importar alto)
  shortHeight: 700, // < 700px alto (y ancho < 1280) → Nest Hub / landscape compacto
};

const LAYOUTS = {
  // Móvil portrait (< 600px ancho)
  mobile: {
    headerHeight: 75,
    panelHeight: 165,
    circleRadius: 145,
    centralItemSize: 72,
    centralRings: [148, 172, 200],
    peripheralItemSize: 44,
    titleFontSize: 16,
    subtitleFontSize: 10,
    timerBarWidth: 170,
    scoreFontSize: 13,
    slotSize: 58,
  },

  // Landscape compacto: SOLO para pantallas ANGOSTAS y BAJAS (Nest Hub 1024×600, etc.)
  // NO se activa en monitores de escritorio aunque tengan poca altura
  landscapeShort: {
    headerHeight: 60,
    panelHeight: 145,
    circleRadius: 165,
    centralItemSize: 78,
    centralRings: [155, 178, 206],
    peripheralItemSize: 46,
    titleFontSize: 18,
    subtitleFontSize: 10,
    timerBarWidth: 240,
    scoreFontSize: 14,
    slotSize: 62,
  },

  // Tablet (600–1279px ancho, altura normal)
  tablet: {
    headerHeight: 90,
    panelHeight: 180,
    circleRadius: 230,
    centralItemSize: 100,
    centralRings: [218, 252, 286],
    peripheralItemSize: 54,
    titleFontSize: 24,
    subtitleFontSize: 12,
    timerBarWidth: 290,
    scoreFontSize: 17,
    slotSize: 72,
  },

  // Desktop (>= 1280px ancho — SIEMPRE, independiente del alto)
  desktop: {
    headerHeight: 100,
    panelHeight: 200,
    circleRadius: 310,
    centralItemSize: 120,
    centralRings: [278, 318, 358],
    peripheralItemSize: 62,
    titleFontSize: 32,
    subtitleFontSize: 14,
    timerBarWidth: 380,
    scoreFontSize: 20,
    slotSize: 78,
  },
};

function getLayoutKey(width, height) {
  // 1. Móvil portrait: prioridad máxima por ancho
  if (width < BP.mobile) return 'mobile';

  // 2. Desktop: cualquier pantalla >= 1280px de ancho SIEMPRE es desktop
  //    Esto evita que monitores 1366×768, 1536×796, etc. activen landscapeShort
  if (width >= BP.desktop) return 'desktop';

  // 3. Entre 600–1279px de ancho: si además es baja → landscapeShort
  //    Cubre Nest Hub (1024×600), tablets landscape cortas, etc.
  if (height < BP.shortHeight) return 'landscapeShort';

  // 4. Tablet normal (600–1279px ancho, altura suficiente)
  return 'tablet';
}

export function useResponsive() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const layoutKey = getLayoutKey(dimensions.width, dimensions.height);
  const layout = LAYOUTS[layoutKey];

  return {
    ...dimensions,
    layout,
    layoutKey,
    isMobile: layoutKey === 'mobile',
    isLandscapeShort: layoutKey === 'landscapeShort',
    isTablet: layoutKey === 'tablet',
    isDesktop: layoutKey === 'desktop',
  };
}