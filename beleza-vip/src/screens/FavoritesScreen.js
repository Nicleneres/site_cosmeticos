import React, { useMemo } from "react";
import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import AppButton from "../components/AppButton";
import EmptyState from "../components/EmptyState";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import { colors, spacing } from "../constants/theme";
import { useFavorites } from "../context/FavoritesContext";
import productsData from "../data/products.json";
import { openFavoritesWhatsApp, openOrderWhatsApp } from "../utils/whatsapp";

const FavoritesScreen = ({ navigation }) => {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const favoriteProducts = useMemo(
    () => productsData.filter((item) => favorites.includes(item.id)),
    [favorites],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {favoriteProducts.length === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            description="Toque no coração dos produtos para salvar e revisar depois."
            icon="heart-outline"
            title="Nenhum favorito salvo"
          />
          <View style={styles.emptyButton}>
            <AppButton
              fullWidth
              onPress={() => navigation.navigate("CategoriesTab")}
              title="Explorar produtos"
              variant="primary"
            />
          </View>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={favoriteProducts}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View style={styles.header}>
              <SectionHeader subtitle="Seus itens preferidos em um só lugar" title="Favoritos" />
              <AppButton
                fullWidth
                icon="logo-whatsapp"
                onPress={() => openFavoritesWhatsApp(favoriteProducts)}
                style={styles.batchButton}
                title="Pedir itens salvos"
                variant="dark"
              />
            </View>
          }
          renderItem={({ item }) => (
            <ProductCard
              isFavorite={isFavorite(item.id)}
              onPress={() => navigation.navigate("ProductDetails", { productId: item.id })}
              onPressOrder={() => openOrderWhatsApp(item)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              product={item}
              showCategory
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  batchButton: {
    marginBottom: spacing.sm,
  },
  emptyButton: {
    paddingHorizontal: spacing.md,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    marginBottom: spacing.sm,
  },
  list: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
});

export default FavoritesScreen;

