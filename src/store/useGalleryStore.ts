import { create } from 'zustand';
import { PicsumImage } from '../types/gallery';
import {
  getData,
  saveData,
  STORAGE_KEYS,
} from '../utils/storage';

interface GalleryState {
  favorites: PicsumImage[];
  loadFavorites: () => Promise<void>;
  toggleFavorite: (image: PicsumImage) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
  favorites: [],

  loadFavorites: async () => {
    const savedFavorites =
      (await getData<PicsumImage[]>(STORAGE_KEYS.FAVORITES)) || [];

    set({ favorites: savedFavorites });
  },

  toggleFavorite: async (image) => {
    const currentFavorites = get().favorites;

    const exists = currentFavorites.some(
      (item) => item.id === image.id
    );

    let updatedFavorites: PicsumImage[];

    if (exists) {
      updatedFavorites = currentFavorites.filter(
        (item) => item.id !== image.id
      );
    } else {
      updatedFavorites = [...currentFavorites, image];
    }

    await saveData(
      STORAGE_KEYS.FAVORITES,
      updatedFavorites
    );

    set({ favorites: updatedFavorites });
  },

  removeFavorite: async (id) => {
    const updatedFavorites = get().favorites.filter(
      (item) => item.id !== id
    );

    await saveData(
      STORAGE_KEYS.FAVORITES,
      updatedFavorites
    );

    set({ favorites: updatedFavorites });
  },

  isFavorite: (id) => {
    return get().favorites.some(
      (item) => item.id === id
    );
  },
}));