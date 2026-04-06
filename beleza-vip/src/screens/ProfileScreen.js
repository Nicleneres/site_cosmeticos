import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import AppButton from "../components/AppButton";
import SectionHeader from "../components/SectionHeader";
import { STORE_INFO } from "../constants/links";
import { colors, radius, spacing, typography } from "../constants/theme";
import { openGeneralWhatsApp, openInstagram } from "../utils/whatsapp";

const ProfileLine = ({ icon, label, value }) => (
  <View style={styles.line}>
    <View style={styles.iconWrap}>
      <Ionicons color={colors.primary} name={icon} size={16} />
    </View>
    <View style={styles.lineText}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const ProfileScreen = ({ navigation }) => (
  <SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.topCard}>
        <Text style={styles.storeName}>{STORE_INFO.storeName}</Text>
        <Text style={styles.storeSubtitle}>Atendimento personalizado para sua rotina de beleza.</Text>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Contato" />
        <ProfileLine icon="logo-whatsapp" label="WhatsApp" value={STORE_INFO.whatsappDisplay} />
        <ProfileLine icon="logo-instagram" label="Instagram" value={STORE_INFO.instagram} />
        <ProfileLine icon="location-outline" label="Cidade" value={STORE_INFO.city} />
        <ProfileLine icon="time-outline" label="Atendimento" value={STORE_INFO.hours} />
        <ProfileLine icon="card-outline" label="Pagamento" value={STORE_INFO.payments} />
      </View>

      <AppButton
        fullWidth
        icon="logo-whatsapp"
        onPress={openGeneralWhatsApp}
        style={styles.buttonSpacing}
        title="Falar no WhatsApp"
        variant="primary"
      />
      <AppButton
        fullWidth
        icon="logo-instagram"
        onPress={openInstagram}
        style={styles.buttonSpacing}
        title="Abrir Instagram"
        variant="outline"
      />
      <AppButton
        fullWidth
        icon="heart-outline"
        onPress={() => navigation.navigate("Favorites")}
        style={styles.buttonSpacing}
        title="Ver Favoritos"
        variant="secondary"
      />
      <AppButton
        fullWidth
        icon="star-outline"
        onPress={() => navigation.navigate("VipGroup")}
        title="Entrar no Grupo VIP"
        variant="dark"
      />
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  buttonSpacing: {
    marginBottom: spacing.sm,
  },
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  iconWrap: {
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: radius.pill,
    height: 30,
    justifyContent: "center",
    width: 30,
  },
  label: {
    color: colors.textMuted,
    fontSize: typography.bodySmall,
  },
  line: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  lineText: {
    flex: 1,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  storeName: {
    color: colors.text,
    fontSize: typography.titleLG,
    fontWeight: "900",
  },
  storeSubtitle: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  topCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  value: {
    color: colors.text,
    fontSize: typography.body,
    fontWeight: "700",
  },
});

export default ProfileScreen;

