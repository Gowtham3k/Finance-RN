import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppDrawerNavigator } from './AppDrawerNavigator';
import { CategoryDetailsScreen } from '../screens/CategoryDetailsScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { colors } from '../constants/theme';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        {/* Main Application with Drawer & Bottom Tabs */}
        <Stack.Screen name="DrawerRoot" component={AppDrawerNavigator} />

        {/* Stack Screens pushed on top */}
        <Stack.Screen
          name="CategoryDetails"
          component={CategoryDetailsScreen}
          options={{
            animation: 'slide_from_right',
          }}
        />

        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{
            animation: 'slide_from_bottom',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
