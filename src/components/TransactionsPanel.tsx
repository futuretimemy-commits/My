import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Zap,
  Car,
  Tv,
  Sparkles,
  Briefcase,
  PiggyBank,
  CircleEllipsis,
  Check,
  Trash2,
  Calendar,
  Filter,
} from 'lucide-react';
import { Transaction } from '../types';
import { formatCurrency, CATEGORIES, TRANSLATIONS } from '../utils';

interface TransactionsPanelProps {
  transactions: Transaction[];
  onToggleComplete: (id: string) => void;
  onDeleteTransaction: (id: string) => void;
  selectedDateStr: string | null;
  datesInCurrentWeek: string[];
  currencySymbol: string;
  language: 'en' | 'ru';
  activeTypeFilter: 'income' | 'expense' | null;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  ShoppingBag,
  Zap,
  Car,
  Tv,
  Sparkles,
  Briefcase,
  PiggyBank,
  CircleEllipsis,
};

export default function TransactionsPanel({
  transactions,
  onToggleComplete,
  onDeleteTransaction,
  selectedDateStr,
  datesInCurrentWeek,
  currencySymbol,
  language,
  activeTypeFilter,
}: TransactionsPanelProps) {
  const t = TRANSLATIONS[language];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Reset category filter if selected day changes to prevent confusing empty views
  useEffect(() => {
    setSelectedCategory(null);
  }, [selectedDateStr]);

  // Filter transactions based on date selection
  const baseFiltered = transactions.filter((tx) => {
    if (selectedDateStr) {
      return tx.date === selectedDateStr;
    }
    return datesInCurrentWeek.includes(tx.date);
  });

  // Apply active type filter (income vs expense)
  const typeFiltered = activeTypeFilter
    ? baseFiltered.filter((tx) => tx.type === activeTypeFilter)
    : baseFiltered;

  // Apply category filter
  const finalFiltered = selectedCategory
    ? typeFiltered.filter((tx) => tx.category === selectedCategory)
    : typeFiltered;

  const getCategoryLabel = (catId: string) => {
    const cat = CATEGORIES.find((c) => c.id === catId);
    if (!cat) return catId;
    return language === 'en' ? cat.label_en : cat.label_ru;
  };

  const getCategoryColor = (catId: string) => {
    const cat = CATEGORIES.find((c) => c.id === catId);
    return cat ? cat.color : '#6b7280';
  };

  const getCategoryIcon = (catId: string, className = "w-4 h-4 text-white") => {
    const cat = CATEGORIES.find((c) => c.id === catId);
    const IconComponent = iconMap[cat?.icon || 'CircleEllipsis'] || CircleEllipsis;
    return <IconComponent className={className} />;
  };

  const formatShortDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const month = d.toLocaleString(language === 'en' ? 'en-US' : 'ru-RU', { month: 'short' });
    const day = d.getDate();
    return `${day} ${month}`;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0b0f17]">
      
      {/* Dynamic Category Chips Scroll Ribbon */}
      <div className="flex items-center gap-2 mb-3 px-0.5 shrink-0 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
            selectedCategory === null
              ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20 border border-primary-500/20'
              : 'bg-gray-800/60 text-gray-400 hover:text-gray-300 border border-transparent'
          }`}
          id="category-chip-all"
        >
          <Filter className="w-3 h-3" />
          {language === 'en' ? 'All' : 'Все'}
        </button>

        {CATEGORIES.map((cat) => {
          // Count items in current list for this category to show count badge (ux helper)
          const count = typeFiltered.filter((tx) => tx.category === cat.id).length;
          if (count === 0 && selectedCategory !== cat.id) return null; // Only show active categories to stay super clean

          const isSelected = selectedCategory === cat.id;
          const label = language === 'en' ? cat.label_en : cat.label_ru;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-gray-800 text-white shadow-sm font-semibold'
                  : 'bg-gray-800/40 text-gray-400 hover:text-gray-300'
              }`}
              style={{ borderColor: isSelected ? cat.color : 'transparent' }}
              id={`category-chip-${cat.id}`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span>{label}</span>
              <span className="text-[9px] opacity-75 bg-slate-900/40 px-1 py-0.2 rounded-md font-mono">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Scrollable list area */}
      <div className="flex-1 overflow-y-auto pr-0.5 no-scrollbar pb-24">
        {finalFiltered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-800/40 flex items-center justify-center mb-3 border border-gray-800/30">
              <Calendar className="w-6 h-6 text-gray-500" />
            </div>
            <p className="text-sm font-medium text-gray-300">
              {language === 'en' ? 'No matching transactions' : 'Нет подходящих операций'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'en' ? 'Try changing your date or category filters' : 'Попробуйте сбросить фильтры'}
            </p>
            {(selectedCategory !== null || activeTypeFilter !== null) && (
              <button
                onClick={() => {
                  setSelectedCategory(null);
                }}
                className="mt-4 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs text-primary-400 font-semibold rounded-xl cursor-pointer transition-all"
              >
                {language === 'en' ? 'Reset Filters' : 'Сбросить фильтры'}
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {finalFiltered.map((tx) => {
              const catColor = getCategoryColor(tx.category);
              const isExpense = tx.type === 'expense';

              return (
                <div
                  key={tx.id}
                  className={`p-3 rounded-2xl bg-[#0f172a] border border-gray-800/50 flex items-center justify-between gap-3 group transition-all duration-250 ${
                    !tx.completed && isExpense ? 'border-amber-500/20 bg-[#0f172a]/95' : ''
                  }`}
                  id={`transaction-item-${tx.id}`}
                >
                  {/* Category Circle Icon & Core info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                      style={{ backgroundColor: catColor }}
                    >
                      {getCategoryIcon(tx.category)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-semibold text-sm text-gray-100 truncate">
                          {tx.title}
                        </span>
                        {!tx.completed && isExpense && (
                          <span className="shrink-0 text-[8px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-extrabold uppercase tracking-wider leading-none">
                            {t.due}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{getCategoryLabel(tx.category)}</span>
                        {!selectedDateStr && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-gray-600" />
                            <span className="text-[10px] text-primary-400/80 font-bold uppercase tracking-wide">
                              {formatShortDate(tx.date)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Financial amounts & quick controls */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right flex flex-col justify-center">
                      <span
                        className={`font-mono text-xs font-bold ${
                          isExpense ? 'text-red-400' : 'text-emerald-400'
                        }`}
                      >
                        {isExpense ? '-' : '+'}
                        {formatCurrency(tx.amount, currencySymbol)}
                      </span>
                      {tx.notes && (
                        <span className="text-[9px] text-gray-500 max-w-[80px] truncate" title={tx.notes}>
                          {tx.notes}
                        </span>
                      )}
                    </div>

                    {/* Quick Mark Paid / Completed Checkbox */}
                    <button
                      onClick={() => onToggleComplete(tx.id)}
                      title={tx.completed ? t.markUnpaid : t.markPaid}
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all tap-feedback cursor-pointer ${
                        tx.completed
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                          : 'border-gray-800 text-gray-500 hover:border-gray-750 hover:text-gray-400'
                      }`}
                      id={`transaction-toggle-${tx.id}`}
                    >
                      <Check className={`w-4 h-4 transition-all ${tx.completed ? 'opacity-100 scale-100' : 'opacity-0 scale-75 hover:opacity-40'}`} />
                    </button>

                    {/* Delete Item Action */}
                    <button
                      onClick={() => onDeleteTransaction(tx.id)}
                      className="w-7 h-7 rounded-lg border border-transparent text-gray-600 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-all tap-feedback cursor-pointer"
                      title="Delete"
                      id={`transaction-delete-${tx.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
