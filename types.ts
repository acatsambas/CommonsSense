export interface Bill {
  id: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
}

export type ImpactScore = 'positive' | 'negative' | 'neutral';

export interface Rating {
  score: ImpactScore;
  justification: string;
}

export interface AnalysisResult {
  summary: string;
  ratings: {
    growth: Rating;
    publicServices: Rating;
    governance: Rating;
    environment: Rating;
  };
}