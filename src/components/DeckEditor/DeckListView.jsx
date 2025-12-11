// src/components/DeckEditor/DeckListView.jsx
import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { COLORS, TYPE_SYMBOLS } from "../../data/constants";

const DeckListView = ({
  deck,
  counts,
  listSubTab,
  setListSubTab,
  setShowSearchModal,
  updateCardQuantity,
  removeCard,
  setSelectedCard
}) => {
  const typeOrder = { Pokémon: 1, Trainer: 2, Energy: 3 };

  const getFilteredCards = () => {
    if (!deck?.cards) return [];

    if (listSubTab === "All") {
      const sorted = [...deck.cards].sort((a, b) => {
        const scoreA = typeOrder[a.supertype] || 99;
        const scoreB = typeOrder[b.supertype] || 99;
        if (scoreA !== scoreB) return scoreA - scoreB;
        return a.name.localeCompare(b.name);
      });
      return sorted;
    }

    return deck.cards.filter((c) => c.supertype === listSubTab);
  };

  const cardsToShow = getFilteredCards();

  return (
    <div className="flex-1 bg-[#1e293b] rounded-[15px] border border-slate-700 flex flex-col overflow-hidden">
      <div className="flex border-b border-slate-700">
        <button
          className="px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 border-[#2563e8] text-white"
          type="button"
        >
          Deck List
        </button>
      </div>

      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-700 bg-[#1e293b]/90 backdrop-blur z-10 shrink-0 overflow-x-auto custom-scrollbar">
        {["Pokémon", "Trainer", "Energy", "All"].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setListSubTab(type)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
              listSubTab === type
                ? "bg-[#2563e8] text-white shadow-lg shadow-blue-900/20"
                : "bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white"
            }`}
          >
            {type === "Trainer" ? "Trainers" : type === "All" ? "Full Deck" : type}
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                listSubTab === type
                  ? "bg-blue-500 text-white"
                  : "bg-slate-800 text-slate-500"
              }`}
            >
              {type === "Pokémon"
                ? counts.pokemon
                : type === "Trainer"
                ? counts.trainer
                : type === "Energy"
                ? counts.energy
                : counts.total}
            </span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowSearchModal(true)}
          className="ml-auto px-4 py-1.5 bg-[#2563e8] hover:bg-blue-500 text-white rounded-full text-xs font-medium flex items-center gap-1 shadow-lg transition-colours whitespace-nowrap"
        >
          <Plus className="w-3 h-3" /> Add Card
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar relative">
        <div className="space-y-2 animate-fade-in pb-20">
          {cardsToShow.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500">No cards in this section.</p>
              <button
                type="button"
                onClick={() => setShowSearchModal(true)}
                className="mt-4 text-blue-400 hover:underline"
              >
                Find Cards
              </button>
            </div>
          ) : (
            cardsToShow.map((card) => (
              <div
                key={card.id}
                className="group bg-[#0f172a]/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-[#2563e8]/30 rounded-[15px] p-4 flex flex-row items-start gap-4 transition-all"
              >
                <div className="shrink-0">
                  <img
                    src={card.images?.small}
                    alt={card.name}
                    className="w-32 h-44 object-contain rounded bg-slate-800 cursor-pointer hover:scale-105 transition-transform shadow-lg"
                    onClick={() => setSelectedCard(card)}
                  />
                </div>

                <div className="flex-1 flex flex-col min-h-[11rem] min-w-0 relative">
                  <div className="pr-10 mb-2">
                    <div
                      className="cursor-pointer"
                      onClick={() => setSelectedCard(card)}
                    >
                      <h4 className="font-bold text-xl text-white leading-tight truncate">
                        {card.name}
                      </h4>
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-1">
                      <span className="uppercase">
                        {typeof card.set === "string"
                          ? card.set
                          : card.set.ptcgoCode || card.set.id}{" "}
                        {card.number}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4 pr-10">
                    {card.abilities?.map((ability, index) => (
                      <div key={`ab-${index}`} className="text-sm">
                        <div className="font-bold text-slate-200 flex items-centre gap-2">
                          <span className="text-red-400 text-[10px] uppercase tracking-wider border border-red-400/30 px-1 rounded">
                            {ability.type}
                          </span>
                          {ability.name}
                        </div>
                        <p className="text-xs text-slate-400 leading-snug mt-0.5">
                          {ability.text}
                        </p>
                      </div>
                    ))}

                    {card.attacks?.map((attack, index) => (
                      <div key={`at-${index}`} className="text-sm">
                        <div className="flex items-centre gap-2 flex-wrap font-bold text-slate-200">
                          <div className="flex gap-0.5">
                            {attack.cost?.map((c, i) => (
                              <div
                                key={i}
                                className={`w-3.5 h-3.5 rounded-full flex items-centre justify-centre text-[7px] font-bold shadow-sm ${
                                  ["Colorless", "Lightning"].includes(c)
                                    ? "text-black"
                                    : "text-white"
                                }`}
                                style={{
                                  backgroundColor: COLORS[c] || "#fff"
                                }}
                              >
                                {TYPE_SYMBOLS[c] || c?.charAt(0)}
                              </div>
                            ))}
                          </div>
                          <span>{attack.name}</span>
                          {attack.damage && (
                            <span className="text-slate-400">
                              {attack.damage}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 leading-snug mt-0.5">
                          {attack.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeCard(card.id)}
                    className="absolute top-0 right-0 p-2 text-slate-600 hover:text-red-400 hover:bg-red-900/20 rounded-[15px] transition-colours"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="mt-auto flex flex-col items-end gap-3 pt-4 border-t border-slate-700/50">
                    <div className="flex items-centre gap-3">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                        List
                      </span>
                      <div className="flex items-centre bg-[#1e293b] rounded-[15px] border border-slate-600 shadow-sm">
                        <button
                          type="button"
                          onClick={() => updateCardQuantity(card.id, -1, "quantity")}
                          className="w-8 h-8 flex items-centre justify-centre hover:bg-slate-700 text-slate-400 hover:text-white transition-colours rounded-l-[15px] text-base font-bold"
                        >
                          -
                        </button>
                        <span className="w-8 text-centre text-base font-bold text-white">
                          {card.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCardQuantity(card.id, 1, "quantity")}
                          className="w-8 h-8 flex items-centre justify-centre hover:bg-slate-700 text-slate-400 hover:text-white transition-colours rounded-r-[15px] text-base font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-centre gap-3">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                        Owned
                      </span>
                      <div className="flex items-centre bg-[#1e293b] rounded-[15px] border border-slate-600 shadow-sm">
                        <button
                          type="button"
                          onClick={() => updateCardQuantity(card.id, -1, "owned")}
                          className="w-8 h-8 flex items-centre justify-centre hover:bg-slate-700 text-slate-400 hover:text-white transition-colours rounded-l-[15px] text-base font-bold"
                        >
                          -
                        </button>
                        <span
                          className={`w-8 text-centre text-base font-bold ${
                            card.owned < card.quantity
                              ? "text-yellow-500"
                              : "text-green-500"
                          }`}
                        >
                          {card.owned}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCardQuantity(card.id, 1, "owned")}
                          className="w-8 h-8 flex items-centre justify-centre hover:bg-slate-700 text-slate-400 hover:text-white transition-colours rounded-r-[15px] text-base font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DeckListView;
