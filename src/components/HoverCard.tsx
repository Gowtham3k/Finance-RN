import React, { useState } from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';

interface HoverCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  hoverStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  scaleHoverTo?: number;
  scalePressTo?: number;
  glowColor?: string;
  activeOpacity?: number;
  accessibilityLabel?: string;
}

export const HoverCard: React.FC<HoverCardProps> = ({
  children,
  style,
  hoverStyle,
  onPress,
  scaleHoverTo = 1.02,
  scalePressTo = 0.98,
  glowColor,
  accessibilityLabel,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [scaleAnim] = useState(() => new Animated.Value(1));
  const isWeb = Platform.OS === 'web';

  const handleHoverIn = () => {
    setIsHovered(true);
    Animated.spring(scaleAnim, {
      toValue: scaleHoverTo,
      friction: 6,
      tension: 120,
      useNativeDriver: !isWeb,
    }).start();
  };

  const handleHoverOut = () => {
    setIsHovered(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 120,
      useNativeDriver: !isWeb,
    }).start();
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: scalePressTo,
      friction: 5,
      tension: 140,
      useNativeDriver: !isWeb,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: isHovered ? scaleHoverTo : 1,
      friction: 5,
      tension: 140,
      useNativeDriver: !isWeb,
    }).start();
  };

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
    ...(isHovered && glowColor
      ? {
          borderColor: glowColor,
          shadowColor: glowColor,
          shadowOpacity: 0.35,
          shadowRadius: 10,
          elevation: 6,
        }
      : {}),
  };

  return (
    <Animated.View style={[style, animatedStyle, isHovered && hoverStyle]}>
      <Pressable
        onPress={onPress}
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityLabel={accessibilityLabel}
        style={{ width: '100%' }}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};
