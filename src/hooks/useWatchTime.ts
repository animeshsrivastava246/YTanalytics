import { useMemo } from 'react';
import { AppVideo } from '@/services/youtube.types';
import { sumDurations, computeTotalTimeAtSpeed, computeTimeSaved, formatDuration } from '@/utils/watchTime';

interface UseWatchTimeResult {
  totalSeconds: number;
  totalFormatted: string;
  timeAtSpeedSeconds: number;
  timeAtSpeedFormatted: string;
  timeSavedSeconds: number;
  timeSavedFormatted: string;
}

export function useWatchTime(videos: AppVideo[], playbackSpeed: number): UseWatchTimeResult {
  return useMemo(() => {
    // 1. Map videos to seconds
    const durations = videos.map(v => v.durationSeconds);
    
    // 2. Sum
    const totalSeconds = sumDurations(durations);
    
    // 3. Compute speed & saved
    const timeAtSpeedSeconds = computeTotalTimeAtSpeed(totalSeconds, playbackSpeed);
    const timeSavedSeconds = computeTimeSaved(totalSeconds, playbackSpeed);

    // 4. Format all strings
    return {
      totalSeconds,
      timeAtSpeedSeconds,
      timeSavedSeconds,
      totalFormatted: formatDuration(totalSeconds),
      timeAtSpeedFormatted: formatDuration(timeAtSpeedSeconds),
      timeSavedFormatted: formatDuration(timeSavedSeconds),
    };
  }, [videos, playbackSpeed]);
}
