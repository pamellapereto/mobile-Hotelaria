import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import AuthContainer from "../ui/AuthContainer";

const RenderAccount = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  const logout = async () => {
    await signOut();
    router.replace("/(auth)");
  };

  return (
    <AuthContainer>
      {/*children */}
      <View>
        <TouchableOpacity onPress={logout}>
          <Text>Sair</Text>
        </TouchableOpacity>
      </View>
    </AuthContainer>
  );
};
export default RenderAccount;
