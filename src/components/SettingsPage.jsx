// src/components/SettingsPage.jsx
import React, { useState } from 'react';
import { ChevronLeft, Save as SaveIcon } from 'lucide-react';

const SettingsPage = ({ settings, onSave, onBack }) => {
  const [key, setKey] = useState(settings.apiKey || '');
  const [track, setTrack] = useState(settings.trackCollection || false);

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </div>
      <div className="bg-[#1e293b] rounded-[15px] border border-slate-700 p-6 space-y-6">
        <div>
          <label className="block text-sm font-bold text-white mb-2">
            Pokemon TCG API Key
          </label>
          <p className="text-xs text-slate-400 mb-2">
            Optional. Increases search limits. Get one at pokemontcg.io.
          </p>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="e.g. 7113ac06..."
            className="w-full bg-[#0f172a] border border-slate-600 rounded-[15px] px-4 py-2 text-white focus:ring-2 focus:ring-[#2563e8] outline-none font-mono text-sm"
          />
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
          <div>
            <h3 className="font-bold text-white">Track Collection</h3>
            <p className="text-xs text-slate-400">
              Enable 'Owned' counters for cards.
            </p>
          </div>
          <button
            onClick={() => setTrack(!track)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              track ? 'bg-[#2563e8]' : 'bg-slate-700'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                track ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>
        <div className="pt-4 flex justify-end">
          <button
            onClick={() => onSave({ apiKey: key, trackCollection: track })}
            className="bg-[#2563e8] hover:bg-blue-500 text-white px-6 py-2 rounded-[15px] font-bold flex items-center gap-2"
          >
            <SaveIcon className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
