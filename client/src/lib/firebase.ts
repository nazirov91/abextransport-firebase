import { FirebaseApp, FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

type FirebaseConfigKeys =
  | "apiKey"
  | "authDomain"
  | "projectId"
  | "storageBucket"
  | "messagingSenderId"
  | "appId"
  | "measurementId";

type EnvConfig = Partial<Record<FirebaseConfigKeys, string>>;

function readFirebaseConfig(): EnvConfig {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };
}

function hasRequiredConfig(config: EnvConfig): config is FirebaseOptions {
  return Boolean(config.apiKey && config.authDomain && config.projectId && config.appId);
}

let firebaseApp: FirebaseApp | null = null;
let firestore: Firestore | null = null;
let auth: Auth | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (firebaseApp) return firebaseApp;
  const config = readFirebaseConfig();
  if (!hasRequiredConfig(config)) {
    if (import.meta.env.DEV) {
      console.warn("[firebase] Missing required Firebase config env vars");
    }
    return null;
  }
  firebaseApp = getApps().length ? getApp() : initializeApp(config);
  firestore = getFirestore(firebaseApp);
  auth = getAuth(firebaseApp);
  return firebaseApp;
}

export function getFirestoreClient(): Firestore | null {
  return getFirebaseApp() ? firestore : null;
}

export function getAuthClient(): Auth | null {
  return getFirebaseApp() ? auth : null;
}
