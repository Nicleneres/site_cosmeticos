import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors, radius, shadows, spacing, typography } from "../constants/theme";
import { formatCurrency } from "../utils/format";
import AppButton from "./AppButton";

const KitCard = ({ kit, onPressOrder, compact = false }) => (
  <View style={[styles.card, compact ? styles.compact : styles.full]}>
    <Image source={{ uri: kit.image }} style={styles.image} />
    <View style={styles.content}>
      <Text style={styles.title}>{kit.name}</Text>
      <Text style={styles.description}>{kit.description}</Text>
      <View style={styles.giftBadge}>
        <Text style={styles.giftText}>{kit.giftHighlight}</Text>
      </View>
      <View style={styles.priceWrap}>
        <Text style={styles.oldPrice}>{formatCurrency(kit.originalPrice)}</Text>
        <Text style={styles.price}>{formatCurrency(kit.price)}</Text>
      </View>
      <AppButton icon="gift-outline" onPress={onPressOrder} title="Quero esse kit" variant="dark" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    overflow: "hidden",
    ...shadows.soft,
  },
  compact: {
    marginRight: spacing.md,
    width: 260,
  },
  content: {
    padding: spacing.md,
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.bodySmall,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  full: {
    width: "100%",
  },
  giftBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.secondary,
    borderRadius: radius.pill,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  giftText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  image: {
    height: 170,
    width: "100%",
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
  priceWrap: {
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: typography.titleMD,
    fontWeight: "800",
  },
});

export default KitCard;

