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

export type BookSummary = {
  templateId: number;
  title: string;
  author: string;
  img: string;
};
