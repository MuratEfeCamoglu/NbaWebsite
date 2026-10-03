import { SEASON, TOTAL_WINS } from "@config/season";
import { CONFERENCES, getTeam } from "@/data/teams";
import { tr } from "@/i18n/tr";
import {
  summarySections,
  type Summary,
  type SummaryRow,
  type SummarySection,
  type ViewMode,
} from "@/lib/summary";
import { formatDeviation, formatLine } from "@/lib/totals";

/** What the image contains: everything, only the ranking, or only the Alt/Üst picks. */
export type ImageVariant = "all" | "ranking" | "picks";

// Colors mirror the @theme tokens in globals.css (a canvas cannot read Tailwind classes).
const COLOR = {
  bg: "#070B14",
  surface: "#0A0F1B",
  surfaceRaised: "#0D1322",
  border: "#1E2840",
  ink: "#EEF2F8",
  inkSoft: "#B4BFD2",
  inkMuted: "#8D9AB2",
  inkFaint: "#6E7C98",
  over: "#FF8A3D",
  overInk: "#1C0D02",
  under: "#5AAEFF",
  underInk: "#03111F",
  warn: "#FFD447",
};

const PAD = 64;
const COLUMN_GAP = 40;
const HEADER_HEIGHT = 120;
const SECTION_TITLE_HEIGHT = 64;
const SECTION_GAP = 28;
const LABEL_ROW_HEIGHT = 40;
const ROW_HEIGHT = 70;
const LOGO_TILE = 50;
const STAR_PATH =
  "M12 2.8l2.83 5.73 6.33.92-4.58 4.46 1.08 6.3L12 17.24l-5.66 2.97 1.08-6.3-4.58-4.46 6.33-.92z";

/** Column x offsets inside a table, and the table width, for each variant. */
function layout(variant: ImageVariant) {
  const showRank = variant !== "picks";
  const showPicks = variant !== "ranking";
  // Without the rank column everything moves left by its width.
  const shift = showRank ? 0 : -52;
  const columnWidth = showPicks ? 716 + shift : 440;
  return {
    showRank,
    showPicks,
    columnWidth,
    width: PAD * 2 + COLUMN_GAP + columnWidth * 2,
    footerHeight: showPicks ? 132 : 64,
    x: {
      rank: 56,
      logo: 76 + shift,
      name: 142 + shift,
      line: 414 + shift,
      side: 438 + shift,
      stars: 548 + shift,
      projection: columnWidth - 24,
    },
  };
}

function sectionHeight(section: SummarySection): number {
  return (
    SECTION_TITLE_HEIGHT + LABEL_ROW_HEIGHT + section.rows.length * ROW_HEIGHT
  );
}

function fontFamilies() {
  const style = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) =>
    style.getPropertyValue(name).trim() || fallback;
  return {
    display: `${read("--font-barlow-condensed", "Arial Narrow")}, sans-serif`,
    sans: `${read("--font-inter", "system-ui")}, sans-serif`,
  };
}

function loadLogo(teamId: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = `/logos/${teamId}.png`;
  });
}

/** Draws the prediction on a canvas and returns it as a PNG. */
export async function renderSummaryImage(
  summary: Summary,
  variant: ImageVariant,
  mode: ViewMode,
): Promise<Blob> {
  const { showRank, showPicks, columnWidth, width, footerHeight, x } =
    layout(variant);
  const font = fontFamilies();
  const display = (weight: number, size: number) =>
    `${weight} ${size}px ${font.display}`;
  const sans = (weight: number, size: number) =>
    `${weight} ${size}px ${font.sans}`;

  const columns = CONFERENCES.map((conference) =>
    summarySections(summary, mode, [conference]),
  );
  const rows = columns.flat().flatMap((section) => section.rows);
  const [logos] = await Promise.all([
    Promise.all(rows.map((row) => loadLogo(row.teamId))),
    document.fonts.load(display(800, 40)),
    document.fonts.load(display(700, 40)),
    document.fonts.load(display(600, 40)),
    document.fonts.load(sans(500, 14)),
    document.fonts.load(sans(600, 14)),
  ]);
  const logoByTeam = new Map(
    rows.map((row, index) => [row.teamId, logos[index]]),
  );

  const columnHeight = (sections: SummarySection[]) =>
    sections.reduce((sum, section) => sum + sectionHeight(section), 0) +
    SECTION_GAP * (sections.length - 1);
  const bodyHeight = Math.max(...columns.map(columnHeight));
  const bodyTop = PAD + HEADER_HEIGHT;
  const height = bodyTop + bodyHeight + footerHeight + PAD;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available");
  const ctx = context;

  const roundRect = (
    left: number,
    top: number,
    w: number,
    h: number,
    radius: number,
  ) => {
    ctx.beginPath();
    // Older iOS Safari (< 16) has no roundRect; trace the corners by hand.
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(left, top, w, h, radius);
      return;
    }
    const r = Math.min(radius, w / 2, h / 2);
    ctx.moveTo(left + r, top);
    ctx.arcTo(left + w, top, left + w, top + h, r);
    ctx.arcTo(left + w, top + h, left, top + h, r);
    ctx.arcTo(left, top + h, left, top, r);
    ctx.arcTo(left, top, left + w, top, r);
    ctx.closePath();
  };

  ctx.fillStyle = COLOR.bg;
  ctx.fillRect(0, 0, width, height);
  ctx.textBaseline = "middle";

  // Header: season chip, site name, title.
  const chipText = SEASON.id.slice(2).replace("-", "–");
  ctx.font = display(800, 30);
  const chipWidth = ctx.measureText(chipText).width + 28;
  ctx.fillStyle = COLOR.ink;
  roundRect(PAD, PAD, chipWidth, 48, 10);
  ctx.fill();
  ctx.fillStyle = COLOR.bg;
  ctx.textAlign = "left";
  ctx.fillText(chipText, PAD + 14, PAD + 25);
  ctx.fillStyle = COLOR.ink;
  ctx.font = display(700, 36);
  ctx.letterSpacing = "3px";
  ctx.fillText(tr.brand.name, PAD + chipWidth + 18, PAD + 25);
  ctx.letterSpacing = "0px";
  ctx.textAlign = "right";
  ctx.font = display(800, 56);
  ctx.fillText(tr.summary.imageTitle[variant], width - PAD, PAD + 25);

  ctx.fillStyle = COLOR.border;
  ctx.fillRect(PAD, PAD + 84, width - PAD * 2, 2);

  columns.forEach((sections, columnIndex) => {
    const left = PAD + columnIndex * (columnWidth + COLUMN_GAP);
    let top = bodyTop;
    for (const section of sections) {
      drawSection(section, left, top);
      top += sectionHeight(section) + SECTION_GAP;
    }
  });

  function drawSection(section: SummarySection, left: number, top: number) {
    const titleY = top + 26;
    const title = section.division
      ? tr.division[section.division]
      : tr.conference[section.conference];
    const suffix = section.division
      ? `${tr.division.suffix} · ${tr.conference[section.conference]}`
      : tr.conference.suffix;
    ctx.textAlign = "left";
    ctx.fillStyle = COLOR.ink;
    ctx.font = display(800, 46);
    ctx.letterSpacing = "2px";
    ctx.fillText(title, left, titleY);
    const titleWidth = ctx.measureText(title).width;
    ctx.fillStyle = COLOR.inkMuted;
    ctx.font = display(600, 22);
    ctx.fillText(suffix, left + titleWidth + 16, titleY + 6);
    ctx.letterSpacing = "0px";

    const tableTop = top + SECTION_TITLE_HEIGHT;
    const tableHeight = LABEL_ROW_HEIGHT + section.rows.length * ROW_HEIGHT;
    ctx.fillStyle = COLOR.surface;
    roundRect(left, tableTop, columnWidth, tableHeight, 18);
    ctx.fill();
    ctx.save();
    roundRect(left, tableTop, columnWidth, tableHeight, 18);
    ctx.clip();
    ctx.fillStyle = COLOR.surfaceRaised;
    ctx.fillRect(left, tableTop, columnWidth, LABEL_ROW_HEIGHT);

    ctx.font = sans(600, 13);
    ctx.letterSpacing = "1.8px";
    ctx.fillStyle = COLOR.inkMuted;
    const labelY = tableTop + LABEL_ROW_HEIGHT / 2 + 1;
    ctx.textAlign = "left";
    ctx.fillText(tr.picks.columns.team, left + x.logo, labelY);
    if (showPicks) {
      ctx.fillText(tr.summary.columns.side, left + x.side, labelY);
      ctx.fillText(tr.picks.columns.confidence, left + x.stars, labelY);
    }
    ctx.textAlign = "right";
    if (showRank) ctx.fillText(tr.picks.columns.rank, left + x.rank, labelY);
    if (showPicks) {
      ctx.fillText(tr.picks.columns.line, left + x.line, labelY);
      ctx.fillText(tr.summary.columns.projection, left + x.projection, labelY);
    }
    ctx.letterSpacing = "0px";

    section.rows.forEach((row, index) => {
      drawRow(row, left, tableTop + LABEL_ROW_HEIGHT + index * ROW_HEIGHT);
    });
    ctx.restore();

    ctx.strokeStyle = COLOR.border;
    ctx.lineWidth = 2;
    roundRect(left, tableTop, columnWidth, tableHeight, 18);
    ctx.stroke();
  }

  function drawRow(row: SummaryRow, left: number, top: number) {
    const team = getTeam(row.teamId);
    const middle = top + ROW_HEIGHT / 2;

    if (showPicks && row.side) {
      ctx.globalAlpha = 0.06;
      ctx.fillStyle = row.side === "over" ? COLOR.over : COLOR.under;
      ctx.fillRect(left, top, columnWidth, ROW_HEIGHT);
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = COLOR.border;
    ctx.fillRect(left, top, columnWidth, 1);

    if (showRank) {
      ctx.textAlign = "right";
      ctx.fillStyle = COLOR.inkMuted;
      ctx.font = display(700, 34);
      ctx.fillText(
        row.rank === null ? "–" : String(row.rank),
        left + x.rank,
        middle + 2,
      );
    }

    // Logo tile
    const tileY = middle - LOGO_TILE / 2;
    ctx.fillStyle = COLOR.ink;
    roundRect(left + x.logo, tileY, LOGO_TILE, LOGO_TILE, 12);
    ctx.fill();
    ctx.strokeStyle = team.colors.primary;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    const logo = logoByTeam.get(row.teamId);
    if (logo) {
      ctx.drawImage(
        logo,
        left + x.logo + 5,
        tileY + 5,
        LOGO_TILE - 10,
        LOGO_TILE - 10,
      );
    } else {
      ctx.fillStyle = COLOR.bg;
      ctx.textAlign = "center";
      ctx.font = display(800, 18);
      ctx.fillText(team.id, left + x.logo + LOGO_TILE / 2, middle + 1);
    }

    // City + name (English names: plain uppercasing, no Turkish dotted İ)
    ctx.textAlign = "left";
    ctx.fillStyle = COLOR.inkMuted;
    ctx.font = sans(500, 12);
    ctx.letterSpacing = "0.8px";
    ctx.fillText(team.city.toUpperCase(), left + x.name, middle - 15);
    ctx.letterSpacing = "0.6px";
    ctx.fillStyle = COLOR.ink;
    ctx.font = display(700, 28);
    ctx.fillText(team.name.toUpperCase(), left + x.name, middle + 11);
    ctx.letterSpacing = "0px";

    if (!showPicks) return;

    // Line
    ctx.textAlign = "right";
    ctx.fillStyle = COLOR.ink;
    ctx.font = display(800, 36);
    ctx.fillText(formatLine(row.line), left + x.line, middle + 2);

    // Side chip
    if (row.side) {
      const over = row.side === "over";
      ctx.fillStyle = over ? COLOR.over : COLOR.under;
      roundRect(left + x.side, middle - 20, 92, 40, 10);
      ctx.fill();
      ctx.fillStyle = over ? COLOR.overInk : COLOR.underInk;
      ctx.textAlign = "center";
      ctx.font = display(700, 24);
      ctx.letterSpacing = "2px";
      ctx.fillText(
        `${over ? "▲" : "▼"} ${over ? tr.picks.over : tr.picks.under}`,
        left + x.side + 47,
        middle + 2,
      );
      ctx.letterSpacing = "0px";
    } else {
      ctx.fillStyle = COLOR.inkFaint;
      ctx.textAlign = "center";
      ctx.font = display(700, 26);
      ctx.fillText("—", left + x.side + 46, middle + 2);
    }

    // Stars
    const tone = row.side === "over" ? COLOR.over : COLOR.under;
    for (let level = 1; level <= 3; level++) {
      const on = (row.confidence ?? 0) >= level;
      ctx.save();
      ctx.translate(left + x.stars + (level - 1) * 28, middle - 12);
      const star = new Path2D(STAR_PATH);
      ctx.lineWidth = 1.6;
      ctx.lineJoin = "round";
      ctx.strokeStyle = on ? tone : COLOR.border;
      if (on) {
        ctx.fillStyle = tone;
        ctx.fill(star);
      }
      ctx.stroke(star);
      ctx.restore();
    }

    // Projection
    ctx.textAlign = "right";
    ctx.font = display(700, 32);
    if (row.projectedWins === undefined) {
      ctx.fillStyle = COLOR.inkFaint;
      ctx.fillText("—", left + x.projection, middle + 2);
    } else {
      ctx.fillStyle = row.conflict ? COLOR.warn : COLOR.ink;
      ctx.fillText(String(row.projectedWins), left + x.projection, middle + 2);
    }
  }

  // Footer
  const footerTop = bodyTop + bodyHeight + 36;
  const credit = tr.summary.imageCredit(SEASON.id);
  if (showPicks) {
    const off = summary.totalStatus.level === "off";
    ctx.textAlign = "left";
    ctx.fillStyle = COLOR.inkMuted;
    ctx.font = sans(600, 14);
    ctx.letterSpacing = "2px";
    ctx.fillText(tr.meter.label, PAD, footerTop + 8);
    ctx.letterSpacing = "0px";
    ctx.font = display(800, 64);
    ctx.fillStyle = off ? COLOR.warn : COLOR.ink;
    const totalText = String(summary.total);
    ctx.fillText(totalText, PAD, footerTop + 60);
    const totalWidth = ctx.measureText(totalText).width;
    ctx.font = display(800, 32);
    ctx.fillStyle = COLOR.inkSoft;
    ctx.fillText(
      `/ ${TOTAL_WINS}   ${formatDeviation(summary.totalStatus.deviation)}`,
      PAD + totalWidth + 14,
      footerTop + 68,
    );

    ctx.textAlign = "right";
    ctx.fillStyle = COLOR.ink;
    ctx.font = display(700, 34);
    ctx.fillText(
      tr.summary.imageCounts(
        summary.pickedCount,
        summary.teamCount,
        summary.overCount,
        summary.underCount,
      ),
      width - PAD,
      footerTop + 22,
    );
    ctx.fillStyle = COLOR.inkMuted;
    ctx.font = sans(500, 16);
    ctx.fillText(credit, width - PAD, footerTop + 66);
  } else {
    ctx.textAlign = "right";
    ctx.fillStyle = COLOR.inkMuted;
    ctx.font = sans(500, 16);
    ctx.fillText(credit, width - PAD, footerTop + 8);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("PNG export failed"))),
      "image/png",
    );
  });
}

/**
 * Saves a blob through a temporary download link. The object URL is revoked
 * later, not right after the click: mobile Safari and some Android browsers
 * start reading it asynchronously and fail on an already revoked URL.
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

/** true on phones and tablets, where a plain download link is unreliable. */
export function prefersShareSheet(): boolean {
  return window.matchMedia("(pointer: coarse)").matches;
}

/**
 * Opens the system share sheet with the image (Save Image, Photos, WhatsApp…).
 * Returns false when the browser cannot share files, so the caller can fall
 * back to a download; a share the user cancels counts as handled.
 */
export async function shareImage(
  blob: Blob,
  fileName: string,
): Promise<boolean> {
  const file = new File([blob], fileName, { type: "image/png" });
  if (!navigator.canShare?.({ files: [file] })) return false;
  try {
    await navigator.share({ files: [file] });
    return true;
  } catch (error) {
    return error instanceof DOMException && error.name === "AbortError";
  }
}
