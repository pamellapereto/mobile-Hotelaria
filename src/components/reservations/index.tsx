import { useAuth } from "@/contexts/AuthContext";
import { FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AuthContainer from "../ui/AuthContainer";
import { global } from "../ui/styles";

const RenderReservations = () => {
  const { width, height } = Dimensions.get("window");
  const { cartReservations, removeReservationFromCart, createOrder } =
    useAuth();

  const { checkIn, checkOut, guests } = useLocalSearchParams();

  return (
    <AuthContainer
      title="Minhas Reservas"
      subtitle="Revise os itens do seu carrinho"
      icon="plane-departure"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={global.content}>
          <Text
            style={[
              global.label,
              { textAlign: "center", paddingVertical: height * 0.013 },
            ]}
          >
            Reservas adicionadas
          </Text>

          {cartReservations.length === 0 ? (
            <View
              style={{
                padding: width * 0.04,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text
                style={[
                  global.label,
                  { color: "rgb(136, 6, 114)", fontSize: 18 },
                ]}
              >
                Nenhuma reserva adicionada
              </Text>
            </View>
          ) : (
            <View>
              {cartReservations.map((item, index) => (
                <View style={styles.itemCard}>
                  <View style={styles.cardHeader}>
                    <FontAwesome5 name="bed" size={20} color="#07042b" />
                    <Text style={styles.roomLabel}>Quarto Master</Text>
                  </View>

                  <View style={styles.divider} />

                  {/* Informações que vieram da Explore */}
                  <View style={styles.infoGrid}>
                    <View style={styles.infoBox}>
                      <Text style={styles.miniLabel}>ENTRADA</Text>
                      <Text style={styles.infoText}>
                        {checkIn || "10/10/2026"}
                      </Text>
                    </View>
                    <View style={styles.infoBox}>
                      <Text style={styles.miniLabel}>SAÍDA</Text>
                      <Text style={styles.infoText}>
                        {checkOut || "15/10/2026"}
                      </Text>
                    </View>
                    <View style={styles.infoBox}>
                      <Text style={styles.miniLabel}>HÓSPEDES</Text>
                      <Text style={styles.infoText}>
                        {guests || "2"} Pessoas
                      </Text>
                    </View>
                  </View>

                  <View style={styles.totalDivider} />
                  {/* Resumo de Valores */}
                  <View style={styles.priceCard}>
                    <Text style={styles.sectionTitle}>Resumo do Valor</Text>

                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Diárias (5 noites)</Text>
                      <Text style={styles.priceValue}>R$ 904,50</Text>
                    </View>
                  </View>
                </View>
              ))}

              {/* Botões de Ação */}
              <View style={styles.itemCard}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalPrice}>R$ 949,50</Text>
                </View>
              </View>
              <View style={styles.buttonArea}>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => console.log("Finalizar")}
                >
                  <Text style={styles.confirmButtonText}>
                    CONFIRMAR RESERVA
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </AuthContainer>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "#EEE",
    marginBottom: 25,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  roomLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#07042b",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginBottom: 15,
  },
  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },
  infoBox: {
    alignItems: "flex-start",
  },
  miniLabel: {
    fontSize: 10,
    color: "#999",
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 10,
    color: "#07042b",
  },
  priceCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 15,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  priceLabel: { color: "#666" },
  priceValue: { fontWeight: "500" },
  totalDivider: {
    height: 1,
    backgroundColor: "#DDD",
    marginVertical: 10,
  },
  totalLabel: { fontSize: 18, fontWeight: "bold" },
  totalPrice: { fontSize: 18, fontWeight: "bold", color: "#28A745" },
  buttonArea: {
    marginTop: 30,
    gap: 12,
  },
  confirmButton: {
    backgroundColor: "rgba(7, 4, 43, 0.94)", // Cor do InputSpin
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(7, 4, 43, 0.94)",
  },
  cancelButtonText: {
    color: "rgba(7, 4, 43, 0.94)",
    fontWeight: "bold",
  },
});

export default RenderReservations;
