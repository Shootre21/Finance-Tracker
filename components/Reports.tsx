
import React, { useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReportsProps {
  transactions: Transaction[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const Reports: React.FC<ReportsProps> = ({ transactions }) => {

  const spendingOverTimeData = useMemo(() => {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const expensesByDay: { [key: string]: number } = {};
    
    transactions
      .filter(t => t.type === TransactionType.EXPENSE && new Date(t.date) >= last30Days)
      .forEach(t => {
        const day = t.date;
        expensesByDay[day] = (expensesByDay[day] || 0) + t.amount;
      });

    return Object.entries(expensesByDay)
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  }, [transactions]);

  const incomeVsExpenseData = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const totals = transactions
      .filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
      })
      .reduce((acc, t) => {
        if (t.type === TransactionType.INCOME) {
          acc.income += t.amount;
        } else {
          acc.expense += t.amount;
        }
        return acc;
      }, { income: 0, expense: 0 });
    
    return [
      { name: 'This Month', income: totals.income, expense: totals.expense },
    ];
  }, [transactions]);

  const largestExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [transactions]);


  return (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-800">Spending Reports</h2>
      
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-surface p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4">Spending Over Time (Last 30 Days)</h3>
                 <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={spendingOverTimeData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            <Bar dataKey="amount" fill="#ef4444" name="Expenses" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div className="bg-surface p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4">Income vs. Expense (This Month)</h3>
                 <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={incomeVsExpenseData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            <Legend />
                            <Bar dataKey="income" fill="#10b981" name="Income" />
                            <Bar dataKey="expense" fill="#ef4444" name="Expense" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
        
        <div className="bg-surface p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold mb-4">Largest Expenses</h3>
            {largestExpenses.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                    {largestExpenses.map(t => (
                        <li key={t.id} className="py-3 flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-800">{t.description}</p>
                                <p className="text-sm text-gray-500">{t.date}</p>
                            </div>
                            <p className="font-bold text-danger">{formatCurrency(t.amount)}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 text-center py-4">No expenses to display.</p>
            )}
        </div>

    </div>
  );
};

export default Reports;
