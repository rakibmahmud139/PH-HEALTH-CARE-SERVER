export type ISchedule = {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
};

export type IFiltersRequest = {
  startDate?: string | undefined;
  endDate?: string | undefined;
};
