import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import EmptyState from "../components/EmptyState";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import { colors, radius, spacing, typography } from "../constants/theme";
import { useFavorites } from "../context/FavoritesContext";
import productsData from "../data/products.json";
import { openOrderWhatsApp } from "../utils/whatsapp";

const PromotionsScreen = ({ navigation }) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  const productsOnSale = useMemo(
    () => productsData.filter((item) => item.discountPercent > 0).sort((a, b) => b.discountPercent - a.discountPercent),
    [],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {productsOnSale.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState
            description="Novas promoções serão liberadas em breve. Volte em alguns minutos."
            icon="pricetag-outline"
            title="Sem promoções no momento"
          />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.container}
          data={productsOnSale}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View>
              <LinearGradient colors={["#f4dadf", "#fff3e9"]} style={styles.banner}>
                <Text style={styles.bannerTitle}>Semana de Ofertas</Text>
                <Text style={styles.bannerText}>
                  Aproveite descontos especiais e peça direto no WhatsApp em poucos toques.
                </Text>
              </LinearGradient>
              <SectionHeader subtitle="Produtos com preço reduzido hoje" title="Promoções ativas" />
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
  banner: {
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  bannerText: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  bannerTitle: {
    color: colors.text,
    fontSize: typography.titleLG,
    fontWeight: "900",
  },
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
});

export default PromotionsScreen;

