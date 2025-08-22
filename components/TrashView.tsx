
import React from 'react';
import { Sheet } from '../types';
import RestoreIcon from './icons/RestoreIcon';
import TrashIcon from './icons/TrashIcon';

interface TrashViewProps {
  deletedSheets: Sheet[];
  onRestore: (id: string) => void;
  onDeletePermanent: (id: string) => void;
}

const TrashView: React.FC<TrashViewProps> = ({ deletedSheets, onRestore, onDeletePermanent }) => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Trash Bin</h2>
      
      <div className="bg-surface p-6 rounded-xl shadow-md">
        {deletedSheets.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {deletedSheets.map(sheet => (
              <li key={sheet.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-lg text-gray-800">{sheet.name}</p>
                  <p className="text-sm text-gray-500">{sheet.transactions.length} transaction(s)</p>
                </div>
                <div className="flex items-center space-x-4 mt-3 sm:mt-0">
                  <button
                    onClick={() => onRestore(sheet.id)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-secondary border border-secondary rounded-lg hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                    aria-label={`Restore sheet ${sheet.name}`}
                  >
                    <RestoreIcon className="w-5 h-5"/>
                    <span>Restore</span>
                  </button>
                  <button
                    onClick={() => onDeletePermanent(sheet.id)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-danger rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger"
                    aria-label={`Delete sheet ${sheet.name} permanently`}
                  >
                    <TrashIcon className="w-5 h-5"/>
                    <span>Delete Permanently</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-16">
            <TrashIcon className="w-16 h-16 mx-auto text-gray-300" />
            <h3 className="mt-4 text-xl font-semibold text-gray-800">The trash is empty</h3>
            <p className="mt-1 text-gray-500">Deleted sheets will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrashView;
