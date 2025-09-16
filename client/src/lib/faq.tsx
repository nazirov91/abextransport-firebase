import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import {
  deleteField,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
  type DocumentData,
  type DocumentReference,
  type FirestoreError,
} from "firebase/firestore";
import { getFirestoreClient } from "@/lib/firebase";
import { getFaqDocRef } from "@/lib/firestorePaths";

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  order?: number;
}

export interface FaqDraft {
  question: string;
  answer: string;
  order: string;
}

interface FaqContextValue {
  faqs: FaqEntry[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  saveFaq: (id: string, draft: FaqDraft) => Promise<void>;
  removeFaq: (id: string) => Promise<void>;
}

const FaqContext = createContext<FaqContextValue | undefined>(undefined);

export function FaqProvider({ children }: { children: React.ReactNode }) {
  const firestore = getFirestoreClient();
  const [faqs, setFaqs] = useState<FaqEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const faqDoc = useMemo<DocumentReference<DocumentData> | null>(() => {
    if (!firestore) return null;
    return getFaqDocRef(firestore);
  }, [firestore]);

  useEffect(() => {
    if (!firestore) {
      setError("Firebase is not configured");
      setLoading(false);
      return;
    }
    if (!faqDoc) {
      setError("FAQ document path is not configured");
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      faqDoc,
      (snapshot) => {
        setLoading(false);
        if (!snapshot.exists()) {
          setFaqs([]);
          setError(null);
          return;
        }
        const data = snapshot.data() ?? {};
        const entries: FaqEntry[] = Object.entries(data).map(([id, value], index) => {
          let parsed: any = value;
          if (typeof value === "string") {
            try {
              parsed = JSON.parse(value);
            } catch {
              parsed = { question: value, answer: "" };
            }
          }
          const question = typeof parsed?.question === "string" ? parsed.question : String(value ?? "");
          const answer = typeof parsed?.answer === "string" ? parsed.answer : "";
          const order = typeof parsed?.order === "number" ? parsed.order : index + 1;
          return {
            id,
            question,
            answer,
            order,
          };
        });
        entries.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setFaqs(entries);
        setError(null);
      },
      (err: FirestoreError) => {
        setLoading(false);
        setError(err.message ?? "Failed to load FAQ");
        if (import.meta.env.DEV) {
          console.error("[FaqProvider] Firestore subscription error", err);
        }
      },
    );

    return () => unsubscribe();
  }, [faqDoc, firestore]);

  const refetch = useCallback(async () => {
    if (!faqDoc) return;
    setLoading(true);
    try {
      const snapshot = await getDoc(faqDoc);
      if (!snapshot.exists()) {
        setFaqs([]);
      } else {
        const data = snapshot.data() ?? {};
        const entries: FaqEntry[] = Object.entries(data).map(([id, value], index) => {
          let parsed: any = value;
          if (typeof value === "string") {
            try {
              parsed = JSON.parse(value);
            } catch {
              parsed = { question: value, answer: "" };
            }
          }
          const question = typeof parsed?.question === "string" ? parsed.question : String(value ?? "");
          const answer = typeof parsed?.answer === "string" ? parsed.answer : "";
          const order = typeof parsed?.order === "number" ? parsed.order : index + 1;
          return {
            id,
            question,
            answer,
            order,
          };
        });
        entries.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setFaqs(entries);
      }
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || "Failed to refresh FAQ");
      if (import.meta.env.DEV) {
        console.error("[FaqProvider] Firestore manual refetch error", err);
      }
    } finally {
      setLoading(false);
    }
  }, [faqDoc]);

  const saveFaq = useCallback(
    async (id: string, draft: FaqDraft) => {
      if (!faqDoc) throw new Error("FAQ doc not configured");
      await setDoc(
        faqDoc,
        {
          [id]: {
            question: draft.question,
            answer: draft.answer,
            order: Number(draft.order) || 0,
          },
        },
        { merge: true },
      );
    },
    [faqDoc],
  );

  const removeFaq = useCallback(
    async (id: string) => {
      if (!faqDoc) throw new Error("FAQ doc not configured");
      await updateDoc(faqDoc, { [id]: deleteField() });
    },
    [faqDoc],
  );

  const value = useMemo(
    () => ({ faqs, loading, error, refetch, saveFaq, removeFaq }),
    [faqs, loading, error, refetch, saveFaq, removeFaq],
  );

  return <FaqContext.Provider value={value}>{children}</FaqContext.Provider>;
}

export function useFaq() {
  const ctx = useContext(FaqContext);
  if (!ctx) throw new Error("useFaq must be used within a FaqProvider");
  return ctx;
}
