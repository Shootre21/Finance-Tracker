
import React from 'react';

interface DashboardCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const DashboardCard: React.FC<DashboardCardProps> = ({ title, amount, icon, color }) => {
  return (
    <div className="bg-surface rounded-xl shadow-md p-6 flex items-center space-x-6 hover:shadow-lg transition-shadow duration-300">
      <div className={`p-3 rounded-full bg-opacity-10 ${color.replace('text-', 'bg-')}`}>
        <div className={color}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-subtle">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>
          {formatCurrency(amount)}
        </p>
      </div>
    </div>
  );
};

export default DashboardCard;
