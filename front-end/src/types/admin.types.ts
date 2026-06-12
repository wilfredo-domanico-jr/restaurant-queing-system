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

// Response Item
export interface CurrentQueueItem {
  id: number;
  ticketNumber: string;
  guestName: string;
  partySize: number;
  section: string;
  waitingMinutes: number;
  joinedAt: string;
  status: string;
}

// Response
export interface CurrentQueueResponse {
  message: string;
  data: {
    items: CurrentQueueItem[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
