// src/components/DeckEditor/DeckEditor.jsx
import React, { useState, useMemo, useRef } from 'react';
import { Loader2 } from 'lucide-react';

import {
  DEFAULT_API_KEY,
  POKEMON_TCG_API_URL,
} from "../../data/constants";

import { DEMO_SEARCH_RESULTS } from '../../data/demoData';

import StatsPanel from './StatsPanel';
import SearchModal from './SearchModal';
import DeckListView from './DeckListView';
import CardDetailModal from './CardDetailModal';

const PAGE_SIZE = 10; // smaller = faster responses


const DeckEditor = ({deck, onUpdate, onDelete, onBack, showToast, apiKey }) => {
  const [activeTab] = useState('list');
  const [listSubTab, setListSubTab] = useState('Pokémon');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [addQuantities, setAddQuantities] = useState({});
  const [showSearchModal, setShowSearchModal] = useState(false);

  const [importState, setImportState] = useState({
    active: false,
    progress: 0,
    total: 0,
    currentCard: '',
  });

  const [showManualPaste, setShowManualPaste] = useState(false);
  const [manualPasteText, setManualPasteText] = useState('');
  const [showAddConfirmation, setShowAddConfirmation] = useState(false);

  // New refs
  const searchCache = useRef(new Map());      // cache query -> card list
  const abortRef = useRef(null);             // track the current fetch

  const counts = useMemo(() => {
    const c = { pokemon: 0, trainer: 0, energy: 0, total: 0, owned: 0 };
    if (deck && deck.cards) {
      deck.cards.forEach((card) => {
        c.total += card.quantity;
        c.owned += card.owned || 0;
        if (card.supertype === 'Pokémon') c.pokemon += card.quantity;
        else if (card.supertype === 'Trainer') c.trainer += card.quantity;
        else if (card.supertype === 'Energy') c.energy += card.quantity;
      });
    }
    return c;
  }, [deck]);

  const getAddQty = (cardId) => addQuantities[cardId] || 1;

  const setAddQty = (cardId, qty) =>
    setAddQuantities((prev) => ({
      ...prev,
      [cardId]: Math.max(1, Math.min(4, qty)),
    }));

  const getDeckCount = (cardId) =>
    deck.cards.find((c) => c.id === cardId)?.quantity || 0;

  const addCard = (card, specificQty) => {
    const existing = deck.cards.find((c) => c.id === card.id);
    let newCards;
    const qtyToAdd = specificQty || 1;

    const cardSet =
      typeof card.set === 'string'
        ? card.set
        : card.set.ptcgoCode || card.set.id;

    const cardToAdd = {
      id: card.id,
      name: card.name,
      supertype: card.supertype,
      subtypes: card.subtypes,
      images: card.images,
      types: card.types,
      set: cardSet,
      number: card.number,
      rarity: card.rarity,
      quantity: qtyToAdd,
      owned: 0,
    };

    if (existing) {
      if (
        existing.quantity + qtyToAdd > 4 &&
        card.supertype !== 'Energy' &&
        !specificQty
      ) {
        showToast('Max 4 copies allowed (except Basic Energy)', 'error');
        return;
      }
      newCards = deck.cards.map((c) =>
        c.id === card.id ? { ...c, quantity: c.quantity + qtyToAdd } : c
      );
    } else {
      newCards = [...deck.cards, cardToAdd];
    }

    const updates = { cards: newCards };
    if (!deck.coverCard && card.supertype === 'Pokémon') {
      updates.coverCard = card.images.small;
    }

    onUpdate(updates);

    if (specificQty && showSearchModal) {
      setShowAddConfirmation(true);
      setTimeout(() => setShowAddConfirmation(false), 1500);
    } else if (!specificQty) {
      showToast(`Added ${card.name}`);
    }
  };

  const updateCardQuantity = (cardId, delta, type = 'quantity') => {
    const newCards = deck.cards
      .map((c) => {
        if (c.id !== cardId) return c;

        if (type === 'owned') {
          const newOwned = Math.max(0, Math.min(c.quantity, c.owned + delta));
          return { ...c, owned: newOwned };
        }

        const newQty = Math.max(0, c.quantity + delta);
        return {
          ...c,
          quantity: newQty,
          owned: Math.min(c.owned, newQty),
        };
      })
      .filter((c) => c.quantity > 0);

    onUpdate({ cards: newCards });
  };

  const removeCard = (cardId) => {
    onUpdate({ cards: deck.cards.filter((c) => c.id !== cardId) });
  };

  const fallbackCopy = (text) => {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('Deck copied!');
    } catch (e) {
      showToast('Failed to copy', 'error');
    }
    document.body.removeChild(ta);
  };

  const handleCopyDeck = () => {
    const lines = [];
    ['Pokémon', 'Trainer', 'Energy'].forEach((type) => {
      const typeCards = deck.cards.filter((c) => c.supertype === type);
      if (typeCards.length > 0) {
        lines.push(
          `${type}: ${typeCards.reduce((a, c) => a + c.quantity, 0)}`
        );
        typeCards.forEach((c) =>
          lines.push(`${c.quantity} ${c.name} ${c.set} ${c.number}`)
        );
        lines.push('');
      }
    });

    const text = lines.join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => showToast('Deck copied!'))
        .catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  };

  const processImportText = async (text) => {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && /^\d+/.test(l));

    if (!lines.length) {
      showToast("Invalid deck format", "error");
      return;
    }

    setImportState({
      active: true,
      progress: 0,
      total: lines.length,
      currentCard: "Starting...",
    });

    const keyToUse = apiKey || DEFAULT_API_KEY;
    const headers = keyToUse ? { "X-Api-Key": keyToUse } : {};
    const selectFields =
      "id,name,images,supertype,subtypes,types,set,number,rarity,hp,evolvesFrom,abilities,attacks,weaknesses,resistances,retreatCost,regulationMark,rules";

    try {
      for (let i = 0; i < lines.length; i += 1) {
        const line = lines[i];
        const match = line.match(
          /^(\d+)\s+(.+?)\s+([A-Z0-9]{3,5})\s+(\d+)\s*$/i
        );

        if (!match) {
          console.warn("Line did not match deck pattern:", line);
          continue;
        }

        const qty = parseInt(match[1], 10);
        const name = match[2];
        const setCode = match[3];
        const number = match[4];

        setImportState((prev) => ({
          ...prev,
          progress: i + 1,
          currentCard: name,
        }));

        try {
          const baseUrl = `${POKEMON_TCG_API_URL}?select=${selectFields}`;
          let query = `set.ptcgoCode:"${setCode}" number:"${number}"`;
          let res = await fetch(
            `${baseUrl}&q=${encodeURIComponent(query)}`,
            { headers }
          );
          let data = await res.json();

          // Fallback to set.id if ptcgoCode fails
          if (!data.data || !data.data.length) {
            query = `set.id:"${setCode.toLowerCase()}" number:"${number}"`;
            res = await fetch(
              `${baseUrl}&q=${encodeURIComponent(query)}`,
              { headers }
            );
            data = await res.json();
          }

          if (data.data && data.data.length) {
            addCard(data.data[0], qty);
          } else {
            console.warn("Could not resolve card from line:", line);
          }
        } catch (innerErr) {
          console.error(`Failed to import card from line: "${line}"`, innerErr);
        }
      }

      showToast("Import complete");
    } catch (err) {
      console.error("Import failed:", err);
      showToast("Import failed", "error");
    } finally {
      setImportState({
        active: false,
        progress: 0,
        total: 0,
        currentCard: "",
      });
    }
  };

  const handlePasteDeck = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text || !text.trim()) {
        setShowManualPaste(true);
        return;
      }
      processImportText(text);
    } catch (err) {
      console.warn("Could not read clipboard, falling back to manual paste", err);
      setShowManualPaste(true);
    }
  };


  const buildSearchQuery = (rawName, format) => {
    const trimmed = rawName.trim();
    const base = trimmed.includes(":") ? trimmed : `name:"${trimmed}*"`;

    if (format === "Standard") {
      return `${base} (regulationMark:"G" OR regulationMark:"H" OR regulationMark:"I")`;
    }

    return base;
  };


  const performSearch = async () => {
    const raw = searchQuery.trim();
    if (!raw) return;

    const lower = raw.toLowerCase();
  
    // Demo shortcut
    if (lower === "demo" || lower === "test") {
      setSearchResults(DEMO_SEARCH_RESULTS);
      showToast("Loaded demo cards", "success");
      return;
    }

    const rawQuery = buildSearchQuery(searchQuery, deck.format);

    // Use cached result if we have one
    if (searchCache.current.has(rawQuery)) {
      setSearchResults(searchCache.current.get(rawQuery));
      return;
    }
  
    // Cancel previous in flight search
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;
  
    setIsSearching(true);
  
    const keyToUse = apiKey || DEFAULT_API_KEY;
    const headers = keyToUse ? { "X-Api-Key": keyToUse } : {};
    const selectFields =
      "id,name,images,supertype,subtypes,types,set,number,rarity,hp,evolvesFrom,abilities,attacks,weaknesses,resistances,retreatCost,regulationMark,rules";

    try {
      const q = encodeURIComponent(rawQuery);

      const url = `/api/pokemontcg?q=${q}&pageSize=10&select=${selectFields}&orderBy=-set.releaseDate,-number`;

      console.log("[Search] Requesting:", url);
  
      let res = await fetch(url, {
        headers,
        signal: controller.signal,
      });
  
      // If auth problem with key, retry without it
      if (res.status === 401 || res.status === 403) {
        console.warn("[Search] API key issue", res.status);
        res = await fetch(url, { signal: controller.signal });
      }
  
      if (!res.ok) {
        const text = await res.text();
        console.error("[Search] HTTP error", res.status, text);
        showToast("Search failed", "error");
        return;
      }
  
      const data = await res.json();
      console.log("[Search] Response data:", data);

      const cards = data.data || [];

      // Cache result
      searchCache.current.set(rawQuery, cards);
      setSearchResults(cards);
  
      if (!cards.length) {
        showToast("No cards found", "success");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        // Expected when typing fast, ignore
        return;
      }
      console.error("[Search] Exception", err);
      showToast("Search failed", "error");
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
      setIsSearching(false);
    }
  };
  



  return (
    <div className="h-[calc(100vh-64px)] md:h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6 animate-fade-in relative">
      {importState.active && (
        <div className="fixed inset-0 z-50 bg-[#0f172a]/90 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-[#1e293b] p-8 rounded-[15px] border border-slate-700 shadow-2xl max-w-sm w-full text-center">
            <Loader2 className="w-12 h-12 text-[#2563e8] animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Importing...</h3>
            <div className="w-full bg-[#0f172a] h-2 rounded-full overflow-hidden mb-2">
              <div
                className="bg-[#2563e8] h-full transition-all duration-300"
                style={{
                  width: `${
                    importState.total > 0
                      ? (importState.progress / importState.total) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
            <p className="text-xs text-slate-500">
              {importState.progress} / {importState.total} - Found{' '}
              {importState.currentCard}
            </p>
          </div>
        </div>
      )}

      {showManualPaste && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm p-4">
          <div className="bg-[#1e293b] p-6 rounded-[15px] border border-slate-700 shadow-2xl max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-2">
              Paste Deck List
            </h3>
            <textarea
              className="w-full h-40 bg-[#0f172a] border border-slate-600 rounded-[15px] p-2 text-xs text-white font-mono mb-4"
              value={manualPasteText}
              onChange={(e) => setManualPasteText(e.target.value)}
              placeholder="4 Gimmighoul SSP 97..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowManualPaste(false)}
                className="px-4 py-2 text-slate-400 hover:text-white rounded-[15px]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowManualPaste(false);
                  processImportText(manualPasteText);
                }}
                className="bg-[#2563e8] hover:bg-blue-500 text-white px-4 py-2 rounded-[15px]"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}

      <StatsPanel
        deck={deck}
        counts={counts}
        onBack={onBack}
        onDelete={onDelete}
        onCopyDeck={handleCopyDeck}
        onPasteDeck={handlePasteDeck}
        showToast={showToast}
      />

      {activeTab === 'list' && (
        <DeckListView
          deck={deck}
          counts={counts}
          listSubTab={listSubTab}
          setListSubTab={setListSubTab}
          setShowSearchModal={setShowSearchModal}
          updateCardQuantity={updateCardQuantity}
          removeCard={removeCard}
          setSelectedCard={setSelectedCard}
        />
      )}

      <SearchModal
        isOpen={showSearchModal}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isSearching={isSearching}
        searchResults={searchResults}
        performSearch={performSearch}
        close={() => setShowSearchModal(false)}
        addCard={addCard}
        getAddQty={getAddQty}
        setAddQty={setAddQty}
        getDeckCount={getDeckCount}
        showAddConfirmation={showAddConfirmation}
      />

          {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
};

export default DeckEditor;

