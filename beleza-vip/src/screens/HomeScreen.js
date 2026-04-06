import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import AppButton from "../components/AppButton";
import CategoryChip from "../components/CategoryChip";
import HomeBanner from "../components/HomeBanner";
import KitCard from "../components/KitCard";
import LogoMark from "../components/LogoMark";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import { colors, spacing, typography } from "../constants/theme";
import { useFavorites } from "../context/FavoritesContext";
import { categories } from "../data/categories";
import kitsData from "../data/kits.json";
import productsData from "../data/products.json";
import { openGeneralWhatsApp, openKitWhatsApp, openOrderWhatsApp } from "../utils/whatsapp";

const HomeScreen = ({ navigation }) => {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const featuredKits = kitsData.filter((item) => item.isFeatured).slice(0, 4);
  const novidades = productsData.filter((item) => item.isNew).slice(0, 6);
  const promocoes = productsData.filter((item) => item.discountPercent > 0).slice(0, 6);

  const goToProduct = (product) => navigation.navigate("ProductDetails", { productId: product.id });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <LogoMark size="small" />
          <Pressable onPress={() => navigation.navigate("Favorites")} style={styles.favoriteBadge}>
            <Ionicons color={colors.white} name="heart" size={16} />
            <Text style={styles.favoriteCount}>{favorites.length}</Text>
          </Pressable>
        </View>

        <HomeBanner />

        <View style={styles.actionArea}>
          <AppButton
            fullWidth
            icon="star-outline"
            onPress={() => navigation.navigate("VipGroup")}
            title="Entrar no Grupo VIP"
            variant="dark"
          />
          <AppButton
            fullWidth
            icon="logo-whatsapp"
            onPress={openGeneralWhatsApp}
            title="Pedir no WhatsApp"
            variant="primary"
          />
        </View>

        <SectionHeader
          actionLabel="Ver todos"
          onPressAction={() => navigation.navigate("KitsTab")}
          subtitle="Presentes prontos para encantar"
          title="Kits em destaque"
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
          {featuredKits.map((item) => (
            <KitCard compact key={item.id} kit={item} onPressOrder={() => openKitWhatsApp(item)} />
          ))}
        </ScrollView>

        <SectionHeader subtitle="Navegue por tipo de produto" title="Categorias principais" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
          {categories.map((category) => (
            <CategoryChip
              key={category}
              label={category}
              onPress={() => navigation.navigate("CategoriesTab", { selectedCategory: category })}
              selected={false}
            />
          ))}
        </ScrollView>

        <SectionHeader
          actionLabel="Ver tudo"
          onPressAction={() => navigation.navigate("CategoriesTab")}
          subtitle="Acabou de chegar"
          title="Novidades"
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
          {novidades.map((item) => (
            <ProductCard
              compact
              key={item.id}
              isFavorite={isFavorite(item.id)}
              onPress={() => goToProduct(item)}
              onPressOrder={() => openOrderWhatsApp(item)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              product={item}
              showCategory
            />
          ))}
        </ScrollView>

        <SectionHeader
          actionLabel="Ver promoções"
          onPressAction={() => navigation.navigate("PromotionsTab")}
          subtitle="Preços especiais por tempo limitado"
          title="Promoções"
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalList}>
          {promocoes.map((item) => (
            <ProductCard
              compact
              key={item.id}
              isFavorite={isFavorite(item.id)}
              onPress={() => goToProduct(item)}
              onPressOrder={() => openOrderWhatsApp(item)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              product={item}
              showCategory
            />
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  actionArea: {
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  favoriteBadge: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 18,
    flexDirection: "row",
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 7,
  },
  favoriteCount: {
    color: colors.white,
    fontSize: typography.bodySmall,
    fontWeight: "800",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  horizontalList: {
    marginBottom: spacing.lg,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
});

export default HomeScreen;
