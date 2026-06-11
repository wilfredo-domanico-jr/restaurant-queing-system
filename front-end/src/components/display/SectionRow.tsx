type SectionRowProps = {
  name: string;
  waiting: number;
};

export default function SectionRow({ name, waiting }: SectionRowProps) {
  return (
    <div className="flex justify-between items-center bg-white/5 rounded-[10px] py-[10px] px-3">
      <span className="text-[13px] text-white/70 font-medium">{name}</span>
      <span className="text-[12px] text-brand-mid font-semibold">
        {waiting} waiting
      </span>
    </div>
  );
}
