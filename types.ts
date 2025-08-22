
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum Category {
  // Expenses
  FOOD = 'Food & Dining',
  TRANSPORT = 'Transportation',
  HOUSING = 'Housing',
  UTILITIES = 'Utilities',
  ENTERTAINMENT = 'Entertainment',
  HEALTH = 'Health & Wellness',
  SHOPPING = 'Shopping',
  PERSONAL_CARE = 'Personal Care',
  EDUCATION = 'Education',
  
  // Income
  SALARY = 'Salary',
  BUSINESS = 'Business',
  INVESTMENTS = 'Investments',
  GIFTS = 'Gifts',

  // Both
  OTHER = 'Other',
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
}

export interface ParsedReceipt {
  description: string;
  amount: number;
  category: Category;
  date?: string;
}

export interface Sheet {
  id: string;
  name: string;
  transactions: Transaction[];
}

export type View = 'dashboard' | 'reports' | 'trash';
