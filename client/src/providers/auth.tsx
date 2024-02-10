"use client";

import { toast } from "@/components/ui/use-toast";
import { IUser, IUserSignIn, IUserSignUp } from "@/types/user";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface IAuthContext {
  token: string | null;
  login: ((userDto: IUserSignIn) => Promise<IUser | null>) | null;
  signUp: ((userDto: IUserSignUp) => Promise<IUser | null>) | null;
  logout: (() => void) | null;
  updateUserName: ((newName: string) => void) | null;
  user: IUser | null;
}

const AuthContext = createContext<IAuthContext>({
  token: null,
  login: null,
  signUp: null,
  logout: null,
  user: null,
  updateUserName: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<IUser | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const login = useCallback(async (userDto: IUserSignIn) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`,
        userDto
      );

      const { email, name, id } = res.data.user;
      const user = { email, name, id };
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
    if (pathname === "/sign-up") return;

    const { CancelToken } = axios;
    const source = CancelToken.source();

    const redirectPath = `/sign-in${
      pathname.includes("sign-in") || pathname.includes("sign-up")
        ? ""
        : `?redirectTo=${pathname}`
    }`;

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
            const { email, name, id } = res.data;
            setUser({ email, name, id });
          } else {
            toast({
              variant: "destructive",
              title: "Unable to authenticate",
              description: "Your token was probably malformed",
            });
            setToken(token);
            localStorage.removeItem("token");
            setTimeout(() => router.push(redirectPath), 1500);
          }
        }
      } catch (err) {}
    })();

    return () => {
      source.cancel("Operation canceled due to component unmount");
    };
  }, [login, token, router, pathname]);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  const signUp = async (userDto: IUserSignUp) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/sign-up`,
        userDto
      );

      const { email, name, id } = res.data.user;
      const user = { email, name, id };
      const token = res.data.token;

      setUser(user);
      setToken(token);
      localStorage.setItem("token", token);

      return user;
    } catch (err) {
      setUser(null);
      return null;
    }
  };

  const updateUserName = (newName: string) =>
    user && setUser((p) => ({ ...p!, name: newName }));

  return (
    <AuthContext.Provider
      value={{ token, login, signUp, logout, user, updateUserName }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
