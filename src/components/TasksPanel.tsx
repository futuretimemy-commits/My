import React, { useState } from 'react';
import { CheckCircle2, Circle, Trash2, Calendar, AlertCircle, Coins, Filter } from 'lucide-react';
import { FinancialTask } from '../types';
import { formatCurrency, TRANSLATIONS } from '../utils';

interface TasksPanelProps {
  tasks: FinancialTask[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  selectedDateStr: string | null;
  datesInCurrentWeek: string[];
  currencySymbol: string;
  language: 'en' | 'ru';
}

export default function TasksPanel({
  tasks,
  onToggleComplete,
  onDeleteTask,
  selectedDateStr,
  datesInCurrentWeek,
  currencySymbol,
  language,
}: TasksPanelProps) {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'todo' | 'completed'>('todo');
  const [priorityFilter, setPriorityFilter] = useState<'high' | 'medium' | 'low' | null>(null);

  // Filter tasks for selected day or full week
  const dateFiltered = tasks.filter((task) => {
    if (selectedDateStr) {
      return task.dueDate === selectedDateStr;
    }
    return datesInCurrentWeek.includes(task.dueDate);
  });

  // Apply priority filter if present
  const priorityFiltered = priorityFilter
    ? dateFiltered.filter((task) => task.priority === priorityFilter)
    : dateFiltered;

  const todoTasks = priorityFiltered.filter((task) => !task.completed);
  const completedTasks = priorityFiltered.filter((task) => task.completed);

  // Raw counts (before priority filters, to display accurate tabs counts)
  const totalTodoCount = dateFiltered.filter((task) => !task.completed).length;
  const totalCompletedCount = dateFiltered.filter((task) => task.completed).length;

  const displayedTasks = activeTab === 'todo' ? todoTasks : completedTasks;

  // Helper to get priority badge style & translated text
  const getPriorityStyle = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return {
          bg: 'bg-red-500/10 text-red-400 border-red-500/20',
          label: t.high,
        };
      case 'medium':
        return {
          bg: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
          label: t.medium,
        };
      case 'low':
        return {
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          label: t.low,
        };
    }
  };

  const formatShortDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const month = d.toLocaleString(language === 'en' ? 'en-US' : 'ru-RU', { month: 'short' });
    const day = d.getDate();
    return `${day} ${month}`;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0b0f17]">
      {/* Sub tabs for Tasks (To-Do vs Completed) */}
      <div className="flex bg-gray-900/40 p-1.5 rounded-2xl gap-1 mb-2.5 shrink-0">
        <button
          onClick={() => setActiveTab('todo')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all tap-feedback cursor-pointer ${
            activeTab === 'todo'
              ? 'bg-[#0f172a] text-white shadow-sm border border-gray-800/40'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          id="task-todo-tab"
        >
          {t.todoTasks} ({totalTodoCount})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all tap-feedback cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-[#0f172a] text-white shadow-sm border border-gray-800/40'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          id="task-completed-tab"
        >
          {t.completedTasks} ({totalCompletedCount})
        </button>
      </div>

      {/* Priority Filter Strip */}
      <div className="flex items-center gap-1.5 mb-3 shrink-0 overflow-x-auto no-scrollbar py-0.5">
        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mr-1 shrink-0 flex items-center gap-1">
          <Filter className="w-3 h-3 text-primary-500" />
          {language === 'en' ? 'Priority:' : 'Приоритет:'}
        </span>
        
        <button
          onClick={() => setPriorityFilter(null)}
          className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
            priorityFilter === null
              ? 'bg-primary-600 text-white'
              : 'bg-gray-800/50 text-gray-400 hover:text-gray-300'
          }`}
        >
          {language === 'en' ? 'All' : 'Все'}
        </button>

        <button
          onClick={() => setPriorityFilter('high')}
          className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            priorityFilter === 'high'
              ? 'bg-red-500/10 text-red-400 border-red-500/30 font-semibold'
              : 'bg-gray-800/30 text-gray-500 hover:text-red-400 border-transparent'
          }`}
        >
          {t.high}
        </button>

        <button
          onClick={() => setPriorityFilter('medium')}
          className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            priorityFilter === 'medium'
              ? 'bg-amber-500/10 text-amber-500 border-amber-500/30 font-semibold'
              : 'bg-gray-800/30 text-gray-500 hover:text-amber-400 border-transparent'
          }`}
        >
          {t.medium}
        </button>

        <button
          onClick={() => setPriorityFilter('low')}
          className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            priorityFilter === 'low'
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 font-semibold'
              : 'bg-gray-800/30 text-gray-500 hover:text-blue-400 border-transparent'
          }`}
        >
          {t.low}
        </button>
      </div>

      {/* Task List container */}
      <div className="flex-1 overflow-y-auto pr-0.5 no-scrollbar pb-24">
        {displayedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-800/40 flex items-center justify-center mb-3 border border-gray-800/30">
              <CheckCircle2 className="w-6 h-6 text-gray-500" />
            </div>
            <p className="text-sm font-medium text-gray-300">
              {activeTab === 'todo' ? t.emptyTasks : t.noTasks}
            </p>
            {priorityFilter !== null && (
              <p className="text-xs text-gray-500 mt-1">
                {language === 'en' ? 'Try resetting the priority filter' : 'Попробуйте сбросить фильтр приоритета'}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {displayedTasks.map((task) => {
              const pStyle = getPriorityStyle(task.priority);

              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-2xl bg-[#0f172a] border border-gray-800/50 flex items-center justify-between gap-3 group transition-all duration-200 ${
                    task.completed ? 'opacity-70' : ''
                  }`}
                  id={`task-item-${task.id}`}
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    {/* Circle Checkbox Trigger */}
                    <button
                      onClick={() => onToggleComplete(task.id)}
                      className="mt-0.5 shrink-0 text-gray-400 hover:text-primary-500 transition-colors cursor-pointer tap-feedback"
                      id={`task-toggle-${task.id}`}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-600 hover:text-gray-500" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      {/* Title with potential Strikethrough */}
                      <p
                        className={`text-sm font-semibold text-gray-100 leading-snug break-words ${
                          task.completed ? 'line-through text-gray-500' : ''
                        }`}
                      >
                        {task.title}
                      </p>

                      {/* Supporting Metas */}
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-gray-400">
                        {/* Priority Badge */}
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-md border font-bold uppercase tracking-wider ${pStyle.bg}`}
                        >
                          {pStyle.label}
                        </span>

                        {/* Linked Budget Item */}
                        {task.amountLinked && (
                          <span className="flex items-center gap-1 text-[11px] text-amber-500/90 font-medium">
                            <Coins className="w-3.5 h-3.5" />
                            {formatCurrency(task.amountLinked, currencySymbol)}
                          </span>
                        )}

                        {/* Date info if we are looking at All Week */}
                        {!selectedDateStr && (
                          <span className="text-[10px] text-primary-400/80 font-semibold uppercase tracking-wide flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatShortDate(task.dueDate)}
                          </span>
                        )}
                      </div>

                      {task.notes && (
                        <p className="text-xs text-gray-500 mt-1 italic break-words">{task.notes}</p>
                      )}
                    </div>
                  </div>

                  {/* Delete task trigger */}
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="w-7 h-7 rounded-lg border border-transparent text-gray-500 hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-all tap-feedback cursor-pointer shrink-0"
                    title="Delete Task"
                    id={`task-delete-${task.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
