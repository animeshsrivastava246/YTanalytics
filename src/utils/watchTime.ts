/**
 * Parses a YouTube ISO 8601 duration string (e.g., "PT1H2M10S") into total seconds.
 */
export function parseISO8601DurationToSeconds(duration: string): number {
  if (!duration) return 0;
  
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Returns the sum of an array of durations (in seconds).
 */
export function sumDurations(secondsArray: number[]): number {
  return secondsArray.reduce((acc, curr) => acc + curr, 0);
}

/**
 * Computes the time it takes to watch `totalSeconds` at `playbackSpeed`.
 */
export function computeTotalTimeAtSpeed(totalSeconds: number, playbackSpeed: number): number {
  if (playbackSpeed <= 0) return totalSeconds;
  return Math.round(totalSeconds / playbackSpeed);
}

/**
 * Computes how much time is saved (or lost) by watching at `playbackSpeed`.
 * Will be negative if speed < 1 (taking extra time).
 */
export function computeTimeSaved(totalSeconds: number, playbackSpeed: number): number {
  const timeAtSpeed = computeTotalTimeAtSpeed(totalSeconds, playbackSpeed);
  return totalSeconds - timeAtSpeed;
}

/**
 * Formats seconds into a human-readable HH:MM:SS format.
 * Drops the hours if 0.
 */
export function formatDuration(totalSeconds: number): string {
  const isNegative = totalSeconds < 0;
  const absoluteSeconds = Math.abs(Math.round(totalSeconds));

  const hours = Math.floor(absoluteSeconds / 3600);
  const minutes = Math.floor((absoluteSeconds % 3600) / 60);
  const seconds = absoluteSeconds % 60;

  const paddedMinutes = hours > 0 ? String(minutes).padStart(2, '0') : String(minutes);
  const paddedSeconds = String(seconds).padStart(2, '0');

  const formattedStr = hours > 0
    ? `${hours}:${paddedMinutes}:${paddedSeconds}`
    : `${paddedMinutes}:${paddedSeconds}`;

  return isNegative ? `-${formattedStr}` : formattedStr;
}
