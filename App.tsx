import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { AuthScreen } from './src/screens/AuthScreen';
import { LoadingSplashScreen } from './src/components/LoadingSplashScreen';

function AppContent() {
  const { isLoading, finishLoading, isAuthenticated, theme, themeColors } = useApp();

  return (
    <View style={[styles.root, { backgroundColor: themeColors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

      {/* 1. Loading Splash Screen with Finance Tracker Logo */}
      {isLoading ? (
        <LoadingSplashScreen onFinish={finishLoading} duration={1900} />
      ) : !isAuthenticated ? (
        /* 2. Sign In / Authentication Page for Admin and Customer */
        <AuthScreen />
      ) : (
        /* 3. Main Authorized Application (Stack + Drawer + Tabs) */
        <RootNavigator />
      )}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
