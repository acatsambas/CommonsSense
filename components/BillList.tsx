
import React from 'react';
import { Bill } from '../types';
import BillListItem from './BillListItem';
import Loader from './Loader';

interface BillListProps {
  bills: Bill[];
  selectedBillId: string | null | undefined;
  onSelectBill: (bill: Bill) => void;
  isLoading: boolean;
  isAnalyzing: boolean;
}

const BillList: React.FC<BillListProps> = ({ bills, selectedBillId, onSelectBill, isLoading, isAnalyzing }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-full">
      <h2 className="text-xl font-bold mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Recent Bills</h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <Loader />
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto max-h-[75vh] pr-2">
          {bills.map((bill) => (
            <BillListItem
              key={bill.id}
              bill={bill}
              isSelected={bill.id === selectedBillId}
              onClick={() => onSelectBill(bill)}
              isAnalyzing={isAnalyzing && bill.id === selectedBillId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BillList;
