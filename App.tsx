import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Layout } from './components/Layout';
import { DailyMission } from './components/DailyMission';
import { PDFExport } from './components/PDFExport';
import { SubscriptionGate } from './components/SubscriptionGate';
import { Onboarding } from './components/Onboarding';
import { getUserData, completeMission, updateUserProfile, upgradeUser, resetProgress, cancelSubscription, saveReflection, clearLocalUserData, DEFAULT_USER, saveUserData, updateLanguagePreference } from './services/storageService';
import { MISSIONS, getMissionForDayRandom, getShuffledMissions, getMissionByIdMode, adaptMission } from './services/mockData';
import { NEXT_STEP_SUGGESTIONS_EN, SOLO_NEXT_STEP_SUGGESTIONS_EN, DISTANCE_NEXT_STEP_SUGGESTIONS_EN } from './services/i18n/content';

const DEFAULT_MISSION_ORDER = MISSIONS.map((m) => m.id);
import { UserProgress, CURRENT_MONTH_THEME, Mission } from './types';
import { Check, Star, Settings, User as UserIcon, LogOut, Flame, ChevronDown, RotateCcw, AlertTriangle, Lock, Sparkles } from 'lucide-react';
import { auth, logoutUser, loginWithGoogle } from './services/firebase';
import { translateAuthError } from './services/firebaseErrors';
import { onAuthStateChanged } from 'firebase/auth';
import { Button } from './components/Button';
import { LanguageSelector } from './components/LanguageSelector';
import { useLanguage } from './services/i18n/language';

const formatToday = (language: 'pt' | 'en' = 'pt') => {
  const today = new Date();
  const locale = language === 'en' ? 'en-US' : 'pt-BR';
  return today.toLocaleDateString(locale, { weekday: 'long', day: '2-digit', month: 'long' });
};

const DAY_IN_MS = 1000 * 60 * 60 * 24;
const ACTIVE_TAB_KEY = 'ce3m:active-tab';
const getLocalDateKey = (date: Date = new Date()) => {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// API base (sem barra final). Se não terminar com /api, anexamos /api.
const RAW_API_BASE = (import.meta as any).env?.VITE_API_URL?.toString()?.replace(/\/$/, '') || '/api';
const API_BASE = RAW_API_BASE.endsWith('/api') ? RAW_API_BASE : `${RAW_API_BASE}/api`;
// Price IDs por moeda (configuráveis via env).
const envAny = (import.meta as any).env || {};
const PRICE_USD = envAny.VITE_STRIPE_PRICE_ID_USD || envAny.VITE_STRIPE_PRICE_ID || 'price_1SbLQaIPHHCnqO89wnvIRA80';
const PRICE_BRL = envAny.VITE_STRIPE_PRICE_ID_BRL || '';

const resolvePriceIdByLocale = () => {
  // Heurística: se idioma pt-BR ou fuso horário do Brasil, usa BRL; senão USD.
  if (typeof navigator !== 'undefined') {
    const lang = navigator.language?.toLowerCase() || '';
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const isBR = lang.startsWith('pt-br') || tz.includes('America/Sao_Paulo') || tz.includes('America/Recife') || tz.includes('America/Bahia') || tz.includes('America/Manaus') || tz.includes('America/Fortaleza');
    if (isBR && PRICE_BRL) return PRICE_BRL;
  }
  return PRICE_USD;
};

const getCurrentDayNumber = (startDate: string) => {
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return 1;
  const today = new Date();
  const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const diffDays = Math.floor((todayMidnight - startMidnight) / DAY_IN_MS);
  return Math.min(MISSIONS.length, Math.max(1, diffDays + 1));
};

const PREMIUM_PREVIEW = {
  theme: 'Missões premium diárias',
  missions: [
    'Check-in de humor em 2 minutos',
    'Pergunta coringa do dia',
    'Ritual rápido de desligar telas'
  ],
  teaser: 'Teste premium traz missões novas todos os dias e mensagens que se adaptam ao seu ritmo.'
};

const getGreeting = (language: 'pt' | 'en' = 'pt') => {
  const hour = new Date().getHours();
  if (language === 'en') {
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
};

const NEXT_STEP_SUGGESTIONS = [
  'Grave um áudio de 30s contando o melhor momento do seu dia — e por que ele importou.',
  'Deixe um bilhete curto elogiando algo específico que o outro fez nas últimas 24h.',
  'Marquem uma saída rápida de 15 minutos esta semana só para conversarem caminhando.',
  'Contem um ao outro um momento recente que fez vocês se sentirem mais conectados.',
  'Façam uma respiração guiada de 1 minuto juntos, sincronizando o ritmo.',
  'Escolham uma foto favorita e conversem por 3 minutos sobre a história por trás dela.',
  'Preparem um chá ou café juntos e conversem sem celular por 5 minutos.',
  'Troquem uma música que represente o clima emocional de hoje.',
  'Pergunte: “O que você mais vai precisar de mim amanhã?” e escute sem interromper.',
  'Agradeça verbalmente por algo pequeno que o outro fez hoje e que você percebeu.',
  'Escolham uma refeição simples e definam um dia para cozinharem juntos esta semana.',
  'Façam uma caminhada curta de 5 minutos prestando atenção só na presença do outro.',
  'Escrevam um “sim/mais”: algo que querem repetir mais vezes no relacionamento.',
  'Façam um check-in rápido: de 0 a 10, qual é o nível de energia emocional hoje?',
  'Olhem-se nos olhos por 20 segundos e tentem descrever como se sentiram depois.',
  'Envie amanhã uma mensagem surpresa que faça o outro sorrir em 10 palavras.',
  'Escolham um mini-ritual semanal para testarem nos próximos 7 dias.',
  'Compartilhem um medo ou preocupação em até duas frases, sem explicações longas.',
  'Relembrem um aprendizado recente que fortaleceu vocês como casal.',
  'Listem três pequenas vitórias da semana — individuais ou em dupla.',
  'Façam um “turno de fala”: cada um fala por 60s sem interrupções.',
  'Segurem a mão do outro por 30 segundos focando só no toque.',
  'Criem uma playlist curta (3 músicas) para ouvirem juntos amanhã.',
  'Escolham uma tarefa pequena da casa para fazerem juntos amanhã.',
  'Peçam claramente algo que precisam para amanhã: “preciso de X, pode me ajudar?”.',
  'Leiam em voz alta algo que escreveram hoje na reflexão do dia.',
  'Convidem o outro para uma micro-meditação de 2 minutos lado a lado.',
  'Definam um horário para irem dormir juntos hoje ou amanhã.',
  'Façam um elogio físico e outro de personalidade, ambos bem específicos.',
  'Compartilhem um desejo para o próximo mês em uma frase curta.',
  'Escolham uma palavra de “pausa segura” para usar antes de discussões escalarem.',
  'Combinem um minuto de alongamento juntos amanhã cedo.',
  'Escrevam num post-it algo simples que trouxe calma hoje.',
  'Escolham um emoji-código para mandarem durante o dia como sinal de carinho.',
  'Definam um limite de tela para hoje à noite e cumpram juntos.',
  'Montem um mini “kit emocional”: chá, playlist, frase, foto — algo que acalma.',
  'Façam uma previsão emocional de amanhã: “acho que vou estar assim por causa de...”',
  'Escolham uma pergunta curiosa para fazer amanhã no almoço.',
  'Crie um lembrete no celular: “elogiar algo até 12h” e cumpra.',
  'Comentem um detalhe do outro que ninguém mais percebe.',
  'Revejam uma foto antiga e digam o que mudou para melhor desde aquele dia.',
  'Façam um pequeno brinde com água celebrando algo minúsculo que deu certo.',
  'Marquem um “encontro de corredor”: 3 minutos de conversa sem distrações.',
  'Listem três comportamentos que querem evitar no próximo conflito.',
  'Gravem um áudio de boa-noite e troquem antes de dormir.',
  'Mandem um meme que descreva o humor do relacionamento hoje.',
  'Criem um gesto físico rápido que signifique “tô com você”.',
  'Inventem um apelido carinhoso provisório só para esta semana.',
  'Repitam amanhã a missão favorita do mês — a escolha é livre.',
  'Definam uma palavra-curinga para lembrar de respirar em momentos tensos.',
  'Escrevam algo que querem dizer, mas preferem guardar para amanhã.',
];

const SOLO_NEXT_STEP_SUGGESTIONS = [
  'Grave um áudio de 30s contando o melhor momento do seu dia — e por que ele importou para você.',
  'Deixe um bilhete curto para si mesmo elogiando algo específico que fez nas últimas 24h.',
  'Marque um micro descanso de 15 minutos esta semana só para caminhar sem celular.',
  'Escreva uma memória recente que te fez sentir mais conectado consigo.',
  'Faça uma respiração guiada de 1 minuto, focando no seu ritmo.',
  'Escolha uma foto favorita sua e escreva a história por trás dela.',
  'Prepare um chá ou café e fique 5 minutos sem tela, apenas degustando.',
  'Crie uma playlist curta (3 músicas) que representa seu humor hoje.',
  'Pergunte: “O que vou precisar de mim amanhã?” e anote a resposta.',
  'Agradeça verbalmente por algo que você fez hoje e quase não percebeu.',
  'Planeje uma refeição simples só para você e defina o dia.',
  'Faça uma caminhada curta de 5 minutos prestando atenção no corpo.',
  'Escreva um “sim/mais”: algo que quer repetir mais vezes.',
  'Faça um check-in rápido: de 0 a 10, qual seu nível de energia emocional hoje?',
  'Olhe-se no espelho por 20 segundos e descreva como se sentiu depois.',
  'Envie para si mesmo uma mensagem programada para amanhã que te faça sorrir.',
  'Escolha um mini-ritual semanal para testar nos próximos 7 dias.',
  'Compartilhe num diário um medo ou preocupação em duas frases.',
  'Relembre um aprendizado recente que te fortaleceu.',
  'Liste três pequenas vitórias da semana.',
  'Faça um “turno de fala” em áudio: fale 60s sem interrupções e depois ouça.',
  'Segure suas próprias mãos por 30 segundos focando na sensação.',
  'Crie um gesto físico rápido que signifique “estou comigo”.',
  'Invente um apelido carinhoso provisório para si esta semana.',
  'Repita amanhã a missão favorita do mês — a escolha é livre.',
  'Defina uma palavra-curinga para lembrar de respirar quando tudo apertar.',
  'Escreva algo que quer dizer, mas prefere guardar para amanhã.',
];

const DISTANCE_NEXT_STEP_SUGGESTIONS = [
  'Mandem um áudio de 30s sobre o melhor minuto do dia e ouçam juntos em chamada rápida.',
  'Façam uma videochamada de 5 minutos só para contar um detalhe bom do dia, sem falar de logística.',
  'Escolham ouvir a mesma música e contem em áudio o que sentiram.',
  'Troquem uma foto do dia e conversem 3 minutos sobre ela na chamada.',
  'Combinem um “boa-noite” por áudio descrevendo algo que apreciaram um no outro hoje.',
  'Marquem 10 minutos amanhã para um café em vídeo, cada um com sua bebida.',
  'Façam uma respiração guiada 4-4 na chamada por 2 minutos antes de dormir.',
  'Escolham um emoji-código para mandar ao longo do dia quando precisarem de apoio.',
  'Troquem um mini-elogio específico por mensagem de voz antes de dormir.',
  'Assistam a um vídeo curto em paralelo e conversem por 3 minutos sobre o que sentiram.',
  'Planejem um “encontro remoto” de 15 minutos no fim de semana (jogo, receita, playlist).',
  'Gravem um áudio dizendo “o que vou precisar de você amanhã” e ouçam juntos.',
  'Enviem um meme que represente o humor do dia e usem como ponto de partida para conversar.',
  'Leiam algo em voz alta por mensagem de voz e peçam para o outro fazer o mesmo.',
  'Façam um brinde com água na chamada e registrem com print para lembrar depois.',
];

const App = () => {
  const { language, setLanguage } = useLanguage();
  const [user, setUser] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'mission' | 'history' | 'profile'>(() => {
    if (typeof window === 'undefined') return 'mission';
    const stored = window.localStorage.getItem(ACTIVE_TAB_KEY);
    if (stored === 'mission' || stored === 'history' || stored === 'profile') return stored;
    return 'mission';
  });
  const [editName, setEditName] = useState('');
  const [editPartnerName, setEditPartnerName] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirm, setResetConfirm] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showNextMonthModal, setShowNextMonthModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [trialActivated, setTrialActivated] = useState(false);
  const [trialLoading, setTrialLoading] = useState(false);
  const [pendingTrialMission, setPendingTrialMission] = useState<{ mission: Mission; day: number } | null>(null);
  const [trialContext, setTrialContext] = useState<'mission' | 'profile'>('mission');
  const [showModeModal, setShowModeModal] = useState(false);
  const [modeSelection, setModeSelection] = useState<'solo' | 'couple' | 'distance'>('couple');
  const [modeName, setModeName] = useState('');
  const [modePartnerName, setModePartnerName] = useState('');
  const [missionOrder, setMissionOrder] = useState<number[]>([]);
  const [modeSwitching, setModeSwitching] = useState(false);
  const [missionMode, setMissionMode] = useState<'solo' | 'couple' | 'distance'>('couple');
  const shuffleSeed = user?.startDate || new Date().toISOString();
  const [confirmingStripe, setConfirmingStripe] = useState(false);
  const [showSubscribeConfirm, setShowSubscribeConfirm] = useState(false);
  const [stripePending, setStripePending] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [resolvingSubscription, setResolvingSubscription] = useState(false);
  const [resolveAttempted, setResolveAttempted] = useState(false);
  const lastStatusCheck = useRef<{ id?: string; ts: number }>({ id: undefined, ts: 0 });

  const premiumAccess = useMemo(() => {
    if (!user) return false;
    const status = (user.subscriptionStatus || '').toLowerCase();
    const nowSec = Math.floor(Date.now() / 1000);
    const allowedStatuses = new Set(['active', 'trialing', 'past_due', 'incomplete']);
    const statusGrants = allowedStatuses.has(status);
    const cancelGrace = Boolean(user.cancelAtPeriodEnd && user.currentPeriodEnd && user.currentPeriodEnd > nowSec);
    return Boolean(user.isPremium || statusGrants || cancelGrace);
  }, [user]);

  const getMissionForDay = (day: number): Mission | undefined => {
    const order = missionOrder.length === MISSIONS.length ? missionOrder : DEFAULT_MISSION_ORDER;
    const missionId = order[day - 1];
    if (missionId) {
      const fromOrder = getMissionByIdMode(missionId, missionMode || 'couple', language);
      if (fromOrder) return fromOrder;
    }
    return getMissionForDayRandom(day, missionMode || 'couple', shuffleSeed, language);
  };
  const [highlightReflection, setHighlightReflection] = useState<{ title: string; text: string } | null>(null);
  
  // Pagination state for history to prevent heavy rendering
  const [historyPage, setHistoryPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [tabChanging, setTabChanging] = useState(false);
  const todayKey = getLocalDateKey();

  // Helper to load data
  const loadUserData = async () => {
    setLoading(true);
    try {
      const data = await getUserData();
      setUser(data);
    } catch (error) {
      console.error("Erro carregando dados do usuário, usando visitante", error);
      const fallback: UserProgress = {
        name: 'Visitante',
        username: 'visitante',
        email: '',
        mode: 'couple',
        partnerName: '',
        startDate: new Date().toISOString(),
        completedMissionIds: [],
        isPremium: false,
        streak: 0,
        lastLoginDate: new Date().toISOString(),
        reflections: {},
        language,
      };
      setUser(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let initialized = false;
    const unsubscribe = onAuthStateChanged(auth, async () => {
      if (!initialized) {
        initialized = true;
        await loadUserData();
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedLang = window.localStorage.getItem('ce3m:language');
    if (!storedLang && user?.language && user.language !== language) {
      setLanguage(user.language);
    }
  }, [user?.language, language, setLanguage]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(ACTIVE_TAB_KEY, activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (user && !user.language) {
      const updated = { ...user, language };
      setUser(updated);
      saveUserData(updated);
    }
  }, [user, language]);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditPartnerName(user.partnerName || '');
      setModeSelection(user.mode || 'couple');
      setModeName(user.name || '');
      setModePartnerName(user.partnerName || '');
      setMissionMode(user.mode || 'couple');
      const order = DEFAULT_MISSION_ORDER;
      setMissionOrder(order);
      if (!Array.isArray(user.missionOrder) || user.missionOrder.length !== order.length || user.missionOrder.some((id, idx) => id !== order[idx])) {
        const updated = { ...user, missionOrder: order };
        saveUserData(updated);
        setUser(updated);
      }
    }
  }, [user]);

  useEffect(() => {
    if (modeSelection === 'solo' && !modePartnerName) {
      setModePartnerName('Minha jornada');
    }
  }, [modeSelection]);

  useEffect(() => {
    // highlight reflexão mais longa usando dados persistidos
    let best: { title: string; text: string } | null = null;
    const seed = user?.startDate || new Date().toISOString();
    const order = missionOrder.length === MISSIONS.length ? missionOrder : getShuffledMissions(seed).map((m) => m.id);
    order.forEach((missionId, idx) => {
      const base = MISSIONS.find((m) => m.id === missionId) || MISSIONS[idx];
      const missionData = getMissionByIdMode(base.id, missionMode || 'couple', language) || adaptMission(base, missionMode || 'couple', language);
      const reflection = getReflectionForMission(base.id);
      if (reflection && reflection.trim().length > 0) {
        if (!best || reflection.length > best.text.length) {
          best = { title: missionData.title, text: reflection.trim() };
        }
      }
    });
    setHighlightReflection(best);
  }, [todayKey, user, missionOrder, missionMode]);

  useEffect(() => {
    setTabChanging(true);
    const t = setTimeout(() => setTabChanging(false), 360);
    return () => clearTimeout(t);
  }, [activeTab]);

  const handleOnboardingComplete = async (name: string, partnerName: string, mode: 'solo' | 'couple' | 'distance') => {
      const updated = await updateUserProfile(name, partnerName, mode);
      setUser(updated);
      setMissionMode(updated.mode || 'couple');
  };

  const completeMissionAndHandle = async (mission: Mission, current: UserProgress, dayNumber: number) => {
    const updatedUser = await completeMission(mission.id, current);
    setUser(updatedUser);
    if (updatedUser.isPremium && dayNumber === MISSIONS.length) {
      setShowNextMonthModal(true);
    }
  };

  const handleCompleteMission = async () => {
    if (!user) return;
    const activeMission = getMissionForDay(currentDay);
    if (!activeMission) return;

    if (!premiumAccess) {
      setPendingTrialMission({ mission: activeMission, day: currentDay });
      setTrialActivated(false);
      setTrialContext('mission');
      setShowTrialModal(true);
      return;
    }

    await completeMissionAndHandle(activeMission, user, currentDay);
  };

  const handleSubscribe = async () => {
    const priceId = resolvePriceIdByLocale();
    if (!priceId) {
      alert('Configure os preços de assinatura (VITE_STRIPE_PRICE_ID_BRL/USD).');
      return;
    }

    try {
      setTrialLoading(true);
      const res = await fetch(`${API_BASE}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          customerEmail: auth.currentUser?.email || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error('Sessão sem URL retornada.');
    } catch (error) {
      console.error('Erro ao iniciar checkout Stripe', error);
      alert('Não foi possível iniciar o pagamento agora. Tente novamente.');
    } finally {
      setTrialLoading(false);
    }
  };

  const openSubscribeConfirm = () => setShowSubscribeConfirm(true);
  const cancelSubscribeConfirm = () => setShowSubscribeConfirm(false);
  const confirmSubscribe = () => {
    setShowSubscribeConfirm(false);
    handleSubscribe();
  };

  const handleConfirmCancelSubscription = async () => {
    let subscriptionId = user?.subscriptionId;
    if (!subscriptionId) {
      // tentativa de resolver pelo e-mail antes de abortar
      const email = auth.currentUser?.email || user?.email;
      if (email) {
        try {
          setResolvingSubscription(true);
          const res = await fetch(`${API_BASE}/resolve-subscription?email=${encodeURIComponent(email)}`);
          if (res.ok) {
            const data = await res.json();
            subscriptionId = data?.id;
            if (subscriptionId) {
              const currentPeriodEnd = typeof data?.current_period_end === 'number' ? data.current_period_end : undefined;
              const cancelAtPeriodEnd = Boolean(data?.cancel_at_period_end);
              const status = (data?.status || '').toString();
              const updated = await upgradeUser(subscriptionId, status, currentPeriodEnd, cancelAtPeriodEnd);
              setUser(updated);
            }
          }
        } catch (err) {
          console.warn('Não foi possível resolver assinatura pelo e-mail antes do cancelamento', err);
        } finally {
          setResolvingSubscription(false);
        }
      }
    }

    if (!subscriptionId) {
      alert(language === 'en' ? 'Subscription not found.' : 'Assinatura não encontrada.');
      return;
    }

    try {
      setCancelLoading(true);
      const res = await fetch(`${API_BASE}/cancel-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId,
          cancelAtPeriodEnd: false, // cancel immediately
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const canceledLocal = await cancelSubscription({
        subscriptionId: data?.id || subscriptionId,
        status: data?.status,
        currentPeriodEnd: data?.current_period_end,
        cancelAtPeriodEnd: data?.cancel_at_period_end ?? false,
        immediate: true,
      });
      setUser(canceledLocal);

      // Sync with Stripe after cancel to ensure state is accurate
      try {
        const verify = await fetch(`${API_BASE}/subscription-status?subscriptionId=${encodeURIComponent(subscriptionId)}`);
        if (verify.ok) {
          const verifyData = await verify.json();
          const vStatus = (verifyData?.status || '').toString();
          const vEnd = typeof verifyData?.current_period_end === 'number' ? verifyData.current_period_end : undefined;
          const vCancel = Boolean(verifyData?.cancel_at_period_end);
          const allowed = ['active', 'trialing', 'past_due', 'incomplete'];
          if (allowed.includes(vStatus) || (vCancel && vEnd && vEnd > Math.floor(Date.now() / 1000))) {
            const upgraded = await upgradeUser(subscriptionId, vStatus, vEnd, vCancel);
            setUser(upgraded);
          } else {
            const ensured = await cancelSubscription({
              subscriptionId,
              status: vStatus,
              currentPeriodEnd: vEnd,
              cancelAtPeriodEnd: vCancel,
              immediate: true,
            });
            setUser(ensured);
          }
        }
      } catch (err) {
        console.warn('Não foi possível verificar cancelamento na Stripe', err);
      }
      setShowCancelModal(false);
    } catch (err) {
      console.error('Erro ao cancelar assinatura Stripe', err);
      alert(language === 'en' ? 'Could not cancel now. Try again.' : 'Não foi possível cancelar agora. Tente novamente.');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleLogout = async () => {
      setLoading(true);
      try {
        await logoutUser();
      } finally {
        clearLocalUserData();
        setUser(null);
        setMissionMode('couple');
        setModeSelection('couple');
        setActiveTab('mission');
        setShowTrialModal(false);
        setPendingTrialMission(null);
        setTrialActivated(false);
        setTrialLoading(false);
        setShowModeModal(false);
        await loadUserData();
        setLoading(false);
      }
  }

  // When returning from Stripe checkout, confirm session and mark as premium.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');

    const shouldConfirm = sessionId && !user?.isPremium && !confirmingStripe;
    if (!shouldConfirm) return;

    const confirmStripe = async () => {
      try {
        setStripePending(true);
        setConfirmingStripe(true);
        const res = await fetch(`${API_BASE}/get-checkout-session?session_id=${encodeURIComponent(sessionId!)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const status = (data?.status || '').toString();
        const subscriptionId = data?.subscriptionId as string | undefined;
        const currentPeriodEnd = typeof data?.currentPeriodEnd === 'number' ? data.currentPeriodEnd : undefined;
        const cancelAtPeriodEnd = Boolean(data?.cancelAtPeriodEnd);
        const subscriptionActive = ['active', 'trialing', 'complete', 'incomplete'].includes(status);
        if (subscriptionActive) {
          const upgraded = await upgradeUser(subscriptionId, status, currentPeriodEnd, cancelAtPeriodEnd);
          setUser(upgraded);
          // Clean URL
          const url = new URL(window.location.href);
          url.searchParams.delete('session_id');
          window.history.replaceState({}, document.title, url.toString());
        }
      } catch (err) {
        console.error('Erro ao confirmar sessão Stripe', err);
      } finally {
        setConfirmingStripe(false);
        setStripePending(false);
      }
    };

    confirmStripe();
  }, [user?.isPremium, confirmingStripe]);

  // Refresh subscription status from Stripe when opening the app (if we have subscriptionId).
  useEffect(() => {
    const refreshSubscription = async () => {
      if (!user?.subscriptionId) return;
       // evita consultas excessivas: só revalida a cada 30s por subscriptionId
      if (
        lastStatusCheck.current.id === user.subscriptionId &&
        Date.now() - lastStatusCheck.current.ts < 30000
      ) {
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/subscription-status?subscriptionId=${encodeURIComponent(user.subscriptionId)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const status = (data?.status || '').toString();
        const currentPeriodEnd = typeof data?.current_period_end === 'number' ? data.current_period_end : undefined;
        const cancelAtPeriodEnd = Boolean(data?.cancel_at_period_end);
        const allowed = ['active', 'trialing', 'past_due', 'incomplete'];
        if (allowed.includes(status) || (cancelAtPeriodEnd && currentPeriodEnd && currentPeriodEnd > Math.floor(Date.now() / 1000))) {
          const upgraded = await upgradeUser(user.subscriptionId, status, currentPeriodEnd, cancelAtPeriodEnd);
          setUser(upgraded);
        } else {
          const updated = await cancelSubscription({
            subscriptionId: user.subscriptionId,
            status,
            currentPeriodEnd,
            cancelAtPeriodEnd,
            immediate: true,
          });
          setUser(updated);
        }
        lastStatusCheck.current = { id: user.subscriptionId, ts: Date.now() };
      } catch (err) {
        console.error('Erro ao atualizar status da assinatura', err);
      }
    };

    refreshSubscription();
  }, [user?.subscriptionId]);

  // Resolve subscriptionId by email for legacy users that lack it.
  useEffect(() => {
    const resolveSubscription = async () => {
      if (resolvingSubscription || resolveAttempted) return;
      if (user?.subscriptionId) return;
      const email = auth.currentUser?.email || user?.email;
      if (!email) return;
      try {
        setResolvingSubscription(true);
        const res = await fetch(`${API_BASE}/resolve-subscription?email=${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const status = (data?.status || '').toString();
        const currentPeriodEnd = typeof data?.current_period_end === 'number' ? data.current_period_end : undefined;
        const cancelAtPeriodEnd = Boolean(data?.cancel_at_period_end);
        const allowed = ['active', 'trialing', 'past_due', 'incomplete'];
        const grant = allowed.includes(status) || (cancelAtPeriodEnd && currentPeriodEnd && currentPeriodEnd > Math.floor(Date.now() / 1000));
        if (grant) {
          const upgraded = await upgradeUser(data?.id, status, currentPeriodEnd, cancelAtPeriodEnd);
          setUser(upgraded);
        } else {
          const updated = await cancelSubscription({
            subscriptionId: data?.id,
            status,
            currentPeriodEnd,
            cancelAtPeriodEnd,
            immediate: true,
          });
          setUser(updated);
        }
      } catch (err) {
        // Se não achar, mantém free.
        console.warn('Não foi possível resolver assinatura pelo e-mail', err);
      } finally {
        setResolvingSubscription(false);
        setResolveAttempted(true);
      }
    };

    resolveSubscription();
  }, [user?.subscriptionId, user?.email, resolvingSubscription, resolveAttempted]);
  const handleLogin = async () => {
      try {
        await loginWithGoogle();
      } catch (error: any) {
        console.error("Erro ao conectar com Google", error);
        const translated = translateAuthError(error, 'conectar com Google');
        alert(`${translated.title}: ${translated.detail}`);
      }
  };
  const handleSaveProfile = async () => {
      const isSolo = user?.mode === 'solo';
      if (!editName.trim() || (!isSolo && !editPartnerName.trim())) {
        alert(isSolo ? "Preencha seu nome." : "Preencha nome e nome do parceiro.");
        return;
      }
      const partnerValue = isSolo ? (editPartnerName.trim() || 'Minha jornada') : editPartnerName.trim();
      const updated = await updateUserProfile(editName.trim(), partnerValue, user?.mode || 'couple');
      setUser(updated);
  };
  const handleResetProgress = async () => {
      if (!user) return;
      const confirmed = resetConfirm.trim() === 'RESET';
      if (!confirmed) return;
      const updated = await resetProgress();
      setUser(updated);
      setShowResetModal(false);
      setResetConfirm('');
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2500);
  };

  const handleCancelSubscription = () => {
    setShowCancelModal(true);
  };

  const handleSaveMode = async () => {
    if (!modeName.trim()) {
      alert("Preencha seu nome.");
      return;
    }
    const partnerValue = modeSelection === 'solo' ? (modePartnerName.trim() || 'Minha jornada') : modePartnerName.trim();
    if (modeSelection !== 'solo' && !partnerValue.trim()) {
      alert("Preencha o nome do parceiro(a).");
      return;
    }
    const updated = await updateUserProfile(modeName.trim(), partnerValue, modeSelection);
    setUser(updated);
    setEditName(updated.name);
    setEditPartnerName(updated.partnerName || '');
    setMissionMode(updated.mode || 'couple');
    setShowModeModal(false);
  };

  const handleStartTrial = async () => {
    if (!user) return;
    setTrialLoading(true);
    try {
      const upgraded = await upgradeUser();
      setUser(upgraded);
      setTrialActivated(true);
      if (pendingTrialMission) {
        await completeMissionAndHandle(pendingTrialMission.mission, upgraded, pendingTrialMission.day);
      }
      setPendingTrialMission(null);
      setShowTrialModal(false);
    } catch (error) {
      console.error("Erro ao ativar teste", error);
      alert("Não foi possível ativar o teste agora. Tente novamente.");
    } finally {
      setTrialLoading(false);
    }
  };

  const handleSaveReflection = async (missionId: number, text: string) => {
    if (!user) return;
    const updated = await saveReflection(missionId, text);
    setUser(updated);
  };

  const getReflectionForMission = (missionId: number) => {
    const fromUser = user?.reflections?.[missionId];
    if (fromUser) return fromUser;
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`ce3m-reflection-${missionId}`) || '';
    }
    return '';
  };

  const currentDay = useMemo(() => {
    if (!user) return 1;
    return getCurrentDayNumber(user.startDate);
  }, [todayKey, user]);

  const activeMission = useMemo(() => {
    if (!user) return undefined;
    return getMissionForDay(currentDay);
  }, [currentDay, missionOrder, missionMode, shuffleSeed, user]);

  const isCompleted = useMemo(() => {
    if (!activeMission || !user) return false;
    return user.completedMissionIds.includes(activeMission.id);
  }, [activeMission, user]);

  const handleMissionToggleMode = async (nextMode: 'couple' | 'distance') => {
    if (!user) return;
    if (missionMode === nextMode) return;
    const partnerValue = user.partnerName?.trim() || '';
    if (!partnerValue) {
      alert("Preencha o nome do parceiro(a) no perfil antes de alternar para casal.");
      setActiveTab('profile');
      setShowModeModal(true);
      return;
    }
    setModeSwitching(true);
    const prevUser = user;
    const optimistic = { ...user, mode: nextMode };
    setMissionMode(nextMode);
    setUser(optimistic);
    setModeSelection(nextMode);
    try {
      const updated = await updateUserProfile(user.name, partnerValue, nextMode);
      setUser(updated);
      setModeName(updated.name);
      setModePartnerName(updated.partnerName || '');
    } catch (error) {
      console.error("Erro ao trocar modo pela missão", error);
      alert("Não foi possível trocar o modo agora. Tente novamente.");
      setUser(prevUser);
      setMissionMode(prevUser.mode === 'solo' || prevUser.mode === 'distance' || prevUser.mode === 'couple' ? prevUser.mode : 'couple');
      const fallbackMode = prevUser.mode === 'solo' || prevUser.mode === 'distance' || prevUser.mode === 'couple' ? prevUser.mode : 'couple';
      setModeSelection(fallbackMode);
    } finally {
      setModeSwitching(false);
    }
  };

  const handleLanguageChange = async (lang: 'pt' | 'en') => {
    setLanguage(lang);
    if (!user) return;
    try {
      const updated = await updateLanguagePreference(lang, user);
      setUser(updated);
    } catch (error) {
      console.error("Erro ao salvar idioma", error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-brand-bg text-brand-primary anim-pulse-soft">
        <HeartPulse />
    </div>;
  }

  const needsOnboarding = user && (!user.mode || ((user.mode === 'couple' || user.mode === 'distance') && (!user.partnerName || user.partnerName === '')));

  if (needsOnboarding) {
      return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (!user) return null;

  const renderMissionView = () => {
    const suggestionList = missionMode === 'solo' 
      ? (language === 'en' ? SOLO_NEXT_STEP_SUGGESTIONS_EN : SOLO_NEXT_STEP_SUGGESTIONS)
      : missionMode === 'distance'
        ? (language === 'en' ? DISTANCE_NEXT_STEP_SUGGESTIONS_EN : DISTANCE_NEXT_STEP_SUGGESTIONS)
        : (language === 'en' ? NEXT_STEP_SUGGESTIONS_EN : NEXT_STEP_SUGGESTIONS);
    const shareSuggestion = async () => {
      if (!activeMission) return;
      const suggestion = suggestionList[(currentDay - 1) % suggestionList.length];
      const text = language === 'en'
        ? `Just finished "${activeMission.title}" (Day ${currentDay}) on 3-Minute Connection. Suggested next step: ${suggestion}`
        : `Acabei "${activeMission.title}" (Dia ${currentDay}) no Conexão em 3 Minutos. Próximo passo sugerido: ${suggestion}`;
      try {
        await navigator.share({ title: 'Próximo passo', text });
      } catch (err) {
        console.log('Share suggestion fallback', err);
      }
    };

    return (
    <div className="space-y-6 md:space-y-8">
        <header className="mb-4">
            <h1 className="font-serif heading-lg text-brand-text leading-tight">{getGreeting(language)}, {user.name.split(' ')[0]}</h1>
            <p className="text-gray-500 text-xs sm:text-sm">{formatToday(language)}</p>
        </header>

        <div className="grid gap-3">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm card-padding soft-hover transition-all duration-300 w-full">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase text-gray-500 font-bold tracking-[0.2em]">Linha da semana</p>
              <span className="text-xs text-brand-primary font-semibold">Streak {user.streak}</span>
            </div>
            <div className="flex items-center gap-2 mt-3 w-full">
              {Array.from({ length: 7 }).map((_, idx) => {
                const dayNumber = Math.max(1, currentDay - 6) + idx;
                const mission = getMissionForDay(dayNumber);
                const done = mission ? user.completedMissionIds.includes(mission.id) : false;
                const isToday = dayNumber === currentDay;
                const isFuture = dayNumber > currentDay;
                return (
                  <div key={dayNumber} className="flex-1">
                    <div className={`h-2 rounded-full ${done ? 'bg-brand-primary' : isToday ? 'bg-amber-300' : isFuture ? 'bg-gray-200' : 'bg-gray-100'}`} />
                    <p className="text-[10px] text-gray-400 mt-1 text-center">D{dayNumber}</p>
                  </div>
                );
              })}
            </div>
            {highlightReflection && (
              <div className="mt-3 bg-brand-primary/10 border border-brand-primary/20 rounded-xl p-3">
                <p className="text-[11px] uppercase text-brand-primary font-bold">Highlight da semana</p>
                <p className="text-sm text-brand-text font-semibold">{highlightReflection.title}</p>
                <p className="text-xs text-gray-600 line-clamp-2">{highlightReflection.text}</p>
              </div>
            )}
          </div>
        </div>

        {activeMission ? (
          <DailyMission 
            key={`${activeMission.id}-${missionMode}`}
            mission={activeMission} 
            isCompleted={isCompleted} 
            onComplete={handleCompleteMission}
            mode={missionMode || 'couple'}
            dayNumber={currentDay}
            partnerName={user.partnerName || ''}
            initialReflection={getReflectionForMission(activeMission.id)}
            onSaveReflection={handleSaveReflection}
            onToggleMode={handleMissionToggleMode}
            modeSwitching={modeSwitching}
            language={language}
          />
        ) : (
          <div className="text-center py-10 bg-white rounded-3xl p-8 shadow-sm">
             <h2 className="font-serif text-2xl text-brand-primary">Ciclo Concluído!</h2>
             <p className="text-gray-500 mt-2">Você completou o ciclo de {CURRENT_MONTH_THEME}.</p>
          </div>
        )}

        {isCompleted && activeMission && (
          <div className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 border border-brand-primary/20 rounded-2xl p-4 shadow-sm card-padding flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs uppercase text-brand-primary font-bold tracking-[0.2em]">Próximo passo sugerido</p>
              <p className="text-sm text-brand-text">{suggestionList[(currentDay - 1) % suggestionList.length]}</p>
            </div>
            <Button variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary/10" onClick={shareSuggestion}>
              {missionMode === 'solo' ? 'Compartilhar (opcional)' : 'Compartilhar com parceiro(a)'}
            </Button>
          </div>
        )}

        <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 flex flex-col gap-2 transition-all duration-300 soft-hover card-float">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Progresso</span>
            <span className="text-brand-primary font-serif font-bold text-sm sm:text-base">{Math.round((user.completedMissionIds.length / 30) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-500"
              style={{ width: `${Math.min(100, (user.completedMissionIds.length / 30) * 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-500">
            <span>{user.completedMissionIds.length} / 30 missões</span>
            <span>Streak {user.streak}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm card-padding transition-all duration-300 soft-hover">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Tema do mês</p>
            <p className="font-serif text-base sm:text-lg text-brand-text">{CURRENT_MONTH_THEME}</p>
            <p className="text-xs text-gray-500 mt-1">30 dias • conteúdo liberado diariamente</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm card-padding transition-all duration-300 soft-hover">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Resumo rápido</p>
            <p className="text-sm text-brand-text">Streak: <span className="font-semibold">{user.streak}</span> dia(s)</p>
            <p className="text-sm text-gray-500">Missões concluídas: <span className="font-semibold text-brand-primary">{user.completedMissionIds.length}</span></p>
          </div>
        </div>

        {!premiumAccess && (
        <div className="bg-gradient-to-br from-brand-primary/10 via-white to-brand-secondary/10 border border-brand-primary/20 rounded-2xl p-5 sm:p-6 shadow-sm card-padding card-float soft-hover">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
            <div>
              <p className="text-[11px] uppercase text-brand-primary font-bold tracking-[0.2em]">Conteúdo premium diário</p>
              <h3 className="font-serif text-xl text-brand-text leading-tight mt-1">Teste 7 dias sem cartão</h3>
              <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                Ative o teste para receber missões novas todos os dias, mensagens que se adaptam ao seu ritmo e PDF com suas reflexões.
              </p>
            </div>
            <span className="text-[11px] text-gray-500 whitespace-nowrap">Cancelamento fácil</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mt-2">
            {PREMIUM_PREVIEW.missions.map((m, i) => (
              <div key={m} className="flex items-start gap-3 text-sm text-brand-text bg-white/80 border border-gray-100 rounded-xl p-3 shadow-[0_4px_18px_rgba(0,0,0,0.04)]">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-brand-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Roteiro {i + 1}</p>
                  <p className="font-semibold">{m}</p>
                  <p className="text-xs text-gray-500">Liberado durante o teste • adaptação diária</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-600">
            <p className="max-w-xl">Inclui rituais extras semanais, histórico ilimitado e exportação em PDF com suas notas.</p>
            {!premiumAccess && (
              <Button 
                onClick={openSubscribeConfirm} 
                className="w-full sm:w-auto bg-brand-text text-white hover:bg-black px-5"
              >
                Ativar teste premium
              </Button>
            )}
          </div>
        </div>
        )}
    </div>
  );
  }

  const renderHistoryView = () => {
    // Pagination Logic
    const orderIds = missionOrder.length === MISSIONS.length ? missionOrder : DEFAULT_MISSION_ORDER;
    const visibleIds = orderIds.slice(0, historyPage * ITEMS_PER_PAGE);
    const hasMore = visibleIds.length < orderIds.length;

    return (
        <div className="space-y-6 md:space-y-8">
            <header>
                <h2 className="font-serif heading-md text-brand-text mb-1 leading-tight">
                  {language === 'en' ? 'Your Journey' : 'Sua Jornada'}
                </h2>
                <p className="text-xs text-brand-primary uppercase tracking-widest font-bold">{CURRENT_MONTH_THEME}</p>
            </header>

            <div className="space-y-0">
                {visibleIds.map((missionId, index) => {
                    const dayNumber = index + 1;
                const missionData = getMissionByIdMode(missionId, missionMode || 'couple', language);
                    const isDone = user.completedMissionIds.includes(missionId);
                    const isLocked = !isDone && dayNumber > currentDay;
                    const isFuture = dayNumber > currentDay;
                    const reflection = getReflectionForMission(missionId);
                
                // Streak logic: Check if this mission and the PREVIOUS mission in the list were both done
                const prevId = visibleIds[index - 1];
                const isPrevDone = prevId && user.completedMissionIds.includes(prevId);
                const isStreak = isDone && isPrevDone;

                    return (
                        <div 
                          key={missionId} 
                          className="relative anim-fade-slide-fast transition-all duration-300 hover:-translate-y-0.5" 
                          style={{ animationDelay: `${index * 35}ms` }}
                        >
                            {/* Streak Connector Line */}
                            {isStreak && (
                                <div className="absolute left-6 -top-4 bottom-1/2 w-0.5 bg-gradient-to-b from-brand-gold/50 to-brand-gold z-0" />
                            )}

                            <div className={`p-4 rounded-xl border mb-3 relative z-10 transition-all duration-300 ${
                                isStreak
                                ? 'bg-amber-50 border-amber-200 shadow-sm'
                                : isDone 
                                ? 'bg-white border-brand-primary/30 shadow-sm' 
                                : 'bg-gray-50 border-gray-100'
                            }`}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-gray-400 uppercase">
                                          {language === 'en' ? 'Day' : 'Dia'} {dayNumber}
                                        </span>
                                    </div>
                                    {isDone && <Check className="w-4 h-4 text-green-500" />}
                                    {isLocked && <span className="text-xs text-gray-300">{language === 'en' ? 'Locked' : 'Bloqueado'}</span>}
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <h4 className={`font-serif text-base sm:text-lg leading-snug ${isDone ? 'text-brand-text' : 'text-gray-400'}`}>
                                        {isFuture && !isDone ? "???" : missionData.title}
                                    </h4>
                                    {isStreak && (
                                        <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20 animate-pulse" />
                                    )}
                                </div>

                                {isDone && <p className="text-sm text-gray-500 mt-1 line-clamp-1">{missionData.action}</p>}
                                {isDone && reflection.trim() && (
                                  <p className="text-xs text-gray-600 mt-1 italic line-clamp-2">
                                    {language === 'en' ? 'Reflection:' : 'Reflexão:'} {reflection.trim()}
                                  </p>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {hasMore && (
                <button 
                    onClick={() => setHistoryPage(p => p + 1)}
                    className="w-full py-3 flex items-center justify-center text-sm text-gray-500 font-medium hover:bg-gray-50 rounded-xl transition-colors"
                >
                    <ChevronDown className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Load more missions' : 'Carregar mais missões'}
                </button>
            )}
            
            <PDFExport user={user} theme={CURRENT_MONTH_THEME} />
            
            {!premiumAccess && <SubscriptionGate onSubscribe={openSubscribeConfirm} />}
        </div>
    );
  };

  const renderProfileView = () => (
      <div className="space-y-6 md:space-y-8">
          <div className="bg-white p-6 md:p-7 rounded-3xl shadow-sm border border-gray-100 text-center relative rounded-surface card-padding card-float soft-hover transition-all duration-300 max-w-3xl mx-auto space-y-4">
              <div className="w-20 h-20 bg-brand-secondary/30 rounded-full mx-auto mb-4 flex items-center justify-center text-brand-primary overflow-hidden">
                  {auth.currentUser?.photoURL ? (
                      <img src={auth.currentUser.photoURL} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                      <UserIcon className="w-10 h-10" />
                  )}
              </div>
              <h2 className="font-serif heading-md text-brand-text">{user.name}</h2>
              <p className="text-gray-400 text-sm mb-4">&</p>
              <h2 className="font-serif heading-md text-brand-text mb-6">{user.partnerName}</h2>
              
              <div className="grid grid-cols-2 gap-3 sm:gap-5 border-t border-gray-100 pt-6">
                  <div className="text-center">
                      <span className="block text-2xl font-bold text-brand-primary">{user.streak}</span>
                      <span className="text-xs text-gray-400 uppercase">{language === 'en' ? 'Day streak' : 'Dias Seguidos'}</span>
                  </div>
                  <div className="text-center">
                      <span className="block text-2xl font-bold text-brand-primary">{user.completedMissionIds.length}</span>
                      <span className="text-xs text-gray-400 uppercase">{language === 'en' ? 'Missions' : 'Missões'}</span>
                  </div>
              </div>

              {auth.currentUser && (
                  <button onClick={handleLogout} className="absolute top-4 right-4 text-gray-400 hover:text-red-400">
                      <LogOut className="w-5 h-5" />
                  </button>
              )}
          </div>

          {auth.currentUser && (
            <div className="p-4 rounded-xl border border-gray-100 bg-white card-padding soft-hover transition-all duration-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-brand-text">{language === 'en' ? 'You are signed in' : 'Você está conectado'}</p>
                  <p className="text-xs text-gray-500 truncate">{auth.currentUser.email || auth.currentUser.displayName}</p>
                </div>
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="text-sm px-4 py-2 border-red-200 text-red-500 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" /> {language === 'en' ? 'Sign out' : 'Sair'}
                </Button>
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl border border-gray-100 bg-white card-padding soft-hover transition-all duration-300">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-sm font-semibold text-brand-text">{language === 'en' ? 'Panel language' : 'Idioma do painel'}</p>
                <p className="text-xs text-gray-500">{language === 'en' ? 'Choose Portuguese or English, or let the browser auto-detect.' : 'Escolha entre Português e English ou deixe no automático pelo navegador.'}</p>
              </div>
              <LanguageSelector onChange={handleLanguageChange} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm card-padding">
            <h3 className="text-sm font-semibold text-brand-text mb-3">{language === 'en' ? 'Habit badges' : 'Selos de hábito'}</h3>
            <div className="grid grid-cols-3 gap-3">
              {[{label: language === 'en' ? '3 days' : '3 dias', threshold: 3}, {label: language === 'en' ? '7 days' : '7 dias', threshold: 7}, {label: language === 'en' ? '14 days' : '14 dias', threshold: 14}].map(({label, threshold}) => {
                const lockedByPlan = !premiumAccess;
                const achieved = !lockedByPlan && user.streak >= threshold;
                const locked = lockedByPlan;
                return (
                  <div key={label} className={`p-3 rounded-xl border text-center ${achieved ? 'border-brand-primary/40 bg-brand-primary/10' : 'border-gray-200 bg-gray-50'} ${locked ? 'opacity-70' : ''}`}>
                    <p className="text-xs font-bold text-gray-500 uppercase">{label}</p>
                    <p className="text-sm text-brand-text font-semibold">
                      {locked ? (language === 'en' ? 'Subscribe to unlock' : 'Assine para liberar') : achieved ? (language === 'en' ? 'Achieved' : 'Conquistado') : (language === 'en' ? 'In progress' : 'Em progresso')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {premiumAccess && (
            <div className="bg-white p-4 rounded-xl border border-gray-100 soft-hover transition-all duration-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-brand-text">{language === 'en' ? 'Active plan' : 'Plano ativo'}</p>
                  <p className="text-xs text-gray-500">{language === 'en' ? 'Cancel anytime. Access remains until the end of the paid cycle.' : 'Cancele quando quiser. O acesso vai até o fim do ciclo pago.'}</p>
                </div>
                <Button 
                  onClick={handleCancelSubscription} 
                  variant="outline" 
                  className="text-sm px-4 py-2 border-red-200 text-red-500 hover:bg-red-50"
                >
                  {language === 'en' ? 'Cancel subscription' : 'Cancelar assinatura'}
                </Button>
              </div>
            </div>
          )}

          {!premiumAccess && (
            <div className="bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 p-5 rounded-2xl border border-brand-primary/20 shadow-sm space-y-3 card-padding">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-brand-gold fill-brand-gold" />
                  <div>
                    <p className="text-sm font-semibold text-brand-text">{language === 'en' ? 'Subscribe to unlock everything' : 'Assine para liberar tudo'}</p>
                    <p className="text-xs text-gray-500">{language === 'en' ? '7-day premium trial • No commitment' : 'Teste premium por 7 dias • Sem fidelidade'}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 font-semibold">
                  {language === 'en' ? '$0.99 / month' : 'R$ 4,99 / mês'}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-brand-text">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="font-semibold">{language === 'en' ? 'Daily premium missions' : 'Missões premium diárias'}</p>
                    <p className="text-xs text-gray-500">{language === 'en' ? 'New scripts unlocked during trial and subscription.' : 'Novos roteiros liberados durante o teste e assinatura.'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="font-semibold">{language === 'en' ? 'Premium PDF' : 'PDF premium'}</p>
                    <p className="text-xs text-gray-500">{language === 'en' ? 'With saved reflections and monthly stats.' : 'Com reflexões salvas e estatísticas do mês.'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="font-semibold">{language === 'en' ? 'Extra weekly rituals' : 'Rituais semanais extras'}</p>
                    <p className="text-xs text-gray-500">{language === 'en' ? 'Check-ins to keep the pace and reduce friction.' : 'Check-ins para manter o ritmo e reduzir ruído.'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="font-semibold">{language === 'en' ? 'Unlimited history + badges' : 'Histórico ilimitado + selos'}</p>
                    <p className="text-xs text-gray-500">{language === 'en' ? 'See your full path and unlock habit badges.' : 'Veja todo o caminho e libere os selos de hábito.'}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-500">
                <span>{language === 'en' ? 'Cancel easily in your profile' : 'Cancele fácil no perfil'}</span>
                <Button onClick={openSubscribeConfirm} className="w-full sm:w-auto bg-brand-text text-white hover:bg-black px-6">
                  {language === 'en' ? 'Subscribe and try 7 days' : 'Assinar e testar 7 dias'}
                </Button>
              </div>
            </div>
          )}
          
          {!auth.currentUser && (
            <div className="p-4 rounded-xl border border-gray-100 bg-white card-padding soft-hover transition-all duration-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-brand-text">{language === 'en' ? 'Sign in to sync' : 'Entrar para sincronizar'}</p>
                  <p className="text-xs text-gray-500">{language === 'en' ? 'Save your progress on any device' : 'Guarde seu progresso em qualquer dispositivo'}</p>
                </div>
                <Button 
                  onClick={handleLogin} 
                  variant="outline" 
                  className="text-sm px-4 py-2 border-brand-primary text-brand-primary hover:bg-brand-primary/10"
                >
                  {language === 'en' ? 'Sign in with Google' : 'Entrar com Google'}
                </Button>
              </div>
            </div>
          )}

          <div className="bg-brand-primary/5 p-4 rounded-xl flex items-center gap-4 transition-all duration-300 soft-hover">
               <div className="bg-white p-2 rounded-full shadow-sm">
                   <Star className={`w-5 h-5 ${premiumAccess ? 'text-brand-gold fill-brand-gold' : 'text-gray-300'}`} />
               </div>
               <div>
                   <h3 className="font-bold text-brand-text text-sm">
                    {language === 'en' ? 'Plan ' : 'Plano '}{premiumAccess ? 'Premium' : (language === 'en' ? 'Free' : 'Gratuito')}
                   </h3>
                   <p className="text-xs text-gray-500">
                    {premiumAccess ? (language === 'en' ? 'Full access unlocked' : 'Acesso total liberado') : (language === 'en' ? 'Subscribe to unlock more' : 'Assine para ver mais')}
                   </p>
               </div>
               {!premiumAccess && (
                  <button onClick={openSubscribeConfirm} className="ml-auto text-xs bg-brand-text text-white px-3 py-1 rounded-full">
                       {language === 'en' ? 'Upgrade' : 'Upgrade'}
                   </button>
               )}
          </div>
          
          <div className="p-4 rounded-xl border border-gray-100 bg-white soft-hover transition-all duration-300">
               <button className="flex items-center gap-3 w-full text-gray-600 text-sm py-2">
                   <Settings className="w-4 h-4" /> {language === 'en' ? 'Notification settings' : 'Configurações de Notificação'}
               </button>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 card-padding soft-hover transition-all duration-300">
              <h3 className="font-semibold text-sm text-brand-text">{language === 'en' ? 'Edit information' : 'Editar informações'}</h3>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline"
                  className="text-xs px-3 py-2 border-brand-primary text-brand-primary hover:bg-brand-primary/10"
                  onClick={() => setShowModeModal(true)}
                >
                  {language === 'en' ? 'Change mode' : 'Trocar modo'}
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder={language === 'en' ? 'Your name' : 'Seu nome'}
                    className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                  />
                  <input 
                    value={editPartnerName}
                    onChange={(e) => setEditPartnerName(e.target.value)}
                    placeholder={language === 'en' ? 'Partner name' : 'Nome do parceiro(a)'}
                    className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                  />
              </div>
              <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveProfile} 
                    variant="primary" 
                    className="px-4 py-2 text-sm"
                    disabled={!editName.trim() || (user?.mode !== 'solo' && !editPartnerName.trim())}
                  >
                    {language === 'en' ? 'Save' : 'Salvar'}
                  </Button>
              </div>
          </div>

          {resetSuccess && (
            <div className="bg-green-50 border border-green-100 text-green-700 rounded-xl p-3 text-sm">
              {language === 'en' ? 'Progress reset successfully. You are back to day 1.' : 'Progresso resetado com sucesso. Você voltou para o dia 1.'}
            </div>
          )}

          <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm space-y-3 card-padding soft-hover transition-all duration-300">
              <div className="flex items-start gap-3">
                  <div className="bg-red-50 text-red-500 p-2 rounded-lg">
                      <RotateCcw className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                      <h3 className="font-semibold text-sm text-red-600">{language === 'en' ? 'Reset journey' : 'Resetar jornada'}</h3>
                      <p className="text-xs text-gray-500">{language === 'en' ? 'Clear completed missions, streak, and restart at day 1. Irreversible action.' : 'Zera missões concluídas, streak e reinicia no dia 1. Ação irreversível.'}</p>
                  </div>
                  <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <Button 
                onClick={() => setShowResetModal(true)}
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50"
              >
                {language === 'en' ? 'Reset progress' : 'Resetar progresso'}
              </Button>
          </div>
      </div>
  );

  return (
    <div>
      {tabChanging && (
        <div className="fixed inset-0 z-30 pointer-events-none">
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] tab-wash" />
        </div>
      )}
      <Layout 
        userStreak={user.streak} 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        language={language}
      >
        <div key={activeTab} className="view-animate space-y-6">
          {activeTab === 'mission' && renderMissionView()}
          {activeTab === 'history' && renderHistoryView()}
          {activeTab === 'profile' && renderProfileView()}
        </div>
      </Layout>

      {showTrialModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-7 space-y-5 border border-brand-primary/20 card-padding">
              <div className="flex items-start gap-3">
                <div className="bg-brand-primary/15 text-brand-primary p-3 rounded-2xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.2em] text-brand-primary font-semibold">
                  {language === 'en' ? 'Activate to unlock' : 'Ative para liberar'}
                </p>
                <h3 className="font-serif text-2xl text-brand-text leading-snug">
                  {trialContext === 'mission'
                    ? (language === 'en' ? 'Unlock 7-day trial and finish the mission' : 'Liberar teste de 7 dias e finalizar a missão')
                    : (language === 'en' ? 'Start the 7-day trial to unlock premium' : 'Ative o teste de 7 dias para liberar o premium')}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  {trialContext === 'mission'
                    ? (language === 'en'
                      ? 'To finish the mission and keep receiving new ones, start the free premium trial (no card). Easy cancel.'
                      : 'Para concluir a missão e seguir recebendo novas, ative o teste premium gratuito (sem cartão). Cancelamento fácil.')
                    : (language === 'en'
                      ? 'Start the free premium trial (no card) to unlock extra daily missions, PDF, and rituals.'
                      : 'Ative o teste premium gratuito (sem cartão) para liberar missões extras diárias, PDF e rituais.')}
                </p>
                </div>
              </div>

            <div className="grid sm:grid-cols-2 gap-3 text-sm text-brand-text">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5" />
                <span>{language === 'en' ? 'No card, cancel anytime.' : 'Sem cartão, cancelamento fácil a qualquer momento.'}</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5" />
                <span>{language === 'en' ? 'Premium content unlocked during the 7-day trial.' : 'Conteúdo premium liberado durante o teste de 7 dias.'}</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5" />
                <span>{language === 'en' ? 'Premium PDF with reflections and stats.' : 'PDF premium com reflexões e estatísticas.'}</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-500 mt-0.5" />
                <span>{language === 'en' ? 'Badges and unlimited history unlocked.' : 'Selos e histórico ilimitado desbloqueados.'}</span>
              </div>
            </div>

            {trialContext === 'mission' && (
              <p className="text-xs text-gray-500">
                {language === 'en'
                  ? 'If you stay on free, the mission remains open until you start the trial.'
                  : 'Se continuar no gratuito, a missão permanece aberta até você ativar o teste.'}
              </p>
            )}

            {trialActivated && (
              <div className="bg-green-50 border border-green-100 text-green-700 text-sm rounded-xl p-3">
                {language === 'en' ? 'Trial activated! Enjoy the next 7 days of premium.' : 'Teste ativado! Aproveite os próximos 7 dias para sentir o premium.'}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
              <Button 
                variant="ghost" 
                className="w-full sm:w-auto" 
                onClick={() => { setShowTrialModal(false); setPendingTrialMission(null); }}
                disabled={trialLoading}
              >
                {language === 'en' ? 'Stay on free' : 'Continuar no gratuito'}
              </Button>
              <Button 
                className="w-full sm:w-auto bg-brand-text text-white hover:bg-black"
                onClick={handleStartTrial}
                disabled={trialLoading}
              >
                {trialLoading
                  ? (language === 'en' ? 'Activating...' : 'Ativando...')
                  : trialContext === 'mission'
                    ? (language === 'en' ? 'Start trial and finish' : 'Ativar teste e concluir')
                    : (language === 'en' ? 'Start free trial' : 'Ativar teste grátis')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showSubscribeConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-gray-100">
            <h3 className="text-lg font-semibold text-brand-text">
              {language === 'en' ? 'Confirm subscription' : 'Confirmar assinatura'}
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'en'
                ? 'Proceed to Stripe to complete your subscription and unlock all premium features.'
                : 'Prosseguir para o Stripe para concluir a assinatura e liberar todos os recursos premium.'}
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
              <Button variant="ghost" className="w-full sm:w-auto" onClick={cancelSubscribeConfirm}>
                {language === 'en' ? 'Not now' : 'Agora não'}
              </Button>
              <Button
                className="w-full sm:w-auto bg-brand-text text-white hover:bg-black"
                onClick={confirmSubscribe}
                disabled={trialLoading}
              >
                {trialLoading
                  ? (language === 'en' ? 'Opening checkout...' : 'Abrindo checkout...')
                  : (language === 'en' ? 'Continue to checkout' : 'Continuar para o checkout')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {stripePending && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-3 border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-brand-primary/30 border-t-brand-primary mx-auto animate-spin" />
            <h3 className="text-lg font-semibold text-brand-text">
              {language === 'en' ? 'Confirming payment...' : 'Confirmando pagamento...'}
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'en'
                ? 'Hold on while we confirm your subscription. Do not close this tab.'
                : 'Aguarde enquanto confirmamos sua assinatura. Não feche esta aba.'}
            </p>
          </div>
        </div>
      )}

      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-red-100">
            <div className="flex items-start gap-3">
              <div className="bg-red-50 text-red-500 p-2 rounded-lg">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-600">Tem certeza que quer resetar?</h3>
                <p className="text-sm text-gray-600">Isso vai zerar missões concluídas, streak e reiniciar no dia 1. Esta ação é irreversível.</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500">Digite "RESET" para confirmar</label>
              <input
                value={resetConfirm}
                onChange={(e) => setResetConfirm(e.target.value)}
                placeholder='RESET'
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
              />
              {resetConfirm && resetConfirm.trim() !== 'RESET' && (
                <p className="text-xs text-red-500">Use exatamente em maiúsculas: RESET</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => { setShowResetModal(false); setResetConfirm(''); }}>
                Cancelar
              </Button>
              <Button 
                onClick={handleResetProgress}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                disabled={resetConfirm.trim() !== 'RESET'}
              >
                Resetar agora
              </Button>
            </div>
          </div>
        </div>
      )}

      {showNextMonthModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 space-y-6 border border-brand-primary/20 card-padding">
            <div className="flex items-start gap-3">
              <div className="bg-brand-primary/15 text-brand-primary p-3 rounded-2xl">
                <Star className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">Parabéns, ciclo fechado</p>
                <h3 className="font-serif text-2xl text-brand-text leading-snug">Continue com missões premium diárias</h3>
                <p className="text-sm text-gray-600 mt-2">{PREMIUM_PREVIEW.teaser}</p>
              </div>
            </div>

            <div className="bg-brand-bg border border-gray-100 rounded-2xl p-4 space-y-3">
              <p className="text-xs uppercase text-brand-primary font-bold tracking-[0.2em]">Conteúdo premium • {PREMIUM_PREVIEW.theme}</p>
              <div className="space-y-2">
                {PREMIUM_PREVIEW.missions.map((m, i) => (
                  <div key={m} className="flex items-center gap-2 text-sm text-brand-text">
                    <Lock className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold">Roteiro premium {i + 1} •</span>
                    <span className="text-gray-600">“{m}” (liberado ao assinar)</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-xs text-gray-500">
                Teste premium 7 dias • cancele fácil
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="ghost" className="w-full sm:w-auto" onClick={() => setShowNextMonthModal(false)}>Depois</Button>
                <Button className="w-full sm:w-auto" onClick={() => { openSubscribeConfirm(); setShowNextMonthModal(false); }}>
                  Assinar e desbloquear
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-7 space-y-4 border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="bg-red-50 text-red-500 p-3 rounded-2xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">
                  {language === 'en' ? 'Cancel subscription' : 'Cancelar assinatura'}
                </p>
                <h3 className="font-serif text-xl text-brand-text leading-snug">
                  {language === 'en' ? 'Are you sure?' : 'Tem certeza?'}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  {language === 'en'
                    ? 'You keep access until the end of the paid cycle. Then you return to the free plan and history stays saved.'
                    : 'Você mantém acesso até o fim do ciclo pago. Depois volta para o plano gratuito e o histórico continua salvo.'}
                </p>
              </div>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-600">
              {language === 'en'
                ? 'We will cancel your subscription in Stripe. You keep access until the end of the current cycle.'
                : 'Vamos cancelar sua assinatura na Stripe. Você mantém acesso até o fim do ciclo atual.'}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="ghost" className="w-full" onClick={() => setShowCancelModal(false)}>
                {language === 'en' ? 'Back' : 'Voltar'}
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
                onClick={handleConfirmCancelSubscription}
                disabled={cancelLoading}
              >
                {cancelLoading
                  ? (language === 'en' ? 'Cancelling...' : 'Cancelando...')
                  : (language === 'en' ? 'Confirm cancellation' : 'Confirmar cancelamento')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showModeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-7 space-y-5 border border-brand-primary/20 card-padding">
            <div className="flex items-start gap-3">
              <div className="bg-brand-primary/15 text-brand-primary p-3 rounded-2xl">
                <UserIcon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.2em] text-brand-primary font-semibold">Modo da jornada</p>
                <h3 className="font-serif text-2xl text-brand-text leading-snug">Escolha solo, casal ou distância</h3>
                <p className="text-sm text-gray-600 mt-2">Você pode ajustar nomes e o formato da jornada a qualquer momento.</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-left">
              <button
                onClick={() => setModeSelection('solo')}
                className={`p-3 rounded-xl border text-sm ${modeSelection === 'solo' ? 'border-brand-primary bg-brand-primary/10' : 'border-gray-200 bg-gray-50'}`}
              >
                <p className="font-semibold text-brand-text">Solo</p>
                <p className="text-xs text-gray-500">Autocuidado</p>
              </button>
              <button
                onClick={() => setModeSelection('couple')}
                className={`p-3 rounded-xl border text-sm ${modeSelection === 'couple' ? 'border-brand-primary bg-brand-primary/10' : 'border-gray-200 bg-gray-50'}`}
              >
                <p className="font-semibold text-brand-text">Casal</p>
                <p className="text-xs text-gray-500">A dois</p>
              </button>
              <button
                onClick={() => setModeSelection('distance')}
                className={`p-3 rounded-xl border text-sm ${modeSelection === 'distance' ? 'border-brand-primary bg-brand-primary/10' : 'border-gray-200 bg-gray-50'}`}
              >
                <p className="font-semibold text-brand-text">À distância</p>
                <p className="text-xs text-gray-500">Chamadas e áudios</p>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                value={modeName}
                onChange={(e) => setModeName(e.target.value)}
                placeholder="Seu nome"
                className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
              />
              {modeSelection !== 'solo' && (
                <input
                  value={modePartnerName}
                  onChange={(e) => setModePartnerName(e.target.value)}
                  placeholder="Nome do parceiro(a)"
                  className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                />
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowModeModal(false)}>
                {language === 'en' ? 'Cancel' : 'Cancelar'}
              </Button>
              <Button onClick={handleSaveMode} className="bg-brand-text text-white hover:bg-black">
                {language === 'en' ? 'Save mode' : 'Salvar modo'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HeartPulse = () => (
    <svg className="w-12 h-12 text-brand-primary animate-pulse" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
)

export default App;
