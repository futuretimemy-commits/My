import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, CalendarRange, Sparkles } from 'lucide-react';
import { getWeekDates, getMonthDates, formatDateKey } from '../utils';
import { Transaction, FinancialTask } from '../types';

interface WeeklyCalendarProps {
  currentWeekPivot: Date;
  selectedDateStr: string | null; // null represents "All Week"
  setSelectedDateStr: (dateStr: string | null) => void;
  setCurrentWeekPivot: (date: Date) => void;
  transactions: Transaction[];
  tasks: FinancialTask[];
  language: 'en' | 'ru';
}

const DAYS_NAME_EN = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const DAYS_NAME_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const MONTHS_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

export default function WeeklyCalendar({
  currentWeekPivot,
  selectedDateStr,
  setSelectedDateStr,
  setCurrentWeekPivot,
  transactions,
  tasks,
  language,
}: WeeklyCalendarProps) {
  const [isMonthView, setIsMonthView] = useState(false);

  const dates = isMonthView 
    ? getMonthDates(new Date(currentWeekPivot)) 
    : getWeekDates(new Date(currentWeekPivot));

  const dayNames = language === 'en' ? DAYS_NAME_EN : DAYS_NAME_RU;
  const monthNames = language === 'en' ? MONTHS_EN : MONTHS_RU;
  const allWeekLabel = language === 'en' ? 'All Week' : 'Вся неделя';

  const pivotYear = currentWeekPivot.getFullYear();
  const pivotMonth = currentWeekPivot.getMonth();

  // Shift pivot date by week or month
  const shiftTime = (direction: 'prev' | 'next') => {
    const nextPivot = new Date(currentWeekPivot);
    if (isMonthView) {
      nextPivot.setMonth(nextPivot.getMonth() + (direction === 'next' ? 1 : -1));
    } else {
      nextPivot.setDate(nextPivot.getDate() + (direction === 'next' ? 7 : -7));
    }
    setCurrentWeekPivot(nextPivot);

    // If a day is selected, automatically update it too so it stays in sync
    if (selectedDateStr) {
      const sel = new Date(selectedDateStr);
      if (isMonthView) {
        sel.setMonth(sel.getMonth() + (direction === 'next' ? 1 : -1));
      } else {
        sel.setDate(sel.getDate() + (direction === 'next' ? 7 : -7));
      }
      setSelectedDateStr(formatDateKey(sel));
    }
  };

  // Quick reset to Today
  const handleJumpToToday = () => {
    const today = new Date();
    setCurrentWeekPivot(today);
    setSelectedDateStr(formatDateKey(today));
  };

  const getDayStatus = (dateStr: string) => {
    const dayTx = transactions.filter((t) => t.date === dateStr);
    const dayTasks = tasks.filter((t) => t.dueDate === dateStr);

    return {
      hasIncome: dayTx.some((t) => t.type === 'income'),
      hasExpense: dayTx.some((t) => t.type === 'expense'),
      hasTask: dayTasks.some((t) => !t.completed),
    };
  };

  const todayStr = formatDateKey(new Date());

  // Format month and year label (e.g., "July 2026")
  const headerLabel = isMonthView 
    ? `${monthNames[pivotMonth]} ${pivotYear}`
    : (() => {
        const first = dates[0];
        const last = dates[6];
        if (!first || !last) return '';
        if (first.getMonth() === last.getMonth()) {
          return `${monthNames[first.getMonth()]} ${first.getFullYear()}`;
        }
        return `${monthNames[first.getMonth()].substring(0, 3)} - ${monthNames[last.getMonth()].substring(0, 3)} ${first.getFullYear()}`;
      })();

  return (
    <div className="bg-[#0f172a] p-4 rounded-3xl shadow-md border border-gray-800/60 mb-4 shrink-0 transition-all duration-300">
      
      {/* Calendar Control Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => shiftTime('prev')}
            className="p-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 tap-feedback cursor-pointer transition-colors"
            id="cal-prev-btn"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleJumpToToday}
            className="px-2 py-1 rounded-lg bg-primary-600/10 hover:bg-primary-600/20 text-primary-400 text-[10px] font-bold uppercase tracking-wider tap-feedback cursor-pointer transition-colors"
            id="cal-today-btn"
          >
            {language === 'en' ? 'Today' : 'Сегодня'}
          </button>
        </div>

        {/* Toggleable Month Title */}
        <button
          onClick={() => setIsMonthView(!isMonthView)}
          className="font-display font-bold text-sm tracking-wide text-gray-100 flex items-center gap-1.5 hover:text-primary-400 transition-colors tap-feedback cursor-pointer bg-transparent py-1 px-2 rounded-lg"
          id="cal-toggle-view-btn"
          title={language === 'en' ? 'Toggle Month/Week View' : 'Переключить месяц/неделю'}
        >
          <CalendarRange className={`w-4.5 h-4.5 text-primary-500 transition-transform duration-300 ${isMonthView ? 'rotate-180 text-amber-500' : ''}`} />
          <span>{headerLabel}</span>
          <span className="text-[9px] bg-gray-800 text-gray-400 font-mono px-1.5 py-0.5 rounded ml-1">
            {isMonthView ? (language === 'en' ? 'Month' : 'Месяц') : (language === 'en' ? 'Week' : 'Неделя')}
          </span>
        </button>

        <button
          onClick={() => shiftTime('next')}
          className="p-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 tap-feedback cursor-pointer transition-colors"
          id="cal-next-btn"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Week Day Names Grid */}
      <div className="grid grid-cols-7 gap-1.5 text-center mb-1.5">
        {dayNames.map((name) => (
          <span key={name} className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">
            {name}
          </span>
        ))}
      </div>

      {/* Day Cells Ribbon/Grid */}
      <div className={`grid grid-cols-7 gap-1.5 transition-all duration-300 ${isMonthView ? 'max-h-[220px] overflow-y-auto no-scrollbar' : ''}`}>
        {dates.map((date) => {
          const dateStr = formatDateKey(date);
          const isSelected = selectedDateStr === dateStr;
          const isToday = dateStr === todayStr;
          const dayNum = date.getDate();
          const { hasIncome, hasExpense, hasTask } = getDayStatus(dateStr);
          
          // Determine if day belongs to different month (for Month View dims)
          const isDiffMonth = isMonthView && date.getMonth() !== pivotMonth;

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDateStr(dateStr)}
              className={`flex flex-col items-center py-2 rounded-xl transition-all duration-200 tap-feedback cursor-pointer ${
                isSelected
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 scale-102 font-bold'
                  : isToday
                  ? 'bg-gray-800/70 border border-primary-500/40 text-primary-400 font-semibold'
                  : isDiffMonth
                  ? 'text-gray-600 opacity-40 hover:bg-gray-800/20'
                  : 'hover:bg-gray-800/40 text-gray-300'
              }`}
              id={`calendar-day-${dateStr}`}
            >
              <span className="font-display text-[13px] font-semibold leading-tight">
                {dayNum}
              </span>

              {/* Multi-dot Indicators */}
              <div className="flex justify-center gap-0.5 mt-1 h-1 w-full">
                {hasIncome && (
                  <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-finance-green'}`} />
                )}
                {hasExpense && (
                  <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-finance-red'}`} />
                )}
                {hasTask && (
                  <span className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-amber-500'}`} />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* "All Week" / Reset filter option */}
      <button
        onClick={() => setSelectedDateStr(null)}
        className={`w-full py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all mt-3 ${
          selectedDateStr === null
            ? 'bg-gray-700/60 text-white border border-gray-600/50'
            : 'bg-gray-850 hover:bg-gray-800 text-gray-400 border border-transparent'
        } cursor-pointer tap-feedback`}
        id="all-week-toggle"
      >
        {isMonthView 
          ? (language === 'en' ? 'Show All Month Operations' : 'Показать операции за весь месяц')
          : allWeekLabel
        }
      </button>
    </div>
  );
}
