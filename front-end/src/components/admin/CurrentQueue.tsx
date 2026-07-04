"use client";

import { useCallback, useEffect, useState } from "react";
import { useFetch } from "@/src/hooks/useFetch";
import { useDelete } from "@/src/hooks/useDelete";
import { usePatch } from "@/src/hooks/usePatch";
import { useQueueUpdates } from "@/src/hooks/useQueueUpdates";
import type { CurrentQueueResponse } from "@/src/types/admin.types";
import CurrentQueueTable from "./CurrentQueueTable";

type CurrentQueueProps = {
  showToast: (message: string) => void;
  totalGuest: number;
  refreshTodayStats: () => Promise<void>;
};

export default function CurrentQueue({
  showToast,
  totalGuest,
  refreshTodayStats,
}: CurrentQueueProps) {
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [currentQueue, setCurrentQueue] = useState<CurrentQueueResponse | null>(
    null,
  );

  const { load: loadCurrentQueue } = useFetch<CurrentQueueResponse>(
    `/admin/current-queue?page=${page}`,
  );

  const { remove: deleteQueue } = useDelete("/admin/delete-queue");
  const { patch: updateStatus } = usePatch("/admin/update-queue-status");

  const fetchData = useCallback(async () => {
    const result = await loadCurrentQueue();
    setCurrentQueue(result);
  }, [loadCurrentQueue]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData, page]);

  useQueueUpdates(fetchData);

  const queueData = currentQueue?.data.items ?? [];
  const totalPages = currentQueue?.data.totalPages ?? 1;
  const hasGuests = queueData.length > 0;

  const startPage = Math.max(1, page - 1);
  const endPage = Math.min(totalPages, startPage + 2);

  const pages: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id);

      await deleteQueue(id);

      const updated = await loadCurrentQueue();
      setCurrentQueue(updated);

      await refreshTodayStats();
    } finally {
      setDeletingId(null);
    }
  };
  const handleUpdate = async (id: number, status: string) => {
    try {
      await updateStatus(id, { status });

      const updated = await loadCurrentQueue();
      setCurrentQueue(updated);

      await refreshTodayStats();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="col-span-4">
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        {/* HEADER */}
        <div className="p-4 px-5 border-b border-border flex items-center justify-between">
          <div className="font-semibold text-sm text-text">Current Queue</div>

          <div className="bg-brand-light text-brand text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            {totalGuest} {totalGuest === 1 ? "guest" : "guests"}
          </div>
        </div>

        {/* BODY */}
        {hasGuests ? (
          <>
            <CurrentQueueTable
              showToast={showToast}
              queueData={queueData}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              deletingId={deletingId}
            />

            {/* PAGINATION */}
            <div className="flex justify-end items-center gap-2 p-4 border-t border-border">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-6 w-6 flex items-center justify-center rounded border border-border text-xs
                cursor-pointer disabled:opacity-40 hover:bg-gray-100 disabled:cursor-not-allowed"
              >
                ←
              </button>

              {pages.map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`h-6 w-6 rounded text-xs font-medium transition
                    border border-border cursor-pointer
                    hover:bg-brand-mid hover:border-brand-dark hover:text-white
                    ${
                      page === pageNumber
                        ? "bg-brand text-white border-brand"
                        : ""
                    }`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-6 w-6 flex items-center justify-center rounded border border-border text-xs
                cursor-pointer disabled:opacity-40 hover:bg-gray-100 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          </>
        ) : (
          <div className="p-12 text-center text-text-muted text-sm">
            <div className="text-4xl mb-2">🎉</div>
            No guests currently in queue
          </div>
        )}
      </div>
    </div>
  );
}
