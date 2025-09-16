import { doc, type DocumentReference } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

function normalisePath(raw: string | undefined): string[] | null {
  if (!raw) return null;
  const segments = raw.split("/").map((part) => part.trim()).filter(Boolean);
  if (segments.length === 0) return null;
  return segments;
}

export function getGlobalsDocRef(db: Firestore): DocumentReference | null {
  const segments = normalisePath(import.meta.env.VITE_FIRESTORE_GLOBALS_DOC as string | undefined);
  if (!segments || segments.length % 2 !== 0) {
    if (import.meta.env.DEV) {
      console.warn("[firestorePaths] Invalid globals doc path", segments);
    }
    return null;
  }
  const [first, ...rest] = segments;
  return doc(db, first, ...rest);
}

export function getFaqDocRef(db: Firestore): DocumentReference | null {
  const segments = normalisePath(import.meta.env.VITE_FIRESTORE_FAQ_DOC as string | undefined);
  if (!segments || segments.length % 2 !== 0) {
    if (import.meta.env.DEV) {
      console.warn("[firestorePaths] Invalid FAQ doc path", segments);
    }
    return null;
  }
  const [first, ...rest] = segments;
  return doc(db, first, ...rest);
}
