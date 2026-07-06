export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string; // YYYY-MM-DD
  completed: boolean; // For tracking if a bill/income is paid/received
  notes?: string;
}

export interface FinancialTask {
  id: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  amountLinked?: number; // Optional associated financial value
  notes?: string;
}

export interface WeeklyBudgetGoal {
  weeklyLimit: number;
  savingsGoal: number;
}
