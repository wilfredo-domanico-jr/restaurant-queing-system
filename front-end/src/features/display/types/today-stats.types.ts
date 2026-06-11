// Response
export interface TodayStatsResponse {
  message: string;
  data: {
    waiting: number;
    seated: number;
    averageWaitingTime: number;
    issued: number;
  };
}
