import { Transaction, FinancialTask, WeeklyBudgetGoal } from './types';

// Helper to get dates of a week starting from Monday, based on a pivot date
export function getWeekDates(pivotDate: Date): Date[] {
  const dates: Date[] = [];
  const day = pivotDate.getDay();
  // Adjust so Monday is index 0, Sunday is index 6
  const diff = pivotDate.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(pivotDate.setDate(diff));

  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(monday);
    nextDay.setDate(monday.getDate() + i);
    dates.push(nextDay);
  }
  return dates;
}

// Helper to get all dates of a month grid (including padding from previous/next months) based on a pivot date
export function getMonthDates(pivotDate: Date): Date[] {
  const year = pivotDate.getFullYear();
  const month = pivotDate.getMonth();
  
  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of current month
  const lastDay = new Date(year, month + 1, 0);
  
  const dates: Date[] = [];
  
  // Calculate padding for the beginning of the month (Monday is index 0, Sunday is index 6)
  const startDay = firstDay.getDay(); // 0 is Sunday, 1 is Monday...
  const paddingLeft = startDay === 0 ? 6 : startDay - 1;
  
  // Add padding days from the previous month
  const prevMonthLast = new Date(year, month, 0);
  for (let i = paddingLeft - 1; i >= 0; i--) {
    const d = new Date(prevMonthLast);
    d.setDate(prevMonthLast.getDate() - i);
    dates.push(d);
  }
  
  // Add all days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    dates.push(new Date(year, month, i));
  }
  
  // Pad right to fill a complete calendar grid row (multiple of 7 days)
  const totalDays = dates.length;
  const paddingRight = (7 - (totalDays % 7)) % 7;
  for (let i = 1; i <= paddingRight; i++) {
    dates.push(new Date(year, month + 1, i));
  }
  
  return dates;
}

// Format date to YYYY-MM-DD
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Format currency beautifully
export function formatCurrency(amount: number, currencySymbol: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencySymbol === '₽' ? 'RUB' : currencySymbol === '$' ? 'USD' : currencySymbol === '€' ? 'EUR' : 'KZT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace('RUB', '₽')
    .replace('KZT', '₸');
}

// Default mock data to start with so the user has an immediate, fully functional interactive experience
export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Salary Deposit',
    amount: 1500,
    type: 'income',
    category: 'Salary',
    date: formatDateKey(new Date()), // Today
    completed: true,
  },
  {
    id: 'tx-2',
    title: 'Grocery Shopping',
    amount: 65,
    type: 'expense',
    category: 'Food',
    date: formatDateKey(new Date()), // Today
    completed: true,
  },
  {
    id: 'tx-3',
    title: 'Electricity Bill',
    amount: 120,
    type: 'expense',
    category: 'Utilities',
    date: formatDateKey(new Date(Date.now() + 86400000)), // Tomorrow
    completed: false,
  },
  {
    id: 'tx-4',
    title: 'Gym Subscription',
    amount: 45,
    type: 'expense',
    category: 'Subscription',
    date: formatDateKey(new Date(Date.now() - 86400000)), // Yesterday
    completed: true,
  },
];

export const INITIAL_TASKS: FinancialTask[] = [
  {
    id: 'task-1',
    title: 'Review weekly grocery budget',
    dueDate: formatDateKey(new Date()), // Today
    completed: false,
    priority: 'medium',
    amountLinked: 100,
  },
  {
    id: 'task-2',
    title: 'Pay electric bill on time',
    dueDate: formatDateKey(new Date(Date.now() + 86400000)), // Tomorrow
    completed: false,
    priority: 'high',
    amountLinked: 120,
  },
  {
    id: 'task-3',
    title: 'Analyze monthly subscriptions',
    dueDate: formatDateKey(new Date(Date.now() - 86400000)), // Yesterday
    completed: true,
    priority: 'low',
  },
];

export const INITIAL_BUDGET: WeeklyBudgetGoal = {
  weeklyLimit: 500,
  savingsGoal: 200,
};

// Russian translation dictionary
export const TRANSLATIONS = {
  en: {
    appName: 'FinCalendar',
    weeklyPlanner: 'Weekly Financial Planner',
    calendar: 'Calendar',
    taskList: 'Task List',
    today: 'Today',
    income: 'Income',
    expense: 'Expense',
    balance: 'Balance',
    weeklyProgress: 'Weekly Progress',
    limitSpent: 'Spent of budget limit',
    addTransaction: 'Add Transaction',
    addTask: 'Add Financial Task',
    title: 'Title',
    amount: 'Amount',
    category: 'Category',
    date: 'Date',
    priority: 'Priority',
    notes: 'Notes (optional)',
    save: 'Save',
    cancel: 'Cancel',
    paid: 'Paid',
    due: 'Due',
    pending: 'Pending',
    completed: 'Completed',
    totalIncome: 'Total Income',
    totalExpense: 'Total Expenses',
    netSavings: 'Net Savings',
    noTransactions: 'No transactions for this day',
    noTasks: 'No tasks for this day',
    allWeek: 'All Week',
    selectedDay: 'Selected Day',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    budgetSettings: 'Budget & Goals',
    weeklyLimitLabel: 'Weekly Budget Limit',
    savingsGoalLabel: 'Weekly Savings Goal',
    currencyLabel: 'Preferred Currency',
    languageLabel: 'Language',
    placeholderTitle: 'e.g., Internet bill',
    placeholderTask: 'e.g., Pay phone invoice',
    linkedAmount: 'Linked Amount',
    emptyTasks: 'Keep going! No tasks left for today.',
    completedTasks: 'Completed Tasks',
    todoTasks: 'To-Do Tasks',
    allDays: 'All Days',
    markPaid: 'Mark Paid',
    markUnpaid: 'Mark Unpaid',
    quickSummary: 'Weekly Summary',
    status: 'Status',
    overBudget: 'Over budget limit!',
    onTrack: 'Excellent, you are on track!',
  },
  ru: {
    appName: 'ФинКалендарь',
    weeklyPlanner: 'Еженедельный ФинПланер',
    calendar: 'Календарь',
    taskList: 'Список задач',
    today: 'Сегодня',
    income: 'Доход',
    expense: 'Расход',
    balance: 'Баланс',
    weeklyProgress: 'Еженедельный прогресс',
    limitSpent: 'Потрачено из лимита',
    addTransaction: 'Добавить операцию',
    addTask: 'Добавить фин-задачу',
    title: 'Название',
    amount: 'Сумма',
    category: 'Категория',
    date: 'Дата',
    priority: 'Приоритет',
    notes: 'Заметки (необязательно)',
    save: 'Сохранить',
    cancel: 'Отмена',
    paid: 'Оплачено',
    due: 'К оплате',
    pending: 'В процессе',
    completed: 'Выполнено',
    totalIncome: 'Всего Доходов',
    totalExpense: 'Всего Расходов',
    netSavings: 'Чистая экономия',
    noTransactions: 'Нет операций на этот день',
    noTasks: 'Нет задач на этот день',
    allWeek: 'Вся неделя',
    selectedDay: 'Выбранный день',
    high: 'Высокий',
    medium: 'Средний',
    low: 'Низкий',
    budgetSettings: 'Бюджет и цели',
    weeklyLimitLabel: 'Недельный лимит трат',
    savingsGoalLabel: 'Цель по накоплениям',
    currencyLabel: 'Валюта приложения',
    languageLabel: 'Язык',
    placeholderTitle: 'Например, Интернет',
    placeholderTask: 'Например, Оплатить счет за телефон',
    linkedAmount: 'Связанная сумма',
    emptyTasks: 'Отлично! На сегодня задач нет.',
    completedTasks: 'Выполненные задачи',
    todoTasks: 'Текущие задачи',
    allDays: 'Все дни',
    markPaid: 'Отметить оплаченным',
    markUnpaid: 'Отметить неоплаченным',
    quickSummary: 'Сводка за неделю',
    status: 'Статус',
    overBudget: 'Лимит превышен!',
    onTrack: 'Отлично, вы укладываетесь в лимит!',
  },
};

export const CATEGORIES = [
  { id: 'Food', label_en: 'Food & Dining', label_ru: 'Еда и кафе', color: '#f59e0b', icon: 'ShoppingBag' },
  { id: 'Utilities', label_en: 'Bills & Utilities', label_ru: 'Коммунальные', color: '#ef4444', icon: 'Zap' },
  { id: 'Transport', label_en: 'Transport & Auto', label_ru: 'Транспорт и авто', color: '#3b82f6', icon: 'Car' },
  { id: 'Subscription', label_en: 'Subscriptions', label_ru: 'Подписки', color: '#8b5cf6', icon: 'Tv' },
  { id: 'Entertainment', label_en: 'Leisure', label_ru: 'Досуг и отдых', color: '#ec4899', icon: 'Sparkles' },
  { id: 'Salary', label_en: 'Work & Salary', label_ru: 'Зарплата / Доход', color: '#10b981', icon: 'Briefcase' },
  { id: 'Savings', label_en: 'Savings & Invest', label_ru: 'Накопления', color: '#06b6d4', icon: 'PiggyBank' },
  { id: 'Other', label_en: 'Other Expenses', label_ru: 'Другие расходы', color: '#6b7280', icon: 'CircleEllipsis' },
];
