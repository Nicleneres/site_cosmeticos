import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "@beleza_vip_favorites";
const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setFavorites(parsed);
          }
        }
      } catch (error) {
        // Falha silenciosa para não bloquear o app.
      } finally {
        setIsLoaded(true);
      }
    };

    loadFavorites();
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favorites)).catch(() => {});
  }, [favorites, isLoaded]);

  const toggleFavorite = (productId) => {
    setFavorites((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  };

  const removeFavorite = (productId) => {
    setFavorites((current) => current.filter((id) => id !== productId));
  };

  const isFavorite = (productId) => favorites.includes(productId);

  const value = useMemo(
    () => ({
      favorites,
      isLoaded,
      toggleFavorite,
      removeFavorite,
      isFavorite,
    }),
    [favorites, isLoaded],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites precisa ser usado dentro de FavoritesProvider.");
  }
  return context;
};

