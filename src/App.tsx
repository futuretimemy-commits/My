import React, { useState, useEffect } from 'react';
import MobileFrame from './components/MobileFrame';
import WeeklyCalendar from './components/WeeklyCalendar';
import FinancialSummary from './components/FinancialSummary';
import TransactionsPanel from './components/TransactionsPanel';
import TasksPanel from './components/TasksPanel';
import QuickAddModal from './components/QuickAddModal';
import BudgetSettingsModal from './components/BudgetSettingsModal';

import { Transaction, FinancialTask, WeeklyBudgetGoal } from './types';
import {
  getWeekDates,
  formatDateKey,
  INITIAL_TRANSACTIONS,
  INITIAL_TASKS,
  INITIAL_BUDGET,
  TRANSLATIONS,
} from './utils';

import { Plus, Settings, Receipt, CheckSquare, Globe } from 'lucide-react';

export default function App() {
  // --- STATE INITIALIZATION WITH LOCALSTORAGE COLD STARTS ---
  const [language, setLanguage] = useState<'en' | 'ru'>(() => {
    const saved = localStorage.getItem('fin_language');
    if (saved === 'en' || saved === 'ru') return saved;
    // Default to 'ru' since prompt was "на телефон" in Russian
    return 'ru';
  });

  const [currencySymbol, setCurrencySymbol] = useState(() => {
    const saved = localStorage.getItem('fin_currency');
    return saved || '₽';
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('fin_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved transactions', e);
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  const [tasks, setTasks] = useState<FinancialTask[]>(() => {
    const saved = localStorage.getItem('fin_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved tasks', e);
      }
    }
    return INITIAL_TASKS;
  });

  const [budget, setBudget] = useState<WeeklyBudgetGoal>(() => {
    const saved = localStorage.getItem('fin_budget');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved budget', e);
      }
    }
    return INITIAL_BUDGET;
  });

  // Calendar Pivot / Dates States
  const [currentWeekPivot, setCurrentWeekPivot] = useState<Date>(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(() => formatDateKey(new Date()));

  // Panel toggles & popup states
  const [activeTab, setActiveTab] = useState<'transactions' | 'tasks'>('transactions');
  const [activeTypeFilter, setActiveTypeFilter] = useState<'income' | 'expense' | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // --- LOCAL STORAGE PERSISTENCE EFFECT WRITERS ---
  useEffect(() => {
    localStorage.setItem('fin_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('fin_currency', currencySymbol);
  }, [currencySymbol]);

  useEffect(() => {
    localStorage.setItem('fin_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('fin_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('fin_budget', JSON.stringify(budget));
  }, [budget]);

  // --- EVENT HANDLERS / CRUD CONTROLLERS ---

  // Add a new transaction
  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const tx: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setTransactions((prev) => [tx, ...prev]);
  };

  // Toggle transaction status (completed/paid vs pending)
  const handleToggleTxComplete = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Delete transaction
  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Add a new financial task
  const handleAddTask = (newTask: Omit<FinancialTask, 'id'>) => {
    const task: FinancialTask = {
      ...newTask,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setTasks((prev) => [task, ...prev]);
  };

  // Toggle task status (completed vs to-do)
  const handleToggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Delete task
  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Reset demo presets
  const handleResetData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setTasks(INITIAL_TASKS);
    setBudget(INITIAL_BUDGET);
    setCurrencySymbol('₽');
    setLanguage('ru');
    setSelectedDateStr(formatDateKey(new Date()));
    setCurrentWeekPivot(new Date());
  };

  // Helper date lists to calculate stats in current selected week
  const datesInCurrentWeek = getWeekDates(new Date(currentWeekPivot)).map((d) => formatDateKey(d));

  const t = TRANSLATIONS[language];

  return (
    <MobileFrame>
      {/* APP WRAPPER LAYOUT */}
      <div className="flex-1 flex flex-col px-4 pt-1 pb-4 bg-[#0b0f17] overflow-hidden">
        
        {/* TOP STATUS BAR APP HEADER */}
        <header className="flex items-center justify-between mb-3 shrink-0">
          <div className="flex flex-col">
            <h1 className="font-display font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
              <span>{t.appName}</span>
              <span className="text-[10px] bg-primary-500/10 text-primary-400 font-bold px-1.5 py-0.5 rounded-md uppercase border border-primary-500/25">
                PRO
              </span>
            </h1>
            <p className="text-[10px] text-gray-500 font-mono tracking-wider">
              {language === 'en' ? 'SIMPLE & CONVENIENT' : 'ПРОСТО И УДОБНО'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Super Quick Language toggle on Header */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
              className="px-2.5 py-1 rounded-xl bg-gray-800/60 border border-gray-700/40 text-[10px] font-bold text-gray-300 hover:text-white flex items-center gap-1 tap-feedback cursor-pointer transition-colors"
              title="Change Language"
              id="header-lang-toggle"
            >
              <Globe className="w-3 h-3 text-primary-400" />
              {language.toUpperCase()}
            </button>

            {/* Settings button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl bg-gray-800/60 border border-gray-700/40 text-gray-400 hover:text-white hover:bg-gray-700 tap-feedback cursor-pointer transition-colors"
              title="Settings"
              id="header-settings-btn"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* 1. WEEKLY CALENDAR STRIP */}
        <WeeklyCalendar
          currentWeekPivot={currentWeekPivot}
          selectedDateStr={selectedDateStr}
          setSelectedDateStr={setSelectedDateStr}
          setCurrentWeekPivot={setCurrentWeekPivot}
          transactions={transactions}
          tasks={tasks}
          language={language}
        />

        {/* 2. DYNAMIC BUDGET PROGRESS CARD */}
        <FinancialSummary
          transactions={transactions}
          budget={budget}
          currencySymbol={currencySymbol}
          language={language}
          selectedDateStr={selectedDateStr}
          datesInCurrentWeek={datesInCurrentWeek}
          activeTypeFilter={activeTypeFilter}
          setActiveTypeFilter={setActiveTypeFilter}
        />

        {/* 3. DUAL SECTOR NAVIGATION TAB (Operations vs Tasks Checklist) */}
        <div className="grid grid-cols-2 bg-gray-900/45 p-1 rounded-2xl gap-1 mb-4.5 shrink-0 border border-gray-850">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer tap-feedback ${
              activeTab === 'transactions'
                ? 'bg-primary-600 text-white shadow-md font-bold'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            id="app-tab-transactions"
          >
            <Receipt className="w-4 h-4" />
            {language === 'en' ? 'Operations' : 'Операции'}
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer tap-feedback ${
              activeTab === 'tasks'
                ? 'bg-primary-600 text-white shadow-md font-bold'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            id="app-tab-tasks"
          >
            <CheckSquare className="w-4 h-4" />
            {language === 'en' ? 'Tasks & Checklist' : 'Фин-задачи'}
          </button>
        </div>

        {/* 4. MAIN ACTIVITY PANEL */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          {activeTab === 'transactions' ? (
            <TransactionsPanel
              transactions={transactions}
              onToggleComplete={handleToggleTxComplete}
              onDeleteTransaction={handleDeleteTransaction}
              selectedDateStr={selectedDateStr}
              datesInCurrentWeek={datesInCurrentWeek}
              currencySymbol={currencySymbol}
              language={language}
              activeTypeFilter={activeTypeFilter}
            />
          ) : (
            <TasksPanel
              tasks={tasks}
              onToggleComplete={handleToggleTaskComplete}
              onDeleteTask={handleDeleteTask}
              selectedDateStr={selectedDateStr}
              datesInCurrentWeek={datesInCurrentWeek}
              currencySymbol={currencySymbol}
              language={language}
            />
          )}

          {/* iOS-style bottom floating action hub block (Plus button) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
            <button
              onClick={() => setIsAddOpen(true)}
              className="w-14 h-14 rounded-full bg-primary-600 hover:bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/30 tap-feedback hover:scale-105 transition-all cursor-pointer border border-primary-500/20"
              title={t.addTransaction}
              id="fab-add-button"
            >
              <Plus className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-Up Addition Sheet Panel */}
      <QuickAddModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddTransaction={handleAddTransaction}
        onAddTask={handleAddTask}
        selectedDateStr={selectedDateStr}
        language={language}
      />

      {/* Settings Panel */}
      <BudgetSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        budget={budget}
        onSaveBudget={setBudget}
        currencySymbol={currencySymbol}
        setCurrencySymbol={setCurrencySymbol}
        language={language}
        setLanguage={setLanguage}
        onResetData={handleResetData}
      />
    </MobileFrame>
  );
}
