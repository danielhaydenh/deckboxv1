// src/components/Dashboard.jsx
import React, { useState } from 'react';
import {
  Layers,
  Plus,
  PlayCircle,
  Edit2,
  Save as SaveIcon,
  X,
  Users,
} from 'lucide-react';
import { FORMATS } from '../data/constants.js';

const Dashboard = ({ decks, onCreate, onLoadDemo, onSelect, onUpdate }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newFormat, setNewFormat] = useState('Standard');
  const [editingDeckId, setEditingDeckId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(newName, newFormat);
    setIsCreating(false);
    setNewName('');
  };

  const handleRename = (deckId) => {
    if (editingName.trim()) onUpdate(deckId, { name: editingName.trim() });
    setEditingDeckId(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Your Decks</h1>
          <p className="text-slate-400">Manage and track your playbooks.</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-[#2563e8] hover:bg-blue-500 text-white px-4 py-2 rounded-[15px] font-medium flex items-center gap-2 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" /> New Deck
        </button>
      </div>

      {isCreating && (
        <div className="bg-[#1e293b] p-4 rounded-[15px] border border-slate-700 animate-slide-in">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-4 items-end"
          >
            <div className="flex-1 w-full">
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Deck Name
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., Charizard ex Beatdown"
                className="w-full bg-[#0f172a] border border-slate-700 rounded-[15px] px-3 py-2 text-white focus:ring-2 focus:ring-[#2563e8] outline-none"
                autoFocus
              />
            </div>
            <div className="w-full md:w-48">
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Format
              </label>
              <select
                value={newFormat}
                onChange={(e) => setNewFormat(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-[15px] px-3 py-2 text-white outline-none"
              >
                {FORMATS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-slate-400 hover:text-white rounded-[15px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#2563e8] hover:bg-blue-500 text-white px-6 py-2 rounded-[15px] font-medium"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {decks.length === 0 && !isCreating ? (
        <div className="text-center py-20 bg-[#1e293b]/50 rounded-[15px] border border-dashed border-slate-700">
          <Layers className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-slate-300">No Decks Yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2 mb-6">
            Create your first deck to start tracking your collection and
            building strategies.
          </p>
          <button
            onClick={onLoadDemo}
            className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-[15px] text-sm transition-colors border border-slate-600"
          >
            <PlayCircle className="w-4 h-4" /> Load Demo Deck
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="group bg-[#1e293b] rounded-[15px] border border-slate-700 hover:border-[#2563e8]/50 hover:shadow-xl transition-all cursor-pointer overflow-hidden relative flex flex-col"
            >
              <div
                className="h-24 bg-gradient-to-r from-slate-700 to-slate-800 relative overflow-hidden"
                onClick={() => onSelect(deck)}
              >
                {deck.coverCard ? (
                  <img
                    src={deck.coverCard}
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity"
                    alt="Cover"
                  />
                ) : (
                  <div
                    className="absolute inset-0 opacity-10 bg-repeat space-x-4 space-y-4"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle, #ffffff 1px, transparent 1px)',
                      backgroundSize: '10px 10px',
                    }}
                  ></div>
                )}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-[15px] text-xs font-mono text-slate-300">
                  {deck.format}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div
                  onClick={(e) => {
                    if (editingDeckId === deck.id) e.stopPropagation();
                    else onSelect(deck);
                  }}
                >
                  {editingDeckId === deck.id ? (
                    <div
                      className="flex items-center gap-2 mb-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="bg-[#0f172a] border border-slate-600 rounded-[15px] px-2 py-1 text-sm text-white w-full focus:ring-2 focus:ring-[#2563e8] outline-none"
                        autoFocus
                        onKeyDown={(e) =>
                          e.key === 'Enter' && handleRename(deck.id)
                        }
                      />
                      <button
                        onClick={() => handleRename(deck.id)}
                        className="p-1 hover:bg-green-600 rounded-[15px] text-green-400 hover:text-white"
                      >
                        <SaveIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingDeckId(null)}
                        className="p-1 hover:bg-slate-700 rounded-[15px] text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-white group-hover:text-[#2563e8] transition-colors truncate flex-1">
                        {deck.name}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingDeckId(deck.id);
                          setEditingName(deck.name);
                        }}
                        className="p-1 text-slate-500 hover:text-white hover:bg-slate-700 rounded-[15px] opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />{' '}
                      {deck.cards?.reduce((a, c) => a + c.quantity, 0) || 0}/60
                    </span>
                    <span>•</span>
                    <span className="text-slate-500 text-xs">
                      Updated{' '}
                      {deck.updatedAt?.seconds
                        ? new Date(
                            deck.updatedAt.seconds * 1000
                          ).toLocaleDateString()
                        : 'Just now'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex h-1.5 rounded-full overflow-hidden bg-slate-700">
                  <div
                    style={{
                      width: `${
                        (deck.cards?.filter((c) => c.supertype === 'Pokémon')
                          .length /
                          60) *
                        100
                      }%`,
                    }}
                    className="bg-purple-500"
                  />
                  <div
                    style={{
                      width: `${
                        (deck.cards?.filter((c) => c.supertype === 'Trainer')
                          .length /
                          60) *
                        100
                      }%`,
                    }}
                    className="bg-[#2563e8]"
                  />
                  <div
                    style={{
                      width: `${
                        (deck.cards?.filter((c) => c.supertype === 'Energy')
                          .length /
                          60) *
                        100
                      }%`,
                    }}
                    className="bg-yellow-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
