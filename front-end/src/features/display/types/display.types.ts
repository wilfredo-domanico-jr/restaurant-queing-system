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

// Response
export interface SectionStatusResponse {
  message: string;
  data: {
    indoor: number;
    outdoor: number;
    bar: number;
    vip: number;
  };
}

// Response
export interface NowServingResponse {
  message: string;
  data: {
    ticketNumber: string;
    guestName: string;
    partySize: number;
    joinedAt: string;
    section: string;
  };
}
