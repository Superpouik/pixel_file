
import React, { useState, useMemo } from 'react';
import { Trash2, Smartphone, Archive, FileImage, CheckCircle2, Loader2 } from 'lucide-react';
import { FileItem } from '../types';

interface CleanTabProps {
  files: FileItem[];
  onRefresh: () => void;
}

const CleanTab: React.FC<CleanTabProps> = ({ files, onRefresh }) => {
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleaned, setCleaned] = useState(false);

  const totalUsedSize = useMemo(() => {
    const total = files.reduce((acc, f) => acc + parseFloat(f.size), 0);
    return total.toFixed(1);
  }, [files]);

  const handleClearJunk = () => {
    setIsCleaning(true);
    setTimeout(() => {
      setIsCleaning(false);
      setCleaned(true);
      setTimeout(() => setCleaned(false), 3000);
    }, 2500);
  };

  return (
    <div className="space-y-6 pt-2 animate-fade-in">
      <div className="bg-[#f3edf7] p-8 rounded-[2.5rem] flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 relative">
          <Smartphone className={`w-12 h-12 text-blue-500 ${isCleaning ? 'animate-bounce' : ''}`} />
          {cleaned && (
            <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 animate-bounce">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          )}
        </div>
        <h1 className="text-2xl font-medium mb-1">{isCleaning ? 'Cleaning...' : 'Storage'}</h1>
        <p className="text-sm text-gray-500">{totalUsedSize} MB of local files managed</p>
        <div className="mt-4 w-full h-2 bg-white/50 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${Math.min(parseFloat(totalUsedSize) / 10, 100)}%` }}></div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-medium text-gray-600 px-2">Suggestions</h2>
        
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-blue-50 rounded-2xl h-fit">
            <Trash2 className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium">Delete app cache</h3>
            <p className="text-xs text-gray-500 mb-4">Clears 1.2 GB of temporary system files</p>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Recommended</span>
              <button 
                onClick={handleClearJunk}
                disabled={isCleaning}
                className="text-sm font-medium text-blue-600 bg-[#d3e3fd] px-6 py-2 rounded-full active:scale-95 transition-all"
              >
                {isCleaning ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Clear'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex gap-4 opacity-50 grayscale">
          <div className="p-3 bg-pink-50 rounded-2xl h-fit">
            <FileImage className="w-6 h-6 text-pink-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium">Duplicate files</h3>
            <p className="text-xs text-gray-500 mb-4">No duplicates found currently</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanTab;
