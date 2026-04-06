import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../constants/theme";

const LogoMark = ({ size = "large" }) => {
  const isSmall = size === "small";
  return (
    <View style={[styles.wrapper, isSmall && styles.wrapperSmall]}>
      <View style={[styles.iconCircle, isSmall && styles.iconCircleSmall]}>
        <Ionicons name="sparkles" size={isSmall ? 20 : 36} color={colors.accent} />
      </View>
      <Text style={[styles.brand, isSmall && styles.brandSmall]}>Beleza VIP</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  brand: {
    color: colors.text,
    fontSize: typography.titleLG,
    fontWeight: "900",
    letterSpacing: 0.2,
    marginTop: spacing.sm,
  },
  brandSmall: {
    fontSize: 17,
    marginTop: spacing.xs,
  },
  iconCircle: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    height: 84,
    justifyContent: "center",
    width: 84,
  },
  iconCircleSmall: {
    height: 52,
    width: 52,
  },
  wrapper: {
    alignItems: "center",
  },
  wrapperSmall: {
    flexDirection: "row",
    gap: spacing.sm,
  },
});

export default LogoMark;

