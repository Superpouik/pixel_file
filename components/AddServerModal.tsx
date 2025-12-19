
import React, { useState } from 'react';
import { X, Server, Loader2, Info } from 'lucide-react';

interface AddServerModalProps {
  onClose: () => void;
  onAdd: (server: any) => void;
}

const AddServerModal: React.FC<AddServerModalProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [host, setHost] = useState('');
  const [protocol, setProtocol] = useState('WebDAV');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (name && host) {
      setIsConnecting(true);
      
      // Simulation d'une tentative de connexion WebDAV/HTTP
      // Dans une app réelle, on ferait un fetch(host, { method: 'PROPFIND' })
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Si c'est SMB ou FTP, on prévient l'utilisateur des limitations PWA
        if (protocol !== 'WebDAV') {
          setError(`Le protocole ${protocol} nécessite un pont (proxy) ou une app native. Utilisez WebDAV pour une connexion directe.`);
          setIsConnecting(false);
          return;
        }

        onAdd({ name, host, protocol, username, status: 'Connected' });
        setIsConnecting(false);
      } catch (err) {
        setError('Impossible de joindre le serveur. Vérifiez l\'adresse IP.');
        setIsConnecting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[2px] animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-[2.5rem] p-6 pb-12 shadow-2xl animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium text-[#1d1b20]">Nouveau serveur NAS</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {isConnecting ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-sm font-medium text-gray-600">Négociation avec {host}...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2 p-1 bg-[#f3edf7] rounded-full">
              {['WebDAV', 'SMB', 'FTP'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => { setProtocol(p); setError(''); }}
                  className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
                    protocol === p ? 'bg-white text-[#041e49] shadow-sm' : 'text-[#49454f]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {protocol !== 'WebDAV' && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-2xl border border-amber-100">
                <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-amber-800">
                  Note : SMB/FTP nécessite l'activation de l'option "Proxy Bridge" sur votre NAS pour fonctionner en PWA. 
                  <b> WebDAV est recommandé.</b>
                </p>
              </div>
            )}

            {error && <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">{error}</p>}

            <div className="space-y-1">
              <input
                type="text"
                placeholder="Nom du serveur (ex: Ma Freebox)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#f3edf7] rounded-2xl px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="space-y-1">
              <input
                type="text"
                placeholder="Adresse (ex: 192.168.1.100 ou https://nas.me)"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                className="w-full bg-[#f3edf7] rounded-2xl px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#f3edf7] rounded-2xl px-4 py-4 text-sm outline-none"
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#f3edf7] rounded-2xl px-4 py-4 text-sm outline-none"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#041e49] text-white py-4 rounded-full font-bold active:scale-95 transition-transform shadow-lg shadow-blue-900/10"
              >
                Connecter le NAS
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddServerModal;
