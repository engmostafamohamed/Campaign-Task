export type CallHandler = (phone: string) => Promise<{
  success: boolean;
  duration: number;
}>;

export interface IClock {
  now(): Date;
  setTimeout(callback: () => void, delay: number): void;
}

export type CampaignConfig = {
  phones: string[];
  maxConcurrentCalls: number;
  maxRetries: number;
  retryDelay: number;
  maxDailyMinutes: number;
  startTime: number;
  endTime: number;
};

export type RetryItem = {
  phone: string;
  attempts: number;
  nextRetryTime: number;
};

export interface ICampaign {
  start(): void;
  pause(): void;
  resume(): void;
  getStatus(): any;
}