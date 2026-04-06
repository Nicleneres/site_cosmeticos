import { Alert, Linking } from "react-native";
import { STORE_INFO, VIP_GROUP_URL } from "../constants/links";

const buildWhatsappUrl = (message) =>
  `https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;

const safeOpenUrl = async (url) => {
  try {
    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
      Alert.alert(
        "Não foi possível abrir o link",
        "Verifique se o WhatsApp está instalado ou tente novamente em instantes.",
      );
      return;
    }

    await Linking.openURL(url);
  } catch (error) {
    Alert.alert(
      "Ops, algo deu errado",
      "Não conseguimos abrir o link no momento. Tente novamente.",
    );
  }
};

export const openGeneralWhatsApp = async () => {
  const message =
    "Olá! Vim pelo app Beleza VIP e quero receber atendimento para fazer meu pedido.";
  await safeOpenUrl(buildWhatsappUrl(message));
};

export const openOrderWhatsApp = async (product) => {
  const message = `Olá! Quero pedir o produto: ${product.name}. Pode me ajudar com esse item?`;
  await safeOpenUrl(buildWhatsappUrl(message));
};

export const openKitWhatsApp = async (kit) => {
  const message = `Oi! Quero esse kit: ${kit.name}. Qual o prazo de entrega?`;
  await safeOpenUrl(buildWhatsappUrl(message));
};

export const openFavoritesWhatsApp = async (products) => {
  const names = products.map((item) => `• ${item.name}`).join("\n");
  const message = `Olá! Quero pedir os itens salvos nos favoritos:\n${names}`;
  await safeOpenUrl(buildWhatsappUrl(message));
};

export const openVipGroup = async () => {
  await safeOpenUrl(VIP_GROUP_URL);
};

export const openInstagram = async () => {
  await safeOpenUrl(STORE_INFO.instagramUrl);
};
