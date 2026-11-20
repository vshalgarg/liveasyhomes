import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

function clean(raw) {
  if (raw == null) return "";
  // Strip quotes/commas from pasted Firebase console values
  return String(raw)
    .trim()
    .replace(/^['"]+|['",]+$/g, "")
    .trim();
}

// NEXT_PUBLIC_* must be referenced statically so Next.js inlines them in the client bundle.
const firebaseConfig = {
  apiKey: clean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: clean(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: clean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: clean(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: clean(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: clean(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
};

export function isFirebaseConfigured() {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.appId
  );
}

export function getFirebaseApp() {
  if (typeof window === "undefined") {
    throw new Error("Firebase Auth is only available in the browser.");
  }
  if (!isFirebaseConfigured()) {
    throw new Error(
      "Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* env vars."
    );
  }
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}
