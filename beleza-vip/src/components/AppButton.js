import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../constants/theme";

const stylesByVariant = {
  primary: {
    backgroundColor: colors.primary,
    textColor: colors.white,
    borderColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
    textColor: colors.text,
    borderColor: colors.secondary,
  },
  outline: {
    backgroundColor: "transparent",
    textColor: colors.primary,
    borderColor: colors.primary,
  },
  dark: {
    backgroundColor: colors.black,
    textColor: colors.white,
    borderColor: colors.black,
  },
};

const AppButton = ({
  title,
  onPress,
  variant = "primary",
  icon,
  fullWidth = false,
  size = "normal",
  style,
}) => {
  const variantStyle = stylesByVariant[variant] || stylesByVariant.primary;
  const isSmall = size === "small";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: variantStyle.backgroundColor,
          borderColor: variantStyle.borderColor,
          opacity: pressed ? 0.9 : 1,
          width: fullWidth ? "100%" : "auto",
          paddingVertical: isSmall ? 10 : 13,
          paddingHorizontal: isSmall ? 14 : 18,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {icon ? <Ionicons name={icon} size={isSmall ? 15 : 17} color={variantStyle.textColor} /> : null}
        <Text style={[styles.label, { color: variantStyle.textColor, fontSize: isSmall ? 13 : typography.button }]}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: radius.pill,
  },
  content: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
  },
  label: {
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});

export default AppButton;

