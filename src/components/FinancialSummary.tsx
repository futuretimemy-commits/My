import React from 'react';
import { TrendingUp, TrendingDown, Wallet, AlertCircle, Sparkles, PieChart as PieIcon } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Transaction, WeeklyBudgetGoal } from '../types';
import { formatCurrency, TRANSLATIONS, CATEGORIES } from '../utils';

interface FinancialSummaryProps {
  transactions: Transaction[];
  budget: WeeklyBudgetGoal;
  currencySymbol: string;
  language: 'en' | 'ru';
  selectedDateStr: string | null;
  datesInCurrentWeek: string[];
  activeTypeFilter: 'income' | 'expense' | null;
  setActiveTypeFilter: (filter: 'income' | 'expense' | null) => void;
}

export default function FinancialSummary({
  transactions,
  budget,
  currencySymbol,
  language,
  selectedDateStr,
  datesInCurrentWeek,
  activeTypeFilter,
  setActiveTypeFilter,
}: FinancialSummaryProps) {
  const t = TRANSLATIONS[language];

  // Filter transactions based on selection
  const filteredTx = transactions.filter((tx) => {
    if (selectedDateStr) {
      return tx.date === selectedDateStr;
    } else {
      return datesInCurrentWeek.includes(tx.date);
    }
  });

  // Calculate stats
  const totalIncome = filteredTx
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = filteredTx
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const netSavings = totalIncome - totalExpense;

  // Budget limit calculation is based on the full week's expenses for safety,
  // but let's compare it based on the selected period context.
  const weekExpenses = transactions
    .filter((tx) => datesInCurrentWeek.includes(tx.date) && tx.type === 'expense')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const limitSpentPercentage = Math.min(100, Math.round((weekExpenses / budget.weeklyLimit) * 100));
  const isOverBudget = weekExpenses > budget.weeklyLimit;
  const isCloseToBudget = weekExpenses >= budget.weeklyLimit * 0.8 && !isOverBudget;

  // Get expenses by category for current filtered transactions
  const categoryBreakdown = CATEGORIES.map((cat) => {
    const total = filteredTx
      .filter((tx) => tx.type === 'expense' && tx.category === cat.id)
      .reduce((sum, tx) => sum + tx.amount, 0);

    return {
      name: language === 'en' ? cat.label_en : cat.label_ru,
      value: total,
      color: cat.color,
      id: cat.id,
    };
  }).filter((item) => item.value > 0);

  const totalFilteredExpense = categoryBreakdown.reduce((sum, item) => sum + item.value, 0);

  // Quick budget advice
  const getBudgetTip = () => {
    if (isOverBudget) {
      return language === 'en'
        ? `Over budget by ${formatCurrency(weekExpenses - budget.weeklyLimit, currencySymbol)}! Try to postpone some purchases.`
        : `Бюджет превышен на ${formatCurrency(weekExpenses - budget.weeklyLimit, currencySymbol)}! Постарайтесь отложить покупки.`;
    }
    if (isCloseToBudget) {
      return language === 'en'
        ? `You've spent ${limitSpentPercentage}% of your limit. Be cautious!`
        : `Потрачено уже ${limitSpentPercentage}% лимита. Будьте аккуратны с тратами!`;
    }
    return language === 'en'
      ? `On track! ${formatCurrency(budget.weeklyLimit - weekExpenses, currencySymbol)} remaining for this week.`
      : `Отлично! Осталось ${formatCurrency(budget.weeklyLimit - weekExpenses, currencySymbol)} на эту неделю.`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700/65 px-2.5 py-1.5 rounded-xl shadow-xl text-xs">
          <p className="font-semibold text-gray-200">{payload[0].name}</p>
          <p className="font-mono text-primary-400 font-bold mt-0.5">
            {formatCurrency(payload[0].value, currencySymbol)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-4 mb-4 shrink-0">
      {/* 3-Column Mini Balance Panel - Interactive Tap Filters */}
      <div className="grid grid-cols-3 gap-2.5">
        {/* Income Card */}
        <button
          onClick={() => setActiveTypeFilter(activeTypeFilter === 'income' ? null : 'income')}
          type="button"
          className={`p-3 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 cursor-pointer tap-feedback ${
            activeTypeFilter === 'income'
              ? 'bg-emerald-950/25 border-emerald-500 ring-2 ring-emerald-500/20 scale-102 shadow-lg shadow-emerald-950/40'
              : 'bg-[#0f172a] border-emerald-900/10 hover:border-emerald-500/30'
          } border`}
          id="summary-card-income"
        >
          <div className="flex items-center justify-between w-full text-emerald-400 mb-1.5">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="text-[10px] font-semibold tracking-wider uppercase opacity-80">{t.income}</span>
            </div>
            {activeTypeFilter === 'income' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </div>
          <span className="font-mono text-xs font-bold text-emerald-400 truncate">
            {formatCurrency(totalIncome, currencySymbol)}
          </span>
          <span className="text-[8px] text-gray-500 mt-1 block">
            {activeTypeFilter === 'income' 
              ? (language === 'en' ? 'Filtering' : 'Фильтр') 
              : (language === 'en' ? 'Tap to filter' : 'Нажмите')}
          </span>
        </button>

        {/* Expense Card */}
        <button
          onClick={() => setActiveTypeFilter(activeTypeFilter === 'expense' ? null : 'expense')}
          type="button"
          className={`p-3 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 cursor-pointer tap-feedback ${
            activeTypeFilter === 'expense'
              ? 'bg-red-950/25 border-red-500 ring-2 ring-red-500/20 scale-102 shadow-lg shadow-red-950/40'
              : 'bg-[#0f172a] border-red-950/10 hover:border-red-500/30'
          } border`}
          id="summary-card-expense"
        >
          <div className="flex items-center justify-between w-full text-red-400 mb-1.5">
            <div className="flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span className="text-[10px] font-semibold tracking-wider uppercase opacity-80">{t.expense}</span>
            </div>
            {activeTypeFilter === 'expense' && (
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            )}
          </div>
          <span className="font-mono text-xs font-bold text-red-400 truncate">
            {formatCurrency(totalExpense, currencySymbol)}
          </span>
          <span className="text-[8px] text-gray-500 mt-1 block">
            {activeTypeFilter === 'expense' 
              ? (language === 'en' ? 'Filtering' : 'Фильтр') 
              : (language === 'en' ? 'Tap to filter' : 'Нажмите')}
          </span>
        </button>

        {/* Net Balance Card */}
        <button
          onClick={() => setActiveTypeFilter(null)}
          type="button"
          className={`p-3 rounded-2xl flex flex-col justify-between text-left transition-all duration-200 cursor-pointer tap-feedback ${
            activeTypeFilter === null
              ? 'bg-[#0f172a] border-gray-800'
              : 'bg-gray-900/40 border-gray-850 opacity-60 hover:opacity-100'
          } border`}
          id="summary-card-balance"
        >
          <div className="flex items-center justify-between w-full text-primary-400 mb-1.5">
            <div className="flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5" />
              <span className="text-[10px] font-semibold tracking-wider uppercase opacity-80">{t.balance}</span>
            </div>
          </div>
          <span className={`font-mono text-xs font-bold truncate ${netSavings >= 0 ? 'text-primary-300' : 'text-red-400'}`}>
            {formatCurrency(netSavings, currencySymbol)}
          </span>
          <span className="text-[8px] text-gray-500 mt-1 block">
            {activeTypeFilter !== null 
              ? (language === 'en' ? 'Reset' : 'Сбросить') 
              : (language === 'en' ? 'All active' : 'Все активно')}
          </span>
        </button>
      </div>

      {/* Weekly Limit Meter Card (Only shown if we look at week or need full context) */}
      <div className="bg-[#0f172a] p-4 rounded-3xl border border-gray-800/60 relative overflow-hidden">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-gray-400 flex items-center gap-1">
            {t.weeklyProgress}
          </span>
          <span className="font-mono text-xs text-gray-300 font-bold">
            {formatCurrency(weekExpenses, currencySymbol)} / {formatCurrency(budget.weeklyLimit, currencySymbol)}
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isOverBudget
                ? 'bg-finance-red'
                : isCloseToBudget
                ? 'bg-amber-500'
                : 'bg-finance-green'
            }`}
            style={{ width: `${limitSpentPercentage}%` }}
          />
        </div>

        {/* Status Tip or Warning */}
        <div className={`flex items-start gap-1.5 text-xs ${isOverBudget ? 'text-red-400' : isCloseToBudget ? 'text-amber-400' : 'text-emerald-400'}`}>
          {isOverBudget ? (
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          )}
          <span className="font-medium leading-normal">{getBudgetTip()}</span>
        </div>
      </div>

      {/* Category Breakdown Card */}
      <div className="bg-[#0f172a] p-4 rounded-3xl border border-gray-800/60 flex flex-col">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-gray-400 flex items-center gap-1.5">
            <PieIcon className="w-3.5 h-3.5 text-primary-500" />
            {language === 'en' ? 'Category Breakdown' : 'Распределение расходов'}
          </span>
          <span className="text-[10px] text-gray-500 font-mono">
            {selectedDateStr 
              ? (language === 'en' ? 'Selected Day' : 'Выбранный день') 
              : (language === 'en' ? 'Weekly' : 'За неделю')}
          </span>
        </div>

        {categoryBreakdown.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-5 text-center">
            <p className="text-xs text-gray-500 font-medium">
              {language === 'en' ? 'No expenses recorded in this period' : 'Нет расходов за этот период'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-3 items-center">
            {/* Pie Chart Container */}
            <div className="col-span-5 h-[100px] relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={44}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={1} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">
                  {language === 'en' ? 'Total' : 'Всего'}
                </span>
                <span className="font-mono text-[10px] font-bold text-gray-200">
                  {formatCurrency(totalFilteredExpense, currencySymbol)}
                </span>
              </div>
            </div>

            {/* Custom Interactive Legend */}
            <div className="col-span-7 flex flex-col gap-1.5 max-h-[110px] overflow-y-auto no-scrollbar pr-1">
              {categoryBreakdown.map((item) => {
                const pct = Math.round((item.value / totalFilteredExpense) * 100);
                return (
                  <div key={item.id} className="flex items-center justify-between gap-1.5 text-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-gray-300 font-medium truncate text-[11px] leading-tight">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] shrink-0 font-mono">
                      <span className="text-gray-400 font-semibold">{pct}%</span>
                      <span className="text-gray-500">({formatCurrency(item.value, currencySymbol)})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
