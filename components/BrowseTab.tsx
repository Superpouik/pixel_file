
import React, { useState, useMemo, useRef } from 'react';
import { 
  Image as ImageIcon, Video, Music, FileText, Download, Box, 
  HardDrive, Plus, ChevronRight, Server, Lock, ArrowLeft, UploadCloud, FolderOpen
} from 'lucide-react';
import { Category, FileItem } from '../types.ts';
import AddServerModal from './AddServerModal.tsx';
import FileListView from './FileListView.tsx';
import { saveFile } from '../services/fileSystem.ts';

// Added missing interface for BrowseTab props
interface BrowseTabProps {
  searchQuery: string;
  files: FileItem[];
  onRefresh: () => void;
}

const categories: Category[] = [
  { id: 'downloads', name: 'Téléchargements', icon: <Download className="w-6 h-6 text-blue-600" />, color: 'bg-blue-100' },
  { id: 'images', name: 'Images', icon: <ImageIcon className="w-6 h-6 text-pink-600" />, color: 'bg-pink-100' },
  { id: 'videos', name: 'Vidéos', icon: <Video className="w-6 h-6 text-orange-600" />, color: 'bg-orange-100' },
  { id: 'audio', name: 'Audio', icon: <Music className="w-6 h-6 text-teal-600" />, color: 'bg-teal-100' },
  { id: 'docs', name: 'Documents', icon: <FileText className="w-6 h-6 text-indigo-600" />, color: 'bg-indigo-100' },
  { id: 'apps', name: 'Applications', icon: <Box className="w-6 h-6 text-green-600" />, color: 'bg-green-100' },
];

const BrowseTab: React.FC<BrowseTabProps> = ({ searchQuery, files, onRefresh }) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showAddServer, setShowAddServer] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [servers, setServers] = useState(() => {
    const saved = localStorage.getItem('pixel_files_servers');
    return saved ? JSON.parse(saved) : [];
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      for (let i = 0; i < e.target.files.length; i++) {
        await saveFile(e.target.files[i], 'import');
      }
      onRefresh();
    }
  };

  const handleMountFolder = async () => {
    try {
      if ('showDirectoryPicker' in window) {
        const handle = await (window as any).showDirectoryPicker();
        alert(`Dossier "${handle.name}" monté avec succès !`);
      } else {
        fileInputRef.current?.click();
      }
    } catch (err) {
      console.log('User cancelled or not supported');
    }
  };

  const filteredCategories = useMemo(() => 
    categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );

  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach(c => {
      counts[c.id] = files.filter(f => {
        if (c.id === 'images') return f.type === 'image';
        if (c.id === 'videos') return f.type === 'video';
        if (c.id === 'audio') return f.type === 'audio';
        if (c.id === 'apps') return f.type === 'app';
        if (c.id === 'docs') return f.type === 'document';
        return true;
      }).length;
    });
    return counts;
  }, [files]);

  if (selectedCategory) {
    return (
      <div className="animate-fade-in h-full flex flex-col">
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-[#fef7ff] py-2 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedCategory(null)} className="p-2 rounded-full hover:bg-gray-200">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-medium">{selectedCategory.name}</h2>
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-[#d3e3fd] text-[#041e49] rounded-full text-sm font-bold"
          >
            <UploadCloud className="w-4 h-4" /> Importer
          </button>
        </div>
        <FileListView 
          categoryId={selectedCategory.id} 
          searchQuery={searchQuery} 
          files={files} 
          onRefresh={onRefresh}
        />
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} multiple className="hidden" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-2 animate-fade-in">
      <section>
        <h2 className="text-sm font-medium text-gray-600 mb-3 px-1">Catégories</h2>
        <div className="grid grid-cols-2 gap-3">
          {filteredCategories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => setSelectedCategory(cat)}
              className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-gray-100 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-colors relative"
            >
              <div className={`p-2 rounded-xl ${cat.color}`}>
                {cat.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{cat.name}</span>
                <span className="text-[10px] text-gray-400">{stats[cat.id]} fichiers</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium text-gray-600 mb-3 px-1">Espaces de stockage</h2>
        <div className="space-y-2">
          <div 
            onClick={handleMountFolder}
            className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm active:bg-gray-50 cursor-pointer"
          >
            <div className="p-2 bg-blue-50 rounded-full">
              <FolderOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Parcourir le Pixel</p>
              <p className="text-xs text-gray-500">Accéder aux dossiers réels</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm opacity-80">
            <div className="p-2 bg-gray-100 rounded-full">
              <HardDrive className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Stockage Interne</p>
              <p className="text-xs text-gray-500">Bac à sable sécurisé</p>
              <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-3 px-1">
          <h2 className="text-sm font-medium text-gray-600">Stockage Réseau (NAS)</h2>
          <button 
            onClick={() => setShowAddServer(true)}
            className="p-2 bg-[#d3e3fd] rounded-full text-[#041e49] active:scale-90 transition-transform"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-2 pb-10">
          {servers.map((server: any) => (
            <div key={server.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm active:bg-gray-50 cursor-pointer group">
              <div className="p-2 bg-indigo-50 rounded-full group-hover:bg-indigo-100">
                <Server className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{server.name}</p>
                <p className="text-xs text-gray-500">{server.protocol} • {server.host}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-green-600">Connecté</span>
              </div>
            </div>
          ))}
          {servers.length === 0 && (
            <div className="text-center py-6 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-xs text-gray-400">Aucun NAS configuré (WebDAV recommandé)</p>
            </div>
          )}
        </div>
      </section>

      {showAddServer && (
        <AddServerModal 
          onClose={() => setShowAddServer(false)} 
          onAdd={(newServer) => {
            const updated = [...servers, { ...newServer, id: Date.now().toString() }];
            setServers(updated);
            localStorage.setItem('pixel_files_servers', JSON.stringify(updated));
            setShowAddServer(false);
          }}
        />
      )}
    </div>
  );
};

export default BrowseTab;
