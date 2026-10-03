"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TeamBadge } from "@/components/TeamBadge";
import { getTeam, type Conference, type TeamId } from "@/data/teams";
import { tr } from "@/i18n/tr";
import { WarnIcon } from "@/components/WarnIcon";
import { rankingConflicts } from "@/lib/consistency";
import { moveTeam } from "@/lib/ranking";
import type { Draft } from "@/lib/validation";

interface RankingListProps {
  conference: Conference;
  order: readonly TeamId[];
  /** Projections are shown next to each team and checked against the order. */
  picks: Draft["picks"];
  onChange: (order: TeamId[]) => void;
  disabled: boolean;
}

function teamLabel(teamId: UniqueIdentifier): string {
  const team = getTeam(teamId as TeamId);
  return `${team.city} ${team.name}`;
}

export function RankingList({
  conference,
  order,
  picks,
  onChange,
  disabled,
}: RankingListProps) {
  const conflicted = new Set(
    rankingConflicts(order, picks).map((conflict) => conflict.teamId),
  );
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const positionOf = (teamId: UniqueIdentifier) =>
    order.indexOf(teamId as TeamId) + 1;

  const announcements: Announcements = {
    onDragStart: ({ active }) =>
      tr.ranking.announce.start(teamLabel(active.id)),
    onDragOver: ({ active, over }) =>
      over
        ? tr.ranking.announce.over(teamLabel(active.id), positionOf(over.id))
        : undefined,
    onDragEnd: ({ active, over }) =>
      over
        ? tr.ranking.announce.end(teamLabel(active.id), positionOf(over.id))
        : tr.ranking.announce.cancel(teamLabel(active.id)),
    onDragCancel: ({ active }) =>
      tr.ranking.announce.cancel(teamLabel(active.id)),
  };

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    onChange(
      moveTeam(
        order,
        order.indexOf(active.id as TeamId),
        order.indexOf(over.id as TeamId),
      ),
    );
  }

  return (
    <DndContext
      id={`ranking-${conference}`}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      accessibility={{
        announcements,
        screenReaderInstructions: {
          draggable: tr.ranking.announce.instructions,
        },
      }}
    >
      <SortableContext
        items={[...order]}
        strategy={verticalListSortingStrategy}
        disabled={disabled}
      >
        <ol
          aria-label={tr.ranking.listLabel(tr.conference.names[conference])}
          className="border-border bg-surface overflow-hidden rounded-2xl border"
        >
          {order.map((teamId, index) => (
            <RankingRow
              key={teamId}
              teamId={teamId}
              rank={index + 1}
              projectedWins={picks[teamId]?.projectedWins}
              conflict={conflicted.has(teamId)}
              isFirst={index === 0}
              isLast={index === order.length - 1}
              disabled={disabled}
              onMove={(offset) =>
                onChange(moveTeam(order, index, index + offset))
              }
            />
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  );
}

interface RankingRowProps {
  teamId: TeamId;
  rank: number;
  projectedWins: number | undefined;
  conflict: boolean;
  isFirst: boolean;
  isLast: boolean;
  disabled: boolean;
  onMove: (offset: -1 | 1) => void;
}

function RankingRow({
  teamId,
  rank,
  projectedWins,
  conflict,
  isFirst,
  isLast,
  disabled,
  onMove,
}: RankingRowProps) {
  const team = getTeam(teamId);
  const label = `${team.city} ${team.name}`;
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: teamId });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: transform
          ? `translate3d(0, ${Math.round(transform.y)}px, 0)`
          : undefined,
        transition,
      }}
      className={`border-border flex h-16 items-center gap-2 border-b px-1.5 last:border-b-0 sm:gap-3 sm:px-3 ${
        isDragging
          ? "bg-surface-active relative z-10 shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
          : "bg-surface"
      }`}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label={tr.ranking.dragHandle(label)}
        disabled={disabled}
        className="text-ink-faint hover:text-ink flex size-11 shrink-0 cursor-grab touch-none items-center justify-center rounded-lg active:cursor-grabbing disabled:cursor-not-allowed"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          {[6, 12, 18].map((y) => (
            <g key={y} fill="currentColor">
              <circle cx="9" cy={y} r="1.7" />
              <circle cx="15" cy={y} r="1.7" />
            </g>
          ))}
        </svg>
      </button>
      <span className="font-display text-ink-muted w-6 shrink-0 text-right text-2xl font-bold tabular-nums sm:w-8 sm:text-3xl">
        {rank}
      </span>
      <TeamBadge teamId={teamId} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          lang="en"
          className="text-ink-muted truncate text-xs font-medium tracking-[0.06em] uppercase"
        >
          {team.city}
        </span>
        <span
          lang="en"
          className="font-display truncate text-xl leading-none font-bold tracking-[0.03em] uppercase sm:text-2xl"
        >
          {team.name}
        </span>
      </span>
      {projectedWins !== undefined && (
        <span
          title={conflict ? tr.ranking.conflictMark : undefined}
          className={`font-display flex w-9 shrink-0 flex-col items-end text-xl leading-none font-bold tabular-nums sm:w-10 sm:text-2xl ${
            conflict ? "text-warn" : "text-ink-soft"
          }`}
        >
          {conflict && <WarnIcon size={14} />}
          <span aria-hidden="true">{projectedWins}</span>
          <span className="sr-only">
            {tr.ranking.projection(projectedWins)}
            {conflict && `. ${tr.ranking.conflictMark}`}
          </span>
        </span>
      )}
      <span className="flex shrink-0">
        <MoveButton
          label={tr.ranking.moveUp(label)}
          direction="up"
          disabled={disabled || isFirst}
          onClick={() => onMove(-1)}
        />
        <MoveButton
          label={tr.ranking.moveDown(label)}
          direction="down"
          disabled={disabled || isLast}
          onClick={() => onMove(1)}
        />
      </span>
    </li>
  );
}

function MoveButton({
  label,
  direction,
  disabled,
  onClick,
}: {
  label: string;
  direction: "up" | "down";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="text-ink-soft hover:bg-surface-active hover:text-ink flex h-11 w-9 items-center justify-center rounded-lg sm:w-11 disabled:opacity-25 disabled:hover:bg-transparent"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={direction === "up" ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} />
      </svg>
    </button>
  );
}
