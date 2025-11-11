export type BookStatusCount = {
  status: string;
  count: number;
};

export type CategoryFinishCount = {
  categoryName: string;
  count: number;
};

export type StatisticsData = {
  averagePagesReadInDay: number;
  averageReadingTimeInDays: number;
  statusCounts: BookStatusCount[];
  finishedBooksByCategory: CategoryFinishCount[];
};
