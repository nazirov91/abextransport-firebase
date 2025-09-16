import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  doc,
  getDoc,
  onSnapshot,
  type DocumentData,
  type DocumentSnapshot,
  type FirestoreError,
} from "firebase/firestore";
import { getFirestoreClient } from "@/lib/firebase";

type GlobalsMap = Record<string, string>;

interface GlobalsContextValue {
  globals: GlobalsMap;
  businessName: string;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const GlobalsContext = createContext<GlobalsContextValue | undefined>(undefined);

export function GlobalsProvider({ children }: { children: React.ReactNode }) {
  const firestore = getFirestoreClient();
  const globalsDocPath = import.meta.env.VITE_FIRESTORE_GLOBALS_DOC as string | undefined;
  const [globals, setGlobals] = useState<GlobalsMap>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pathSegments = useMemo(() => {
    if (!globalsDocPath) return null;
    const segments = globalsDocPath.split("/").map((segment) => segment.trim()).filter(Boolean);
    if (segments.length === 0 || segments.length % 2 !== 0) {
      if (import.meta.env.DEV) {
        console.warn("[GlobalsProvider] Invalid VITE_FIRESTORE_GLOBALS_DOC path", globalsDocPath);
      }
      return null;
    }
    return segments;
  }, [globalsDocPath]);

  const applySnapshot = useCallback((snapshot: DocumentSnapshot<DocumentData>) => {
    if (!snapshot.exists()) {
      setGlobals({});
      setError("Globals document not found");
      return;
    }
    const data = snapshot.data() ?? {};
    const nextGlobals: GlobalsMap = {};
    for (const [key, value] of Object.entries(data)) {
      if (value == null) continue;
      nextGlobals[key] = typeof value === "string" ? value : String(value);
    }
    setGlobals(nextGlobals);
    setError(null);
  }, []);

  useEffect(() => {
    if (!firestore) {
      setError("Firebase is not configured");
      setLoading(false);
      return;
    }
    if (!pathSegments) {
      setError("Globals document path is not configured");
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      doc(firestore, ...pathSegments),
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
  }, [applySnapshot, firestore, pathSegments]);

  const refetch = useCallback(() => {
    if (!firestore || !pathSegments) return;
    setLoading(true);
    getDoc(doc(firestore, ...pathSegments))
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
  }, [applySnapshot, firestore, pathSegments]);

  const businessName = globals.business_name?.trim() || "Abex Transport";

  const value: GlobalsContextValue = {
    globals,
    businessName,
    loading,
    error,
    refetch,
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
