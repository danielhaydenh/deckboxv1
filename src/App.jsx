// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Layers, Settings as SettingsIcon, Loader2 } from 'lucide-react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';

import {
  auth,
  db,
  appId,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from "./components/firebase/firebase";
import { globalStyles } from './data/constants';
import { DEMO_DECK } from './data/demoData';

import Toast from './components/Toast';
import Dashboard from './components/Dashboard';
import SettingsPage from './components/SettingsPage';
import DeckEditor from './components/DeckEditor/DeckEditor';

console.log("Deckbox build v2.8 (direct Pokémon TCG API search)");
console.log("[Config] Pokémon TCG API URL:", "https://api.pokemontcg.io/v2/cards");


export default function DeckBoxApp() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard');
  const [decks, setDecks] = useState([]);
  const [activeDeck, setActiveDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [settings, setSettings] = useState({
    apiKey: '',
    trackCollection: false,
  });

  const showToast = (msg, type = 'success') =>
    setToast({ message: msg, type });
  const closeToast = () => setToast(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (
          typeof __initial_auth_token !== 'undefined' &&
          __initial_auth_token
        ) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error('Auth failed', err);
      }
    };

    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchSettings = async () => {
      try {
        const snap = await getDoc(
          doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'config')
        );
        if (snap.exists()) setSettings(snap.data());
      } catch (e) {
        console.log('No settings yet');
      }
    };
    fetchSettings();

    const q = query(
      collection(db, 'artifacts', appId, 'users', user.uid, 'decks')
    );
    const unsubDecks = onSnapshot(
      q,
      (snapshot) => {
        const deckList = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setDecks(deckList);
      },
      () => {
        showToast('Could not load decks', 'error');
      }
    );

    return () => unsubDecks();
  }, [user]);

  const handleCreateDeck = async (name, format) => {
    if (!name) return showToast('Deck name required', 'error');
    try {
      const newDeck = {
        name,
        format,
        cards: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        coverCard: null,
      };
      const docRef = await addDoc(
        collection(db, 'artifacts', appId, 'users', user.uid, 'decks'),
        newDeck
      );
      setActiveDeck({ id: docRef.id, ...newDeck });
      setView('deck');
      showToast('Deck created!');
    } catch (err) {
      showToast('Failed to create deck', 'error');
    }
  };

  const handleCreateDemoDeck = async () => {
    if (!user) return;
    try {
      const newDeck = {
        ...DEMO_DECK,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      const docRef = await addDoc(
        collection(db, 'artifacts', appId, 'users', user.uid, 'decks'),
        newDeck
      );
      setActiveDeck({ id: docRef.id, ...newDeck });
      setView('deck');
      showToast('Demo deck loaded!');
    } catch (err) {
      showToast('Failed to create demo deck', 'error');
    }
  };

  const handleDeleteDeck = async (deckId) => {
    if (!window.confirm('Are you sure you want to delete this deck?')) return;
    try {
      await deleteDoc(
        doc(db, 'artifacts', appId, 'users', user.uid, 'decks', deckId)
      );
      if (activeDeck?.id === deckId) {
        setActiveDeck(null);
        setView('dashboard');
      }
      showToast('Deck deleted');
    } catch (err) {
      showToast('Delete failed', 'error');
    }
  };

  const handleUpdateDeck = async (deckId, data) => {
    try {
      await updateDoc(
        doc(db, 'artifacts', appId, 'users', user.uid, 'decks', deckId),
        {
          ...data,
          updatedAt: serverTimestamp(),
        }
      );
      setActiveDeck((prev) =>
        prev && prev.id === deckId ? { ...prev, ...data } : prev
      );
    } catch (err) {
      showToast('Update failed', 'error');
    }
  };

  const saveSettings = async (newSettings) => {
    if (!user) return;
    try {
      await setDoc(
        doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'config'),
        newSettings,
        { merge: true }
      );
      setSettings(newSettings);
      showToast('Settings saved');
    } catch (e) {
      showToast('Failed to save settings', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-[#2563e8]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans pb-20 md:pb-0">
      <style>{globalStyles}</style>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      <nav className="border-b border-slate-700 bg-[#0f172a]/95 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setView('dashboard')}
          >
            <div className="bg-[#2563e8] p-1.5 rounded-[15px]">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">DeckBox</span>
          </div>
          <div className="flex items-center gap-4">
            {view !== 'dashboard' && (
              <button
                onClick={() => setView('dashboard')}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                My Decks
              </button>
            )}
            <button
              onClick={() => setView('settings')}
              className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-[#1e293b] transition-all"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2563e8] to-purple-500 flex items-center justify-center text-xs font-bold">
              {user ? user.uid.slice(0, 2).toUpperCase() : '??'}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {view === 'dashboard' && (
          <Dashboard
            decks={decks}
            onCreate={handleCreateDeck}
            onLoadDemo={handleCreateDemoDeck}
            onSelect={(deck) => {
              setActiveDeck(deck);
              setView('deck');
            }}
            onUpdate={handleUpdateDeck}
          />
        )}
        {view === 'deck' && activeDeck && (
          <DeckEditor
            deck={activeDeck}
            onUpdate={(data) => handleUpdateDeck(activeDeck.id, data)}
            onDelete={() => handleDeleteDeck(activeDeck.id)}
            onBack={() => setView('dashboard')}
            showToast={showToast}
            apiKey={settings.apiKey}
          />
        )}
        {view === 'settings' && (
          <SettingsPage
            settings={settings}
            onSave={saveSettings}
            onBack={() => setView('dashboard')}
          />
        )}
      </main>
    </div>
  );
}