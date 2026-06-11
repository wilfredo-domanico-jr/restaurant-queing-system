import { useState } from "react";
import { CreateTicketData } from "../types/queue.types";

export function useTicketModal() {
  const [ticketData, setTicketData] = useState<CreateTicketData | null>(null);

  const open = (data: CreateTicketData) => setTicketData(data);
  const close = () => setTicketData(null);

  return {
    ticketData,
    open,
    close,
  };
}
