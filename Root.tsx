import React, { useEffect, useState } from 'react';
import App from './App';
import { LandingPage } from './LandingPage';

type View = 'landing' | 'app';

const LANDING_PATH = '/invite';
const APP_PATH = '/app';
const STORAGE_KEY = 'ce3m:last-view';

const detectInitialView = (): View => {
  if (typeof window === 'undefined') return 'landing';
  const path = window.location.pathname.toLowerCase();
  if (path.startsWith(APP_PATH)) return 'app';
  return 'landing';
};

export const Root: React.FC = () => {
  const [view, setView] = useState<View>(detectInitialView);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const path = window.location.pathname;

    // Keep the landing page on /convite (also catch root) without forcing a reload.
    if (view === 'landing' && path !== LANDING_PATH) {
      window.history.replaceState(null, '', LANDING_PATH);
    }

    if (view === 'app') {
      window.localStorage.setItem(STORAGE_KEY, 'app');
      if (path !== APP_PATH) {
        window.history.replaceState(null, '', APP_PATH);
      }
    }
  }, [view]);

  const handleStart = () => setView('app');

  if (view === 'landing') {
    return <LandingPage onStart={handleStart} />;
  }

  return <App />;
};

export default Root;
