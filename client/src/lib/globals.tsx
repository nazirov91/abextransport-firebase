import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  getDoc,
  onSnapshot,
  type DocumentData,
  type DocumentReference,
  type DocumentSnapshot,
  type FirestoreError,
} from "firebase/firestore";
import { getFirestoreClient } from "@/lib/firebase";
import { getGlobalsDocRef } from "@/lib/firestorePaths";

type GlobalsMap = Record<string, string>;

interface GlobalsContextValue {
  globals: GlobalsMap;
  businessName: string;
  heroMessage: string;
  tagline: string;
  phone: string;
  email: string;
  mcNumber: string;
  dotNumber: string;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  fieldMap: Record<string, string>;
}

const GlobalsContext = createContext<GlobalsContextValue | undefined>(undefined);

export function GlobalsProvider({ children }: { children: React.ReactNode }) {
  const firestore = getFirestoreClient();
  const [globals, setGlobals] = useState<GlobalsMap>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldMap, setFieldMap] = useState<Record<string, string>>({});

  const globalsDocRef = useMemo<DocumentReference<DocumentData> | null>(() => {
    if (!firestore) return null;
    return getGlobalsDocRef(firestore);
  }, [firestore]);

  const applySnapshot = useCallback((snapshot: DocumentSnapshot<DocumentData>) => {
    if (!snapshot.exists()) {
      setGlobals({});
      setError("Globals document not found");
      return;
    }
    const data = snapshot.data() ?? {};
    const nextGlobals: GlobalsMap = {};
    const nextFieldMap: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value == null) continue;
      const normalizedKey = key.replace(/\s+/g, "_").toLowerCase();
      nextGlobals[normalizedKey] = typeof value === "string" ? value : String(value);
      nextFieldMap[normalizedKey] = key;
    }
    setGlobals(nextGlobals);
    setFieldMap(nextFieldMap);
    setError(null);
  }, []);

  useEffect(() => {
    if (!firestore) {
      setError("Firebase is not configured");
      setLoading(false);
      return;
    }
    if (!globalsDocRef) {
      setError("Globals document path is not configured");
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      globalsDocRef,
      (snapshot) => {
        setLoading(false);
        applySnapshot(snapshot);
      },
      (err: FirestoreError) => {
        setLoading(false);
        setError(err?.message ?? "Failed to load globals");
        if (import.meta.env.DEV) {
          console.error("[GlobalsProvider] Firestore subscription error", err);
        }
      },
    );

    return () => unsubscribe();
  }, [applySnapshot, firestore, globalsDocRef]);

  const refetch = useCallback(() => {
    if (!firestore || !globalsDocRef) return;
    setLoading(true);
    getDoc(globalsDocRef)
      .then((snapshot) => {
        applySnapshot(snapshot);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        setError(message || "Failed to refresh globals");
        if (import.meta.env.DEV) {
          console.error("[GlobalsProvider] Firestore refetch error", err);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [applySnapshot, firestore, globalsDocRef]);

  const businessName = globals.business_name?.trim() || "Abex Transport";
  const heroMessage = globals.hero_message?.trim() || businessName;
  const tagline = globals.tagline?.trim() || "Reliable auto transport services";
  const phone = globals.phone?.trim() || "281-220-1799";
  const email = globals.email?.trim() || "contact@abextransport.com";
  const mcNumber = globals.mc?.trim() || "MC-123456";
  const dotNumber = globals.dot?.trim() || "DOT-7891011";

  const value: GlobalsContextValue = {
    globals,
    businessName,
    heroMessage,
    tagline,
    phone,
    email,
    mcNumber,
    dotNumber,
    loading,
    error,
    refetch,
    fieldMap,
  };

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (error) console.error("[GlobalsProvider] error:", error);
  }, [error]);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    console.log("[GlobalsProvider] globals updated:", globals);
  }, [globals]);

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    console.log("[GlobalsProvider] globals map:", globals);
    console.log("[GlobalsProvider] businessName:", businessName);
  }, [businessName]);

  return <GlobalsContext.Provider value={value}>{children}</GlobalsContext.Provider>;
}

export function useGlobals() {
  const ctx = useContext(GlobalsContext);
  if (!ctx) throw new Error("useGlobals must be used within a GlobalsProvider");
  return ctx;
}
