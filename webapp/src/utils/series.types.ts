export enum Strategy {
  FIBONACCI = "fibonacci",
  DOUBLING = "doubling",
  SM2 = "sm2",
}

export type Series = {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  strategy: Strategy;
  hlc: string;
  // eventsUntil: string;
};

// todays data
export type Occurance = {
  id: string;
  date: string;
  seriesId: string;
  status: string;
  occurance: number;
  rate: number;
};
