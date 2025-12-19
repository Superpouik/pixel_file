
import React from 'react';
import { AppTab } from '../types';
import { Sparkles, FolderSearch, Share2 } from 'lucide-react';

interface BottomNavProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: AppTab.CLEAN, label: 'Clean', icon: Sparkles },
    { id: AppTab.BROWSE, label: 'Browse', icon: FolderSearch },
    { id: AppTab.SHARE, label: 'Share', icon: Share2 },
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 h-20 bg-[#f7f2fa] flex items-center justify-around px-2 border-t border-gray-100">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex flex-col items-center gap-1 group w-20"
          >
            <div className={`
              px-5 py-1 rounded-full transition-all duration-200
              ${isActive ? 'bg-[#e8def8] text-[#1d192b]' : 'text-[#49454f] group-hover:bg-gray-200'}
            `}>
              <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} />
            </div>
            <span className={`text-xs font-medium ${isActive ? 'text-[#1d192b]' : 'text-[#49454f]'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
