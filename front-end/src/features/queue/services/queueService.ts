import { apiClient } from "@/lib/apiClient";
import { CreateTicketDto, CreateTicketResponse } from "../types/queue.types";

// CREATE TICKET
export const createTicket = async (
  data: CreateTicketDto,
): Promise<CreateTicketResponse> => {
  return apiClient<CreateTicketResponse>("/queue/create-ticket", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
