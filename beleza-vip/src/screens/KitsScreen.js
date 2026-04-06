import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import KitCard from "../components/KitCard";
import SectionHeader from "../components/SectionHeader";
import { colors, radius, spacing, typography } from "../constants/theme";
import kitsData from "../data/kits.json";
import { openKitWhatsApp } from "../utils/whatsapp";

const KitsScreen = () => (
  <SafeAreaView style={styles.safeArea}>
    <FlatList
      contentContainerStyle={styles.container}
      data={kitsData}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View>
          <LinearGradient colors={["#f7d9de", "#f5ece8"]} style={styles.banner}>
            <Text style={styles.bannerTitle}>Kits Exclusivos</Text>
            <Text style={styles.bannerText}>
              Monte presentes elegantes com preço especial e encante em qualquer ocasião.
            </Text>
          </LinearGradient>
          <SectionHeader subtitle="Ofertas perfeitas para autocuidado e presente" title="Escolha seu kit" />
        </View>
      }
      renderItem={({ item }) => <KitCard kit={item} onPressOrder={() => openKitWhatsApp(item)} />}
      showsVerticalScrollIndicator={false}
    />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  banner: {
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
  },
  bannerText: {
    color: colors.textMuted,
    fontSize: typography.body,
    lineHeight: 21,
    marginTop: spacing.xs,
  },
  bannerTitle: {
    color: colors.text,
    fontSize: typography.titleLG,
    fontWeight: "900",
  },
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  safeArea: {
    backgroundColor: colors.background,
    flex: 1,
  },
});

export default KitsScreen;

