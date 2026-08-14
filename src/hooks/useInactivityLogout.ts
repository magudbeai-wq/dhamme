import { useEffect, useCallback, useRef, useState } from 'react';

const INACTIVITY_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
const STORAGE_KEY_LAST_ACTIVE = 'dhamme_last_active_timestamp';

interface UseInactivityLogoutOptions {
  enabled: boolean;
  onLogout: () => void;
  timeoutMs?: number;
}

export function useInactivityLogout({
  enabled,
  onLogout,
  timeoutMs = INACTIVITY_TIMEOUT_MS
}: UseInactivityLogoutOptions) {
  const [isLoggedOutDueToInactivity, setIsLoggedOutDueToInactivity] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const updateLastActiveTime = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LAST_ACTIVE, Date.now().toString());
    } catch (e) {
      console.warn('Unable to write to localStorage for inactivity tracker:', e);
    }
  }, []);

  const triggerLogout = useCallback(() => {
    setIsLoggedOutDueToInactivity(true);
    onLogout();
  }, [onLogout]);

  const checkTimeout = useCallback(() => {
    if (!enabled) return;

    const savedLastActiveStr = localStorage.getItem(STORAGE_KEY_LAST_ACTIVE);
    if (savedLastActiveStr) {
      const lastActive = parseInt(savedLastActiveStr, 10);
      const now = Date.now();
      if (!isNaN(lastActive) && now - lastActive >= timeoutMs) {
        triggerLogout();
        return;
      }
    }
  }, [enabled, timeoutMs, triggerLogout]);

  const resetTimer = useCallback(() => {
    if (!enabled) return;

    updateLastActiveTime();

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      triggerLogout();
    }, timeoutMs);
  }, [enabled, timeoutMs, updateLastActiveTime, triggerLogout]);

  useEffect(() => {
    if (!enabled) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      return;
    }

    // Check if timeout already elapsed while inactive/closed
    checkTimeout();

    // Start timer & save active timestamp
    resetTimer();

    const activityEvents = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
      'click'
    ];

    const handleUserActivity = () => {
      resetTimer();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkTimeout();
        resetTimer();
      } else {
        updateLastActiveTime();
      }
    };

    const handleWindowFocus = () => {
      checkTimeout();
      resetTimer();
    };

    // Attach event listeners
    activityEvents.forEach((evt) => {
      window.addEventListener(evt, handleUserActivity, { passive: true });
    });

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);

    // Periodic check every 15 seconds as a safety heartbeat
    const interval = setInterval(() => {
      checkTimeout();
    }, 15000);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      clearInterval(interval);

      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, handleUserActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [enabled, checkTimeout, resetTimer, updateLastActiveTime]);

  const clearInactivityNotice = () => {
    setIsLoggedOutDueToInactivity(false);
  };

  return {
    isLoggedOutDueToInactivity,
    clearInactivityNotice
  };
}
