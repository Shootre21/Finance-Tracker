
import React from 'react';
import { Transaction, TransactionType } from '../types';
import ArrowUpIcon from './icons/ArrowUpIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';
import TrashIcon from './icons/TrashIcon';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const TransactionItem: React.FC<{ transaction: Transaction; onDelete: (id: string) => void }> = ({ transaction, onDelete }) => {
  const isIncome = transaction.type === TransactionType.INCOME;
  const amountColor = isIncome ? 'text-secondary' : 'text-danger';
  const Icon = isIncome ? ArrowUpIcon : ArrowDownIcon;

  return (
    <li className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-full ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
          <Icon className={`w-5 h-5 ${amountColor}`} />
        </div>
        <div>
          <p className="font-semibold text-gray-800">{transaction.description}</p>
          <p className="text-sm text-gray-500">{transaction.category} &middot; {transaction.date}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <p className={`font-bold text-lg ${amountColor}`}>
          {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
        </p>
        <button 
          onClick={() => onDelete(transaction.id)}
          className="text-gray-400 hover:text-danger focus:outline-none"
          aria-label="Delete transaction"
        >
          <TrashIcon className="w-5 h-5"/>
        </button>
      </div>
    </li>
  );
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  return (
    <div className="bg-surface p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
      {transactions.length > 0 ? (
        <ul className="space-y-3">
          {transactions.map(transaction => (
            <TransactionItem key={transaction.id} transaction={transaction} onDelete={onDelete} />
          ))}
        </ul>
      ) : (
        <div className="text-center py-10">
            <p className="text-gray-500">No transactions yet.</p>
            <p className="text-sm text-gray-400">Add one using the form!</p>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
