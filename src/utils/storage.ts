import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  USERS: '@fotoowl_users',
  SESSION: '@fotoowl_session',
  FAVORITES: '@fotoowl_favorites',
};

export const saveData = async <T>(
  key: string,
  value: T
): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const getData = async <T>(
  key: string
): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key);

    if (value !== null) {
      return JSON.parse(value) as T;
    }

    return null;
  } catch (error) {
    console.error('Error reading data:', error);
    return null;
  }
};

export const removeData = async (
  key: string
): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
  }
};