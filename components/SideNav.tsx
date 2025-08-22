
import React from 'react';
import { Sheet, View } from '../types';
import PlusIcon from './icons/PlusIcon';
import LayoutGridIcon from './icons/LayoutGridIcon';
import BarChartIcon from './icons/BarChartIcon';
import TrashIcon from './icons/TrashIcon';
import MinusCircleIcon from './icons/MinusCircleIcon';

interface SideNavProps {
  sheets: Sheet[];
  activeSheetId: string;
  onSwitchSheet: (id: string) => void;
  onAddSheet: () => void;
  onDeleteSheet: (id: string) => void;
  currentView: View;
  onSetView: (view: View) => void;
}

const NavLink: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
            isActive 
            ? 'bg-primary text-white' 
            : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);


const SideNav: React.FC<SideNavProps> = ({ sheets, activeSheetId, onSwitchSheet, onAddSheet, onDeleteSheet, currentView, onSetView }) => {
  return (
    <aside className="w-64 h-[calc(100vh-68px)] sticky top-[68px] bg-surface border-r border-gray-200 flex flex-col p-4">
      <nav className="space-y-2">
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Views</h3>
        <NavLink 
          icon={<LayoutGridIcon className="w-5 h-5"/>} 
          label="Dashboard"
          isActive={currentView === 'dashboard'}
          onClick={() => onSetView('dashboard')}
        />
        <NavLink 
          icon={<BarChartIcon className="w-5 h-5"/>} 
          label="Reports"
          isActive={currentView === 'reports'}
          onClick={() => onSetView('reports')}
        />
         <NavLink 
          icon={<TrashIcon className="w-5 h-5"/>} 
          label="Trash"
          isActive={currentView === 'trash'}
          onClick={() => onSetView('trash')}
        />
      </nav>

      <div className="mt-6 flex-grow">
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sheets</h3>
        <div className="space-y-1">
          {sheets.map(sheet => (
            <div key={sheet.id} className="group flex items-center justify-between rounded-md hover:bg-gray-200">
                <button
                onClick={() => onSwitchSheet(sheet.id)}
                className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                    sheet.id === activeSheetId && currentView !== 'trash'
                    ? 'bg-indigo-100 text-primary'
                    : 'text-gray-600'
                }`}
                >
                {sheet.name}
                </button>
                {sheets.length > 1 && (
                    <button 
                        onClick={() => onDeleteSheet(sheet.id)}
                        className="opacity-0 group-hover:opacity-100 text-danger/70 hover:text-danger p-1 mr-1 rounded-full transition-opacity"
                        aria-label={`Move ${sheet.name} to trash`}
                        title={`Move ${sheet.name} to trash`}
                    >
                        <MinusCircleIcon className="w-5 h-5"/>
                    </button>
                )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto">
         <button 
            onClick={onAddSheet}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
            <PlusIcon className="w-5 h-5" />
            <span>New Expense Sheet</span>
        </button>
      </div>
    </aside>
  );
};

export default SideNav;