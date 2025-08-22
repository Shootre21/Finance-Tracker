
import React from 'react';
import WalletIcon from './icons/WalletIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-surface shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center">
        <WalletIcon className="h-8 w-8 text-primary" />
        <h1 className="ml-3 text-2xl font-bold text-gray-800 tracking-tight">
          Zenith Finance Tracker
        </h1>
      </div>
    </header>
  );
};

export default Header;
