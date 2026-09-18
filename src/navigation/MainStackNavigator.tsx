import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MainTabNavigator from './MainTabNavigator';
import ImageDetailScreen from '../screens/Main/ImageDetailScreen';
import { MainStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<MainStackParamList>();

export default function MainStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ImageDetails"
        component={ImageDetailScreen}
        options={{ title: 'Image Details' }}
      />
    </Stack.Navigator>
  );
}