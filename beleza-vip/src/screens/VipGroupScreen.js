import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import AppButton from "../components/AppButton";
import { VIP_GROUP_URL } from "../constants/links";
import { colors, radius, spacing, typography } from "../constants/theme";
import { openGeneralWhatsApp, openVipGroup } from "../utils/whatsapp";

const benefits = [
  "Ofertas em primeira mão",
  "Kits com valor exclusivo para membros",
  "Avisos de reposição de produtos queridinhos",
  "Atendimento preferencial via WhatsApp",
];

const VipGroupScreen = () => (
  <SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Ionicons color={colors.accent} name="sparkles-outline" size={34} />
        <Text style={styles.title}>Grupo VIP Beleza VIP</Text>
        <Text style={styles.subtitle}>
          Entre no grupo oficial para receber promoções, novidades e kits especiais antes de todo mundo.
        </Text>
      </View>

      <View style={styles.listCard}>
        <Text style={styles.listTitle}>Vantagens de entrar agora</Text>
        {benefits.map((benefit) => (
          <View key={benefit} style={styles.benefitItem}>
            <Ionicons color={colors.success} name="checkmark-circle" size={18} />
            <Text style={styles.benefitText}>{benefit}</Text>
          </View>
        ))}
      </View>

      <AppButton
        fullWidth
        icon="logo-whatsapp"
        onPress={openVipGroup}
        style={styles.buttonSpacing}
        title="Entrar no Grupo VIP"
        variant="dark"
      />
      <AppButton
        fullWidth
        icon="chatbubbles-outline"
        onPress={openGeneralWhatsApp}
        title="Falar com a revendedora"
        variant="outline"
      />

      <Text style={styles.linkLabel}>{`Link direto: ${VIP_GROUP_URL}`}</Text>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  benefitItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  benefitText: {
    color: colors.text,
    flex: 1,
    fontSize: typography.body,
  },
  buttonSpacing: {
    marginBottom: spacing.sm,
  },
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  hero: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  linkLabel: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: spacing.md,
    textAlign: "center",
  },
  listCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  listTitle: {
    color: colors.text,
    fontSize: typography.titleMD,
    fontWeight: "800",
    marginBottom: spacing.sm,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  title: {
    color: colors.text,
    fontSize: typography.titleLG,
    fontWeight: "900",
    marginTop: spacing.sm,
    textAlign: "center",
  },
});

export default VipGroupScreen;

