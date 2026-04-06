import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import AppButton from "../components/AppButton";
import EmptyState from "../components/EmptyState";
import { colors, radius, spacing, typography } from "../constants/theme";
import { useFavorites } from "../context/FavoritesContext";
import productsData from "../data/products.json";
import { formatCurrency } from "../utils/format";
import { openOrderWhatsApp } from "../utils/whatsapp";

const ProductDetailsScreen = ({ navigation, route }) => {
  const product = productsData.find((item) => item.id === route.params?.productId);
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.wrapper}>
          <EmptyState
            description="Não encontramos esse item. Volte para categorias e tente novamente."
            icon="alert-circle-outline"
            title="Produto indisponível"
          />
          <AppButton onPress={() => navigation.goBack()} title="Voltar" variant="outline" />
        </View>
      </SafeAreaView>
    );
  }

  const favorite = isFavorite(product.id);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.image }} style={styles.image} />

        <View style={styles.card}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.priceWrap}>
            {product.oldPrice ? <Text style={styles.oldPrice}>{formatCurrency(product.oldPrice)}</Text> : null}
            <Text style={styles.price}>{formatCurrency(product.price)}</Text>
          </View>

          <Text style={styles.description}>{product.description}</Text>

          <Text style={styles.benefitsTitle}>Benefícios</Text>
          <View style={styles.benefitList}>
            {product.benefits.map((benefit) => (
              <View key={benefit} style={styles.benefitItem}>
                <Ionicons color={colors.success} name="checkmark-circle" size={18} />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          <AppButton
            fullWidth
            icon="logo-whatsapp"
            onPress={() => openOrderWhatsApp(product)}
            style={styles.buttonSpacing}
            title="Pedir no WhatsApp"
            variant="primary"
          />
          <AppButton
            fullWidth
            icon={favorite ? "heart" : "heart-outline"}
            onPress={() => toggleFavorite(product.id)}
            title={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            variant="outline"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  benefitItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  benefitList: {
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  benefitText: {
    color: colors.text,
    flex: 1,
    fontSize: typography.body,
    lineHeight: 20,
  },
  benefitsTitle: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "800",
    marginTop: spacing.md,
  },
  buttonSpacing: {
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    marginTop: -16,
    padding: spacing.md,
  },
  category: {
    color: colors.primary,
    fontSize: typography.bodySmall,
    fontWeight: "700",
  },
  content: {
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  image: {
    borderRadius: radius.lg,
    height: 320,
    width: "100%",
  },
  name: {
    color: colors.text,
    fontSize: typography.titleLG,
    fontWeight: "900",
    marginTop: spacing.xs,
  },
  oldPrice: {
    color: colors.textMuted,
    fontSize: typography.bodySmall,
    textDecorationLine: "line-through",
  },
  price: {
    color: colors.primaryDark,
    fontSize: typography.titleLG,
    fontWeight: "900",
  },
  priceWrap: {
    marginTop: spacing.sm,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  wrapper: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
});

export default ProductDetailsScreen;

