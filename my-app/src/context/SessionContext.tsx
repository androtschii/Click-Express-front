import { createContext, useContext, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSession, logout as logoutFn, type Session } from "../services/authService";

interface SessionCtx {
  session: Session | null;
  setSession: (s: Session | null) => void;
  handleLogout: () => void;
}

const Ctx = createContext<SessionCtx | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(() => getSession());
  const qc = useQueryClient();

  const setSession = (s: Session | null) => setSessionState(s);

  const handleLogout = () => {
    logoutFn();
    setSessionState(null);
    qc.clear();
  };

  return <Ctx.Provider value={{ session, setSession, handleLogout }}>{children}</Ctx.Provider>;
}

export function useSessionCtx() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSessionCtx outside SessionProvider");
  return ctx;
}
