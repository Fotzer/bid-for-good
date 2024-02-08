"use client";

import { IUser, IUserSignIn } from "@/types/user";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

interface IAuthContext {
  token: string | null;
  login: ((userDto: IUserSignIn) => Promise<IUser | null>) | null;
  logout: (() => void) | null;
  user: IUser | null;
}

const AuthContext = createContext<IAuthContext>({
  token: null,
  login: null,
  logout: null,
  user: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<IUser | null>(null);

  const login = useCallback(async (userDto: IUserSignIn) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`,
        userDto
      );

      const { email, name } = res.data.user;
      const user = { email, name };
      const token = res.data.token;

      setUser(user);
      setToken(token);
      localStorage.setItem("token", token);

      return user;
    } catch (err) {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const { CancelToken } = axios;
    const source = CancelToken.source();

    (async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login-by-token`,
            "",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              cancelToken: source.token,
            }
          );

          if (res.status < 307) {
            const { email, name } = res.data;
            setUser({ email, name });
          } else {
            toast({
              variant: "destructive",
              title: "Unable to authenticate",
              description: "Your token was probably malformed",
            });
            setToken(token);
            localStorage.removeItem("token");
          }
        }
      } catch (err) {}
    })();

    return () => {
      source.cancel("Operation canceled due to component unmount");
    };
  }, [login, token]);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
