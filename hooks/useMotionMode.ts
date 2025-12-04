import { useEffect, useMemo, useState } from 'react';

type MotionMode = 'light' | 'full';

const STORAGE_KEY = 'motionMode';

const detectInitial = (): MotionMode => {
  if (typeof window === 'undefined') return 'light';
  const saved = window.localStorage.getItem(STORAGE_KEY) as MotionMode | null;
  if (saved === 'light' || saved === 'full') return saved;

  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return 'light';

  const deviceMemory = (navigator as any).deviceMemory as number | undefined;
  if (deviceMemory && deviceMemory <= 4) return 'light';

  return 'light';
};

export const useMotionMode = () => {
  const [motionMode, setMotionMode] = useState<MotionMode>(detectInitial);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, motionMode);
  }, [motionMode]);

  useEffect(() => {
    const reduceWatcher = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const handle = () => {
      if (reduceWatcher.matches) setMotionMode('light');
    };
    reduceWatcher?.addEventListener('change', handle);
    return () => reduceWatcher?.removeEventListener('change', handle);
  }, []);

  const isLight = useMemo(() => motionMode === 'light', [motionMode]);

  const toggleMotionMode = () => {
    setMotionMode((prev) => (prev === 'light' ? 'full' : 'light'));
  };

  return { motionMode, isLight, toggleMotionMode };
};
