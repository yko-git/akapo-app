import { createContext } from "react";

type LoginContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
};

export const LoginContext = createContext<LoginContextType | null>(null);

// デフォルト値
const defaultContextValue: LoginContextType = {
  isLoggedIn: false,
  setIsLoggedIn: () => {},
};
