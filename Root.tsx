import React, { useEffect, useState } from 'react';
import App from './App';
import { LandingPage } from './LandingPage';

type View = 'landing' | 'app';

const LANDING_HASH = '#/invite';
const APP_HASH = '#/app';
const STORAGE_KEY = 'ce3m:last-view';

const normalizePathToHash = () => {
  const { pathname, hash } = window.location;
  if (!hash && (pathname === '/app' || pathname === '/invite')) {
    const target = pathname === '/app' ? APP_HASH : LANDING_HASH;
    window.history.replaceState(null, '', target);
  }
  if (!hash && pathname === '/') {
    window.history.replaceState(null, '', LANDING_HASH);
  }
};

const detectInitialView = (): View => {
  if (typeof window === 'undefined') return 'landing';
  normalizePathToHash();
  const hash = window.location.hash.toLowerCase();
  // Hash tem prioridade: se a pessoa digitou #/invite, respeita, mesmo com storage.
  if (hash.includes('/app')) return 'app';
  if (hash.includes('/invite')) return 'landing';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'app') return 'app';
  return 'landing';
};

export const Root: React.FC = () => {
  const [view, setView] = useState<View>(detectInitialView);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const nextHash = view === 'app' ? APP_HASH : LANDING_HASH;
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, '', nextHash);
    }
    if (view === 'app') {
      window.localStorage.setItem(STORAGE_KEY, 'app');
    }
  }, [view]);

  const handleStart = () => setView('app');

  if (view === 'landing') {
    return <LandingPage onStart={handleStart} />;
  }

  return <App />;
};

export default Root;
