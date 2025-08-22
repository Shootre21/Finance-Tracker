
import React from 'react';
import DashboardCard from './DashboardCard';
import ArrowUpIcon from './icons/ArrowUpIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';
import BalanceIcon from './icons/BalanceIcon';

interface DashboardProps {
  balance: number;
  income: number;
  expenses: number;
}

const Dashboard: React.FC<DashboardProps> = ({ balance, income, expenses }) => {
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <DashboardCard 
          title="Total Balance" 
          amount={balance}
          icon={<BalanceIcon className="w-8 h-8"/>}
          color={balance >= 0 ? 'text-blue-600' : 'text-danger'}
        />
        <DashboardCard 
          title="Total Income" 
          amount={income} 
          icon={<ArrowUpIcon className="w-8 h-8"/>}
          color="text-secondary"
        />
        <DashboardCard 
          title="Total Expenses" 
          amount={expenses} 
          icon={<ArrowDownIcon className="w-8 h-8"/>}
          color="text-danger"
        />
      </div>
    </section>
  );
};

export default Dashboard;
