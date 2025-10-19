
import React, { useState, useEffect, useCallback } from 'react';
import { Bill, AnalysisResult } from './types';
import { fetchBills } from './services/parliamentService';
import { analyzeBillText } from './services/geminiService';
import Header from './components/Header';
import BillList from './components/BillList';
import BillAnalysis from './components/BillAnalysis';
import ErrorMessage from './components/ErrorMessage';

const App: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoadingBills, setIsLoadingBills] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBills = async () => {
      try {
        setError(null);
        setIsLoadingBills(true);
        const fetchedBills = await fetchBills();
        setBills(fetchedBills);
      } catch (err) {
        console.error('Failed to fetch bills:', err);
        setError('Failed to load parliamentary bills. The service may be unavailable or blocked. Please try again later.');
      } finally {
        setIsLoadingBills(false);
      }
    };
    loadBills();
  }, []);

  const handleSelectBill = useCallback(async (bill: Bill) => {
    if (selectedBill?.id === bill.id) return;
    
    setSelectedBill(bill);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setError(null);

    try {
      const billTextToAnalyze = `Title: ${bill.title}\n\nDescription: ${bill.description}`;
      const result = await analyzeBillText(billTextToAnalyze);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Failed to analyze bill:', err);
      setError('An error occurred during analysis. The AI service might be unavailable or the request could not be processed.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedBill]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <BillList
              bills={bills}
              selectedBillId={selectedBill?.id}
              onSelectBill={handleSelectBill}
              isLoading={isLoadingBills}
              isAnalyzing={isAnalyzing}
            />
          </div>
          <div className="lg:col-span-2">
            <BillAnalysis
              bill={selectedBill}
              analysis={analysisResult}
              isAnalyzing={isAnalyzing}
              error={error}
            />
             {error && !isAnalyzing && (
                <div className="mt-4">
                    <ErrorMessage message={error} />
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
