/**
 * Date helpers.
 * - Internal storage: ISO `YYYY-MM-DD`.
 * - Table display: `DD/MM/YYYY` (matches the Figma sample data).
 * - Sidebar date inputs: `MM/DD/YYYY` (matches the Figma helper text).
 */

function parts(iso: string): [string, string, string] | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  return [m[1], m[2], m[3]];
}

/** ISO -> `DD/MM/YYYY` for the table's Signup Date column. */
export function formatTableDate(iso: string): string {
  const p = parts(iso);
  if (!p) return '—';
  const [y, mo, d] = p;
  return `${d}/${mo}/${y}`;
}

/** ISO -> `M/D/YYYY` (used inside the provider modal, matching the Figma). */
export function formatShortDate(iso: string): string {
  const p = parts(iso);
  if (!p) return '—';
  const [y, mo, d] = p;
  return `${Number(mo)}/${Number(d)}/${y}`;
}

/** `YYYY-MM-DD` (from a native date input) is already ISO — passthrough guard. */
export function normalizeInputDate(value: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : '';
}

function isRealDate(y: number, m: number, d: number): boolean {
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const dt = new Date(y, m - 1, d);
  return (
    dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
  );
}

/** `MM/DD/YYYY` -> ISO `YYYY-MM-DD`, or `''` when incomplete / invalid. */
export function mmddyyyyToIso(text: string): string {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text.trim());
  if (!m) return '';
  const [, mo, d, y] = m;
  if (!isRealDate(Number(y), Number(mo), Number(d))) return '';
  return `${y}-${mo}-${d}`;
}

/** ISO `YYYY-MM-DD` -> `MM/DD/YYYY` for display in the sidebar date fields. */
export function isoToMmddyyyy(iso: string): string {
  const p = parts(iso);
  if (!p) return '';
  const [y, mo, d] = p;
  return `${mo}/${d}/${y}`;
}

/** Digits-only input -> progressively slash-formatted `MM/DD/YYYY` (max 10 chars). */
export function maskMmddyyyy(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  const parts3 = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)];
  return parts3.filter(Boolean).join('/');
}

/**
 * Inclusive ISO date-range test. Empty bounds are treated as open-ended.
 */
export function withinDateRange(iso: string, from: string, to: string): boolean {
  if (from && iso < from) return false;
  if (to && iso > to) return false;
  return true;
}
