import { useState } from "react";
import { createTicket } from "@/src/features/kiosk/services/queueService";
import { CreateTicketResponse } from "../types/kiosk.types";

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
      console.log("Create Ticket Response", result);
      return result as CreateTicketResponse;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading };
}
