import { useState } from "react";

type TicketData = {
  ticketNumber: string;
  name: string;
  partySize: number;
  section: string;
  position: number;
  waitTime: number;
};

export function useTicketModal() {
  const [ticketData, setTicketData] = useState<TicketData | null>(null);

  const open = (data: TicketData) => setTicketData(data);
  const close = () => setTicketData(null);

  return {
    ticketData,
    open,
    close,
  };
}
