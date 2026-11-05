import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { authService } from "@/shared/services/auth.service";
import { tokenStorage } from "@/shared/services/token-storage";
import { UserRoleEnum, type User } from "@/shared/types/auth";

type AuthContextData = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (login: string, password: string) => Promise<void>;
  updateUser: (user: User) => void;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextData | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async (): Promise<User> => {
    const currentUser = await authService.getMe();

    if (
      !currentUser?.role ||
      ![
        UserRoleEnum.ADMIN,
        UserRoleEnum.TEACHER,
        UserRoleEnum.STUDENT,
      ].includes(currentUser.role)
    ) {
      throw new Error("Dados do usuário ou role inválidos.");
    }

    setUser(currentUser);
    return currentUser;
  }, []);

  useEffect(() => {
    async function restoreSession() {
      try {
        const savedToken = await tokenStorage.get();

        if (savedToken) {
          setToken(savedToken);
          await fetchMe();
        }
      } catch {
        await tokenStorage.remove();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, [fetchMe]);

  const login = useCallback(async (loginValue: string, password: string) => {
    const { accessToken, user: loggedUser } = await authService.login({
      login: loginValue,
      password,
    });

    if (!accessToken || typeof accessToken !== "string") {
      throw new Error("A API não retornou um token válido.");
    }

    await tokenStorage.set(accessToken);
    setToken(accessToken);

    try {
      const currentUser = loggedUser ?? (await authService.getMe());

      if (
        currentUser.role !== UserRoleEnum.ADMIN &&
        currentUser.role !== UserRoleEnum.TEACHER &&
        currentUser.role !== UserRoleEnum.STUDENT
      ) {
        throw new Error("Dados do usuário ou perfil inválido.");
      }

      setUser(currentUser);
    } catch (error) {
      await tokenStorage.remove();
      setToken(null);
      setUser(null);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await tokenStorage.remove();
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
  }
  return context;
}
