
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction, TransactionType } from '../types';

interface CategoryChartProps {
  transactions: Transaction[];
}

const COLORS = [
    '#0ea5e9', '#10b981', '#f97316', '#ef4444', '#8b5cf6', 
    '#3b82f6', '#f59e0b', '#ec4899', '#6366f1', '#14b8a6'
];

const CategoryChart: React.FC<CategoryChartProps> = ({ transactions }) => {
  const chartData = useMemo(() => {
    const expenseData = transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {} as { [key: string]: number });
    
    return Object.entries(expenseData).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  return (
    <div className="bg-surface p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-bold mb-4">Expense Breakdown</h3>
      <div style={{ width: '100%', height: 300 }}>
        {chartData.length > 0 ? (
            <ResponsiveContainer>
            <PieChart>
                <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                >
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Legend />
            </PieChart>
            </ResponsiveContainer>
        ) : (
             <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No expense data to display.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default CategoryChart;
