"use client";

import { useState } from "react";
import { usePost } from "@/src/hooks/usePost";
import Hero from "@/src/components/kiosk/Hero";
import {
  CreateTicketRequest,
  CreateTicketResponse,
  CreateTicketData,
} from "@/src/types/kiosk.types";
import PartySize from "@/src/components/kiosk/PartySize";
import SeatingPreference from "@/src/components/kiosk/SeatingPreference";
import JoinQueueForm from "@/src/components/kiosk/JoinQueueForm";
import TicketModal from "@/src/components/kiosk/TicketModal";

export default function Kiosk() {
  const [form, setForm] = useState({
    guestName: "",
    partySize: 1,
    section: "",
  });

  const { post: submitTicket, loading } = usePost<
    CreateTicketResponse,
    CreateTicketRequest
  >("/kiosk/create-ticket");

  const [ticketData, setTicketData] = useState<CreateTicketData | null>(null);

  const handleCreate = async () => {
    try {
      const result = await submitTicket(form);

      setTicketData(result.data);

      setForm({
        guestName: "",
        partySize: 1,
        section: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="view active block min-h-[calc(100vh-56px)] bg-cream">
        <Hero />

        <div className="max-w-3xl mx-auto py-10 px-6">
          <PartySize
            partySize={form.partySize}
            setPartySize={(value) =>
              setForm((prev) => ({
                ...prev,
                partySize: value,
              }))
            }
          />

          <SeatingPreference
            section={form.section}
            setSection={(value) =>
              setForm((prev) => ({
                ...prev,
                section: value,
              }))
            }
          />

          <JoinQueueForm
            name={form.guestName}
            partySize={form.partySize}
            section={form.section}
            setName={(value) =>
              setForm((prev) => ({
                ...prev,
                guestName: value,
              }))
            }
            handleCreate={handleCreate}
            loading={loading}
          />

          <p className="text-xs text-text-muted text-center mt-[-1rem]">
            By joining, you agree to our table allocation policy.
          </p>
        </div>
      </div>

      {ticketData && (
        <TicketModal
          ticketNumber={ticketData.ticketNumber}
          guestName={ticketData.guestName}
          partySize={ticketData.partySize}
          section={ticketData.section}
          positionInQueue={ticketData.positionInQueue}
          estimatedWaitMinutes={ticketData.estimatedWaitMinutes}
          onClose={() => setTicketData(null)}
        />
      )}
    </>
  );
}
