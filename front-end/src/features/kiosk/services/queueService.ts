import { apiClient } from "@/src/lib/apiClient";
import { CreateTicketDto, CreateTicketResponse } from "../types/kiosk.types";

// CREATE TICKET
export const createTicket = async (
  data: CreateTicketDto,
): Promise<CreateTicketResponse> => {
  return apiClient<CreateTicketResponse>("/kiosk/create-ticket", {
    method: "POST",
    body: JSON.stringify(data),
  });
};
