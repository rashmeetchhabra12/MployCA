export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function parseDelay(value: unknown) {
  const delay = Number(value ?? 0);
  if (!Number.isFinite(delay)) {
    return 0;
  }

  return Math.min(Math.max(delay, 0), 5000);
}
