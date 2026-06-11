import { useState } from "react";
import { createTicket } from "@/src/features/queue/services/queueService";

export function useQueue() {
  const [partySize, setPartySize] = useState(1);
  const [section, setSection] = useState("");
  const [name, setName] = useState("");

  const [ticketData, setTicketData] = useState<null | {
    ticketNumber: string;
    name: string;
    partySize: number;
    section: string;
    position: number;
    waitTime: number;
  }>(null);

  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);

    try {
      const result = await createTicket({
        partySize,
        section,
        guestName: name,
      });

      const data = result.data;

      setTicketData({
        ticketNumber: data.ticketNumber,
        name: data.guestName,
        partySize: data.partySize,
        section: data.section,
        position: data.positionInQueue,
        waitTime: data.estimatedWaitMinutes,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    partySize,
    setPartySize,
    section,
    setSection,
    name,
    setName,
    ticketData,
    setTicketData,
    loading,
    handleCreate,
  };
}
