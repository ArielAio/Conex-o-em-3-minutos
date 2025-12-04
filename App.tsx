import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { DailyMission } from './components/DailyMission';
import { PDFExport } from './components/PDFExport';
import { SubscriptionGate } from './components/SubscriptionGate';
import { Onboarding } from './components/Onboarding';
import { getUserData, completeMission, updateUserProfile, upgradeUser, resetProgress, cancelSubscription, saveReflection } from './services/storageService';
import { getMissionByDay, MISSIONS } from './services/mockData';
import { UserProgress, CURRENT_MONTH_THEME } from './types';
import { Check, Star, Settings, User as UserIcon, LogOut, Flame, ChevronDown, RotateCcw, AlertTriangle, Lock } from 'lucide-react';
import { auth, logoutUser, loginWithGoogle } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Button } from './components/Button';

const getCurrentDayFromStart = (startDateStr?: string) => {
  const today = new Date();
  const start = startDateStr ? new Date(startDateStr) : new Date();
  const isValid = !isNaN(start.getTime());
  const startDate = isValid ? start : new Date();

  const startMid = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
  const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const diffDays = Math.max(0, Math.floor((todayMid - startMid) / 86400000));
  return Math.min(MISSIONS.length, diffDays + 1);
};

const formatToday = () => {
  const today = new Date();
  return today.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
};

const NEXT_MONTH_PREVIEW = {
  theme: 'Conflitos sem guerra',
  missions: ['Pausa antes de responder', 'Regra do relógio', 'Debrief sem culpa'],
  teaser: 'Mês 2 preparado para transformar conflitos em diálogo seguro.'
};

const getGreeting = () => {
  const hour = new Date().getHours();
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

const App = () => {
  const [user, setUser] = useState<UserProgress | null>(null);
  const [currentDay, setCurrentDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'mission' | 'history' | 'profile'>('mission');
  const [editName, setEditName] = useState('');
  const [editPartnerName, setEditPartnerName] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirm, setResetConfirm] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showNextMonthModal, setShowNextMonthModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [highlightReflection, setHighlightReflection] = useState<{ title: string; text: string } | null>(null);
  
  // Pagination state for history to prevent heavy rendering
  const [historyPage, setHistoryPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [tabChanging, setTabChanging] = useState(false);
  const todayKey = new Date().toISOString().slice(0, 10);

  // Helper to load data
  const loadUserData = async () => {
    setLoading(true);
    try {
      const data = await getUserData();
      setUser(data);

      const dayByCalendar = getCurrentDayFromStart(data.startDate);
      setCurrentDay(dayByCalendar);
    } catch (error) {
      console.error("Erro carregando dados do usuário, usando visitante", error);
      const fallback: UserProgress = {
        name: 'Visitante',
        partnerName: '',
        startDate: new Date().toISOString(),
        completedMissionIds: [],
        isPremium: false,
        streak: 0,
        lastLoginDate: new Date().toISOString(),
        reflections: {},
      };
      setUser(fallback);
      setCurrentDay(getCurrentDayFromStart(fallback.startDate));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        loadUserData();
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditPartnerName(user.partnerName || '');
    }
  }, [user]);

  useEffect(() => {
    // highlight reflexão mais longa usando dados persistidos
    let best: { title: string; text: string } | null = null;
    MISSIONS.forEach((mission) => {
      const reflection = getReflectionForMission(mission.id);
      if (reflection && reflection.trim().length > 0) {
        if (!best || reflection.length > best.text.length) {
          best = { title: mission.title, text: reflection.trim() };
        }
      }
    });
    setHighlightReflection(best);
  }, [todayKey, user]);

  useEffect(() => {
    setTabChanging(true);
    const t = setTimeout(() => setTabChanging(false), 360);
    return () => clearTimeout(t);
  }, [activeTab]);

  const handleOnboardingComplete = async (name: string, partnerName: string) => {
      const updated = await updateUserProfile(name, partnerName);
      setUser(updated);
  };

  const handleCompleteMission = async () => {
    if (!user) return;
    const activeMission = getMissionByDay(currentDay);
    if (activeMission) {
      const updatedUser = await completeMission(activeMission.id, user);
      setUser(updatedUser);
      if (activeMission.day === 30) {
        setShowNextMonthModal(true);
      }
    }
  };

  const handleSubscribe = async () => {
      const updated = await upgradeUser();
      setUser(updated);
      alert("Bem-vindo ao Premium! O próximo mês foi desbloqueado.");
  };

  const handleLogout = async () => {
      await logoutUser();
  }
  const handleLogin = async () => {
      try {
        await loginWithGoogle();
      } catch (error: any) {
        console.error("Erro ao conectar com Google", error);
        alert("Não foi possível conectar. Tente novamente.");
      }
  };
  const handleSaveProfile = async () => {
      if (!editName.trim() || !editPartnerName.trim()) {
        alert("Preencha nome e nome do parceiro.");
        return;
      }
      const updated = await updateUserProfile(editName.trim(), editPartnerName.trim());
      setUser(updated);
  };
  const handleResetProgress = async () => {
      if (!user) return;
      const confirmed = resetConfirm.trim().toUpperCase() === 'RESET';
      if (!confirmed) return;
      const updated = await resetProgress();
      setUser(updated);
      setCurrentDay(1);
      setShowResetModal(false);
      setResetConfirm('');
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2500);
  };

  const handleCancelSubscription = () => {
    setShowCancelModal(true);
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-brand-bg text-brand-primary anim-pulse-soft">
        <HeartPulse />
    </div>;
  }

  const needsOnboarding = user && (!user.partnerName || user.partnerName === '');

  if (needsOnboarding) {
      return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (!user) return null;

  const activeMission = getMissionByDay(currentDay);
  const isCompleted = activeMission ? user.completedMissionIds.includes(activeMission.id) : false;

  const renderMissionView = () => {
    const shareSuggestion = async () => {
      if (!activeMission) return;
      const suggestion = NEXT_STEP_SUGGESTIONS[activeMission.day % NEXT_STEP_SUGGESTIONS.length];
      const text = `Acabei "${activeMission.title}" (Dia ${activeMission.day}) no Conexão em 3 Minutos. Próximo passo sugerido: ${suggestion}`;
      try {
        await navigator.share({ title: 'Próximo passo', text });
      } catch (err) {
        console.log('Share suggestion fallback', err);
      }
    };

    return (
    <div className="space-y-6 md:space-y-8">
        <header className="mb-4">
            <h1 className="font-serif heading-lg text-brand-text leading-tight">{getGreeting()}, {user.name.split(' ')[0]}</h1>
            <p className="text-gray-500 text-xs sm:text-sm">{formatToday()}</p>
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
                const mission = getMissionByDay(dayNumber);
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
            mission={activeMission} 
            isCompleted={isCompleted} 
            onComplete={handleCompleteMission}
            initialReflection={getReflectionForMission(activeMission.id)}
            onSaveReflection={handleSaveReflection}
          />
        ) : (
          <div className="text-center py-10 bg-white rounded-3xl p-8 shadow-sm">
             <h2 className="font-serif text-2xl text-brand-primary">Mês Concluído!</h2>
             <p className="text-gray-500 mt-2">Você completou o ciclo de {CURRENT_MONTH_THEME}.</p>
          </div>
        )}

        {isCompleted && activeMission && (
          <div className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 border border-brand-primary/20 rounded-2xl p-4 shadow-sm card-padding flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-xs uppercase text-brand-primary font-bold tracking-[0.2em]">Próximo passo sugerido</p>
              <p className="text-sm text-brand-text">{NEXT_STEP_SUGGESTIONS[activeMission.day % NEXT_STEP_SUGGESTIONS.length]}</p>
            </div>
            <Button variant="outline" className="border-brand-primary text-brand-primary hover:bg-brand-primary/10" onClick={shareSuggestion}>
              Compartilhar com parceiro(a)
            </Button>
          </div>
        )}

          <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-300 soft-hover card-float">
           <div className="w-full">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Progresso</span>
              <div className="flex gap-1 mt-1">
                 {Array.from({length: 5}).map((_, i) => (
                    <div key={i} className={`w-8 h-1 rounded-full ${i < (user.completedMissionIds.length / 30) * 5 ? 'bg-brand-primary' : 'bg-gray-100'}`} />
                 ))}
              </div>
           </div>
           <span className="text-brand-primary font-serif font-bold text-lg sm:text-xl">{Math.round((user.completedMissionIds.length / 30) * 100)}%</span>
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

        <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-2xl p-5 shadow-sm card-padding">
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="text-xs uppercase text-brand-primary font-bold tracking-[0.2em]">Próximo mês</p>
            <span className="text-[11px] text-gray-500">Teste 7 dias • sem fidelidade</span>
          </div>
          <p className="font-serif text-lg text-brand-text">{NEXT_MONTH_PREVIEW.theme}</p>
          <p className="text-sm text-gray-600">{NEXT_MONTH_PREVIEW.teaser}</p>
          <div className="mt-3 space-y-2">
            {NEXT_MONTH_PREVIEW.missions.map((m, i) => (
              <div key={m} className="flex items-center gap-2 text-sm text-brand-text">
                <Lock className="w-4 h-4 text-gray-400" />
                <span className="font-semibold">Missão {i + 1} •</span>
                <span className="text-gray-600">“{m}” (bloqueada até assinar)</span>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
  }

  const renderHistoryView = () => {
    // Pagination Logic
    const visibleMissions = MISSIONS.slice(0, historyPage * ITEMS_PER_PAGE);
    const hasMore = visibleMissions.length < MISSIONS.length;

    return (
        <div className="space-y-6 md:space-y-8">
            <header>
                <h2 className="font-serif heading-md text-brand-text mb-1 leading-tight">Sua Jornada</h2>
                <p className="text-xs text-brand-primary uppercase tracking-widest font-bold">{CURRENT_MONTH_THEME}</p>
            </header>

            <div className="space-y-0">
                {visibleMissions.map((mission, index) => {
                    const isDone = user.completedMissionIds.includes(mission.id);
                    const isLocked = !isDone && mission.day > currentDay;
                    const isFuture = mission.day > currentDay;
                    const reflection = getReflectionForMission(mission.id);
                
                // Streak logic: Check if this mission and the PREVIOUS mission in the list were both done
                const prevMission = visibleMissions[index - 1];
                const isPrevDone = prevMission && user.completedMissionIds.includes(prevMission.id);
                const isStreak = isDone && isPrevDone;

                    return (
                        <div 
                          key={mission.id} 
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
                                        <span className="text-xs font-bold text-gray-400 uppercase">Dia {mission.day}</span>
                                    </div>
                                    {isDone && <Check className="w-4 h-4 text-green-500" />}
                                    {isLocked && <span className="text-xs text-gray-300">Bloqueado</span>}
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <h4 className={`font-serif text-base sm:text-lg leading-snug ${isDone ? 'text-brand-text' : 'text-gray-400'}`}>
                                        {isFuture && !isDone ? "???" : mission.title}
                                    </h4>
                                    {isStreak && (
                                        <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20 animate-pulse" />
                                    )}
                                </div>

                                {isDone && <p className="text-sm text-gray-500 mt-1 line-clamp-1">{mission.action}</p>}
                                {isDone && reflection.trim() && (
                                  <p className="text-xs text-gray-600 mt-1 italic line-clamp-2">
                                    Reflexão: {reflection.trim()}
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
                    Carregar mais missões
                </button>
            )}
            
            <PDFExport user={user} theme={CURRENT_MONTH_THEME} />
            
            {!user.isPremium && <SubscriptionGate onSubscribe={handleSubscribe} />}
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
                      <span className="text-xs text-gray-400 uppercase">Dias Seguidos</span>
                  </div>
                  <div className="text-center">
                      <span className="block text-2xl font-bold text-brand-primary">{user.completedMissionIds.length}</span>
                      <span className="text-xs text-gray-400 uppercase">Missões</span>
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
                  <p className="text-sm font-semibold text-brand-text">Você está conectado</p>
                  <p className="text-xs text-gray-500 truncate">{auth.currentUser.email || auth.currentUser.displayName}</p>
                </div>
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="text-sm px-4 py-2 border-red-200 text-red-500 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" /> Sair
                </Button>
              </div>
            </div>
          )}

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm card-padding">
            <h3 className="text-sm font-semibold text-brand-text mb-3">Selos de hábito</h3>
            <div className="grid grid-cols-3 gap-3">
              {[{label: '3 dias', threshold: 3}, {label: '7 dias', threshold: 7}, {label: '14 dias', threshold: 14}].map(({label, threshold}) => {
                const lockedByPlan = !user.isPremium;
                const achieved = !lockedByPlan && user.streak >= threshold;
                const locked = lockedByPlan;
                return (
                  <div key={label} className={`p-3 rounded-xl border text-center ${achieved ? 'border-brand-primary/40 bg-brand-primary/10' : 'border-gray-200 bg-gray-50'} ${locked ? 'opacity-70' : ''}`}>
                    <p className="text-xs font-bold text-gray-500 uppercase">{label}</p>
                    <p className="text-sm text-brand-text font-semibold">
                      {locked ? 'Assine para liberar' : achieved ? 'Conquistado' : 'Em progresso'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {user.isPremium && (
            <div className="bg-white p-4 rounded-xl border border-gray-100 soft-hover transition-all duration-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-brand-text">Plano ativo</p>
                  <p className="text-xs text-gray-500">Cancele quando quiser. O acesso vai até o fim do ciclo pago.</p>
                </div>
                <Button 
                  onClick={handleCancelSubscription} 
                  variant="outline" 
                  className="text-sm px-4 py-2 border-red-200 text-red-500 hover:bg-red-50"
                >
                  Cancelar assinatura
                </Button>
              </div>
            </div>
          )}

          {!user.isPremium && (
            <div className="bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 p-5 rounded-2xl border border-brand-primary/20 shadow-sm space-y-3 card-padding">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-brand-gold fill-brand-gold" />
                  <div>
                    <p className="text-sm font-semibold text-brand-text">Assine para liberar tudo</p>
                    <p className="text-xs text-gray-500">Teste premium por 7 dias • Sem fidelidade</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 font-semibold">R$ 9,90 / mês</div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-brand-text">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="font-semibold">Mês 2: Conflitos sem guerra</p>
                    <p className="text-xs text-gray-500">Missões bloqueadas liberadas automaticamente.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="font-semibold">PDF premium</p>
                    <p className="text-xs text-gray-500">Com reflexões salvas e estatísticas do mês.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="font-semibold">Rituais semanais extras</p>
                    <p className="text-xs text-gray-500">Check-ins para manter o ritmo e reduzir ruído.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="font-semibold">Histórico ilimitado + selos</p>
                    <p className="text-xs text-gray-500">Veja todo o caminho e libere os selos de hábito.</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-500">
                <span>Cancele fácil no perfil</span>
                <Button onClick={handleSubscribe} className="w-full sm:w-auto bg-brand-text text-white hover:bg-black px-6">
                  Assinar e testar 7 dias
                </Button>
              </div>
            </div>
          )}
          
          {!auth.currentUser && (
            <div className="p-4 rounded-xl border border-gray-100 bg-white card-padding soft-hover transition-all duration-300">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-brand-text">Entrar para sincronizar</p>
                  <p className="text-xs text-gray-500">Guarde seu progresso em qualquer dispositivo</p>
                </div>
                <Button 
                  onClick={handleLogin} 
                  variant="outline" 
                  className="text-sm px-4 py-2 border-brand-primary text-brand-primary hover:bg-brand-primary/10"
                >
                  Entrar com Google
                </Button>
              </div>
            </div>
          )}

          <div className="bg-brand-primary/5 p-4 rounded-xl flex items-center gap-4 transition-all duration-300 soft-hover">
               <div className="bg-white p-2 rounded-full shadow-sm">
                   <Star className={`w-5 h-5 ${user.isPremium ? 'text-brand-gold fill-brand-gold' : 'text-gray-300'}`} />
               </div>
               <div>
                   <h3 className="font-bold text-brand-text text-sm">Plano {user.isPremium ? 'Premium' : 'Gratuito'}</h3>
                   <p className="text-xs text-gray-500">{user.isPremium ? 'Acesso total liberado' : 'Assine para ver mais'}</p>
               </div>
               {!user.isPremium && (
                   <button onClick={handleSubscribe} className="ml-auto text-xs bg-brand-text text-white px-3 py-1 rounded-full">
                       Upgrade
                   </button>
               )}
          </div>
          
          <div className="p-4 rounded-xl border border-gray-100 bg-white soft-hover transition-all duration-300">
               <button className="flex items-center gap-3 w-full text-gray-600 text-sm py-2">
                   <Settings className="w-4 h-4" /> Configurações de Notificação
               </button>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 card-padding soft-hover transition-all duration-300">
              <h3 className="font-semibold text-sm text-brand-text">Editar informações</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                  />
                  <input 
                    value={editPartnerName}
                    onChange={(e) => setEditPartnerName(e.target.value)}
                    placeholder="Nome do parceiro(a)"
                    className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
                  />
              </div>
              <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveProfile} 
                    variant="primary" 
                    className="px-4 py-2 text-sm"
                    disabled={!editName.trim() || !editPartnerName.trim()}
                  >
                    Salvar
                  </Button>
              </div>
          </div>

          {resetSuccess && (
            <div className="bg-green-50 border border-green-100 text-green-700 rounded-xl p-3 text-sm">
              Progresso resetado com sucesso. Você voltou para o dia 1.
            </div>
          )}

          <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm space-y-3 card-padding soft-hover transition-all duration-300">
              <div className="flex items-start gap-3">
                  <div className="bg-red-50 text-red-500 p-2 rounded-lg">
                      <RotateCcw className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                      <h3 className="font-semibold text-sm text-red-600">Resetar jornada</h3>
                      <p className="text-xs text-gray-500">Zera missões concluídas, streak e reinicia no dia 1. Ação irreversível.</p>
                  </div>
                  <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <Button 
                onClick={() => setShowResetModal(true)}
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50"
              >
                Resetar progresso
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
      >
        <div key={activeTab} className="view-animate space-y-6">
          {activeTab === 'mission' && renderMissionView()}
          {activeTab === 'history' && renderHistoryView()}
          {activeTab === 'profile' && renderProfileView()}
        </div>
      </Layout>

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
              {resetConfirm && resetConfirm.trim().toUpperCase() !== 'RESET' && (
                <p className="text-xs text-red-500">Use letras maiúsculas: RESET</p>
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
                disabled={resetConfirm.trim().toUpperCase() !== 'RESET'}
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
                <h3 className="font-serif text-2xl text-brand-text leading-snug">Prontos para o próximo mês?</h3>
                <p className="text-sm text-gray-600 mt-2">{NEXT_MONTH_PREVIEW.teaser}</p>
              </div>
            </div>

            <div className="bg-brand-bg border border-gray-100 rounded-2xl p-4 space-y-3">
              <p className="text-xs uppercase text-brand-primary font-bold tracking-[0.2em]">Mês 2 • {NEXT_MONTH_PREVIEW.theme}</p>
              <div className="space-y-2">
                {NEXT_MONTH_PREVIEW.missions.map((m, i) => (
                  <div key={m} className="flex items-center gap-2 text-sm text-brand-text">
                    <Lock className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold">Missão {i + 1} •</span>
                    <span className="text-gray-600">“{m}” (bloqueada até assinar)</span>
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
                <Button className="w-full sm:w-auto" onClick={() => { handleSubscribe(); setShowNextMonthModal(false); }}>
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
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">Cancelar assinatura</p>
                <h3 className="font-serif text-xl text-brand-text leading-snug">Tem certeza?</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Você mantém acesso até o fim do ciclo pago. Depois volta para o plano gratuito e o histórico continua salvo.
                </p>
              </div>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-600">
              O cancelamento é processado no gateway (Stripe/Mercado Pago). Clique abaixo para simular o cancelamento agora.
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowCancelModal(false)}>Voltar</Button>
              <Button 
                variant="outline" 
                className="border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => {
                  setShowCancelModal(false);
                  cancelSubscription().then(setUser);
                }}
              >
                Confirmar cancelamento
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
