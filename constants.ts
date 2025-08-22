
import { Transaction, TransactionType, Category, Sheet } from './types';

export const initialTransactions: Transaction[] = [
  {
    id: '1',
    date: '2023-10-01',
    description: 'Monthly Salary',
    amount: 5000,
    type: TransactionType.INCOME,
    category: Category.SALARY,
  },
  {
    id: '2',
    date: '2023-10-02',
    description: 'Groceries from SuperMart',
    amount: 150.75,
    type: TransactionType.EXPENSE,
    category: Category.FOOD,
  },
  {
    id: '3',
    date: '2023-10-03',
    description: 'Monthly Rent',
    amount: 1200,
    type: TransactionType.EXPENSE,
    category: Category.HOUSING,
  },
  {
    id: '4',
    date: '2023-10-05',
    description: 'Gasoline',
    amount: 60,
    type: TransactionType.EXPENSE,
    category: Category.TRANSPORT,
  },
  {
    id: '5',
    date: '2023-10-10',
    description: 'Dinner with friends',
    amount: 85.50,
    type: TransactionType.EXPENSE,
    category: Category.ENTERTAINMENT,
  },
   {
    id: '6',
    date: '2023-10-12',
    description: 'Electricity Bill',
    amount: 75.00,
    type: TransactionType.EXPENSE,
    category: Category.UTILITIES,
  },
];

export const initialSheets: Sheet[] = [
    {
        id: crypto.randomUUID(),
        name: 'Personal Finances',
        transactions: initialTransactions,
    },
    {
        id: crypto.randomUUID(),
        name: 'Vacation Fund',
        transactions: [
            { id: 'v1', date: '2023-10-01', description: 'Initial Deposit', amount: 1000, type: TransactionType.INCOME, category: Category.GIFTS },
            { id: 'v2', date: '2023-10-15', description: 'Plane Tickets', amount: 450, type: TransactionType.EXPENSE, category: Category.TRANSPORT },
        ]
    }
];

export const expenseCategories: Category[] = [
    Category.FOOD,
    Category.TRANSPORT,
    Category.HOUSING,
    Category.UTILITIES,
    Category.ENTERTAINMENT,
    Category.HEALTH,
    Category.SHOPPING,
    Category.PERSONAL_CARE,
    Category.EDUCATION,
    Category.OTHER
];

export const incomeCategories: Category[] = [
    Category.SALARY,
    Category.BUSINESS,
    Category.INVESTMENTS,
    Category.GIFTS,
    Category.OTHER
];
