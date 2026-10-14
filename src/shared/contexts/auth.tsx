
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { api } from '../services/api';
import { tokenStorage } from '../services/token-storage';

export type Role = 'ADMIN' | 'TEACHER';

export type User = {
  id: number | string;
  name?: string;
  login?: string;
  role: Role;
  [key: string]: unknown;
};

type LoginResponse = {
  message: string;
  data: string;
};

type MeResponse = {
  message?: string;
  data: User;
};

type AuthContextData = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<
  AuthContextData | undefined
>(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async (): Promise<User> => {
    const response = await api.get<MeResponse>('/me');
    const currentUser = response.data.data;

    if (
      !currentUser?.role ||
      !['ADMIN', 'TEACHER'].includes(currentUser.role)
    ) {
      throw new Error('Dados do usuário ou role inválidos.');
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

  const login = useCallback(
    async (loginValue: string, password: string) => {
      const response = await api.post<LoginResponse>(
        '/auth/login',
        {
          login: loginValue,
          password,
        },
      );

      const accessToken = response.data.data;

      if (
        typeof accessToken !== 'string' ||
        !accessToken
      ) {
        throw new Error('A API não retornou um JWT válido.');
      }

      await tokenStorage.set(accessToken);
      setToken(accessToken);

      try {
        await fetchMe();
      } catch (error) {
        await tokenStorage.remove();
        setToken(null);
        setUser(null);
        throw error;
      }
    },
    [fetchMe],
  );

  const logout = useCallback(async () => {
    await tokenStorage.remove();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext)
  return context as AuthContextData;
}