import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../constants/theme";

const EmptyState = ({ icon = "heart-outline", title, description }) => (
  <View style={styles.container}>
    <Ionicons name={icon} size={34} color={colors.primary} />
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.description}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  description: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.xs,
    textAlign: "center",
  },
  title: {
    color: colors.text,
    fontSize: typography.titleMD,
    fontWeight: "800",
    marginTop: spacing.sm,
    textAlign: "center",
  },
});

export default EmptyState;

