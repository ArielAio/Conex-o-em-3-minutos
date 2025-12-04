import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Mission } from '../types';
import { Button } from './Button';
import { CheckCircle, Lock, Sparkles, Share2, ChevronDown, HeartHandshake, Clock } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

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
  const [showAction, setShowAction] = useState(isCompleted);
  const [showCompletedDetails, setShowCompletedDetails] = useState(isCompleted);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const particlesCount = isCompleted ? 18 : 0;
  const shareCardRef = useRef<HTMLDivElement | null>(null);

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
      setShowCompletedDetails(true);
    } else {
      setShowCompletedDetails(false);
    }
  }, [isCompleted, mission.id]);

  const handleComplete = async () => {
    if (isCompleted || isCompleting) return;
    setIsCompleting(true);
    try {
      await onComplete();
      if (!insight && mission.insights && mission.insights.length) {
        const pick = mission.insights[Math.floor(Math.random() * mission.insights.length)];
        setInsight(pick);
      }
    } catch (error) {
      console.error('Erro ao completar missão', error);
      alert('Não foi possível salvar agora. Tente novamente.');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleManualInsight = async () => {
    if (mission.insights && mission.insights.length) {
      const pick = mission.insights[Math.floor(Math.random() * mission.insights.length)];
      setInsight(pick);
    } else {
      setInsight('Confiem no processo diário. Pequenas ações somadas constroem segurança.');
    }
  }

  const dataUrlToFile = async (dataUrl: string, filename: string) => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  };

  const buildShareText = () => {
    const titleLine = `${isCompleted ? 'Missão concluída' : 'Missão do dia'}: "${mission.title}" (Dia ${mission.day} • ${mission.theme})`;
    const actionLine = `Ação: ${mission.action}`;
    const inviteLine = isCompleted 
      ? 'Quero compartilhar esse momento com você. ❤️'
      : 'Topa fazer comigo hoje? ❤️';
    const insightLine = insight ? `\nInsight que tive: "${insight}"` : '';

    const linkLine = 'Acesse: https://conexao-em-3-minutos.vercel.app';
    return `${titleLine}\n${actionLine}\n${inviteLine}${insightLine}\n${linkLine}`;
  };

  const handleShare = async () => {
    const textToShare = buildShareText();
    if (!shareCardRef.current) {
      try {
        await navigator.share({ title: 'Conexão em 3 Minutos', text: textToShare, url: window.location.href });
      } catch (error) {
        console.error('Share fallback error', error);
        alert('Compartilhe copiando o texto: ' + textToShare);
      }
      return;
    }

    try {
      setIsSharing(true);
      const dataUrl = await htmlToImage.toPng(shareCardRef.current, { pixelRatio: 2, cacheBust: true });
      const file = await dataUrlToFile(dataUrl, 'conexao-missao.png');

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Conexão em 3 Minutos',
          text: textToShare,
          files: [file],
        });
      } else {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'conexao-missao.png';
        link.click();
        alert('Imagem pronta para compartilhar. Abra sua galeria/WhatsApp e envie.');
      }
    } catch (error) {
      console.error('Erro ao gerar imagem', error);
      try {
        await navigator.share({ title: 'Conexão em 3 Minutos', text: textToShare, url: window.location.href });
      } catch (err) {
        alert('Não foi possível compartilhar agora. Copie este texto:\n\n' + textToShare);
      }
    } finally {
      setIsSharing(false);
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
      <div className="bg-white p-6 md:p-10 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-brand-success/20 anim-scale-pop relative overflow-hidden transition-all duration-500 card-padding rounded-surface card-float soft-hover">
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
          
          <h3 className="font-serif heading-lg mb-2 text-brand-text leading-tight">Missão Cumprida!</h3>
          <p className="text-gray-500 mb-6 font-light text-fluid">Você fortaleceu seu laço hoje.</p>

          <div className="bg-white/80 border border-brand-primary/20 rounded-2xl p-4 shadow-sm mb-6 text-left card-padding">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-brand-text text-sm font-semibold">
                <Share2 className="w-4 h-4 text-brand-primary" />
                <span>Compartilhar missão com seu amor</span>
              </div>
              <Button 
                variant="primary" 
                onClick={handleShare}
                disabled={isSharing}
                className="rounded-full px-5 py-2 text-sm font-semibold shadow-brand-primary/30"
              >
                <Share2 className="w-4 h-4" />
                {isSharing ? 'Preparando...' : 'Enviar missão'}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Ele recebe o link da missão já com a ação do dia.</p>
          </div>
          
          <div className="bg-gradient-to-br from-brand-bg to-white p-6 rounded-2xl border border-brand-primary/20 mb-6 text-left shadow-sm card-padding">
             <div className="flex items-center gap-2 mb-3 text-brand-accent">
               <Sparkles className="w-4 h-4 text-brand-gold" />
               <span className="text-xs font-bold uppercase tracking-wider text-brand-gold">Insight do Dia</span>
             </div>
             
             {insight ? (
                <p className="text-brand-text leading-relaxed font-serif text-lg italic animate-fade-in anim-scale-pop">
                  "{insight}"
                </p>
             ) : (
                <div className="text-center py-2">
                    <Button variant="ghost" onClick={handleManualInsight} className="text-sm">
                        <Sparkles className="w-4 h-4 mr-2" /> Revelar Insight
                    </Button>
                </div>
             )}
          </div>
          
          <div className="mt-8 text-left">
            <button
              onClick={() => setShowCompletedDetails((prev) => !prev)}
              className="w-full flex items-center justify-between bg-white/70 border border-brand-primary/20 rounded-2xl px-4 py-3 text-sm font-semibold text-brand-text shadow-sm hover:border-brand-primary/40 transition"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-primary" />
                <span>Ver missão realizada</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-brand-primary transition-transform ${showCompletedDetails ? 'transform rotate-180' : ''}`}
              />
            </button>

            {showCompletedDetails && (
              <div className="mt-4 space-y-3 bg-white/80 border border-brand-primary/20 rounded-2xl p-5 shadow-sm anim-fade-slide">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-brand-primary font-bold">
                  <span className="px-2 py-1 bg-brand-primary/10 rounded-full">Dia {mission.day}</span>
                  <span className="text-gray-400">•</span>
                  <span>{mission.theme}</span>
                </div>
                <h4 className="font-serif text-xl text-brand-text leading-snug">{mission.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{mission.shortDescription}</p>
                <div className="bg-brand-bg p-4 rounded-xl border-l-4 border-brand-primary/40">
                  <p className="text-xs uppercase tracking-wider text-brand-accent font-bold mb-1">Ação realizada</p>
                  <p className="text-base text-brand-text leading-relaxed">{mission.action}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-brand-primary/10 overflow-hidden transition-all duration-300 card-float rounded-surface soft-hover">
      {/* Card oculto para gerar imagem de compartilhamento */}
      <div className="hidden">
        <div 
          ref={shareCardRef}
          className="w-[600px] bg-gradient-to-br from-[#FDFCF8] to-white border border-[#E8E0F0] rounded-3xl shadow-xl overflow-hidden"
          style={{ fontFamily: '"Playfair Display", serif' }}
        >
          <div className="p-6 bg-brand-primary/10 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-accent font-bold">Conexão em 3 Minutos</p>
              <h2 className="text-3xl text-brand-text mt-1">{mission.title}</h2>
              <p className="text-sm text-gray-500">Dia {mission.day} • {mission.theme}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-brand-primary">
              <HeartHandshake className="w-6 h-6" />
            </div>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-base text-gray-600 leading-relaxed">{mission.action}</p>
            {(insight || (mission.insights && mission.insights.length)) && (
              <div className="bg-white border border-brand-primary/20 rounded-2xl p-4 shadow-sm">
                <p className="text-xs uppercase tracking-widest text-brand-gold font-bold mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-gold" /> Insight
                </p>
                <p className="text-lg text-brand-text italic">
                  “{insight || mission.insights?.[0]}”
                </p>
              </div>
            )}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-gray-500">
                conclua e compartilhe seu momento • conexaoem3min.com
              </div>
              <div className="text-sm font-semibold text-brand-primary">#ConexãoEm3Minutos</div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-brand-primary/10 p-5 sm:p-6 pb-12 relative">
          <div className="absolute top-4 right-4">
               <span className="bg-white/80 backdrop-blur-sm text-brand-text px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                 <Clock className="w-3 h-3" /> 3 min
               </span>
          </div>
          <span className="text-brand-primary font-bold text-xs uppercase tracking-widest">Dia {mission.day}</span>
          <h2 className="font-serif heading-lg text-brand-text mt-2 leading-tight">
            {mission.title}
          </h2>

      </div>

      <div className="p-6 md:p-8 -mt-6 bg-white rounded-t-3xl relative z-10 card-padding">
        <p className="text-fluid text-gray-600 mb-8 leading-relaxed font-light">
            {mission.shortDescription}
        </p>

        <div className={`transition-all duration-500 overflow-hidden ${showAction ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-brand-bg p-6 rounded-2xl border-l-4 border-brand-primary mb-6 anim-fade-slide card-padding">
                <h4 className="font-bold text-brand-accent mb-2 text-xs uppercase flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4" /> Sua Ação:
                </h4>
                <p className="text-[clamp(1.05rem,2.6vw,1.3rem)] text-gray-800 font-serif leading-snug">
                {mission.action}
                </p>
            </div>

            <div className="bg-white/95 border border-brand-primary/25 rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8 card-padding">
              <div className="flex items-start gap-2">
                <Share2 className="w-4 h-4 text-brand-primary mt-1" />
                <div>
                  <p className="text-sm font-semibold text-brand-text">Compartilhar missão com seu amor</p>
                  <p className="text-xs text-gray-500">Enviamos o link com a ação do dia para fazerem juntos.</p>
                </div>
              </div>
              <Button 
                variant="primary" 
                onClick={handleShare}
                disabled={isSharing}
                className="w-full md:w-auto rounded-full px-5 py-2 text-sm font-semibold shadow-brand-primary/30"
              >
                <Share2 className="w-4 h-4" />
                {isSharing ? 'Preparando...' : 'Enviar missão'}
              </Button>
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
