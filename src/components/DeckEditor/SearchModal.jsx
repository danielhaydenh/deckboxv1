// src/DeckEditor/SearchModal.jsx
import React from 'react';
import {
  Search,
  Plus,
  Minus,
  X,
  Loader2,
  Check,
} from 'lucide-react';

const SearchModal = ({
  isOpen,
  searchQuery,
  setSearchQuery,
  isSearching,
  searchResults,
  performSearch,
  close,
  addCard,
  getAddQty,
  setAddQty,
  getDeckCount,
  showAddConfirmation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0f172a]/95 backdrop-blur-sm p-4 flex flex-col animate-fade-in">
      {showAddConfirmation && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center animate-pop-in">
          <div className="bg-[#1e293b]/90 border border-slate-600 rounded-[15px] px-8 py-6 shadow-2xl flex flex-col items-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3 text-white shadow-lg">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Cards Added!</h3>
          </div>
        </div>
      )}

      <div className="bg-[#1e293b] rounded-[15px] border border-slate-700 flex flex-col h-full overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-700 flex gap-4 items-center bg-[#1e293b]/90 backdrop-blur z-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search (e.g. 'Pikachu', 'types:Fire')"
              className="w-full bg-[#0f172a] border border-slate-700 rounded-[15px] pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-[#2563e8] outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && performSearch()}
              autoFocus
            />
          </div>
          <button
            onClick={performSearch}
            disabled={isSearching}
            className="bg-[#2563e8] hover:bg-blue-500 text-white px-6 py-3 rounded-[15px] font-medium disabled:opacity-50 transition-colors hidden md:block"
          >
            {isSearching ? '...' : 'Search'}
          </button>
          <button
            onClick={close}
            className="p-3 hover:bg-slate-700 rounded-[15px] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#0f172a]/50">
          {isSearching && searchResults.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 flex-col">
              <Loader2 className="w-10 h-10 mb-4 animate-spin opacity-60" />
              <p>Searching for cards...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults.map((card) => {
                const qty = getAddQty(card.id);
                const inDeck = getDeckCount(card.id);
                const isMaxed =
                  card.supertype !== 'Energy' && inDeck >= 4;

                return (
                  <div
                    key={card.id}
                    className="group bg-[#1e293b] rounded-[15px] p-2 border border-slate-800 hover:border-[#2563e8] transition-all flex flex-col"
                  >
                    <div className="relative aspect-[0.7] mb-2 overflow-hidden rounded-[15px] bg-[#0f172a]">
                      <img
                        src={card.images.small}
                        alt={card.name}
                        className="w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity"
                      />
                      {inDeck > 0 && (
                        <div className="absolute top-2 right-2 bg-[#2563e8]/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-[15px] shadow-lg border border-blue-400">
                          In Deck: {inDeck}
                        </div>
                      )}
                    </div>
                    <div className="mt-auto">
                      <h4 className="font-bold text-sm text-slate-200 truncate">
                        {card.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center bg-[#0f172a] rounded-[15px] border border-slate-600">
                          <button
                            onClick={() => setAddQty(card.id, qty - 1)}
                            disabled={isMaxed}
                            className="px-2 py-1.5 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors text-xs disabled:opacity-50 rounded-l-[15px]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-white">
                            {qty}
                          </span>
                          <button
                            onClick={() => setAddQty(card.id, qty + 1)}
                            disabled={isMaxed}
                            className="px-2 py-1.5 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors text-xs disabled:opacity-50 rounded-r-[15px]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => addCard(card, qty)}
                          disabled={isMaxed}
                          className={`flex-1 py-1.5 rounded-[15px] text-xs font-bold shadow transition-colors ${
                            isMaxed
                              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                              : 'bg-[#2563e8] hover:bg-blue-500 text-white'
                          }`}
                        >
                          {isMaxed ? 'Max' : 'Add'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 flex-col">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p>Search for cards to add</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
