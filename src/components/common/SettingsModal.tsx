import React from 'react';
import { 
  X, 
  Settings as SettingsIcon, 
  Gauge, 
  RotateCcw, 
  Sliders, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Sparkles,
  Zap
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trafficMultiplier: number;
  onChangeTrafficMultiplier: (val: number) => void;
  animationSpeedMs: number;
  onChangeAnimationSpeed: (ms: number) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onResetAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  trafficMultiplier,
  onChangeTrafficMultiplier,
  animationSpeedMs,
  onChangeAnimationSpeed,
  isDarkMode,
  onToggleDarkMode,
  onResetAllData,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div onClick={onClose} className="fixed inset-0 -z-10" />

      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-cyan-400 flex items-center justify-center shadow-xs">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Platform Settings</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Simulation parameters and environmental controls</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Traffic Multiplier */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Gauge className="w-4 h-4 text-cyan-500" />
                <label className="text-xs font-bold text-slate-900 dark:text-white">
                  Global Traffic Delay Multiplier
                </label>
              </div>
              <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">
                {trafficMultiplier.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={trafficMultiplier}
              onChange={e => onChangeTrafficMultiplier(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0.5x (Light Traffic)</span>
              <span>1.0x (Standard)</span>
              <span>3.0x (Severe Rush Hour)</span>
            </div>
          </div>

          {/* Visualization Speed */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-blue-500" />
                <label className="text-xs font-bold text-slate-900 dark:text-white">
                  Algorithm Animation Pace
                </label>
              </div>
              <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                {animationSpeedMs} ms
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Fast (200ms)', ms: 200 },
                { label: 'Normal (500ms)', ms: 500 },
                { label: 'Deliberate (1000ms)', ms: 1000 },
              ].map(opt => (
                <button
                  key={opt.ms}
                  onClick={() => onChangeAnimationSpeed(opt.ms)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                    animationSpeedMs === opt.ms
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Mode Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center space-x-3">
              {isDarkMode ? <Moon className="w-5 h-5 text-cyan-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Interface Theme</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isDarkMode ? 'Dark Navy Logistics High-Contrast' : 'Clean Light Logistics Minimal'}
                </p>
              </div>
            </div>
            <button
              onClick={onToggleDarkMode}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              Toggle Mode
            </button>
          </div>

          {/* Reset All Data to Initial Demo State */}
          <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-rose-900 dark:text-rose-200">Reset Demo Data</p>
              <p className="text-[11px] text-rose-700 dark:text-rose-400">
                Restore all default nodes, roads, vehicles, and test packages.
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all network nodes, roads, and packages to default?')) {
                  onResetAllData();
                  onClose();
                }
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-700 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
