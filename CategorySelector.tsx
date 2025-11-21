import React, { useState } from 'react';
import { FoodItem } from '../types';
import { Check, Users } from 'lucide-react';

interface CategorySelectorProps {
  items: FoodItem[];
  onConfirm: (selectedItems: FoodItem[]) => void;
  onCancel: () => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ items, onConfirm, onCancel }) => {
  // Default select all or none? Let's start with none to force choice, or maybe popular ones.
  // Let's start with none.
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map(i => i.id)));
    }
  };

  const handleConfirm = () => {
    const selectedItems = items.filter(i => selectedIds.has(i.id));
    onConfirm(selectedItems);
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in-up px-4">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-orange-100 flex flex-col max-h-[80vh]">
        
        <div className="bg-teal-600 p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Users size={24} />
            </div>
            <div>
                <h2 className="text-2xl font-bold">多人聚餐模式</h2>
                <p className="text-teal-100 text-sm">請勾選大家有興趣的種類，我們再幫你從中選一個！</p>
            </div>
          </div>
          <div className="flex gap-2">
             <button 
              onClick={handleSelectAll}
              className="text-xs md:text-sm bg-teal-700 hover:bg-teal-800 px-3 py-1.5 rounded-lg transition-colors"
            >
              {selectedIds.size === items.length ? '取消全選' : '全選'}
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 custom-scrollbar">
          {items.map((item) => {
            const isSelected = selectedIds.has(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`
                  relative flex items-center p-3 rounded-xl border-2 transition-all duration-200
                  text-left group
                  ${isSelected 
                    ? 'border-teal-500 bg-teal-50 shadow-md' 
                    : 'border-gray-100 bg-white hover:border-teal-200 hover:shadow-sm'
                  }
                `}
              >
                <span className="text-2xl mr-3 filter drop-shadow-sm">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                    <span className={`block font-bold truncate ${isSelected ? 'text-teal-800' : 'text-gray-700'}`}>
                        {item.name}
                    </span>
                    <span className="text-xs text-gray-400">{item.category}</span>
                </div>
                <div className={`
                    absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center
                    transition-all duration-200
                    ${isSelected ? 'bg-teal-500 scale-100' : 'bg-gray-200 scale-0 opacity-0'}
                `}>
                    <Check size={12} className="text-white" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center shrink-0">
            <button 
                onClick={onCancel}
                className="px-6 py-2 text-gray-500 hover:text-gray-800 font-medium transition-colors"
            >
                取消
            </button>
            <button 
                onClick={handleConfirm}
                disabled={selectedIds.size === 0}
                className="px-8 py-3 bg-teal-600 text-white rounded-xl font-bold shadow-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all flex items-center gap-2"
            >
                決定就是這些了 ({selectedIds.size})
            </button>
        </div>
      </div>
    </div>
  );
};