import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { FavoritesProvider } from "./src/context/FavoritesContext";
import AppNavigator from "./src/navigation/AppNavigator";
import SplashScreen from "./src/screens/SplashScreen";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {showSplash ? (
        <SplashScreen />
      ) : (
        <FavoritesProvider>
          <AppNavigator />
        </FavoritesProvider>
      )}
    </SafeAreaProvider>
  );
}
