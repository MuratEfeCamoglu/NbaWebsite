import type { ReactNode } from "react";

/** Secondary button in the sticky action bar: compact on phones, full size from `sm`. */
export const ACTION_BUTTON =
  "border-border-strong font-display hover:bg-surface-active flex h-11 items-center justify-center gap-1.5 rounded-xl border px-3 text-base font-bold tracking-[0.04em] whitespace-nowrap sm:h-13 sm:gap-2 sm:px-6 sm:text-xl sm:tracking-[0.08em]";

/** Primary (filled) button in the sticky action bar. */
export const ACTION_PRIMARY =
  "bg-ink text-bg font-display flex h-11 items-center justify-center gap-1.5 rounded-xl px-3 text-base font-extrabold tracking-[0.04em] whitespace-nowrap hover:bg-white sm:h-13 sm:gap-2 sm:px-7 sm:text-xl sm:tracking-[0.08em]";

/**
 * Bottom bar of a step page. On phones it shrinks to one row of buttons so it
 * does not cover the list; the status text is shown from `sm` up.
 */
export function ActionBar({
  status,
  children,
}: {
  status: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="border-border bg-bg sticky bottom-0 z-20 mt-10 flex items-center justify-between gap-4 border-t px-4 py-3 sm:flex-wrap sm:px-6 sm:py-5 lg:px-30">
      <p
        role="status"
        className="text-ink-soft hidden max-w-[420px] text-sm sm:block"
      >
        {status}
      </p>
      <div className="flex w-full gap-2 sm:w-auto sm:flex-wrap sm:gap-3 [&>*]:flex-auto sm:[&>*]:flex-none">
        {children}
      </div>
    </div>
  );
}
