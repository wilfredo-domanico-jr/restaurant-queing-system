import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const HUB_URL = API_URL ? `${API_URL.replace(/\/api\/?$/, "")}/hubs/queue` : "";

export function useQueueUpdates(onUpdate: () => void) {
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    if (!HUB_URL) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, { withCredentials: false })
      .withAutomaticReconnect()
      .build();

    connection.on("queueUpdated", () => onUpdateRef.current());

    connection.start().catch((err) => console.error("SignalR connection failed", err));

    return () => {
      connection.stop();
    };
  }, []);
}
