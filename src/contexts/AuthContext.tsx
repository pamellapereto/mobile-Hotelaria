import { API_URL } from "@/constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useMemo, useState } from "react";

type AuthContextProps = {
  token: string | null;
  isLoading: boolean;
  signIn: (email: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar token ao abrir o app
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("token");
        if (stored) setToken(stored);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

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
  async function signOut() {}

  const value = useMemo(
    () => ({ token, isLoading, signIn, signOut }),
    [token, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
