import { useAuth } from "@/contexts/AuthContext";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
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

  const calculoTotal = cartReservations.reduce(
    (acc, item) => acc + Number(item.preco),
    0,
  );

  const handleFinishOrder = async () => {
    try {
      await createOrder("Pix");
      Alert.alert("Sucesso", "Pedido finalizado!");
    } catch (error: any) {
      Alert.alert(
        "Erro",
        error.message || "Não foi possível finalizar o pedido.",
      );
    }
  };
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
                <View key={index} style={styles.itemCard}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={styles.cardHeader}>
                      <FontAwesome5 name="bed" size={20} color="#07042b" />
                      <Text style={styles.roomLabel}>{item.nome}</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => removeReservationFromCart(index)}
                    >
                      <MaterialCommunityIcons
                        name="trash-can"
                        color={"#8f0000"}
                        size={20}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.divider} />

                  {/* Informações que vieram da Explore */}
                  <View style={styles.infoGrid}>
                    <View style={styles.infoBox}>
                      <Text style={styles.miniLabel}>ENTRADA</Text>
                      <Text style={styles.infoText}>{item.dataInicio}</Text>
                    </View>
                    <View style={styles.infoBox}>
                      <Text style={styles.miniLabel}>SAÍDA</Text>
                      <Text style={styles.infoText}>{item.dataFim}</Text>
                    </View>
                    <View style={styles.infoBox}>
                      <Text style={styles.miniLabel}>HÓSPEDES</Text>
                      <Text style={styles.infoText}>
                        {item.quantidade} Pessoas
                      </Text>
                    </View>
                  </View>
                  <View style={styles.totalDivider} />
                  {/* Resumo de Valores */}
                  <View style={styles.priceCard}>
                    <Text style={styles.sectionTitle}>Resumo do valor</Text>

                    <View style={[styles.priceRow, { alignItems: "center" }]}>
                      <View>
                        <Text style={styles.priceLabel}>
                          Preço da diária: R$ {item.preco}
                        </Text>
                        <Text style={styles.priceLabel}>
                          Quantidade de diárias: X
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.priceValue}>Subtotal</Text>
                        <Text style={styles.priceValue}>R$ X,xx</Text>
                      </View>
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
                  <Text style={styles.totalPrice}>{calculoTotal}</Text>
                </View>
              </View>
              <View style={styles.buttonArea}>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleFinishOrder}
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
