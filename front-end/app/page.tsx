"use client";

import { useState } from "react";
import { createTicket } from "@/services/queueService";
import Hero from "@/src/components/kiosk/Hero";
import PartySize from "@/src/components/kiosk/PartySize";
import SeatingPreference from "@/src/components/kiosk/SeatingPreference";
import JoinQueueForm from "@/src/components/kiosk/JoinQueueForm";
import TicketModal from "@/src/components/kiosk/TicketModal";
export default function Kiosk() {
  const [partySize, setPartySize] = useState<number>(1);
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
        partySize: partySize,
        section: section,
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
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="view active block min-h-[calc(100vh-56px)] bg-cream">
        <Hero />

        <div className="max-w-3xl mx-auto py-10 px-6">
          <PartySize partySize={partySize} setPartySize={setPartySize} />

          <SeatingPreference section={section} setSection={setSection} />

          <JoinQueueForm
            name={name}
            partySize={partySize}
            section={section}
            handleCreate={handleCreate}
            setName={setName}
            loading={loading}
          />

          <p className="text-xs text-text-muted text-center mt-[-1rem]">
            By joining, you agree to our table allocation policy. Ticket expires
            after 5 minutes of calling.
          </p>
        </div>
      </div>
      {ticketData && (
        <TicketModal
          ticketNumber={ticketData.ticketNumber}
          name={ticketData.name}
          partySize={ticketData.partySize}
          section={ticketData.section}
          position={ticketData.position}
          waitTime={ticketData.waitTime}
          onClose={() => setTicketData(null)}
        />
      )}
    </>
  );
}
