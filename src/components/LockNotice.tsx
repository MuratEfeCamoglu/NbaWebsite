import { tr } from "@/i18n/tr";

export function LockNotice() {
  return (
    <p
      role="status"
      className="border-warn/40 bg-warn/8 flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm text-[#F3E7B8]"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="text-warn shrink-0"
      >
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
      <span>
        <strong className="text-warn">{tr.lock.lockedTitle}</strong>{" "}
        {tr.lock.lockedText}
      </span>
    </p>
  );
}
