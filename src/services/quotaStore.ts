import { create } from 'zustand';

interface QuotaState {
  isQuotaExceeded: boolean;
  quotaExceededAt: string | null;
  setQuotaExceeded: () => void;
  resetQuota: () => void;
  isRetryBlocked: () => boolean;
}

/**
 * Global store for YouTube API quota-exceeded state.
 * When a 403 quotaExceeded is caught, `setQuotaExceeded()` is called.
 * The quota resets at midnight Pacific Time (YouTube's reset).
 */
export const useQuotaStore = create<QuotaState>()((set, get) => ({
  isQuotaExceeded: false,
  quotaExceededAt: null,

  setQuotaExceeded: () =>
    set({
      isQuotaExceeded: true,
      quotaExceededAt: new Date().toISOString(),
    }),

  resetQuota: () =>
    set({
      isQuotaExceeded: false,
      quotaExceededAt: null,
    }),

  isRetryBlocked: (): boolean => {
    const { isQuotaExceeded, quotaExceededAt } = get();
    if (!isQuotaExceeded || !quotaExceededAt) return false;

    // YouTube quota resets at midnight Pacific Time.
    // Block retries if the error occurred on the same PT calendar day.
    const errorDate = new Date(quotaExceededAt);
    const now = new Date();

    const ptFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const errorDay = ptFormatter.format(errorDate);
    const currentDay = ptFormatter.format(now);

    if (currentDay !== errorDay) {
      // New day — auto-reset quota
      get().resetQuota();
      return false;
    }

    return true;
  },
}));
