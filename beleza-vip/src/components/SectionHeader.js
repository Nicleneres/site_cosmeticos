import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../constants/theme";

const SectionHeader = ({ title, subtitle, actionLabel, onPressAction }) => (
  <View style={styles.container}>
    <View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
    {actionLabel && onPressAction ? (
      <Pressable onPress={onPressAction}>
        <Text style={styles.action}>{actionLabel}</Text>
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  action: {
    color: colors.primary,
    fontSize: typography.bodySmall,
    fontWeight: "700",
  },
  container: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.bodySmall,
    marginTop: 2,
  },
  title: {
    color: colors.text,
    fontSize: typography.titleMD,
    fontWeight: "800",
  },
});

export default SectionHeader;

