
import React, { useState, useMemo } from 'react';
import { Transaction, Sheet, TransactionType, View } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import CategoryChart from './components/CategoryChart';
import SideNav from './components/SideNav';
import Reports from './components/Reports';
import NewSheetModal from './components/NewSheetModal';
import TrashView from './components/TrashView';
import { initialSheets } from './constants';

const App: React.FC = () => {
  const [sheets, setSheets] = useState<Sheet[]>(initialSheets);
  const [deletedSheets, setDeletedSheets] = useState<Sheet[]>([]);
  const [activeSheetId, setActiveSheetId] = useState<string>(initialSheets[0]?.id || '');
  const [view, setView] = useState<View>('dashboard');
  const [isNewSheetModalOpen, setIsNewSheetModalOpen] = useState(false);

  const activeSheet = useMemo(() => {
    return sheets.find(s => s.id === activeSheetId);
  }, [sheets, activeSheetId]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      date: new Date().toISOString().split('T')[0],
    };
    
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? { ...sheet, transactions: [newTransaction, ...sheet.transactions] }
          : sheet
      )
    );
  };
  
  const deleteTransaction = (id: string) => {
     setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === activeSheetId 
          ? { ...sheet, transactions: sheet.transactions.filter(t => t.id !== id) }
          : sheet
      )
    );
  };

  const addSheet = (name: string) => {
    const newSheet: Sheet = {
      id: crypto.randomUUID(),
      name,
      transactions: [],
    };
    setSheets(prev => [...prev, newSheet]);
    setActiveSheetId(newSheet.id);
    setIsNewSheetModalOpen(false);
  };

  const deleteSheet = (id: string) => {
    const sheetToDelete = sheets.find(s => s.id === id);
    if (!sheetToDelete || sheets.length <= 1) return;

    setDeletedSheets(prev => [...prev, sheetToDelete]);
    const remainingSheets = sheets.filter(s => s.id !== id);
    setSheets(remainingSheets);

    if (activeSheetId === id) {
      setActiveSheetId(remainingSheets[0]?.id || '');
    }
  };

  const restoreSheet = (id: string) => {
    const sheetToRestore = deletedSheets.find(s => s.id === id);
    if (!sheetToRestore) return;

    setSheets(prev => [...prev, sheetToRestore].sort((a,b) => a.name.localeCompare(b.name)));
    setDeletedSheets(prev => prev.filter(s => s.id !== id));
  };

  const permanentlyDeleteSheet = (id: string) => {
    setDeletedSheets(prev => prev.filter(s => s.id !== id));
  };


  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    if (!activeSheet) return { totalIncome: 0, totalExpenses: 0, balance: 0 };

    const totalIncome = activeSheet.transactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = activeSheet.transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, balance };
  }, [activeSheet]);

  const activeTransactions = activeSheet?.transactions || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <SideNav 
          sheets={sheets}
          activeSheetId={activeSheetId}
          onSwitchSheet={setActiveSheetId}
          onAddSheet={() => setIsNewSheetModalOpen(true)}
          onDeleteSheet={deleteSheet}
          currentView={view}
          onSetView={setView}
        />
        <main className="flex-1 p-4 md:p-8">
          {view === 'dashboard' && activeSheet && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Dashboard 
                  balance={balance} 
                  income={totalIncome} 
                  expenses={totalExpenses} 
                />
                <TransactionList transactions={activeTransactions} onDelete={deleteTransaction} />
              </div>
              <div className="space-y-8">
                <TransactionForm onAddTransaction={addTransaction} />
                <CategoryChart transactions={activeTransactions} />
              </div>
            </div>
          )}
          {view === 'reports' && activeSheet && (
            <Reports transactions={activeTransactions} />
          )}
          {view === 'trash' && (
            <TrashView 
              deletedSheets={deletedSheets}
              onRestore={restoreSheet}
              onDeletePermanent={permanentlyDeleteSheet}
            />
          )}
           {!activeSheet && view !== 'trash' && (
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold text-gray-700">No Sheet Selected</h2>
              <p className="text-gray-500 mt-2">Create a new sheet or select one to get started.</p>
            </div>
           )}
        </main>
      </div>
      {isNewSheetModalOpen && (
        <NewSheetModal 
          onClose={() => setIsNewSheetModalOpen(false)}
          onSubmit={addSheet}
        />
      )}
    </div>
  );
};

export default App;