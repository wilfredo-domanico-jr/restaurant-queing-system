"use client";

import { useState } from "react";
import Hero from "@/src/components/kiosk/Hero";
import PartySize from "@/src/components/kiosk/PartySize";
import SeatingPreference from "@/src/components/kiosk/SeatingPreference";
import JoinQueueForm from "@/src/components/kiosk/JoinQueueForm";
import TicketModal from "@/src/components/kiosk/TicketModal";
export default function Kiosk() {
  const [partySize, setPartySize] = useState<number | null>(null);
  const [section, setSection] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [ticketData, setTicketData] = useState<null | {
    ticketNumber: string;
    name: string;
    partySize: number;
    section: string;
    position: number;
    waitTime: number;
  }>(null);

  function joinQueue() {
    setTicketData({
      ticketNumber: `A${Math.floor(Math.random() * 900 + 100)}`,
      name,
      partySize: partySize!,
      section: section!,
      position: 1,
      waitTime: 10,
    });
  }

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
            joinQueue={joinQueue}
            setName={setName}
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
