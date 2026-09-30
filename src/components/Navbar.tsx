import React from 'react';
import { 
  Network, 
  Layers, 
  Package as PackageIcon, 
  Truck, 
  BarChart3, 
  RotateCcw, 
  BookOpen, 
  RefreshCw 
} from 'lucide-react';
import { UndoAction } from '../types';

export type ActiveTab = 'map' | 'dsa' | 'packages' | 'fleet' | 'stats';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  undoStackSize: number;
  lastUndoAction?: UndoAction;
  onUndo: () => void;
  onOpenGuide: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  undoStackSize,
  lastUndoAction,
  onUndo,
  onOpenGuide,
  onResetData,
}) => {
  const navItems = [
    { id: 'map' as ActiveTab, label: 'Network & Map', icon: Network },
    { id: 'dsa' as ActiveTab, label: 'DSA Visualizer Lab', icon: Layers },
    { id: 'packages' as ActiveTab, label: 'Package Registry', icon: PackageIcon },
    { id: 'fleet' as ActiveTab, label: 'Fleet & Dispatch', icon: Truck },
    { id: 'stats' as ActiveTab, label: 'Metrics & Stats', icon: BarChart3 },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md">
              <Network className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  PACKAGE DELIVERY
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  DSA OPTIMIZER
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Weighted Graph • Dijkstra • Min-Heap • Hash Map • Vector • Stack
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            {/* Undo Stack Button */}
            <button
              onClick={onUndo}
              disabled={undoStackSize === 0}
              title={
                undoStackSize > 0
                  ? `Pop Undo Stack: ${lastUndoAction?.description || 'Last Action'}`
                  : 'Undo Stack is empty'
              }
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                undoStackSize > 0
                  ? 'bg-slate-800 text-amber-400 border-amber-500/40 hover:bg-slate-700'
                  : 'bg-slate-800/50 text-slate-500 border-slate-700/40 cursor-not-allowed'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Undo</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  undoStackSize > 0 ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-700 text-slate-500'
                }`}
              >
                {undoStackSize}
              </span>
            </button>

            {/* DSA Academic Reference */}
            <button
              onClick={onOpenGuide}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-indigo-300 border border-indigo-500/30 hover:bg-slate-700 hover:text-indigo-200 transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">DSA Theory</span>
            </button>

            {/* Reset Network Data */}
            <button
              onClick={onResetData}
              title="Reset to default seed network data"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex overflow-x-auto space-x-1 py-2 border-t border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
