export interface GeneratedAsset {
  id: string;
  imageUrl: string;
  prompt: string;
  timestamp: number;
}

export interface Scenario {
  id: string;
  label: string;
  icon: string;
  promptTemplate: string;
  description: string;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface GenerationError {
  message: string;
}