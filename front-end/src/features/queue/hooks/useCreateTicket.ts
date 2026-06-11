import { useState } from "react";
import { createTicket } from "@/src/features/queue/services/queueService";

type TicketResponse = {
  ticketNumber: string;
  guestName: string;
  partySize: number;
  section: string;
  positionInQueue: number;
  estimatedWaitMinutes: number;
};

export function useCreateTicket() {
  const [loading, setLoading] = useState(false);

  const create = async (payload: {
    partySize: number;
    section: string;
    guestName: string;
  }) => {
    setLoading(true);

    try {
      const result = await createTicket(payload);
      return result.data as TicketResponse;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading };
}
