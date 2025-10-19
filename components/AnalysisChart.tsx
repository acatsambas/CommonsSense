
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AnalysisResult } from '../types';

interface AnalysisChartProps {
  ratings: AnalysisResult['ratings'];
}

const AnalysisChart: React.FC<AnalysisChartProps> = ({ ratings }) => {
  const data = [
    { subject: 'Growth', A: ratings.growth.score, fullMark: 10 },
    { subject: 'Services', A: ratings.publicServices.score, fullMark: 10 },
    { subject: 'Governance', A: ratings.governance.score, fullMark: 10 },
    { subject: 'Environment', A: ratings.environment.score, fullMark: 10 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="#e0e0e0" dark:stroke="#4a5568" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#4a5568', dark: '#a0aec0', fontSize: 14 }} />
        <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: 'transparent' }} />
        <Radar name="Impact Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
        <Tooltip
            contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid #ccc',
                borderRadius: '8px',
                color: '#333'
            }}
            cursor={{ fill: 'rgba(59, 130, 246, 0.2)' }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default AnalysisChart;
