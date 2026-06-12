// Response
export interface TodayStatsResponse {
  message: string;
  data: {
    waiting: number;
    called: number;
    seated: number;
    noShow: number;
    averageWaitingTime: number;
  };
}
