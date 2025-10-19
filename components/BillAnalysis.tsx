import React from 'react';
import { Bill, AnalysisResult, Rating, ImpactScore } from '../types';
import Loader from './Loader';

interface BillAnalysisProps {
  bill: Bill | null;
  analysis: AnalysisResult | null;
  isAnalyzing: boolean;
  error: string | null;
}

const scoreStyles: Record<ImpactScore, string> = {
    positive: 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900',
    negative: 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900',
    neutral: 'text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600',
};

const RatingCard: React.FC<{ title: string; rating: Rating }> = ({ title, rating }) => (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg flex flex-col">
        <h4 className="font-bold text-gray-800 dark:text-white">{title}</h4>
        <div className={`px-3 py-1 rounded-full my-2 font-semibold text-base capitalize self-start ${scoreStyles[rating.score]}`}>
            {rating.score}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">{rating.justification}</p>
    </div>
);


const BillAnalysis: React.FC<BillAnalysisProps> = ({ bill, analysis }) => {
  if (!bill) {
    return (
      <div className="flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full min-h-[75vh]">
        <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Select a bill</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Choose a bill from the list to see its AI-powered analysis.</p>
        </div>
      </div>
    );
  }

  const isAnalyzing = !analysis;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-full">
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{bill.title}</h2>
      <a href={bill.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 block">
        Read Full Bill &#x2197;
      </a>

      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center h-96">
          <Loader />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Analyzing bill, please wait...</p>
        </div>
      )}
      
      {!isAnalyzing && analysis && (
         <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">AI Summary</h3>
              <p className="text-gray-700 dark:text-gray-300">{analysis.summary}</p>
            </div>
            
            <div>
                <h3 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">Impact Rating</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <RatingCard title="Growth" rating={analysis.ratings.growth} />
                    <RatingCard title="Public Services" rating={analysis.ratings.publicServices} />
                    <RatingCard title="Governance" rating={analysis.ratings.governance} />
                    <RatingCard title="Environment" rating={analysis.ratings.environment} />
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default BillAnalysis;