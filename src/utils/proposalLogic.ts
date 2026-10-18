/**
 * Pure helper functions for the Rishika V2 Interactive Botanical Keepsake:
 * - Passcode validation ('0710' or '1007' for 7 October) without spoilers or hints
 * - Garden sunrise progress calculation (0 to 10 flowers -> 0% to 100% full sunrise)
 * - Days counter calculation since 7 October 2026 (local time)
 * - Letter block parser and inline token splitting (sunflower & animated white-heart)
 * - Scrubber and volume input validation/clamping
 * - Hash route normalization
 * - Garden coordinate clamping & flower generation
 * - Playful button dodge & disappearance calculation
 */

export const VALID_PASSCODES = ['0710', '1007'] as const;

export function validatePasscode(rawInput: string): {
  isComplete: boolean;
  isValid: boolean;
  cleaned: string;
  errorMessage: string;
} {
  const cleaned = String(rawInput || '').replace(/\D/g, '').slice(0, 4);
  if (cleaned.length < 4) {
    return {
      isComplete: false,
      isValid: false,
      cleaned,
      errorMessage: 'Please enter all 4 digits to unlock the keepsake.',
    };
  }
  const isValid = (VALID_PASSCODES as readonly string[]).includes(cleaned);
  return {
    isComplete: true,
    isValid,
    cleaned,
    errorMessage: isValid
      ? ''
      : 'That combination keeps the locket closed. Try another 4 digits.',
  };
}

export const GARDEN_FULL_SUNRISE_COUNT = 10;

export function computeGardenSunriseProgress(flowerCount: number): number {
  const clamped = clampRangeInput(flowerCount, 0, GARDEN_FULL_SUNRISE_COUNT, 0);
  return Number((clamped / GARDEN_FULL_SUNRISE_COUNT).toFixed(2));
}

export function extractYouTubeId(input: string): string | null {
  const trimmed = String(input || '').trim();
  if (!trimmed) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(
    /(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export function computeDaysSince(metDateISO: string, nowDate: Date = new Date()): number {
  const parts = metDateISO.split('-').map(Number);
  if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
    return 0;
  }
  const [year, month, day] = parts;
  const startLocal = new Date(year, month - 1, day, 0, 0, 0, 0);
  const currentLocal = new Date(
    nowDate.getFullYear(),
    nowDate.getMonth(),
    nowDate.getDate(),
    0,
    0,
    0,
    0
  );
  const diffMs = currentLocal.getTime() - startLocal.getTime();
  return Math.max(0, Math.round(diffMs / 86400000));
}

export function clampRangeInput(rawValue: unknown, min: number, max: number, fallback: number): number {
  const num = typeof rawValue === 'number' ? rawValue : Number(rawValue);
  if (!Number.isFinite(num)) {
    return fallback;
  }
  if (num < min) return min;
  if (num > max) return max;
  return num;
}

export function formatSeconds(secondsInput: unknown): string {
  const sec = clampRangeInput(secondsInput, 0, 35999, 0);
  const whole = Math.floor(sec);
  const mins = Math.floor(whole / 60);
  const rem = whole % 60;
  return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
}

export function parseLetterBlocks(rawLetter: string): { greeting: string; blocks: string[] } {
  const normalized = String(rawLetter || '').replace(/\r\n/g, '\n').trim();
  const parts = normalized
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  if (parts.length === 0) {
    return { greeting: '', blocks: [] };
  }
  return {
    greeting: parts[0],
    blocks: parts.slice(1),
  };
}

export type InlineToken =
  | { type: 'text'; value: string }
  | { type: 'sunflower' }
  | { type: 'white-heart' };

export function tokenizeInlineIcons(text: string): InlineToken[] {
  const rawTokens = String(text || '').split(/(🌻|🤍)/g);
  const result: InlineToken[] = [];
  for (const tok of rawTokens) {
    if (tok === '🌻') {
      result.push({ type: 'sunflower' });
    } else if (tok === '🤍') {
      result.push({ type: 'white-heart' });
    } else if (tok.length > 0) {
      result.push({ type: 'text', value: tok });
    }
  }
  return result;
}

export const VALID_ROUTES = [
  'lock',
  '1',
  '2',
  '3',
  '4',
  '4/garden',
  '4/letter',
  '4/song',
  '5',
  '6',
  '7',
] as const;

export type RouteKey = (typeof VALID_ROUTES)[number];

export function normalizeRoute(hash: string): RouteKey {
  const cleaned = String(hash || '')
    .replace(/^#\/?/, '')
    .trim();
  if (cleaned === '0') return 'lock';
  if ((VALID_ROUTES as readonly string[]).includes(cleaned)) {
    return cleaned as RouteKey;
  }
  return 'lock';
}

export function getChapterNumber(route: RouteKey): number {
  if (route === 'lock') return 0;
  const firstChar = route.charAt(0);
  const parsed = Number(firstChar);
  return Number.isFinite(parsed) && parsed >= 1 && parsed <= 7 ? parsed : 1;
}

export interface PlantedFlower {
  id: number;
  xPercent: number;
  soilDepthPercent: number;
  kind: 'sunflower' | 'lily';
  scale: number;
  swayDeg: number;
}

export function createPlantedFlower(
  id: number,
  rawXPercent: number,
  rawYPercent: number
): PlantedFlower {
  const xPercent = clampRangeInput(rawXPercent, 10, 90, 50);
  const soilDepthPercent = clampRangeInput(rawYPercent, 85, 92, 88);
  const kind: 'sunflower' | 'lily' = id % 2 === 0 ? 'sunflower' : 'lily';
  const scale = Number((0.88 + ((id * 17) % 28) / 100).toFixed(2));
  const swayDeg = ((id % 2 === 0 ? 1 : -1) * (2 + (id % 4)));
  return {
    id,
    xPercent,
    soilDepthPercent,
    kind,
    scale,
    swayDeg,
  };
}

export const NO_MAX_ATTEMPTS = 5;

export function isNoButtonHidden(attemptCount: number): boolean {
  return attemptCount >= NO_MAX_ATTEMPTS;
}

export function computeDodgeOffset(attemptCount: number): {
  x: number;
  y: number;
  scale: number;
  hidden: boolean;
} {
  if (attemptCount <= 0) {
    return { x: 0, y: 0, scale: 1, hidden: false };
  }
  if (isNoButtonHidden(attemptCount)) {
    return { x: 0, y: 0, scale: 0, hidden: true };
  }
  const presets = [
    { x: 28, y: -24, scale: 0.88 },
    { x: 54, y: 18, scale: 0.76 },
    { x: -24, y: 26, scale: 0.64 },
    { x: 46, y: -22, scale: 0.52 },
  ];
  const idx = Math.max(0, attemptCount - 1) % presets.length;
  return { ...presets[idx], hidden: false };
}
