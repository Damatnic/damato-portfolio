export const SITE_TZ = process.env.NEXT_PUBLIC_SITE_TZ?.trim() || 'America/Chicago';

export function dayKey(ms: number): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: SITE_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(ms));
  const y = parts.find((p) => p.type === 'year')?.value ?? '0000';
  const m = parts.find((p) => p.type === 'month')?.value ?? '00';
  const d = parts.find((p) => p.type === 'day')?.value ?? '00';
  return `${y}-${m}-${d}`;
}

export function todayKey(): string {
  return dayKey(Date.now());
}

export function lastNDayKeys(n: number, now: number = Date.now()): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    out.push(dayKey(now - i * 86_400_000));
  }
  return out;
}

export function formatLocalTime(ms: number): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: SITE_TZ,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  }).format(new Date(ms));
}

export function formatLocalTimeWithSeconds(ms: number): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: SITE_TZ,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  }).format(new Date(ms));
}

export function localHour(now: number = Date.now()): number {
  const hourStr = new Intl.DateTimeFormat('en-US', {
    timeZone: SITE_TZ,
    hour: 'numeric',
    hour12: false,
  }).format(new Date(now));
  const h = parseInt(hourStr, 10);
  return Number.isFinite(h) ? h % 24 : 0;
}