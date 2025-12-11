// src/DeckEditor/StatsPanel.jsx
import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ClipboardCopy,
  ClipboardPaste,
  Trash2,
  Edit2,
  Save as SaveIcon,
  CheckCircle,
  Menu,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { COLORS } from '../../data/constants';

const StatsPanel = ({
  deck,
  counts,
  onBack,
  onDelete,
  onCopyDeck,
  onPasteDeck,
  showToast,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileStats, setShowMobileStats] = useState(!isMobile);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameText, setRenameText] = useState(deck.name);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setRenameText(deck.name);
  }, [deck.name]);

  const handleRename = () => {
    if (!renameText.trim()) {
      showToast('Deck name cannot be empty', 'error');
      return;
    }
    deck.onUpdate({ name: renameText.trim() });
    setIsRenaming(false);
  };

  return (
    <div className="w-full md:w-80 flex flex-col gap-6 shrink-0">
      <div className="md:hidden bg-[#1e293b] p-4 rounded-[15px] border border-slate-700 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-[15px] text-slate-400 hover:text-white hover:bg-slate-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white truncate max-w-[150px]">
              {deck.name}
            </h1>
            <span className="text-xs text-slate-400">
              {deck.format} • {counts.total}/60
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowMobileStats(!showMobileStats)}
          className={`p-2 rounded-[15px] transition-colors ${
            showMobileStats
              ? 'bg-[#2563e8] text-white'
              : 'bg-slate-700 text-slate-400'
          }`}
        >
          {showMobileStats ? <ChevronLeft className="rotate-90" /> : <Menu />}
        </button>
      </div>

      <div
        className={`bg-[#1e293b] p-6 rounded-[15px] border border-slate-700 ${
          showMobileStats ? 'block' : 'hidden'
        } md:block`}
      >
        <div className="hidden md:flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        </div>

        <div className="mb-6 hidden md:block">
          {isRenaming ? (
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={renameText}
                onChange={(e) => setRenameText(e.target.value)}
                className="bg-[#0f172a] border border-slate-600 rounded-[15px] px-2 py-1 text-lg font-bold text-white w-full focus:ring-2 focus:ring-[#2563e8] outline-none"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              />
              <button
                onClick={handleRename}
                className="p-1 hover:bg-green-600 rounded-[15px] text-green-400 hover:text-white"
              >
                <SaveIcon className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between group mb-2">
              <h1 className="text-2xl font-bold text-white truncate flex-1 mr-2">
                {deck.name}
              </h1>
              <button
                onClick={() => setIsRenaming(true)}
                className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700 rounded-[15px] opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-slate-700 rounded-[15px] text-xs text-slate-300">
              {deck.format}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded-[15px] ${
                counts.total > 60
                  ? 'bg-red-500/20 text-red-300'
                  : 'bg-yellow-500/20 text-yellow-300'
              }`}
            >
              {counts.total}/60 Cards
            </span>
            {counts.total === 60 && (
              <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded-[15px] flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Legal
              </span>
            )}
          </div>
        </div>

        {(showMobileStats || !isMobile) && (
          <div className="h-48 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Pokémon', value: counts.pokemon },
                    { name: 'Trainer', value: counts.trainer },
                    { name: 'Energy', value: counts.energy },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill={COLORS.Psychic} />
                  <Cell fill={COLORS.Trainer} />
                  <Cell fill={COLORS.Energy} />
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    color: 'white',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: 'white' }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconSize={8}
                  wrapperStyle={{ fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="mt-2 pt-6 border-t border-slate-700 text-center">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Deck Status
          </h3>
          <div
            className={`text-5xl font-extrabold mb-1 ${
              counts.owned >= 60 ? 'text-green-400' : 'text-white'
            }`}
          >
            {counts.owned}
            <span className="text-2xl text-slate-500 font-medium ml-2">
              / 60
            </span>
          </div>
          <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden mt-4">
            <div
              className={`h-full transition-all duration-500 ${
                counts.owned >= 60 ? 'bg-green-500' : 'bg-[#2563e8]'
              }`}
              style={{
                width: `${Math.min(100, (counts.owned / 60) * 100)}%`,
              }}
            ></div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {counts.owned >= 60
              ? 'Deck collection complete.'
              : 'Collect more cards to finish.'}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2">
          <button
            onClick={onPasteDeck}
            className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 rounded-[15px] text-sm transition-colors"
          >
            <ClipboardPaste className="w-4 h-4" /> Paste Deck
          </button>
          <button
            onClick={onCopyDeck}
            className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 rounded-[15px] text-sm transition-colors"
          >
            <ClipboardCopy className="w-4 h-4" /> Copy Deck
          </button>
          <button
            onClick={onDelete}
            className="col-span-2 flex items-center justify-center gap-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 py-2 rounded-[15px] text-sm transition-colors border border-red-900/50 mt-2"
          >
            <Trash2 className="w-4 h-4" /> Delete Deck
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;
