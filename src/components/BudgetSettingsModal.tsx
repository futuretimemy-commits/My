import React, { useState } from 'react';
import { X, Settings, Coins, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { WeeklyBudgetGoal } from '../types';
import { TRANSLATIONS } from '../utils';

interface BudgetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: WeeklyBudgetGoal;
  onSaveBudget: (budget: WeeklyBudgetGoal) => void;
  currencySymbol: string;
  setCurrencySymbol: (symbol: string) => void;
  language: 'en' | 'ru';
  setLanguage: (lang: 'en' | 'ru') => void;
  onResetData: () => void;
}

export default function BudgetSettingsModal({
  isOpen,
  onClose,
  budget,
  onSaveBudget,
  currencySymbol,
  setCurrencySymbol,
  language,
  setLanguage,
  onResetData,
}: BudgetSettingsModalProps) {
  const t = TRANSLATIONS[language];

  const [limit, setLimit] = useState(String(budget.weeklyLimit));
  const [goal, setGoal] = useState(String(budget.savingsGoal));
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const limitVal = parseFloat(limit);
    const goalVal = parseFloat(goal);

    if (isNaN(limitVal) || limitVal <= 0 || isNaN(goalVal) || goalVal < 0) return;

    onSaveBudget({
      weeklyLimit: limitVal,
      savingsGoal: goalVal,
    });
    onClose();
  };

  const handleResetTrigger = () => {
    if (showResetConfirm) {
      onResetData();
      setShowResetConfirm(false);
      onClose();
    } else {
      setShowResetConfirm(true);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs transition-all">
      {/* Tap backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet Content */}
      <div className="relative bg-[#0b0f17] border-t border-gray-800 rounded-t-[32px] max-h-[90%] flex flex-col z-50 shadow-2xl overflow-hidden animate-slide-up">
        
        {/* Notch */}
        <div className="w-12 h-1.5 bg-gray-800 rounded-full mx-auto my-3 shrink-0" />

        {/* Header */}
        <div className="px-6 flex items-center justify-between pb-3 border-b border-gray-800/60 shrink-0">
          <span className="font-display font-semibold text-base text-gray-100 flex items-center gap-2">
            <Settings className="w-4.5 h-4.5 text-primary-500 animate-spin-slow" />
            {t.budgetSettings}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-gray-800/80 text-gray-400 hover:text-gray-200 cursor-pointer"
            id="close-settings-modal"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 no-scrollbar">
          
          {/* Language Switch */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {t.languageLabel}
            </label>
            <div className="grid grid-cols-2 gap-2 bg-gray-900/40 p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                id="language-en-btn"
              >
                🇬🇧 English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ru')}
                className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  language === 'ru'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                id="language-ru-btn"
              >
                🇷🇺 Русский
              </button>
            </div>
          </div>

          {/* Currency Switch */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {t.currencyLabel}
            </label>
            <div className="grid grid-cols-4 gap-2 bg-gray-900/40 p-1 rounded-2xl">
              {['₽', '$', '€', '₸'].map((symbol) => (
                <button
                  key={symbol}
                  type="button"
                  onClick={() => setCurrencySymbol(symbol)}
                  className={`py-2 text-sm font-mono font-bold rounded-xl transition-all cursor-pointer ${
                    currencySymbol === symbol
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                  id={`currency-option-${symbol}`}
                >
                  {symbol}
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Budget Limit */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {t.weeklyLimitLabel}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm font-semibold">
                {currencySymbol}
              </span>
              <input
                type="number"
                required
                min="1"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full bg-[#0f172a] font-mono text-sm text-gray-100 pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-primary-500 transition-colors"
                id="settings-limit-input"
              />
            </div>
          </div>

          {/* Savings Goal */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {t.savingsGoalLabel}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm font-semibold">
                {currencySymbol}
              </span>
              <input
                type="number"
                required
                min="0"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-[#0f172a] font-mono text-sm text-gray-100 pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-primary-500 transition-colors"
                id="settings-goal-input"
              />
            </div>
          </div>

          {/* Reset Action */}
          <div className="pt-2 border-t border-gray-800/60 mt-2">
            <button
              type="button"
              onClick={handleResetTrigger}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                showResetConfirm
                  ? 'bg-red-500 hover:bg-red-400 text-white animate-pulse'
                  : 'bg-red-500/10 hover:bg-red-500/15 text-red-400'
              }`}
              id="settings-reset-btn"
            >
              {showResetConfirm ? (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  {language === 'en' ? 'Click to Confirm Wipeout' : 'Нажмите для подтверждения'}
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  {language === 'en' ? 'Reset Default Presets' : 'Сбросить данные к демо-версии'}
                </>
              )}
            </button>
            {showResetConfirm && (
              <p className="text-[10px] text-gray-500 text-center mt-1.5">
                {language === 'en'
                  ? 'This resets all custom transactions and tasks.'
                  : 'Это сбросит все добавленные вами операции и задачи.'}
              </p>
            )}
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-semibold tracking-wide shadow-lg shadow-primary-600/25 transition-all cursor-pointer tap-feedback mt-auto"
            id="settings-submit-btn"
          >
            {t.save}
          </button>
        </form>
      </div>
    </div>
  );
}
