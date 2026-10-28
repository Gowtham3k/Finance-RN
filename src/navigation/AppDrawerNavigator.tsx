import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MainTabNavigator } from './MainTabNavigator';
import { CustomDrawerContent } from './CustomDrawerContent';
import { useApp } from '../context/AppContext';

const Drawer = createDrawerNavigator();

export const AppDrawerNavigator: React.FC = () => {
  const { themeColors } = useApp();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: themeColors.drawerBg,
          width: 290,
          borderRightWidth: 1,
          borderRightColor: themeColors.border,
        },
        drawerType: 'front',
        overlayColor: 'rgba(0, 0, 0, 0.7)',
      }}
    >
      <Drawer.Screen name="MainTabs" component={MainTabNavigator} />
    </Drawer.Navigator>
  );
};
