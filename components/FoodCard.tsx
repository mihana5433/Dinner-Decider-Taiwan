import React from 'react';
import { FoodItem } from '../types';

interface FoodCardProps {
  item: FoodItem;
  onClick?: () => void;
  selected?: boolean;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item, onClick, selected }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer
        flex flex-col items-center justify-center p-6 h-40 shadow-sm
        ${selected 
          ? 'border-orange-500 bg-orange-50 scale-105 shadow-md ring-2 ring-orange-200' 
          : 'border-white bg-white hover:border-orange-200 hover:shadow-md'
        }
      `}
    >
      <div className="text-5xl mb-3 transform transition-transform duration-300 group-hover:scale-110">
        {item.emoji}
      </div>
      <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
      <span className="text-xs text-gray-400 mt-1">{item.category}</span>
    </div>
  );
};
