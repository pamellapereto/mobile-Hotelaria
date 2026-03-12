import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AuthContainer from "../ui/AuthContainer";
import DateSelector from "../ui/DateSelector";
import InputSpin from "../ui/InputSpin";
import RoomCard from "../ui/RoomCard";
import TextField from "../ui/TextField";
import { global } from "../ui/styles";
const RenderExplorer = () => {
  const { searchRoom, addReservationToCart } = useAuth();
  const { width, height } = Dimensions.get("window");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [qntGuests, setQntGuests] = useState<number>(1);
  const [calendar, setCalendar] = useState<"checkin" | "checkout" | null>(null);
  const [loading, setLoading] = useState(false);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const closeCalendar = () => setCalendar(null);

  const handleSearch = async () => {
    if (!checkIn || !checkOut) {
      Alert.alert("ATENÇÃO!", "Selecione as datas de entrada e saída.");
      return;
    }
    setLoading(true);
    setAvailableRooms([]);

    try {
      const rooms = await searchRoom(checkIn, checkOut, qntGuests);
      setAvailableRooms(rooms || []);
      console.log(rooms);
    } catch (error: any) {
      if (!error?.message?.includes("encontrado")) {
        Alert.alert("ERRO", "Ocorreu um problema ao buscar quartos.");
      }
      setAvailableRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (room: any) => {
    addReservationToCart({
      roomId: room.id,
      nome: room.nome,
      qtd_cama_casal: room.qtd_cama_casal,
      qtd_cama_solteiro: room.qtd_cama_solteiro,
      preco: Number(room.preco),
      dataInicio: checkIn,
      dataFim: checkOut,
      quantidade: qntGuests,
    });

    Alert.alert("SUCESSO!", "Quarto adicionado ao carrinho!");
  };

  return (
    <AuthContainer>
      {/*children */}
      <View style={{ display: "flex", justifyContent: "center" }}>
        {/*Essa View vocês tinham e eu só estilizei*/}
        <View style={{ display: "flex", flexDirection: "column" }}>
          {/*Criei esta nova View para check-in*/}
          {/* Input de checkIn para abrir calendário*/}
          <TouchableOpacity onPress={() => setCalendar("checkin")}>
            <View style={{ width: width * 0.8 }}>
              {/* Nova view para dar largura ao TextField */}
              <TextField
                label="Check-in"
                icon={{ lib: "FontAwesome5", name: "calendar-alt" }}
                placeholder="Selecione a data"
                value={checkIn}
              />
            </View>
            {/* Fecha aqui */}
          </TouchableOpacity>
        </View>
        {/*View de check-in fecha aqui */}
        <View style={{ display: "flex", flexDirection: "column" }}>
          {/*Criei esta nova View para check-out*/}
          {/* Input de checkIn para abrir calendário*/}
          <TouchableOpacity onPress={() => setCalendar("checkout")}>
            <View style={{ width: width * 0.8 }}>
              {/* Nova view para dar largura ao TextField */}
              <TextField
                label="Check-out"
                icon={{ lib: "FontAwesome5", name: "calendar-alt" }}
                placeholder="Selecione a data"
                value={checkOut}
              />
            </View>
            {/* Fecha aqui */}
          </TouchableOpacity>
        </View>
        {/*View do check-out que fecha aqui */}
        {/* Modal para fechar calendário ao clicar fora */}
        <Modal
          transparent
          animationType="fade"
          visible={calendar !== null}
          onRequestClose={closeCalendar}
        >
          {/* Backdrop: qualquer clique aqui fora, fecha */}
          <Pressable
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0, 0.29)",
            }}
            onPress={closeCalendar}
          >
            {/* Área do calendário que, ao clicar, não o fecha */}
            <Pressable onPress={() => {}}>
              {/* <DateSelector /> */}
              {calendar === "checkin" && (
                <DateSelector
                  onSelectDate={(date) => {
                    setCheckIn(date);
                    closeCalendar();
                  }}
                />
              )}
              {/* <DateSelector /> */}
              {calendar === "checkout" && (
                <DateSelector
                  onSelectDate={(date) => {
                    setCheckOut(date);
                    closeCalendar();
                  }}
                />
              )}
            </Pressable>
          </Pressable>
        </Modal>
        {/* InputSpin */}
        <View>
          <Text style={global.label}>Quantidade de hóspedes</Text>
          <InputSpin
            guests={qntGuests}
            onSelectSpin={(guests) => {
              setQntGuests(guests);
            }}
            minGuests={1}
            maxGuests={6}
            step={1}
            colorMin={"#420350ff"}
            colorMax={"#420350ff"}
          />
        </View>
        <TouchableOpacity disabled={loading} onPress={handleSearch}>
          {loading ? (
            <ActivityIndicator size="small" color="#420350ff" />
          ) : (
            <Text>Consultar disponibilidade</Text>
          )}
        </TouchableOpacity>
      </View>

      {/*Renderização dos quartos */}

      {availableRooms.length > 0 ? (
        <View>
          <Text
            style={[
              global.label,
              { marginTop: height * 0.04, textAlign: "center" },
            ]}
          >
            Opções encontradas:
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={width * 0.07}
          >
            {availableRooms.map((room) => (
              <RoomCard
                key={room.id}
                image={
                  room.fotos?.length > 0
                    ? { uri: room.fotos[0].url }
                    : require("../../../assets/images/quarto.jpg")
                }
                label={room.nome}
                icon={{
                  lib: "FontAwesome5",
                  name: "bed",
                }}
                description={{
                  title: "Descrição do quarto",
                  text: `${room.qtd_cama_casal} cama(s) casal \n${room.qtd_cama_solteiro} cama(s) solteiro `,
                  price: Number(room.preco),
                }}
                onPressReserve={() => handleAddToCart(room)}
              />
            ))}
          </ScrollView>
        </View>
      ) : (
        <View>
          <Text
            style={[
              global.label,
              { marginTop: height * 0.04, textAlign: "center" },
            ]}
          >
            Nenhuma opção disponível!
          </Text>
        </View>
      )}
    </AuthContainer>
  );
};
export default RenderExplorer;
