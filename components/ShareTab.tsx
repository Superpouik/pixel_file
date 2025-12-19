
import React from 'react';
import { Send, Download, Scan, Wifi, Users } from 'lucide-react';

const ShareTab: React.FC = () => {
  return (
    <div className="space-y-6 pt-2 h-full flex flex-col">
      <div className="bg-[#d3e3fd] p-8 rounded-[2rem] text-center space-y-4">
        <div className="flex justify-center">
          <div className="relative">
            <Send className="w-16 h-16 text-[#041e49]" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full border-2 border-[#d3e3fd] animate-pulse"></div>
          </div>
        </div>
        <h1 className="text-2xl font-medium text-[#041e49]">Nearby Share</h1>
        <p className="text-sm text-[#041e49] opacity-80">
          Fast and offline file sharing with nearby Android devices.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button className="flex flex-col items-center gap-3 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors">
          <div className="p-4 bg-green-50 rounded-2xl">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <span className="font-medium">Send</span>
        </button>
        <button className="flex flex-col items-center gap-3 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors">
          <div className="p-4 bg-blue-50 rounded-2xl">
            <Download className="w-8 h-8 text-blue-600" />
          </div>
          <span className="font-medium">Receive</span>
        </button>
      </div>

      <div className="mt-auto pb-6 space-y-4">
        <h3 className="text-sm font-medium text-gray-600 px-2">Privacy & visibility</h3>
        <div className="bg-[#f3edf7] p-4 rounded-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium">Visible to everyone</p>
              <p className="text-xs text-gray-500">Nearby devices can find you</p>
            </div>
          </div>
          <div className="w-10 h-6 bg-blue-600 rounded-full relative">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareTab;
