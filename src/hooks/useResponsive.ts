import { useWindowDimensions } from 'react-native';

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();
  
  const isTablet = width >= 768;
  const isLandscape = width > height;

  // For lists, we might want 1 column on phone, 2 on tablet portrait, 3 on tablet landscape
  let numColumns = 1;
  if (isTablet) {
    numColumns = isLandscape ? 3 : 2;
  }

  // A constrained width for forms or detail screens on large devices
  const maxWidth = isTablet ? 800 : '100%';

  return {
    width,
    height,
    isTablet,
    isLandscape,
    numColumns,
    maxWidth,
  };
};
