
import React, { useState } from 'react';
import { MoreVertical, Image as ImageIcon, Video, Music, FileText, Download, Box, Trash2, X, Maximize2 } from 'lucide-react';
import { FileItem } from '../types.ts';
import { deleteFile } from '../services/fileSystem.ts';

// Added missing interface for FileListView props
interface FileListViewProps {
  categoryId: string;
  searchQuery: string;
  files: FileItem[];
  onRefresh: () => void;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'image': return <ImageIcon className="w-5 h-5 text-pink-600" />;
    case 'video': return <Video className="w-5 h-5 text-orange-600" />;
    case 'audio': return <Music className="w-5 h-5 text-teal-600" />;
    case 'document': return <FileText className="w-5 h-5 text-indigo-600" />;
    case 'app': return <Box className="w-5 h-5 text-green-600" />;
    default: return <Download className="w-5 h-5 text-blue-600" />;
  }
};

const FileListView: React.FC<FileListViewProps> = ({ categoryId, searchQuery, files, onRefresh }) => {
  const [previewFile, setPreviewFile] = useState<any>(null);

  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = 
      (categoryId === 'images' && f.type === 'image') ||
      (categoryId === 'videos' && f.type === 'video') ||
      (categoryId === 'audio' && f.type === 'audio') ||
      (categoryId === 'apps' && f.type === 'app') ||
      (categoryId === 'docs' && f.type === 'document') ||
      (categoryId === 'downloads');
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Supprimer ce fichier définitivement ?')) {
      await deleteFile(id);
      onRefresh();
    }
  };

  const handleOpenFile = (file: any) => {
    if (file.blob) {
      const url = URL.createObjectURL(file.blob);
      setPreviewFile({ ...file, url });
    } else {
      alert("Ce fichier est un raccourci et ne peut pas être ouvert directement.");
    }
  };

  return (
    <div className="space-y-1 pb-20">
      {filteredFiles.map((file) => (
        <div 
          key={file.id} 
          onClick={() => handleOpenFile(file)}
          className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white active:bg-gray-100 transition-colors group cursor-pointer"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
            {file.type === 'image' && file.blob ? (
               <img src={URL.createObjectURL(file.blob)} className="w-full h-full object-cover" alt="" />
            ) : getIcon(file.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{file.size} • {file.modified}</p>
          </div>
          <button 
            onClick={(e) => handleDelete(e, file.id)}
            className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ))}

      {previewFile && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-fade-in">
          <div className="flex justify-between items-center p-4">
            <h3 className="text-white text-sm font-medium truncate max-w-[70%]">{previewFile.name}</h3>
            <button 
              onClick={() => {
                URL.revokeObjectURL(previewFile.url);
                setPreviewFile(null);
              }}
              className="p-2 bg-white/10 rounded-full text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4">
            {previewFile.type === 'image' ? (
              <img src={previewFile.url} className="max-w-full max-h-full object-contain rounded-lg" alt="" />
            ) : previewFile.type === 'video' ? (
              <video src={previewFile.url} controls autoPlay className="max-w-full max-h-full rounded-lg" />
            ) : (
              <div className="text-center text-white space-y-4">
                <FileText className="w-20 h-20 mx-auto opacity-50" />
                <p>Aperçu non disponible.</p>
                <a href={previewFile.url} download={previewFile.name} className="inline-block bg-blue-600 px-6 py-2 rounded-full font-bold">Télécharger</a>
              </div>
            )}
          </div>
        </div>
      )}

      {filteredFiles.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Download className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p>Dossier vide</p>
        </div>
      )}
    </div>
  );
};

export default FileListView;
