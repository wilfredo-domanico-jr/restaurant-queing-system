// Request
export interface CreateTicketRequest {
  partySize: number;
  section: string;
  guestName: string;
}

export interface CreateTicketData {
  ticketNumber: string;
  guestName: string;
  partySize: number;
  section: string;
  positionInQueue: number;
  estimatedWaitMinutes: number;
}

// Response
export interface CreateTicketResponse {
  message: string;
  data: CreateTicketData;
}
