import { API_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type CartReservations = {
  roomId: number;
  nome: string;
  qtd_cama_casal: number;
  qtd_cama_solteiro: number;
  preco: number;
  dataInicio: string;
  dataFim: string;
  quantidade: number;
};

type AuthContextProps = {
  token: string | null;
  isLoading: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
  searchRoom: (
    dataInicio: string,
    dataFim: string,
    quantidade: number,
  ) => Promise<any[]>;

  cartReservations: CartReservations[];
  addReservationToCart: (resevation: CartReservations) => void;
  removeReservationFromCart: (index: number) => void;
  clearCart: () => void;
  /* idAdicional pode ser nulo no database, portanto não está sendo chamado no back-end!*/
  createOrder: (pagamento: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cartReservations, setCartReservations] = useState<CartReservations[]>(
    [],
  );

  // Carregar token e dados do carrinho local ao abrir o app
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("token");
        const storedCart = await AsyncStorage.getItem("cartReservations");

        if (stored) setToken(stored);
        if (storedCart) setCartReservations(JSON.parse(storedCart));
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("cartReservations", JSON.stringify(cartReservations));
  }, [cartReservations]);

  async function signIn(email: string, senha: string) {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    });
    // Back-end retorna erro {erro: "..."} quando falha
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.erro || "Credenciais inválidas");
    }
    //Back-end retorna JSON
    const tokenAPI: string = await res.json();

    await AsyncStorage.setItem("token", tokenAPI);
    setToken(tokenAPI);
  }
  //SignOut:
  async function signOut() {
    await AsyncStorage.removeItem("token");
    setToken(null);
  }

  async function searchRoom(
    dataInicio: string,
    dataFim: string,
    quantidade: number,
  ) {
    const res = await fetch(`${API_URL}/quartosDisponiveis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataInicio, dataFim, quantidade }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => null);
      throw new Error(
        error?.erro || error?.mensagem || "Erro ao buscar quartos",
      );
    }
    return await res.json();
  }

  //Adicionar localmente um item ao carrinho
  const addReservationToCart = (reservation: CartReservations) => {
    setCartReservations((propsRoomReserved) => [
      ...propsRoomReserved,
      reservation,
    ]);
  };

  //Remover localmente um item em específico do carrinho
  const removeReservationFromCart = (index: number) => {
    setCartReservations((propsRoomReserved) =>
      propsRoomReserved.filter((_, i) => i !== index),
    );
  };

  //Remover localmente todos os objetos do carrinho
  const clearCart = () => {
    setCartReservations([]);
  };

  const createOrder = async (pagamento: string) => {
    if (!token) {
      throw new Error("Usuário não autenticado");
    }

    if (cartReservations.length === 0) {
      throw new Error("Carrinho está vazio!");
    }

    const quartos = cartReservations.map((item) => ({
      id: item.roomId,
      dataInicio: item.dataInicio,
      dataFim: item.dataFim,
    }));

    const res = await fetch(`${API_URL}/reserva`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        pagamento,
        quartos,
      }),
    });

    const result = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(result?.message || "Erro ao finalizar pedido");
    }

    clearCart();
  };

  const value = useMemo(
    () => ({
      token,
      isLoading,
      signIn,
      signOut,
      searchRoom,
      cartReservations,
      addReservationToCart,
      removeReservationFromCart,
      clearCart,
      createOrder,
    }),
    [token, isLoading, cartReservations],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth() deve ser usado dentro de AuthProvider");
  return ctx;
};

export default AuthProvider;
