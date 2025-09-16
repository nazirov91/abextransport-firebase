import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
  type User,
} from "firebase/auth";
import { getAuthClient } from "@/lib/firebase";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authClient, setAuthClient] = useState<Auth | null>(null);

  useEffect(() => {
    const client = getAuthClient();
    if (!client) {
      setAuthError("Firebase auth is not configured");
      setLoading(false);
      return;
    }
    setAuthClient(client);
    const unsubscribe = onAuthStateChanged(client, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!authClient) {
        throw new Error("Firebase auth is not initialized");
      }
      await signInWithEmailAndPassword(authClient, email, password);
    },
    [authClient],
  );

  const signOutUser = useCallback(async () => {
    if (!authClient) return;
    await signOut(authClient);
  }, [authClient]);

  const value = useMemo(
    () => ({ user, loading, authError, signIn, signOutUser }),
    [user, loading, authError, signIn, signOutUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
