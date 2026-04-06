import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, shadows, spacing, typography } from "../constants/theme";

const HomeBanner = () => (
  <LinearGradient colors={["#f6e0d6", "#fceef1"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.banner}>
    <View style={styles.iconCircle}>
      <Ionicons name="sparkles" size={20} color={colors.accent} />
    </View>
    <Text style={styles.title}>Sua beleza em destaque todos os dias</Text>
    <Text style={styles.description}>
      Descubra produtos selecionados, kits especiais e ofertas exclusivas para clientes VIP.
    </Text>
  </LinearGradient>
);

const styles = StyleSheet.create({
  banner: {
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    ...shadows.soft,
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  iconCircle: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 24,
    height: 42,
    justifyContent: "center",
    marginBottom: spacing.sm,
    width: 42,
  },
  title: {
    color: colors.text,
    fontSize: typography.titleMD,
    fontWeight: "800",
    lineHeight: 25,
  },
});

export default HomeBanner;

