import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import AuthNavigator from './AuthNavigator';
import MainStackNavigator from './MainStackNavigator';

import { useAuthStore } from '../store/useAuthStore';
import { useGalleryStore } from '../store/useGalleryStore';

export default function RootNavigator() {
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const isLoading = useAuthStore(
    (state) => state.isLoading
  );

  const loadSession = useAuthStore(
    (state) => state.loadSession
  );

  const loadFavorites = useGalleryStore(
    (state) => state.loadFavorites
  );

  useEffect(() => {
    loadSession();
    loadFavorites();
  }, [loadSession, loadFavorites]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <MainStackNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});