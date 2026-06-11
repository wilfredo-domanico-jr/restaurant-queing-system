import { useState } from "react";

export function useQueueForm() {
  const [partySize, setPartySize] = useState(1);
  const [section, setSection] = useState("");
  const [name, setName] = useState("");

  return {
    partySize,
    setPartySize,
    section,
    setSection,
    name,
    setName,
  };
}
