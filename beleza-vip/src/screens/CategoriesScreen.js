import React, { useEffect, useMemo, useState } from "react";
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import CategoryChip from "../components/CategoryChip";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import { colors, spacing, typography } from "../constants/theme";
import { useFavorites } from "../context/FavoritesContext";
import { categories } from "../data/categories";
import productsData from "../data/products.json";
import { openOrderWhatsApp } from "../utils/whatsapp";

const CategoriesScreen = ({ navigation, route }) => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    if (route.params?.selectedCategory) {
      setSelectedCategory(route.params.selectedCategory);
    }
  }, [route.params?.selectedCategory]);

  const filteredProducts = useMemo(
    () => productsData.filter((item) => item.category === selectedCategory),
    [selectedCategory],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <SectionHeader subtitle="Escolha uma categoria para explorar os produtos" title="Categorias" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
          {categories.map((item) => (
            <CategoryChip
              key={item}
              label={item}
              onPress={() => setSelectedCategory(item)}
              selected={item === selectedCategory}
            />
          ))}
        </ScrollView>

        <Text style={styles.resultText}>{`${filteredProducts.length} itens em ${selectedCategory}`}</Text>

        <FlatList
          contentContainerStyle={styles.list}
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              isFavorite={isFavorite(item.id)}
              onPress={() => navigation.navigate("ProductDetails", { productId: item.id })}
              onPressOrder={() => openOrderWhatsApp(item)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              product={item}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  chips: {
    marginBottom: spacing.md,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  resultText: {
    color: colors.textMuted,
    fontSize: typography.bodySmall,
    marginBottom: spacing.sm,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
});

export default CategoriesScreen;

