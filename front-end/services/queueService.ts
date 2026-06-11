import { apiClient } from "@/lib/apiClient";

// DTO type
export interface CreateTicketDto {
  partySize: number;
  section: string;
  guestName: string;
}

// Response
export interface CreateTicketResponse {
  message: string;
  data: {
    ticketNumber: string;
    guestName: string;
    partySize: number;
    section: string;
    positionInQueue: number;
    estimatedWaitMinutes: number;
  };
}

// CREATE TICKET
export const createTicket = async (
  data: CreateTicketDto,
): Promise<CreateTicketResponse> => {
  return apiClient<CreateTicketResponse>("/queue/create-ticket", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// GET ALL TICKETS
// export const getTickets = async () => {
//   return apiClient("queue/tickets");
// };
