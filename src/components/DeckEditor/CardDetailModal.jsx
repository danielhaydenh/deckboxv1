// src/components/DeckEditor/CardDetailModal.jsx
import React from "react";
import { X } from "lucide-react";
import { COLORS, TYPE_SYMBOLS } from "../../data/constants";

const CardDetailModal = ({ card, onClose }) => {
  if (!card) return null;

  const {
    images,
    name,
    types,
    hp,
    supertype,
    subtypes,
    evolvesFrom,
    abilities,
    attacks,
    weaknesses,
    resistances,
    retreatCost
  } = card;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#1e293b] rounded-[15px] max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 md:p-10 flex items-start justify-center bg-[#0f172a] md:w-1/3 border-b md:border-b-0 md:border-r border-slate-700">
          <img
            src={images?.large || images?.small}
            alt={name}
            className="w-full max-w-[300px] object-contain shadow-lg rounded-[15px]"
          />
        </div>

        <div className="p-6 md:p-10 flex-1 flex flex-col text-slate-200">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-white">
                {name}
                {types?.length > 0 && ` - ${types.join(" / ")}`}
                {hp && ` - ${hp} HP`}
              </h2>
              <p className="text-xl text-slate-400">
                {supertype}
                {subtypes?.length > 0 && ` - ${subtypes.join(" - ")}`}
                {evolvesFrom && ` - Evolves from ${evolvesFrom}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-full text-slate-400 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {abilities?.map((ability, index) => (
              <div key={`ab-${index}`} className="space-y-1">
                <div className="font-bold text-lg text-white">
                  <span className="text-red-400">{ability.type}:</span>{" "}
                  {ability.name}
                </div>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {ability.text}
                </p>
              </div>
            ))}

            {attacks?.map((attack, index) => (
              <div key={`at-${index}`} className="space-y-1">
                <div className="flex items-center flex-wrap gap-2 font-bold text-lg text-white">
                  <div className="flex gap-1">
                    {attack.cost?.map((c, i) => (
                      <div
                        key={i}
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${
                          ["Colorless", "Lightning"].includes(c)
                            ? "text-black"
                            : "text-white"
                        }`}
                        style={{ backgroundColor: COLORS[c] || "#fff" }}
                      >
                        {TYPE_SYMBOLS[c] || c?.charAt(0)}
                      </div>
                    ))}
                  </div>
                  <span>{attack.name}</span>
                  {attack.damage && (
                    <span className="text-slate-200">{attack.damage}</span>
                  )}
                </div>
                <p className="text-slate-400 text-sm">{attack.text}</p>
              </div>
            ))}

            {card.rules &&
              !abilities &&
              !attacks && (
                <div className="text-slate-300 text-sm italic">
                  {card.rules.map((r, i) => (
                    <p key={i} className="mb-2">
                      {r}
                    </p>
                  ))}
                </div>
              )}

            <div className="space-y-2 pt-6 mt-2 text-slate-300 text-base border-t border-slate-700">
              <p>
                <span className="font-bold text-slate-500 inline-block w-28">
                  Weakness:
                </span>{" "}
                {weaknesses && weaknesses.length
                  ? `${weaknesses[0].type} ${weaknesses[0].value || ""}`
                  : "N/A"}
              </p>
              <p>
                <span className="font-bold text-slate-500 inline-block w-28">
                  Resistance:
                </span>{" "}
                {resistances && resistances.length
                  ? `${resistances[0].type} ${resistances[0].value || ""}`
                  : "N/A"}
              </p>
              <p>
                <span className="font-bold text-slate-500 inline-block w-28">
                  Retreat:
                </span>{" "}
                {retreatCost ? retreatCost.length : "0"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailModal;
