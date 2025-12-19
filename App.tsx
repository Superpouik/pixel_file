
import React, { useState, useEffect } from 'react';
import { AppTab, FileItem } from './types.ts';
import BottomNav from './components/BottomNav.tsx';
import BrowseTab from './components/BrowseTab.tsx';
import CleanTab from './components/CleanTab.tsx';
import ShareTab from './components/ShareTab.tsx';
import TopSearchBar from './components/TopSearchBar.tsx';
import { getAllFiles } from './services/fileSystem.ts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.BROWSE);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [files, setFiles] = useState<FileItem[]>([]);

  const refreshFiles = async () => {
    const allFiles = await getAllFiles();
    setFiles(allFiles);
  };

  useEffect(() => {
    refreshFiles();
  }, [activeTab]);

  return (
    <div className="flex flex-col h-[100dvh] max-w-md mx-auto bg-[#fef7ff] relative overflow-hidden safe-area-inset-top safe-area-inset-bottom">
      <div className="px-4 pt-4 pb-2 z-20">
        <TopSearchBar 
          isFocused={isSearchFocused} 
          onFocus={() => setIsSearchFocused(true)} 
          onBlur={() => setIsSearchFocused(false)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <main className="flex-1 overflow-y-auto px-4 pb-24 scroll-smooth">
        {activeTab === AppTab.CLEAN && <CleanTab files={files} onRefresh={refreshFiles} />}
        {activeTab === AppTab.BROWSE && <BrowseTab searchQuery={searchQuery} files={files} onRefresh={refreshFiles} />}
        {activeTab === AppTab.SHARE && <ShareTab />}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
