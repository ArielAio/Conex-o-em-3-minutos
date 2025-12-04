import React from 'react';
import { Button } from './Button';
import { Check, Star } from 'lucide-react';

interface SubscriptionGateProps {
    onSubscribe: () => void;
}

export const SubscriptionGate: React.FC<SubscriptionGateProps> = ({ onSubscribe }) => {
  return (
    <div className="bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 p-8 rounded-2xl border border-brand-primary/20 text-center my-8 no-print">
      <div className="bg-white/80 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
        <Star className="w-6 h-6 text-brand-gold fill-brand-gold" />
      </div>
      <h2 className="font-serif text-2xl text-brand-text mb-2">Desbloqueie a Conexão Profunda</h2>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Garanta o próximo mês de missões, acesso ao histórico completo e insights ilimitados de IA.
      </p>
      
      <div className="grid md:grid-cols-2 gap-4 max-w-lg mx-auto mb-8 text-left">
        <div className="flex items-center gap-2 text-sm text-gray-600">
            <Check className="w-4 h-4 text-green-500" />
            <span>Acesso ao Mês 2: Intimidade</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
            <Check className="w-4 h-4 text-green-500" />
            <span>PDF Mensal Premium</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
            <Check className="w-4 h-4 text-green-500" />
            <span>Rituais Semanais Extras</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
            <Check className="w-4 h-4 text-green-500" />
            <span>Insights de IA Personalizados</span>
        </div>
      </div>

      <Button onClick={onSubscribe} className="bg-brand-text text-white hover:bg-black w-full md:w-auto px-8">
        Assinar por R$ 24,90/mês
      </Button>
      <p className="text-xs text-gray-400 mt-4">Cancele quando quiser.</p>
    </div>
  );
};
