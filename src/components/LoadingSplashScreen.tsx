import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';

interface LoadingSplashScreenProps {
  onFinish?: () => void;
  duration?: number;
}

export const LoadingSplashScreen: React.FC<LoadingSplashScreenProps> = ({
  onFinish,
  duration = 2000,
}) => {
  const [pulseAnim] = useState(() => new Animated.Value(1));
  const [rotateAnim] = useState(() => new Animated.Value(0));
  const [progressAnim] = useState(() => new Animated.Value(0));
  const [fadeAnim] = useState(() => new Animated.Value(1));

  const [statusText, setStatusText] = useState('Initializing secure vault...');

  useEffect(() => {
    // Pulsing logo animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ])
    ).start();

    // Spinning ring animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
      })
    ).start();

    // Progress bar fill animation
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: duration - 300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();

    // Text status intervals
    const t1 = setTimeout(() => {
      setStatusText('Encrypting client ledger...');
    }, 600);

    const t2 = setTimeout(() => {
      setStatusText('Loading financial analytics...');
    }, 1200);

    const t3 = setTimeout(() => {
      setStatusText('Welcome to Finance Tracker');
    }, 1700);

    // Fade out and finish callback
    const tFinish = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: Platform.OS !== 'web',
      }).start(() => {
        if (onFinish) onFinish();
      });
    }, duration);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tFinish);
    };
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Background radial glow effect */}
      <View style={styles.glowAura} />

      {/* Animated Logo Container */}
      <Animated.View style={[styles.logoWrapper, { transform: [{ scale: pulseAnim }] }]}>
        {/* Rotating outer ring */}
        <Animated.View style={[styles.outerRing, { transform: [{ rotate: spin }] }]} />

        {/* Central Logo Box */}
        <View style={styles.logoBox}>
          <Ionicons name="wallet" size={42} color="#FFF" />
          <View style={styles.miniBadge}>
            <Ionicons name="trending-up" size={14} color="#10B981" />
          </View>
        </View>
      </Animated.View>

      {/* Brand Title & Tagline */}
      <Text style={styles.appName}>FINANCE TRACKER</Text>
      <Text style={styles.appTagline}>Smart Budget & Wealth Management</Text>

      {/* Animated Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>

      {/* Security Badge Footer */}
      <View style={styles.footerNote}>
        <Ionicons name="lock-closed" size={13} color={colors.textMuted} />
        <Text style={styles.footerText}>Client-Side Offline Secure Vault</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#070B14',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
  },
  glowAura: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    filter: Platform.OS === 'web' ? 'blur(60px)' : undefined,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  outerRing: {
    position: 'absolute',
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: colors.primary,
    borderRightColor: colors.cyan,
  },
  logoBox: {
    width: 88,
    height: 88,
    borderRadius: 26,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(99, 102, 241, 0.4)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
    position: 'relative',
  },
  miniBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#0F172A',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#10B981',
  },
  appName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 2.5,
    marginBottom: 6,
  },
  appTagline: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: 36,
  },
  progressContainer: {
    width: '75%',
    maxWidth: 280,
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11.5,
    color: colors.primaryLight,
    fontWeight: '600',
  },
  footerNote: {
    position: 'absolute',
    bottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
});
