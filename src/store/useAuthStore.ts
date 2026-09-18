import { create } from 'zustand';
import { User } from '../types/auth';
import {
  getData,
  saveData,
  removeData,
  STORAGE_KEYS,
} from '../utils/storage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  register: (userData: User) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
  updateProfile: (updatedData: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  register: async (userData) => {
    try {
      const users = (await getData<User[]>(STORAGE_KEYS.USERS)) || [];

      const alreadyExists = users.some(
        (user) =>
          user.email.toLowerCase() === userData.email.toLowerCase()
      );

      if (alreadyExists) {
        return false;
      }

      const updatedUsers = [...users, userData];

      await saveData(STORAGE_KEYS.USERS, updatedUsers);
      await saveData(STORAGE_KEYS.SESSION, userData);

      set({
        user: userData,
        isAuthenticated: true,
      });

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  },

  login: async (email, password) => {
    try {
      const users = (await getData<User[]>(STORAGE_KEYS.USERS)) || [];

      const foundUser = users.find(
        (user) =>
          user.email.toLowerCase() === email.toLowerCase().trim() &&
          user.password === password
      );

      if (!foundUser) {
        return false;
      }

      await saveData(STORAGE_KEYS.SESSION, foundUser);

      set({
        user: foundUser,
        isAuthenticated: true,
      });

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  logout: async () => {
    try {
      await removeData(STORAGE_KEYS.SESSION);

      set({
        user: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  loadSession: async () => {
    try {
      const session = await getData<User>(STORAGE_KEYS.SESSION);

      if (session) {
        set({
          user: session,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Session loading error:', error);

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  updateProfile: async (updatedData) => {
    try {
      const currentUser = get().user;

      if (!currentUser) return;

      const updatedUser: User = {
        ...currentUser,
        ...updatedData,
      };

      const users = (await getData<User[]>(STORAGE_KEYS.USERS)) || [];

      const updatedUsers = users.map((user) =>
        user.id === currentUser.id ? updatedUser : user
      );

      await saveData(STORAGE_KEYS.USERS, updatedUsers);
      await saveData(STORAGE_KEYS.SESSION, updatedUser);

      set({
        user: updatedUser,
      });
    } catch (error) {
      console.error('Profile update error:', error);
    }
  },
}));