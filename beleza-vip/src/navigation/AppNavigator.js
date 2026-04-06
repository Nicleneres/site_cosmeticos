import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { colors, typography } from "../constants/theme";
import CategoriesScreen from "../screens/CategoriesScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import HomeScreen from "../screens/HomeScreen";
import KitsScreen from "../screens/KitsScreen";
import ProductDetailsScreen from "../screens/ProductDetailsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import PromotionsScreen from "../screens/PromotionsScreen";
import VipGroupScreen from "../screens/VipGroupScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    border: colors.border,
    card: colors.white,
    primary: colors.primary,
    text: colors.text,
  },
};

const getTabIcon = (routeName, focused) => {
  if (routeName === "HomeTab") return focused ? "home" : "home-outline";
  if (routeName === "CategoriesTab") return focused ? "grid" : "grid-outline";
  if (routeName === "KitsTab") return focused ? "gift" : "gift-outline";
  if (routeName === "PromotionsTab") return focused ? "pricetag" : "pricetag-outline";
  return focused ? "person" : "person-outline";
};

const MainTabs = () => (
  <Tab.Navigator
    initialRouteName="HomeTab"
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarStyle: {
        backgroundColor: colors.white,
        borderTopColor: colors.border,
        height: 64,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: "700",
      },
      tabBarIcon: ({ color, focused, size }) => (
        <Ionicons color={color} name={getTabIcon(route.name, focused)} size={size} />
      ),
    })}
  >
    <Tab.Screen component={HomeScreen} name="HomeTab" options={{ title: "Início" }} />
    <Tab.Screen component={CategoriesScreen} name="CategoriesTab" options={{ title: "Categorias" }} />
    <Tab.Screen component={KitsScreen} name="KitsTab" options={{ title: "Kits" }} />
    <Tab.Screen component={PromotionsScreen} name="PromotionsTab" options={{ title: "Promoções" }} />
    <Tab.Screen component={ProfileScreen} name="ProfileTab" options={{ title: "Perfil" }} />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer theme={appTheme}>
    <Stack.Navigator
      initialRouteName="Tabs"
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerBackTitleVisible: false,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.white },
        headerTintColor: colors.text,
        headerTitleStyle: { fontSize: typography.titleMD, fontWeight: "800" },
      }}
    >
      <Stack.Screen component={MainTabs} name="Tabs" options={{ headerShown: false }} />
      <Stack.Screen component={ProductDetailsScreen} name="ProductDetails" options={{ title: "Produto" }} />
      <Stack.Screen component={FavoritesScreen} name="Favorites" options={{ title: "Favoritos" }} />
      <Stack.Screen component={VipGroupScreen} name="VipGroup" options={{ title: "Grupo VIP" }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;

