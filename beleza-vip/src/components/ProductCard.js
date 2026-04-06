import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, shadows, spacing, typography } from "../constants/theme";
import { formatCurrency } from "../utils/format";
import AppButton from "./AppButton";

const ProductCard = ({
  product,
  onPress,
  onPressOrder,
  onToggleFavorite,
  isFavorite,
  compact = false,
  showCategory = false,
}) => (
  <Pressable onPress={onPress} style={[styles.card, compact ? styles.compact : styles.regular]}>
    <Image source={{ uri: product.image }} style={styles.image} />

    {product.discountPercent ? (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{`-${product.discountPercent}%`}</Text>
      </View>
    ) : null}

    <Pressable onPress={onToggleFavorite} style={styles.favoriteButton}>
      <Ionicons
        name={isFavorite ? "heart" : "heart-outline"}
        size={18}
        color={isFavorite ? colors.danger : colors.primary}
      />
    </Pressable>

    <View style={styles.body}>
      {showCategory ? <Text style={styles.category}>{product.category}</Text> : null}
      <Text style={styles.name} numberOfLines={2}>
        {product.name}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {product.shortDescription}
      </Text>
      <View style={styles.priceBlock}>
        {product.oldPrice ? <Text style={styles.oldPrice}>{formatCurrency(product.oldPrice)}</Text> : null}
        <Text style={styles.price}>{formatCurrency(product.price)}</Text>
      </View>
      <AppButton icon="logo-whatsapp" onPress={onPressOrder} size="small" title="Pedir no WhatsApp" variant="primary" />
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.danger,
    borderRadius: radius.pill,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    position: "absolute",
    top: spacing.sm,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "800",
  },
  body: {
    gap: spacing.xs,
    padding: spacing.sm,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    overflow: "hidden",
    ...shadows.soft,
  },
  category: {
    color: colors.primary,
    fontSize: typography.bodySmall,
    fontWeight: "700",
  },
  compact: {
    marginRight: spacing.md,
    width: 230,
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.bodySmall,
    lineHeight: 18,
  },
  favoriteButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: radius.pill,
    height: 34,
    justifyContent: "center",
    position: "absolute",
    right: spacing.sm,
    top: spacing.sm,
    width: 34,
  },
  image: {
    height: 160,
    width: "100%",
  },
  name: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "800",
    lineHeight: 20,
  },
  oldPrice: {
    color: colors.textMuted,
    fontSize: typography.bodySmall,
    textDecorationLine: "line-through",
  },
  price: {
    color: colors.primaryDark,
    fontSize: typography.titleMD,
    fontWeight: "800",
  },
  priceBlock: {
    alignItems: "flex-start",
    gap: 2,
    marginBottom: spacing.xs,
  },
  regular: {
    marginBottom: spacing.md,
    width: "100%",
  },
});

export default ProductCard;

