import { useState, useEffect, useRef } from 'react';

const useFPS = (): number => {
  const [fps, setFps] = useState(0);
  const framesRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const rafRef = useRef<number>();

  useEffect(() => {
    const tick = (now: number) => {
      framesRef.current++;
      const delta = now - lastTimeRef.current;
      if (delta >= 1000) {
        const currentFps = Math.round((framesRef.current * 1000) / delta);
        setFps(currentFps);
        console.log(`[FPS] ${currentFps}`);
        framesRef.current = 0;
        lastTimeRef.current = now;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return fps;
};

export default useFPS;
