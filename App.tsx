import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { DailyMission } from './components/DailyMission';
import { PDFExport } from './components/PDFExport';
import { SubscriptionGate } from './components/SubscriptionGate';
import { Onboarding } from './components/Onboarding';
import { getUserData, completeMission, updateUserProfile, upgradeUser, resetProgress } from './services/storageService';
import { getMissionByDay, MISSIONS } from './services/mockData';
import { UserProgress, CURRENT_MONTH_THEME } from './types';
import { Check, Star, Settings, User as UserIcon, LogOut, Flame, ChevronDown, RotateCcw, AlertTriangle } from 'lucide-react';
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
  
  // Pagination state for history to prevent heavy rendering
  const [historyPage, setHistoryPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

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

  const renderMissionView = () => (
    <div className="space-y-6">
        <header className="mb-4">
            <h1 className="font-serif text-3xl text-brand-text">Bom dia, {user.name.split(' ')[0]}</h1>
            <p className="text-gray-500 text-sm">{formatToday()}</p>
        </header>

        {activeMission ? (
          <DailyMission 
            mission={activeMission} 
            isCompleted={isCompleted} 
            onComplete={handleCompleteMission}
          />
        ) : (
          <div className="text-center py-10 bg-white rounded-3xl p-8 shadow-sm">
             <h2 className="font-serif text-2xl text-brand-primary">Mês Concluído!</h2>
             <p className="text-gray-500 mt-2">Você completou o ciclo de {CURRENT_MONTH_THEME}.</p>
          </div>
        )}

        <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 flex items-center justify-between">
           <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Progresso</span>
              <div className="flex gap-1 mt-1">
                 {Array.from({length: 5}).map((_, i) => (
                    <div key={i} className={`w-8 h-1 rounded-full ${i < (user.completedMissionIds.length / 30) * 5 ? 'bg-brand-primary' : 'bg-gray-100'}`} />
                 ))}
              </div>
           </div>
           <span className="text-brand-primary font-serif font-bold text-xl">{Math.round((user.completedMissionIds.length / 30) * 100)}%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Tema do mês</p>
            <p className="font-serif text-lg text-brand-text">{CURRENT_MONTH_THEME}</p>
            <p className="text-xs text-gray-500 mt-1">30 dias • conteúdo liberado diariamente</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Resumo rápido</p>
            <p className="text-sm text-brand-text">Streak: <span className="font-semibold">{user.streak}</span> dia(s)</p>
            <p className="text-sm text-gray-500">Missões concluídas: <span className="font-semibold text-brand-primary">{user.completedMissionIds.length}</span></p>
          </div>
        </div>
    </div>
  );

  const renderHistoryView = () => {
    // Pagination Logic
    const visibleMissions = MISSIONS.slice(0, historyPage * ITEMS_PER_PAGE);
    const hasMore = visibleMissions.length < MISSIONS.length;

    return (
        <div className="space-y-6">
            <header>
                <h2 className="font-serif text-2xl text-brand-text mb-1">Sua Jornada</h2>
                <p className="text-xs text-brand-primary uppercase tracking-widest font-bold">{CURRENT_MONTH_THEME}</p>
            </header>

            <div className="space-y-0">
                {visibleMissions.map((mission, index) => {
                    const isDone = user.completedMissionIds.includes(mission.id);
                    const isLocked = !isDone && mission.day > currentDay;
                    const isFuture = mission.day > currentDay;
                    
                    // Streak logic: Check if this mission and the PREVIOUS mission in the list were both done
                    const prevMission = visibleMissions[index - 1];
                    const isPrevDone = prevMission && user.completedMissionIds.includes(prevMission.id);
                    const isStreak = isDone && isPrevDone;

                    return (
                        <div 
                          key={mission.id} 
                          className="relative anim-fade-slide-fast" 
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
                                    <h4 className={`font-serif text-lg ${isDone ? 'text-brand-text' : 'text-gray-400'}`}>
                                        {isFuture && !isDone ? "???" : mission.title}
                                    </h4>
                                    {isStreak && (
                                        <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20 animate-pulse" />
                                    )}
                                </div>

                                {isDone && <p className="text-sm text-gray-500 mt-1 line-clamp-1">{mission.action}</p>}
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
      <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center relative">
              <div className="w-20 h-20 bg-brand-secondary/30 rounded-full mx-auto mb-4 flex items-center justify-center text-brand-primary overflow-hidden">
                  {auth.currentUser?.photoURL ? (
                      <img src={auth.currentUser.photoURL} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                      <UserIcon className="w-10 h-10" />
                  )}
              </div>
              <h2 className="font-serif text-2xl text-brand-text">{user.name}</h2>
              <p className="text-gray-400 text-sm mb-4">&</p>
              <h2 className="font-serif text-2xl text-brand-text mb-6">{user.partnerName}</h2>
              
              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                  <div>
                      <span className="block text-2xl font-bold text-brand-primary">{user.streak}</span>
                      <span className="text-xs text-gray-400 uppercase">Dias Seguidos</span>
                  </div>
                  <div>
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
            <div className="p-4 rounded-xl border border-gray-100 bg-white">
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
          
          {!auth.currentUser && (
            <div className="p-4 rounded-xl border border-gray-100 bg-white">
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

          <div className="bg-brand-primary/5 p-4 rounded-xl flex items-center gap-4">
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
          
          <div className="p-4 rounded-xl border border-gray-100 bg-white">
               <button className="flex items-center gap-3 w-full text-gray-600 text-sm py-2">
                   <Settings className="w-4 h-4" /> Configurações de Notificação
               </button>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
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

          <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm space-y-3">
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
      <Layout 
        userStreak={user.streak} 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
      >
        {activeTab === 'mission' && renderMissionView()}
        {activeTab === 'history' && renderHistoryView()}
        {activeTab === 'profile' && renderProfileView()}
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
    </div>
  );
};

const HeartPulse = () => (
    <svg className="w-12 h-12 text-brand-primary animate-pulse" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
)

export default App;
