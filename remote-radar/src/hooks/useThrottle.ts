import { useCallback, useRef } from 'react';

const useThrottle = <T extends any[]>(callback: (...args: T) => void, delay: number) => {
  const lastCall = useRef(0);
  const timeoutRef = useRef<number>();

  return useCallback(
    (...args: T) => {
      const now = Date.now();

      if (lastCall.current && now < lastCall.current + delay) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(() => {
          lastCall.current = now;
          callback(...args);
        }, delay);
      } else {
        lastCall.current = now;
        callback(...args);
      }
    },
    [callback, delay]
  );
};

export default useThrottle;
