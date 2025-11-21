import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Dices, Search, MapPinOff, Users } from 'lucide-react';
import { Header } from './components/Header';
import { FoodCard } from './components/FoodCard';
import { ResultsDisplay } from './components/ResultsDisplay';
import { PocketListModal } from './components/PocketListModal';
import { CategorySelector } from './components/CategorySelector';
import { getAIRecommendation } from './services/geminiService';
import { COMMON_TAIWAN_FOODS, LOADING_MESSAGES } from './constants';
import { AppMode, FoodItem, LatLng, RecommendationResult, SavedPlace } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [selectedFood, setSelectedFood] = useState<FoodItem | undefined>(undefined);
  const [aiResult, setAiResult] = useState<RecommendationResult | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(LOADING_MESSAGES[0]);
  const [userLocation, setUserLocation] = useState<LatLng | undefined>(undefined);
  const [userInput, setUserInput] = useState('');
  const [locationError, setLocationError] = useState<string | null>(null);

  // Pocket List State
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [isPocketListOpen, setIsPocketListOpen] = useState(false);

  // Load saved places from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dinner-decider-saved-places');
    if (saved) {
      try {
        setSavedPlaces(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved places", e);
      }
    }
  }, []);

  // Save to localStorage whenever list changes
  useEffect(() => {
    localStorage.setItem('dinner-decider-saved-places', JSON.stringify(savedPlaces));
  }, [savedPlaces]);

  // Initialize location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Location access denied or failed:", error);
          setLocationError("無法獲取您的位置。AI 推薦將無法尋找附近店家，但仍可提供建議。");
        }
      );
    }
  }, []);

  // Rotate loading messages
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingText(prev => {
          const currentIndex = LOADING_MESSAGES.indexOf(prev);
          const nextIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
          return LOADING_MESSAGES[nextIndex];
        });
      }, 1500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleRandomPick = (items: FoodItem[] = COMMON_TAIWAN_FOODS) => {
    setIsLoading(true);
    setMode(AppMode.RANDOM);
    setAiResult(undefined);
    
    // Simulate a "roulette" effect
    let count = 0;
    const maxIterations = 20;
    const intervalSpeed = 100;

    const shuffleInterval = setInterval(() => {
      // Use the provided items list (subset or full)
      const randomIndex = Math.floor(Math.random() * items.length);
      setSelectedFood(items[randomIndex]);
      count++;

      if (count >= maxIterations) {
        clearInterval(shuffleInterval);
        setIsLoading(false);
      }
    }, intervalSpeed);
  };

  const handleGroupSelection = (selectedItems: FoodItem[]) => {
    // From group selector, proceed to random pick but restricted to selection
    handleRandomPick(selectedItems);
  };

  const handleAISearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim()) return;

    setIsLoading(true);
    setMode(AppMode.AI_CHAT);
    setAiResult(undefined);

    try {
      const result = await getAIRecommendation(userInput, userLocation);
      setAiResult(result);
    } catch (error) {
      alert("AI 發生錯誤，請稍後再試。");
      setMode(AppMode.HOME);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNearbySearchForRandom = async (foodName: string) => {
    setIsLoading(true);
    try {
      const prompt = `我想吃"${foodName}"。請推薦附近好吃的店家。`;
      const result = await getAIRecommendation(prompt, userLocation);
      setAiResult(result);
      setMode(AppMode.AI_CHAT); // Switch to AI view to show map results
    } catch (error) {
      alert("無法搜尋附近店家");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSavedPlace = (place: Omit<SavedPlace, 'addedAt'>) => {
    setSavedPlaces(prev => {
      const exists = prev.some(p => p.uri === place.uri);
      if (exists) {
        return prev.filter(p => p.uri !== place.uri);
      } else {
        return [...prev, { ...place, addedAt: Date.now() }];
      }
    });
  };

  const removeSavedPlace = (uri: string) => {
    setSavedPlaces(prev => prev.filter(p => p.uri !== uri));
  };

  const resetApp = () => {
    setMode(AppMode.HOME);
    setSelectedFood(undefined);
    setAiResult(undefined);
    setUserInput('');
  };

  return (
    <div className="min-h-screen pb-12 bg-orange-50 text-gray-800">
      <Header 
        onOpenPocketList={() => setIsPocketListOpen(true)} 
        savedCount={savedPlaces.length}
      />

      <main className="container mx-auto px-4 max-w-4xl">
        
        {/* Location Warning */}
        {locationError && mode === AppMode.HOME && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded shadow-sm flex items-start gap-3 text-sm">
            <MapPinOff size={18} className="mt-0.5" />
            <p>{locationError}</p>
          </div>
        )}

        {/* HOME VIEW */}
        {mode === AppMode.HOME && (
          <div className="space-y-10 animate-fade-in">
            
            {/* Action Buttons Area */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Random Card (Left - 5 cols) */}
              <div className="md:col-span-5 bg-white p-8 rounded-3xl shadow-lg border border-orange-100 hover:shadow-xl transition-shadow flex flex-col items-center text-center">
                <div className="bg-orange-100 p-4 rounded-full mb-6">
                  <Dices className="w-10 h-10 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">隨機幫我選</h2>
                <p className="text-gray-500 mb-8">不知道要吃什麼？讓命運決定你的晚餐！</p>
                <button 
                  onClick={() => handleRandomPick(COMMON_TAIWAN_FOODS)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-md"
                >
                  立即抽取
                </button>
              </div>

              {/* Group & AI Cards Column (Right - 7 cols) */}
              <div className="md:col-span-7 space-y-6">
                
                {/* Group Dining Card */}
                <div className="bg-teal-600 text-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow flex flex-col sm:flex-row items-center sm:items-start gap-5 relative overflow-hidden group">
                   <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                   
                   <div className="bg-white/20 p-3 rounded-full shrink-0">
                      <Users className="w-8 h-8 text-teal-50" />
                   </div>
                   <div className="flex-1 text-center sm:text-left z-10">
                      <h2 className="text-xl font-bold mb-1">多人聚餐模式</h2>
                      <p className="text-teal-100 text-sm mb-4">
                        意見不同？先勾選大家想吃的類別，再幫你們選！
                      </p>
                      <button 
                        onClick={() => setMode(AppMode.GROUP_SELECTOR)}
                        className="w-full sm:w-auto px-6 py-2 bg-white text-teal-700 rounded-lg font-bold hover:bg-teal-50 transition-colors shadow-sm"
                      >
                        開始挑選
                      </button>
                   </div>
                </div>

                {/* AI Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white/20 p-2 rounded-full">
                      <Sparkles className="w-5 h-5 text-yellow-300" />
                    </div>
                    <h2 className="text-xl font-bold">AI 智慧推薦</h2>
                  </div>
                  <form onSubmit={handleAISearch} className="mt-auto">
                    <div className="relative">
                      <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="例：慶生餐廳、安靜的咖啡廳..."
                        className="w-full bg-white/10 border border-white/30 rounded-xl py-3 pl-4 pr-12 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                      />
                      <button 
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                      >
                        <Search size={18} />
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            </div>

            {/* Common Categories Grid (Decorative / Quick Access) */}
            <div>
              <h3 className="text-xl font-bold text-gray-700 mb-6 px-2 border-l-4 border-orange-500">
                常見選擇
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {COMMON_TAIWAN_FOODS.slice(0, 10).map((item) => (
                  <FoodCard 
                    key={item.id} 
                    item={item} 
                    onClick={() => {
                      setSelectedFood(item);
                      setMode(AppMode.RANDOM);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GROUP SELECTOR VIEW */}
        {mode === AppMode.GROUP_SELECTOR && (
          <CategorySelector 
            items={COMMON_TAIWAN_FOODS}
            onConfirm={handleGroupSelection}
            onCancel={() => setMode(AppMode.HOME)}
          />
        )}

        {/* LOADING STATE */}
        {isLoading && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-50 flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">
                🍴
              </div>
            </div>
            <p className="mt-6 text-xl font-medium text-gray-600 animate-pulse">
              {loadingText}
            </p>
          </div>
        )}

        {/* RESULTS VIEW */}
        {!isLoading && (mode === AppMode.RANDOM || mode === AppMode.AI_CHAT) && (
          <ResultsDisplay 
            resultType={mode === AppMode.RANDOM ? 'random' : 'ai'}
            foodItem={selectedFood}
            aiResult={aiResult}
            onReset={resetApp}
            onFindNearbyForRandom={handleNearbySearchForRandom}
            loadingNearby={isLoading}
            savedPlaces={savedPlaces}
            onToggleSave={toggleSavedPlace}
          />
        )}
        
        {/* Pocket List Modal */}
        <PocketListModal 
          isOpen={isPocketListOpen}
          onClose={() => setIsPocketListOpen(false)}
          savedPlaces={savedPlaces}
          onRemove={removeSavedPlace}
        />

      </main>
    </div>
  );
};

export default App;