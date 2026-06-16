"use client";

import Hero from "@/src/components/kiosk/Hero";
import PartySize from "@/src/components/kiosk/PartySize";
import SeatingPreference from "@/src/components/kiosk/SeatingPreference";
import JoinQueueForm from "@/src/components/kiosk/JoinQueueForm";
import TicketModal from "@/src/components/kiosk/TicketModal";

import { useQueueForm } from "@/src/features/kiosk/hooks/useQueueFrom";
import { useCreateTicket } from "@/src/features/kiosk/hooks/useCreateTicket";
import { useTicketModal } from "@/src/features/kiosk/hooks/useTicketModal";

export default function Kiosk() {
  const form = useQueueForm();
  const ticketApi = useCreateTicket();
  const modal = useTicketModal();

  const handleCreate = async () => {
    const result = await ticketApi.create({
      partySize: form.partySize,
      section: form.section,
      guestName: form.name,
    });

    modal.open({
      ticketNumber: result.data.ticketNumber,
      guestName: result.data.guestName,
      partySize: result.data.partySize,
      section: result.data.section,
      positionInQueue: result.data.positionInQueue,
      estimatedWaitMinutes: result.data.estimatedWaitMinutes,
    });
  };

  return (
    <>
      <div className="view active block min-h-[calc(100vh-56px)] bg-cream">
        <Hero />

        <div className="max-w-3xl mx-auto py-10 px-6">
          <PartySize
            partySize={form.partySize}
            setPartySize={form.setPartySize}
          />

          <SeatingPreference
            section={form.section}
            setSection={form.setSection}
          />

          <JoinQueueForm
            name={form.name}
            partySize={form.partySize}
            section={form.section}
            setName={form.setName}
            handleCreate={handleCreate}
            loading={ticketApi.loading}
          />

          <p className="text-xs text-text-muted text-center mt-[-1rem]">
            By joining, you agree to our table allocation policy. 
          </p>
        </div>
      </div>

      {modal.ticketData && (
        <TicketModal
          ticketNumber={modal.ticketData.ticketNumber}
          guestName={modal.ticketData.guestName}
          partySize={modal.ticketData.partySize}
          section={modal.ticketData.section}
          positionInQueue={modal.ticketData.positionInQueue}
          estimatedWaitMinutes={modal.ticketData.estimatedWaitMinutes}
          onClose={modal.close}
        />
      )}
    </>
  );
}
