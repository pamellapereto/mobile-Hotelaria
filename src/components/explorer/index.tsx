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
  const { searchRoom } = useAuth();
  const { width, height } = Dimensions.get("window");
  //useState() para gerenciar e alterar os estados
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

  return (
    <AuthContainer>
      {/*children */}
      <View style={{ display: "flex", justifyContent: "center" }}>
        {" "}
        {/*Essa View vocês tinham e eu só estilizei*/}
        <View style={{ display: "flex", flexDirection: "column" }}>
          {" "}
          {/*Criei esta nova View para check-in*/}
          {/* Input de checkIn para abrir calendário*/}
          <TouchableOpacity onPress={() => setCalendar("checkin")}>
            <View style={{ width: width * 0.8 }}>
              {" "}
              {/* Nova view para dar largura ao TextField */}
              <TextField
                label="Check-in"
                icon={{ lib: "FontAwesome5", name: "calendar-alt" }}
                placeholder="Selecione a data"
                value={checkIn}
              />
            </View>{" "}
            {/* Fecha aqui */}
          </TouchableOpacity>
        </View>{" "}
        {/*View de check-in fecha aqui */}
        <View style={{ display: "flex", flexDirection: "column" }}>
          {" "}
          {/*Criei esta nova View para check-out*/}
          {/* Input de checkIn para abrir calendário*/}
          <TouchableOpacity onPress={() => setCalendar("checkout")}>
            <View style={{ width: width * 0.8 }}>
              {" "}
              {/* Nova view para dar largura ao TextField */}
              <TextField
                label="Check-out"
                icon={{ lib: "FontAwesome5", name: "calendar-alt" }}
                placeholder="Selecione a data"
                value={checkOut}
              />
            </View>{" "}
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
                image={require("../../../assets/images/quarto.jpg")}
                /* image={{uri: "https://"}} */
                label="Apartamento"
                icon={{
                  lib: "FontAwesome5",
                  name: "bed",
                }}
                description={{
                  title: "Descrição do quarto",
                  text: "1 cama de casal\n2 camas de solteiro",
                  price: 180.9,
                }}
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
