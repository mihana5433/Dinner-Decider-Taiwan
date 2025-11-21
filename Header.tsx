import React from 'react';
import { UtensilsCrossed, BookHeart } from 'lucide-react';

interface HeaderProps {
  onOpenPocketList?: () => void;
  savedCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPocketList, savedCount = 0 }) => {
  return (
    <header className="w-full py-6 px-4 flex flex-col items-center justify-center text-center relative max-w-5xl mx-auto">
      {/* Mobile/Top-right prominent button */}
      {onOpenPocketList && (
        <button 
          onClick={onOpenPocketList}
          className="absolute top-4 right-4 md:top-8 md:right-6 flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-full shadow-lg hover:bg-rose-600 hover:scale-105 transition-all group z-10 ring-2 ring-rose-100"
          title="我的口袋名單"
        >
          <BookHeart size={20} className="group-hover:animate-pulse" />
          <span className="font-bold text-sm md:text-base">口袋名單</span>
          {savedCount > 0 && (
            <span className="bg-white text-rose-600 text-xs font-extrabold px-1.5 py-0.5 rounded-full min-w-[1.25rem]">
              {savedCount}
            </span>
          )}
        </button>
      )}

      <div className="bg-orange-500 p-3 rounded-full shadow-lg mb-4 mt-8 md:mt-2">
        <UtensilsCrossed className="w-8 h-8 text-white" />
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight mb-2">
        晚餐吃什麼？
      </h1>
      <p className="text-gray-600 text-sm md:text-base max-w-md">
        解決選擇困難症，探索台灣在地美食或讓 AI 幫你決定！
      </p>
    </header>
  );
};