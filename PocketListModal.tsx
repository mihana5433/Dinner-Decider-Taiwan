import React from 'react';
import { X, MapPin, Trash2, ExternalLink, Calendar } from 'lucide-react';
import { SavedPlace } from '../types';

interface PocketListModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlaces: SavedPlace[];
  onRemove: (uri: string) => void;
}

export const PocketListModal: React.FC<PocketListModalProps> = ({
  isOpen,
  onClose,
  savedPlaces,
  onRemove,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col relative z-10 animate-fade-in-up overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-orange-50">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <div className="bg-orange-500 p-1.5 rounded-lg text-white">
                   <MapPin size={18} />
                </div>
                口袋名單 ({savedPlaces.length})
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-orange-100 rounded-full transition-colors text-gray-500 hover:text-gray-700">
                <X size={20} />
            </button>
        </div>
        
        <div className="overflow-y-auto p-4 space-y-3 bg-gray-50/50 flex-grow">
            {savedPlaces.length === 0 ? (
                <div className="text-center py-12 text-gray-400 flex flex-col items-center">
                    <div className="mb-3 bg-gray-100 p-4 rounded-full">
                      <MapPin size={32} className="text-gray-300" />
                    </div>
                    <p className="font-medium">還沒有收藏任何店家喔！</p>
                    <p className="text-sm mt-1 opacity-70">在搜尋結果點擊 ❤️ 即可加入</p>
                </div>
            ) : (
                savedPlaces.map((place) => (
                    <div key={place.uri} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all group relative">
                        <div className="pr-8">
                            <h3 className="font-bold text-gray-800 mb-1 text-lg">{place.title}</h3>
                            {place.snippet && (
                                <p className="text-xs text-gray-500 line-clamp-2 mb-2 italic bg-gray-50 p-2 rounded">
                                    "{place.snippet}"
                                </p>
                            )}
                            <div className="flex items-center justify-between mt-3">
                                <a 
                                    href={place.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg font-medium flex items-center transition-colors shadow-sm"
                                >
                                    <ExternalLink size={14} className="mr-1.5" />
                                    開啟地圖
                                </a>
                                <span className="text-[10px] text-gray-400 flex items-center">
                                  <Calendar size={10} className="mr-1" />
                                  {new Date(place.addedAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <button 
                            onClick={() => onRemove(place.uri)}
                            className="absolute top-3 right-3 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="移除"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};