import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, FileText, Check, Plus, ShoppingBag, Zap, Car, Tv, Sparkles, Briefcase, PiggyBank, CircleEllipsis } from 'lucide-react';
import { Transaction, FinancialTask } from '../types';
import { CATEGORIES, TRANSLATIONS, formatDateKey } from '../utils';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  onAddTask: (task: Omit<FinancialTask, 'id'>) => void;
  selectedDateStr: string | null;
  language: 'en' | 'ru';
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

export default function QuickAddModal({
  isOpen,
  onClose,
  onAddTransaction,
  onAddTask,
  selectedDateStr,
  language,
}: QuickAddModalProps) {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'transaction' | 'task'>('transaction');

  // Today or selected day
  const defaultDateStr = selectedDateStr || formatDateKey(new Date());

  // Transaction States
  const [txTitle, setTxTitle] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txType, setTxType] = useState<'income' | 'expense'>('expense');
  const [txCategory, setTxCategory] = useState('Food');
  const [txDate, setTxDate] = useState(defaultDateStr);
  const [txNotes, setTxNotes] = useState('');

  // Task States
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDate, setTaskDate] = useState(defaultDateStr);
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [taskAmountLinked, setTaskAmountLinked] = useState('');
  const [taskNotes, setTaskNotes] = useState('');

  // Synchronize dates when selected date or open state shifts
  useEffect(() => {
    if (isOpen) {
      setTxDate(defaultDateStr);
      setTaskDate(defaultDateStr);
    }
  }, [isOpen, defaultDateStr]);

  if (!isOpen) return null;

  // Handle saving transaction
  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txTitle.trim() || !txAmount) return;

    const amountNum = parseFloat(txAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    onAddTransaction({
      title: txTitle.trim(),
      amount: amountNum,
      type: txType,
      category: txCategory,
      date: txDate,
      completed: true, // Defaulting new items to completed/paid for ease of use, or let them toggle
      notes: txNotes.trim() ? txNotes.trim() : undefined,
    });

    // Reset Form
    setTxTitle('');
    setTxAmount('');
    setTxCategory('Food');
    setTxNotes('');
    onClose();
  };

  // Handle saving task
  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const linkedVal = taskAmountLinked ? parseFloat(taskAmountLinked) : undefined;

    onAddTask({
      title: taskTitle.trim(),
      dueDate: taskDate,
      completed: false,
      priority: taskPriority,
      amountLinked: linkedVal && !isNaN(linkedVal) ? linkedVal : undefined,
      notes: taskNotes.trim() ? taskNotes.trim() : undefined,
    });

    // Reset Form
    setTaskTitle('');
    setTaskAmountLinked('');
    setTaskNotes('');
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs transition-all duration-300">
      {/* Click outside background to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-Up Drawer Container */}
      <div className="relative bg-[#0b0f17] border-t border-gray-800 rounded-t-[32px] max-h-[92%] flex flex-col z-50 shadow-2xl overflow-hidden animate-slide-up">
        
        {/* Decorative notch line */}
        <div className="w-12 h-1.5 bg-gray-800 rounded-full mx-auto my-3" />

        {/* Modal Header */}
        <div className="px-6 flex items-center justify-between pb-3 border-b border-gray-800/60 shrink-0">
          <div className="flex bg-gray-900/60 p-1 rounded-2xl w-48 shrink-0">
            <button
              onClick={() => setActiveTab('transaction')}
              className={`flex-1 py-1 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'transaction'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:text-gray-300'
              } cursor-pointer`}
              id="add-tab-tx"
            >
              {language === 'en' ? 'Fin Operation' : 'Операция'}
            </button>
            <button
              onClick={() => setActiveTab('task')}
              className={`flex-1 py-1 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'task'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:text-gray-300'
              } cursor-pointer`}
              id="add-tab-task"
            >
              {language === 'en' ? 'Task' : 'Задача'}
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-gray-800/80 text-gray-400 hover:text-gray-200 cursor-pointer tap-feedback"
            id="close-add-modal-btn"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          {activeTab === 'transaction' ? (
            /* Transaction Form */
            <form onSubmit={handleSaveTransaction} className="flex flex-col gap-4">
              {/* Type Switcher (Income vs Expense) */}
              <div className="grid grid-cols-2 gap-2 bg-gray-900/40 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setTxType('expense');
                    setTxCategory('Food');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    txType === 'expense'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                  id="tx-type-expense-btn"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  {t.expense}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTxType('income');
                    setTxCategory('Salary');
                  }}
                  className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    txType === 'income'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                  id="tx-type-income-btn"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {t.income}
                </button>
              </div>

              {/* Title & Amount row */}
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-xs text-gray-400 font-medium mb-1 block">{t.title}</label>
                  <input
                    type="text"
                    required
                    value={txTitle}
                    onChange={(e) => setTxTitle(e.target.value)}
                    placeholder={t.placeholderTitle}
                    className="w-full bg-[#0f172a] text-sm text-gray-100 placeholder-gray-500 px-3.5 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-primary-500 transition-colors"
                    id="tx-title-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 font-medium mb-1 block">{t.amount}</label>
                    <input
                      type="number"
                      required
                      min="0.01"
                      step="any"
                      value={txAmount}
                      onChange={(e) => setTxAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-[#0f172a] font-mono text-sm text-gray-100 placeholder-gray-500 px-3.5 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-primary-500 transition-colors"
                      id="tx-amount-input"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 font-medium mb-1 block">{t.date}</label>
                    <input
                      type="date"
                      required
                      value={txDate}
                      onChange={(e) => setTxDate(e.target.value)}
                      className="w-full bg-[#0f172a] text-xs text-gray-100 px-3.5 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-primary-500 transition-colors"
                      id="tx-date-input"
                    />
                  </div>
                </div>
              </div>

              {/* Category Matrix */}
              <div>
                <label className="text-xs text-gray-400 font-medium mb-1.5 block">{t.category}</label>
                <div className="grid grid-cols-4 gap-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = txCategory === cat.id;
                    const IconComp = iconMap[cat.icon] || CircleEllipsis;
                    const label = language === 'en' ? cat.label_en : cat.label_ru;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setTxCategory(cat.id)}
                        className={`flex flex-col items-center p-2 rounded-xl border text-center cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-primary-600/10 border-primary-500 text-white'
                            : 'bg-[#0f172a] border-gray-850 text-gray-400 hover:text-gray-300'
                        }`}
                        id={`tx-category-option-${cat.id}`}
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center mb-1 text-white shadow-xs"
                          style={{ backgroundColor: cat.color }}
                        >
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] font-medium leading-tight line-clamp-1">
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes Input */}
              <div>
                <label className="text-xs text-gray-400 font-medium mb-1 block">{t.notes}</label>
                <textarea
                  value={txNotes}
                  onChange={(e) => setTxNotes(e.target.value)}
                  placeholder={t.notes}
                  className="w-full bg-[#0f172a] text-xs text-gray-100 placeholder-gray-500 px-3.5 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-primary-500 transition-colors h-16 resize-none"
                  id="tx-notes-input"
                />
              </div>

              {/* Save CTA */}
              <button
                type="submit"
                className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-semibold tracking-wide shadow-lg shadow-primary-600/20 transition-all cursor-pointer tap-feedback mt-2"
                id="tx-submit-btn"
              >
                {t.save}
              </button>
            </form>
          ) : (
            /* Task Form */
            <form onSubmit={handleSaveTask} className="flex flex-col gap-4">
              {/* Task Title */}
              <div>
                <label className="text-xs text-gray-400 font-medium mb-1 block">{t.title}</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder={t.placeholderTask}
                  className="w-full bg-[#0f172a] text-sm text-gray-100 placeholder-gray-500 px-3.5 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-primary-500 transition-colors"
                  id="task-title-input"
                />
              </div>

              {/* Dual-Column Input */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 font-medium mb-1 block">{t.date}</label>
                  <input
                    type="date"
                    required
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    className="w-full bg-[#0f172a] text-xs text-gray-100 px-3.5 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-primary-500 transition-colors"
                    id="task-date-input"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-medium mb-1 block">
                    {t.linkedAmount}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={taskAmountLinked}
                    onChange={(e) => setTaskAmountLinked(e.target.value)}
                    placeholder="e.g. 50 (optional)"
                    className="w-full bg-[#0f172a] font-mono text-xs text-gray-100 placeholder-gray-500 px-3.5 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-primary-500 transition-colors"
                    id="task-amount-input"
                  />
                </div>
              </div>

              {/* Priority Selector */}
              <div>
                <label className="text-xs text-gray-400 font-medium mb-1.5 block">{t.priority}</label>
                <div className="grid grid-cols-3 gap-2 bg-gray-900/40 p-1 rounded-2xl">
                  {(['low', 'medium', 'high'] as const).map((p) => {
                    const isSelected = taskPriority === p;
                    let pColorClass = 'text-blue-400';
                    let pBgClass = 'bg-blue-500/10 border-blue-500/20';
                    let text = t.low;

                    if (p === 'medium') {
                      pColorClass = 'text-amber-500';
                      pBgClass = 'bg-amber-500/10 border-amber-500/20';
                      text = t.medium;
                    } else if (p === 'high') {
                      pColorClass = 'text-red-400';
                      pBgClass = 'bg-red-500/10 border-red-500/20';
                      text = t.high;
                    }

                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setTaskPriority(p)}
                        className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? `${pColorClass} ${pBgClass} border`
                            : 'text-gray-400 hover:text-gray-300'
                        }`}
                        id={`task-priority-option-${p}`}
                      >
                        {text}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes Input */}
              <div>
                <label className="text-xs text-gray-400 font-medium mb-1 block">{t.notes}</label>
                <textarea
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                  placeholder={t.notes}
                  className="w-full bg-[#0f172a] text-xs text-gray-100 placeholder-gray-500 px-3.5 py-2.5 rounded-xl border border-gray-800 focus:outline-none focus:border-primary-500 transition-colors h-16 resize-none"
                  id="task-notes-input"
                />
              </div>

              {/* Save CTA */}
              <button
                type="submit"
                className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-semibold tracking-wide shadow-lg shadow-primary-600/20 transition-all cursor-pointer tap-feedback mt-2"
                id="task-submit-btn"
              >
                {t.save}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
