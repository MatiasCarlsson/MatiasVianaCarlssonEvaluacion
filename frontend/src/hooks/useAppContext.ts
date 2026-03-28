import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import type { AppContextValue } from "../context/AppContext";

export const useAppContext = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext debe usarse dentro de <AppProvider>");
  return ctx;
};
