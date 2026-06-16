"use client";

type JoinQueueFormProps = {
  name: string;
  partySize: number | null;
  section: string | null;
  setName: (value: string) => void;
  handleCreate: () => void;
  loading: boolean;
};

export default function JoinQueueForm({
  name,
  partySize,
  section,
  setName,
  handleCreate,
  loading,
}: JoinQueueFormProps) {
  return (
    <>
      <div className="font-serif text-2xl text-text mb-5">
        Your <span className="text-brand italic">name</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end mb-10">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-2 border-border rounded-xl p-3"
          placeholder="e.g. Maria Santos"
        />

        <button
          onClick={handleCreate}
          disabled={!name || !partySize || !section || loading}
          className="bg-brand text-white rounded-xl py-3 px-7 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Creating...
            </>
          ) : (
            "Get Ticket →"
          )}
        </button>
      </div>
    </>
  );
}
