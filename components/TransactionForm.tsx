import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, Category, ParsedReceipt } from '../types';
import { incomeCategories, expenseCategories } from '../constants';
import PlusIcon from './icons/PlusIcon';
import CameraIcon from './icons/CameraIcon';
import ReceiptScannerModal from './ReceiptScannerModal';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState<Category>(Category.FOOD);
  const [currentCategories, setCurrentCategories] = useState<Category[]>(expenseCategories);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    if (type === TransactionType.EXPENSE) {
      setCurrentCategories(expenseCategories);
      if (!expenseCategories.includes(category)) {
        setCategory(Category.FOOD);
      }
    } else {
      setCurrentCategories(incomeCategories);
      if (!incomeCategories.includes(category)) {
        setCategory(Category.SALARY);
      }
    }
  }, [type, category]);

  const handleParseReceipt = (data: ParsedReceipt) => {
    setDescription(data.description);
    setAmount(String(data.amount));
    setType(TransactionType.EXPENSE); // Receipts are always expenses
    
    // Check if the category from AI is a valid expense category, otherwise default
    const isValidCategory = expenseCategories.includes(data.category);
    setCategory(isValidCategory ? data.category : Category.OTHER);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) {
      alert('Please fill in all fields.');
      return;
    }

    onAddTransaction({
      description,
      amount: parseFloat(amount),
      type,
      category,
    });

    setDescription('');
    setAmount('');
    setType(TransactionType.EXPENSE);
    setCategory(Category.FOOD);
  };

  return (
    <>
      <div className="bg-surface p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Add New Transaction</h3>
          <button 
              onClick={() => setIsScannerOpen(true)}
              className="text-primary hover:text-indigo-700 p-2 rounded-full hover:bg-indigo-50 transition-colors"
              aria-label="Scan a receipt"
              title="Scan a receipt"
          >
              <CameraIcon className="w-6 h-6"/>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Coffee meeting"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            >
              <option value={TransactionType.EXPENSE}>Expense</option>
              <option value={TransactionType.INCOME}>Income</option>
            </select>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            >
              {currentCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            <PlusIcon className="w-5 h-5 mr-2"/>
            Add Transaction
          </button>
        </form>
      </div>
      {isScannerOpen && (
        <ReceiptScannerModal 
            onClose={() => setIsScannerOpen(false)}
            onParse={handleParseReceipt}
        />
      )}
    </>
  );
};

export default TransactionForm;