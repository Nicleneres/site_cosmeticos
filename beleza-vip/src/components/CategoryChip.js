import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radius, spacing, typography } from "../constants/theme";

const CategoryChip = ({ label, selected, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.chip,
      selected ? styles.selected : styles.unselected,
      pressed && styles.pressed,
    ]}
  >
    <Text style={[styles.text, selected ? styles.textSelected : styles.textUnselected]}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    marginRight: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  pressed: {
    opacity: 0.9,
  },
  selected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  text: {
    fontSize: typography.bodySmall,
    fontWeight: "700",
  },
  textSelected: {
    color: colors.white,
  },
  textUnselected: {
    color: colors.primary,
  },
  unselected: {
    backgroundColor: colors.white,
    borderColor: colors.border,
  },
});

export default CategoryChip;

