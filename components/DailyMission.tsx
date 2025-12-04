import React, { useState, useEffect, useMemo } from 'react';
import { Mission } from '../types';
import { Button } from './Button';
import { generateInsight } from '../services/geminiService';
import { CheckCircle, Lock, Sparkles, Share2, ChevronDown, HeartHandshake, Clock } from 'lucide-react';

interface DailyMissionProps {
  mission: Mission;
  isCompleted: boolean;
  onComplete: () => void;
  isLocked?: boolean;
}

const Particles = ({ count }: { count: number }) => {
    const particles = useMemo(() => {
      return Array.from({ length: count }).map((_, i) => {
        const left = Math.random() * 100;
        const duration = 2 + Math.random() * 1.4;
        const delay = Math.random() * 0.5;
        const size = 4 + Math.random() * 6;
        const rotate = Math.random() * 360;
        const bg = ['#D8B4E2', '#E5C3C6', '#C5A059', '#8EB89B', '#FCA5A5', '#93C5FD', '#FCD34D'][Math.floor(Math.random() * 7)];
        const borderRadius = Math.random() > 0.6 ? '50%' : '2px';

        return { i, left, duration, delay, size, rotate, bg, borderRadius };
      });
    }, [count]);

    if (count === 0) return null;

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 anim-confetti">
            {particles.map((p) => (
              <div 
                key={p.i}
                className="absolute opacity-0"
                style={{
                    left: `${p.left}%`,
                    top: '-20px',
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    backgroundColor: p.bg,
                    borderRadius: p.borderRadius,
                    transform: `rotate(${p.rotate}deg)`,
                    animation: `confetti ${p.duration}s ease-out ${p.delay}s forwards`
                }}
              />
            ))}
        </div>
    );
};

export const DailyMission: React.FC<DailyMissionProps> = ({ 
  mission, 
  isCompleted, 
  onComplete,
  isLocked = false
}) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [showAction, setShowAction] = useState(isCompleted);
  const [isCompleting, setIsCompleting] = useState(false);
  const particlesCount = isCompleted ? 18 : 0;

  const heartBursts = useMemo(() => {
    return Array.from({ length: 16 }).map((_, i) => {
      const left = Math.random() * 100;
      const delay = Math.random() * 0.6;
      const size = 12 + Math.random() * 10;
      const duration = 1.8 + Math.random() * 0.8;
      const rotate = Math.random() * 40 - 20;
      return { i, left, delay, size, duration, rotate };
    });
  }, []);

  useEffect(() => {
    if (isCompleted) {
      setShowAction(true);
    }
  }, [isCompleted]);

  const handleComplete = async () => {
    if (isCompleted || isCompleting) return;
    setIsCompleting(true);
    try {
      await onComplete();
      if (process.env.API_KEY && !insight) {
          setIsLoadingInsight(true);
          const text = await generateInsight(mission.title, mission.action);
          setInsight(text);
          setIsLoadingInsight(false);
      }
    } catch (error) {
      console.error('Erro ao completar missão', error);
      alert('Não foi possível salvar agora. Tente novamente.');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleManualInsight = async () => {
    setIsLoadingInsight(true);
    const text = await generateInsight(mission.title, mission.action);
    setInsight(text);
    setIsLoadingInsight(false);
  }

  const handleShare = async () => {
    const textToShare = `Acabei de completar a missão "${mission.title}" do Conexão em 3 Minutos! ❤️\n\n"${mission.quote || 'Pequenos gestos mudam tudo.'}"`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Conexão em 3 Minutos',
          text: textToShare,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      navigator.clipboard.writeText(textToShare);
      alert('Mensagem copiada! Envie para seu amor.');
    }
  };

  if (isLocked) {
    return (
      <div className="bg-white/60 p-8 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center min-h-[300px] backdrop-blur-sm">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Lock className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="font-serif text-xl mb-2 text-gray-500">Em Breve</h3>
        <p className="text-gray-400 text-sm max-w-xs">
          Assine para liberar o calendário completo ou aguarde o dia chegar.
        </p>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="bg-white p-6 md:p-10 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-brand-success/20 anim-scale-pop relative overflow-hidden transition-all duration-500">
        <Particles count={particlesCount} />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {heartBursts.map((h) => (
            <div
              key={h.i}
              className="absolute text-brand-primary/80 anim-heart-float"
              style={{
                left: `${h.left}%`,
                bottom: '-10%',
                width: `${h.size}px`,
                height: `${h.size}px`,
                animationDelay: `${h.delay}s`,
                animationDuration: `${h.duration}s`,
                transform: `rotate(${h.rotate}deg)`
              }}
            >
              <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                <path d="M12 21s-7-4.35-7-10a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.65-7 10-7 10Z" />
              </svg>
            </div>
          ))}
        </div>
        
        <div className="absolute top-0 right-0 w-40 h-40 bg-green-50 rounded-full blur-3xl -z-0 transform translate-x-10 -translate-y-10 opacity-60"></div>

        <div className="relative z-10 text-center">
          <div className="group inline-flex items-center justify-center bg-green-100 text-green-700 p-4 rounded-full mb-6 shadow-sm cursor-default anim-scale-pop hover:scale-110 transition-transform duration-300">
            <CheckCircle className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
          </div>
          
          <h3 className="font-serif text-2xl md:text-3xl mb-2 text-brand-text">Missão Cumprida!</h3>
          <p className="text-gray-500 mb-8 font-light">Você fortaleceu seu laço hoje.</p>
          
          <div className="bg-gradient-to-br from-brand-bg to-white p-6 rounded-2xl border border-brand-primary/20 mb-6 text-left shadow-sm">
             <div className="flex items-center gap-2 mb-3 text-brand-accent">
               <Sparkles className="w-4 h-4 text-brand-gold" />
               <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">Insight do Dia</span>
             </div>
             
             {insight ? (
                <p className="text-brand-text leading-relaxed font-serif text-lg italic animate-fade-in">
                  "{insight}"
                </p>
             ) : (
                <div className="text-center py-2">
                    {isLoadingInsight ? (
                        <span className="text-sm text-gray-400 animate-pulse">Consultando o universo...</span>
                    ) : (
                        <Button variant="ghost" onClick={handleManualInsight} className="text-sm">
                            <Sparkles className="w-4 h-4 mr-2" /> Revelar Insight Profundo
                        </Button>
                    )}
                </div>
             )}
          </div>
          
          <Button 
            variant="secondary" 
            onClick={handleShare}
            className="mx-auto rounded-full px-6 py-2 text-sm font-medium hover:scale-105 transition-transform bg-brand-bg text-brand-primary border border-brand-primary/20"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar Amor
          </Button>

        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-brand-primary/10 overflow-hidden transition-all duration-300">
      <div className="bg-brand-primary/10 p-6 pb-12 relative">
          <div className="absolute top-4 right-4">
               <span className="bg-white/80 backdrop-blur-sm text-brand-text px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                 <Clock className="w-3 h-3" /> 3 min
               </span>
          </div>
          <span className="text-brand-primary font-bold text-xs uppercase tracking-widest">Dia {mission.day}</span>
          <h2 className="font-serif text-3xl text-brand-text mt-2 leading-tight">
            {mission.title}
          </h2>
      </div>

      <div className="p-6 md:p-8 -mt-6 bg-white rounded-t-3xl relative z-10">
        <p className="text-lg text-gray-600 mb-8 leading-relaxed font-light">
            {mission.shortDescription}
        </p>

        <div className={`transition-all duration-500 overflow-hidden ${showAction ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-brand-bg p-6 rounded-2xl border-l-4 border-brand-primary mb-8 anim-fade-slide">
                <h4 className="font-bold text-brand-accent mb-2 text-xs uppercase flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4" /> Sua Ação:
                </h4>
                <p className="text-xl text-gray-800 font-serif leading-snug">
                {mission.action}
                </p>
            </div>
        </div>

        {!showAction ? (
            <Button 
                variant="outline" 
                fullWidth 
                onClick={() => setShowAction(true)}
                className="py-4 border-dashed border-2 hover:bg-brand-bg hover:text-brand-primary hover:border-solid group anim-pulse-soft"
            >
                <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                Ver a Missão de Hoje
            </Button>
        ) : (
            <Button 
                onClick={handleComplete} 
                fullWidth 
                disabled={isCompleted || isCompleting}
                className="py-4 text-lg bg-gradient-to-r from-brand-primary to-brand-accent shadow-lg shadow-brand-primary/30 transform transition active:scale-95 anim-scale-pop"
            >
                {isCompleting ? 'Salvando...' : isCompleted ? 'Concluída' : 'Marcar como Concluída'}
            </Button>
        )}
      </div>
    </div>
  );
};
