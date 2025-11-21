import React from 'react';
import { MapPin, Navigation, ExternalLink, Heart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { RecommendationResult, FoodItem, SavedPlace } from '../types';

interface ResultsDisplayProps {
  resultType: 'random' | 'ai';
  foodItem?: FoodItem; // If random
  aiResult?: RecommendationResult; // If AI
  onReset: () => void;
  onFindNearbyForRandom?: (foodName: string) => void;
  loadingNearby?: boolean;
  savedPlaces: SavedPlace[];
  onToggleSave: (place: Omit<SavedPlace, 'addedAt'>) => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  resultType,
  foodItem,
  aiResult,
  onReset,
  onFindNearbyForRandom,
  loadingNearby,
  savedPlaces,
  onToggleSave
}) => {
  
  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in-up">
      {/* Header Section */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-orange-100">
        
        {/* Random Result Header */}
        {resultType === 'random' && foodItem && (
          <div className="bg-gradient-to-r from-orange-400 to-amber-500 p-8 text-white text-center">
            <h2 className="text-xl font-medium opacity-90 mb-2">命運的選擇是...</h2>
            <div className="text-7xl mb-4 filter drop-shadow-lg animate-bounce-short">{foodItem.emoji}</div>
            <h1 className="text-4xl font-bold tracking-wide">{foodItem.name}</h1>
            <div className="mt-6">
               <button
                onClick={() => onFindNearbyForRandom && onFindNearbyForRandom(foodItem.name)}
                disabled={loadingNearby}
                className="bg-white text-orange-600 px-6 py-2 rounded-full font-bold shadow-lg hover:bg-orange-50 transition-colors disabled:opacity-70 flex items-center justify-center mx-auto gap-2"
              >
                {loadingNearby ? (
                   <span className="animate-pulse">搜尋中...</span>
                ) : (
                  <>
                    <MapPin size={18} />
                    尋找附近店家
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* AI Result Content */}
        <div className="p-6 md:p-8 space-y-6">
          {resultType === 'ai' && aiResult && (
            <div className="prose prose-orange max-w-none prose-headings:text-gray-800 prose-p:text-gray-600">
               <ReactMarkdown>{aiResult.text}</ReactMarkdown>
            </div>
          )}

          {/* Map Results List (Common for both if AI populated it) */}
          {aiResult?.mapChunks && aiResult.mapChunks.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="text-orange-500" />
                推薦店家
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {aiResult.mapChunks.map((chunk, idx) => {
                  if (!chunk.maps) return null;
                  const place = chunk.maps;
                  // Extract rating snippet if available for preview
                  const snippet = place.placeAnswerSources?.[0]?.reviewSnippets?.[0]?.content;
                  
                  // Check if saved
                  const isSaved = savedPlaces.some(p => p.uri === place.uri);
                  
                  return (
                    <div 
                      key={idx}
                      className="block bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group relative"
                    >
                      <div className="flex justify-between items-start pr-8">
                        <a href={place.uri} target="_blank" rel="noopener noreferrer">
                          <h4 className="font-bold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-1 cursor-pointer">
                            {place.title}
                          </h4>
                        </a>
                      </div>
                      
                      <button
                        onClick={() => onToggleSave({ uri: place.uri, title: place.title, snippet })}
                        className="absolute top-4 right-3 p-1.5 rounded-full hover:bg-gray-50 transition-colors"
                        title={isSaved ? "取消收藏" : "加入口袋名單"}
                      >
                        <Heart 
                          size={20} 
                          className={`transition-colors ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}`} 
                        />
                      </button>

                      <a href={place.uri} target="_blank" rel="noopener noreferrer">
                        {snippet && (
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                            "{snippet}"
                          </p>
                        )}
                        <div className="mt-3 flex items-center text-xs text-blue-600 font-medium">
                           <Navigation size={12} className="mr-1" />
                           在 Google 地圖中查看
                           <ExternalLink size={12} className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty state for AI result if no maps found but text exists */}
          {resultType === 'ai' && aiResult && (!aiResult.mapChunks || aiResult.mapChunks.length === 0) && (
            <div className="p-4 bg-orange-50 text-orange-700 rounded-lg text-sm">
              AI 提供了一些建議，但沒有回傳具體的地圖資料。建議您可以直接在地圖搜尋相關關鍵字。
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 p-4 flex justify-center border-t border-gray-100">
          <button
            onClick={onReset}
            className="text-gray-500 hover:text-gray-800 font-medium transition-colors px-6 py-2"
          >
            再選一次
          </button>
        </div>
      </div>
    </div>
  );
};