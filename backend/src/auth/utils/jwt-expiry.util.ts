const DURATION_PATTERN = /^(\d+)([smhd])$/i;

export function parseJwtExpiresInToSeconds(value: string, fallbackSeconds: number): number {
  const trimmed = value.trim();
  if (/^\d+$/.test(trimmed)) {
    const numericValue = Number.parseInt(trimmed, 10);
    return numericValue > 0 ? numericValue : fallbackSeconds;
  }

  const match = DURATION_PATTERN.exec(trimmed);
  if (!match) {
    return fallbackSeconds;
  }

  const amount = Number.parseInt(match[1], 10);
  if (!Number.isFinite(amount) || amount <= 0) {
    return fallbackSeconds;
  }

  const unit = match[2].toLowerCase();
  if (unit === 's') return amount;
  if (unit === 'm') return amount * 60;
  if (unit === 'h') return amount * 60 * 60;
  return amount * 60 * 60 * 24;
}

export function parseJwtExpiresInToMilliseconds(value: string, fallbackMs: number): number {
  const seconds = parseJwtExpiresInToSeconds(value, Math.floor(fallbackMs / 1000));
  return seconds * 1000;
}
