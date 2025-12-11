// src/components/firebase/firebase.js

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase initialisation
// These globals come from your host app (for example SB React config)
const firebaseConfig = JSON.parse(__firebase_config);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Per app instance id to namespace user data
const appId = typeof __app_id !== "undefined" ? __app_id : "deckbox-default";

// Re export whatever App.jsx needs
export {
  app,
  auth,
  db,
  appId,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged
};
