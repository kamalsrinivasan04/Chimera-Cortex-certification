import { useEffect, useRef } from 'react';
import api from '../services/api';

/**
 * Custom hook to detect and report cheating activity in the assessment.
 * @param {string} assessmentId - The active assessment ID.
 * @param {boolean} isActive - Whether the assessment is currently running.
 * @param {Function} onWarning - Callback when a violation is detected to show warning toast/modal.
 * @param {Function} onTerminate - Callback when cheating count triggers termination.
 */
export const useCheatingDetection = (assessmentId, isActive, onWarning, onTerminate) => {
  const isReportingRef = useRef(false);

  useEffect(() => {
    if (!isActive || !assessmentId) return;

    const reportViolation = async (eventType) => {
      // Prevent rapid duplicate reports
      if (isReportingRef.current) return;
      isReportingRef.current = true;

      try {
        console.warn(`Cheating violation detected: ${eventType}`);
        const { data } = await api.post(`/api/assessments/${assessmentId}/cheat`, { eventType });
        
        onWarning(eventType, data.cheatingCount);

        if (data.terminated) {
          onTerminate();
        }
      } catch (err) {
        console.error('Error logging cheating activity', err);
      } finally {
        setTimeout(() => {
          isReportingRef.current = false;
        }, 1000);
      }
    };

    // 1. Tab Switching (Visibility API)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        reportViolation('Tab Switch');
      }
    };

    // 2. Window Blur
    const handleWindowBlur = () => {
      reportViolation('Window Blur');
    };

    // 3. Disable Right Click
    const handleContextMenu = (e) => {
      e.preventDefault();
      reportViolation('Right Click');
    };

    // 4. Disable Copy
    const handleCopy = (e) => {
      e.preventDefault();
      reportViolation('Copy');
    };

    // 5. Disable Paste
    const handlePaste = (e) => {
      e.preventDefault();
      reportViolation('Paste');
    };

    // 6. Leaving Full Screen
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        reportViolation('Exit Fullscreen');
      }
    };

    // Attach listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Cleanup listeners
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [assessmentId, isActive, onWarning, onTerminate]);
};
