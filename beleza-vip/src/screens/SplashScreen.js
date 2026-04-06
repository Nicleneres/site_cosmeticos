import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { STORE_INFO } from "../constants/links";
import { colors, spacing, typography } from "../constants/theme";
import LogoMark from "../components/LogoMark";

const SplashScreen = () => (
  <LinearGradient colors={["#f7e3db", "#fdeef1", "#ffffff"]} style={styles.container}>
    <View style={styles.logoWrapper}>
      <LogoMark />
      <Text style={styles.slogan}>{STORE_INFO.slogan}</Text>
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  logoWrapper: {
    alignItems: "center",
  },
  slogan: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 22,
    marginTop: spacing.md,
    maxWidth: 280,
    textAlign: "center",
  },
});

export default SplashScreen;

