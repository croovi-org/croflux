import Link from "next/link";

type ReachItemProps = {
  icon: string;
  label: string;
  value: string;
  href: string;
};

export function ReachItem({ icon, label, value, href }: ReachItemProps) {
  return (
    <Link
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className="group flex items-start gap-3 rounded-[12px] border border-transparent px-1 py-1 transition hover:border-[#2a2a35] hover:bg-[#14141b]"
    >
      <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] border border-[#2a2a35] bg-[#18181f] text-[16px] text-[#e4e4e7]">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[12px] text-[#52525b]">{label}</div>
        <div className="truncate text-[13px] font-medium text-[#a1a1aa] transition group-hover:text-[#d4d4dd]">
          {value}
        </div>
      </div>
    </Link>
  );
}
