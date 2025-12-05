import React from 'react';
import { Heart, Calendar, User, Sparkles } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  userStreak: number;
  activeTab: 'mission' | 'history' | 'profile';
  onTabChange: (tab: 'mission' | 'history' | 'profile') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, userStreak, activeTab, onTabChange }) => {
  
  const NavItem = ({ icon: Icon, id, label }: { icon: any, id: 'mission' | 'history' | 'profile', label: string }) => {
    const isActive = activeTab === id;
    return (
      <button 
        onClick={() => onTabChange(id)}
        className={`flex flex-col items-center justify-center w-full py-3 transition-all duration-300 relative soft-hover tap-bounce ${
          isActive ? 'text-brand-primary transform -translate-y-1' : 'text-gray-400'
        }`}
      >
        <div className={`p-1 rounded-full transition-all duration-300 ${isActive ? 'bg-brand-bg anim-glow' : ''}`}>
          <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
        </div>
        <span className={`text-[10px] mt-1 font-medium tracking-wide ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
          {label}
        </span>
        {isActive && (
          <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-brand-primary rounded-full"></span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-brand-bg pb-28 md:pb-0 md:pl-24 relative">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/70 to-transparent pointer-events-none md:hidden" aria-hidden />
      
      {/* Desktop/Tablet Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-24 bg-white border-r border-gray-100 flex-col items-center py-8 z-50">
        <div className="mb-12 mt-2">
            <Heart className="w-8 h-8 text-brand-primary fill-brand-primary" />
        </div>
        <div className="flex flex-col gap-8 w-full px-2">
            <NavItem icon={Sparkles} id="mission" label="Hoje" />
            <NavItem icon={Calendar} id="history" label="Histórico" />
            <NavItem icon={User} id="profile" label="Perfil" />
        </div>
      </aside>

      {/* Top Bar (Mobile) */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl z-40 px-safe py-3 pt-safe border-b border-gray-100 md:hidden flex justify-between items-center transition-all duration-300 shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
           <Heart className="w-5 h-5 text-brand-primary fill-brand-primary animate-pulse-slow" />
          <span className="font-serif font-bold heading-md text-brand-text leading-none truncate">Conexão</span>
        </div>
        <div className="flex items-center gap-2 bg-brand-primary/10 px-3 py-1 rounded-full">
            <span className="text-brand-primary font-bold text-sm leading-none">🔥 {userStreak}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 md:pt-12 px-safe pb-6 md:pb-14 app-shell w-full overflow-hidden">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.06)] z-50 pb-safe">
        <div className="flex justify-around items-end px-safe pb-2 pt-1">
          <NavItem icon={Calendar} id="history" label="Jornada" />
          <div className="relative -top-5">
             <button 
                onClick={() => onTabChange('mission')}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 active:scale-95 nav-fab ${
                    activeTab === 'mission' 
                    ? 'bg-brand-primary text-white shadow-brand-primary/40 ring-4 ring-brand-bg' 
                    : 'bg-white text-gray-400 border border-gray-100'
                }`}
             >
                 <Heart className={`w-6 h-6 ${activeTab === 'mission' ? 'fill-current' : ''}`} />
             </button>
          </div>
          <NavItem icon={User} id="profile" label="Você" />
        </div>
      </nav>
    </div>
  );
};
