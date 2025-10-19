
import React from 'react';
import { Bill } from '../types';

interface BillListItemProps {
  bill: Bill;
  isSelected: boolean;
  onClick: () => void;
  isAnalyzing: boolean;
}

const BillListItem: React.FC<BillListItemProps> = ({ bill, isSelected, onClick, isAnalyzing }) => {
  const date = new Date(bill.pubDate);
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div
      onClick={onClick}
      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 dark:border-blue-400 shadow-md'
          : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
      }`}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-md text-gray-800 dark:text-white pr-4">{bill.title}</h3>
        {isAnalyzing && (
            <div className="flex-shrink-0">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formattedDate}</p>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
        {bill.description}
      </p>
    </div>
  );
};

export default BillListItem;
