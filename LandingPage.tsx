import React from 'react';
import { ArrowRight, CalendarRange, Check, Clock3, FileText, Flame, Heart, Lock, Mail, Shield, Sparkles, Star, Unlock } from 'lucide-react';
import { LanguageSelector } from './components/LanguageSelector';
import { useLanguage } from './services/i18n/language';

interface LandingPageProps {
  onStart: () => void;
}

const sellingPoints = [
  { title: 'Missão diária guiada', desc: '3 minutos por dia para quebrar a rotina automática e abrir conversa de verdade.' },
  { title: 'Envio por e-mail', desc: 'Receba a missão às 07h para criar hábito e não depender da memória.' },
  { title: 'PDF do mês', desc: 'Transforme as conquistas em um presente digital que fica para sempre.' },
  { title: 'Assinatura leve', desc: 'R$ 4,99 para liberar missões premium diárias e manter o progresso correndo.' },
];

const sellingPointsEn = [
  { title: 'Guided daily mission', desc: '3 minutes a day to break autopilot and spark real conversation.' },
  { title: 'Email delivery', desc: 'Receive the mission at 7 a.m. to build a habit without relying on memory.' },
  { title: 'Monthly PDF', desc: 'Turn your wins into a digital gift that lasts.' },
  { title: 'Light plan', desc: '$0.99 to unlock daily premium missions and keep momentum.' },
];

const steps = [
  { icon: Heart, title: 'Dia Zero imediato', desc: 'Crie a conta e já recebe a primeira missão que gera conexão real.' },
  { icon: Mail, title: 'Gatilho diário', desc: 'Às 07h chega o e-mail lembrando que a relação é prioridade, não obrigação.' },
  { icon: Flame, title: 'Marca como concluída', desc: 'Um clique para registrar, ganhar streak e desbloquear insights.' },
  { icon: FileText, title: 'Fecha o ciclo', desc: 'Exporta o PDF, celebra e segue com missões premium diárias.' },
];

const stepsEn = [
  { icon: Heart, title: 'Instant Day Zero', desc: 'Create your account and get the first mission that drives real connection.' },
  { icon: Mail, title: 'Daily trigger', desc: 'At 7 a.m. the email reminds you the relationship is priority, not obligation.' },
  { icon: Flame, title: 'Mark as done', desc: 'One click to log, keep your streak, and unlock insights.' },
  { icon: FileText, title: 'Close the loop', desc: 'Export the PDF, celebrate, and keep daily premium missions coming.' },
];

const bonuses = [
  { icon: Unlock, label: '30 dias destravados um a um', accent: 'Hábito' },
  { icon: Shield, label: 'Conteúdo pensado para casais e solos', accent: 'Seguro' },
  { icon: CalendarRange, label: 'Temas mensais já prontos', accent: 'Rápido' },
  { icon: Star, label: 'Rituais extras no plano premium', accent: 'Premium' },
];

const bonusesEn = [
  { icon: Unlock, label: '30 days unlocked, step by step', accent: 'Habit' },
  { icon: Shield, label: 'Content for couples and solos', accent: 'Safe' },
  { icon: CalendarRange, label: 'Monthly themes ready to go', accent: 'Fast' },
  { icon: Star, label: 'Extra rituals in premium plan', accent: 'Premium' },
];

const premiumPreview = {
  title: 'Conteúdo premium diário',
  teaser: 'Missões novas todos os dias, com mensagens que podem ser personalizadas depois do seu teste.',
  missions: ['Pausa antes de responder', 'Check-in honesto de 3 perguntas', 'Debrief sem culpa'],
};

const premiumPreviewEn = {
  title: 'Daily premium content',
  teaser: 'New missions every day, with messages you can personalize after your trial.',
  missions: ['Pause before replying', 'Honest 3-question check-in', 'Guilt-free debrief'],
};

const testimonials = [
  {
    name: 'Marina & Rafael',
    role: 'Casados há 6 anos',
    quote: '“Paramos de discutir por bobagem. Três minutos por dia e o dia já começa mais leve.”'
  },
  {
    name: 'Camila',
    role: 'Solteira, 29 anos',
    quote: '“Usei sozinha para treinar comunicação. Meu próximo relacionamento já vai começar com menos ruído.”'
  },
  {
    name: 'Luiza & Pedro',
    role: 'Noivos',
    quote: '“O PDF do mês virou presente no chá de panela. Todo mundo pediu o app.”'
  },
  {
    name: 'André',
    role: 'Em reconciliação',
    quote: '“Os lembretes diários tiraram a relação do piloto automático. Virou ritual de cuidado.”'
  }
];

const testimonialsEn = [
  {
    name: 'Marina & Rafael',
    role: 'Married for 6 years',
    quote: '“We stopped arguing over small stuff. Three minutes a day and the day starts lighter.”'
  },
  {
    name: 'Camila',
    role: 'Single, 29',
    quote: '“I used it solo to practice communication. My next relationship will start with less noise.”'
  },
  {
    name: 'Luiza & Pedro',
    role: 'Engaged',
    quote: '“The monthly PDF became a gift at our bridal shower. Everyone asked for the app.”'
  },
  {
    name: 'André',
    role: 'Reconciling',
    quote: '“Daily reminders took us off autopilot. It became a care ritual.”'
  }
];

const faqs = [
  { q: 'Por que 3 minutos por dia funcionam?', a: 'Porque é curto o bastante para caber em qualquer rotina e longo o suficiente para abrir espaço emocional diário. A constância pesa mais que a intensidade.' },
  { q: 'Preciso estar em um relacionamento?', a: 'Não. O painel funciona para quem quer melhorar a relação consigo ou se preparar para um relacionamento mais saudável.' },
  { q: 'E se eu esquecer de entrar?', a: 'O e-mail diário traz a missão com link direto. Você recebe, clica e conclui em menos de 3 minutos.' },
  { q: 'O que ganho ao assinar?', a: 'Libera missões premium diárias, rituais semanais extras, PDF premium e histórico ilimitado. Sem travar o progresso.' },
];

const faqsEn = [
  { q: 'Why do 3 minutes a day work?', a: 'Short enough for any routine and long enough to create daily emotional space. Consistency beats intensity.' },
  { q: 'Do I need to be in a relationship?', a: 'No. The dashboard works to improve your relationship with yourself or prepare for a healthier one.' },
  { q: 'What if I forget to log in?', a: 'The daily email brings the mission with a direct link. You get it, click, and finish in under 3 minutes.' },
  { q: 'What do I get by subscribing?', a: 'Daily premium missions, extra weekly rituals, premium PDF, and unlimited history. Progress stays unlocked.' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const { language } = useLanguage();
  const t = (pt: string, en: string) => (language === 'en' ? en : pt);
  const lpSelling = language === 'en' ? sellingPointsEn : sellingPoints;
  const lpSteps = language === 'en' ? stepsEn : steps;
  const lpBonuses = language === 'en' ? bonusesEn : bonuses;
  const lpPremium = language === 'en' ? premiumPreviewEn : premiumPreview;
  const lpTestimonials = language === 'en' ? testimonialsEn : testimonials;
  const lpFaqs = language === 'en' ? faqsEn : faqs;
  const featureList = language === 'en'
    ? [
        'Dashboard with today’s mission, progress, and visible streak',
        'Daily email with direct link to complete',
        'Monthly PDF export with your wins',
        'Future missions signposted and locked until you subscribe',
        'Extra weekly rituals to deepen connection',
        'Full history to revisit learnings',
      ]
    : [
        'Painel com missão do dia, progresso e streak visível',
        'Envio diário por e-mail com link direto para concluir',
        'Exportação em PDF do mês com suas conquistas',
        'Missões futuras sinalizadas e bloqueadas até assinar',
        'Rituais semanais extras para aprofundar a conexão',
        'Histórico completo para revisitar aprendizados',
      ];
  const premiumBullets = language === 'en'
    ? ['Premium content unlocked effortlessly', 'Premium PDF with records and insights', 'Exclusive weekly rituals', 'No commitment: cancel anytime']
    : ['Conteúdo premium liberado sem esforço', 'PDF premium com registros e insights', 'Rituais semanais exclusivos', 'Sem fidelidade: cancele quando quiser'];
  const proofList = language === 'en'
    ? [
        { title: 'Daily value', desc: 'Deliver something small every day so users miss it when it is not there.' },
        { title: 'Emotional habit', desc: 'Streak and progress bar create commitment to the relationship itself.' },
        { title: 'Natural upgrade', desc: 'When the cycle ends, the upgrade button is ready to keep daily premium missions.' },
      ]
    : [
        { title: 'Valor diário', desc: 'Entregue algo pequeno todos os dias e o usuário sente falta quando não recebe.' },
        { title: 'Hábito emocional', desc: 'Streak e barra de progresso criam comprometimento com o próprio casal.' },
        { title: 'Oferta natural', desc: 'Ao terminar o ciclo, o botão de upgrade já está lá para continuar com premium diário.' },
      ];

  return (
    <div className="bg-brand-bg text-brand-text min-h-screen overflow-hidden relative w-full" data-lang={language}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-16 w-72 h-72 bg-gradient-to-br from-brand-primary/25 to-brand-secondary/30 blur-3xl" />
        <div className="absolute top-40 -right-12 w-64 h-64 bg-gradient-to-br from-amber-200/30 to-brand-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-10 w-40 h-40 bg-gradient-to-br from-brand-secondary/40 to-transparent blur-2xl" />
      </div>

      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50">
        <LanguageSelector emphasize className="backdrop-blur" />
      </div>

      <header className="relative app-shell px-safe pt-8 pb-6 flex items-center justify-between w-full overflow-hidden">
        <div className="flex items-center gap-2">
          <Heart className="w-8 h-8 text-brand-primary fill-brand-primary drop-shadow-sm" />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">
              {t('Conexão em 3 minutos', '3-Minute Connection')}
            </p>
            <p className="font-serif text-lg text-brand-text leading-none">
              {t('Três minutos por dia. Uma relação inteira melhor.', 'Three minutes a day. A whole relationship better.')}
            </p>
          </div>
        </div>
        <button
          onClick={onStart}
          className="hidden sm:inline-flex items-center gap-2 bg-brand-text text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:translate-y-[-1px] transition-transform duration-200"
        >
          {t('Entrar no painel', 'Go to dashboard')}
          <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      <main className="relative app-shell px-safe pb-16 space-y-24 w-full overflow-hidden">
        <section className="relative rounded-3xl bg-white/80 border border-white/60 shadow-[0_30px_80px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="absolute -right-16 -top-16 w-72 h-72 bg-gradient-to-br from-brand-primary/25 to-brand-secondary/25 blur-3xl" />
          <div className="grid md:grid-cols-2 gap-10 lg:gap-14 p-8 sm:p-10 md:p-12 relative z-10">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/15 text-brand-primary font-semibold rounded-full text-xs tracking-wide">
                <Sparkles className="w-4 h-4" />
                {t('Seu ritual diário de 3 minutos', 'Your 3-minute daily ritual')}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight text-brand-text">
                {t('Um relacionamento mais leve e seguro, começando hoje.', 'A lighter, safer relationship starting today.')}
              </h1>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                {t('Missões guiadas, lembretes diários e um painel que acompanha seu progresso. Só 3 minutos por dia para conversar melhor, diminuir ruídos e aumentar o carinho. Sem complicar a rotina.',
                'Guided missions, daily reminders, and a dashboard that tracks your progress. Just 3 minutes a day to talk better, reduce friction, and grow affection—without complicating your routine.')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onStart}
                  className="inline-flex items-center justify-center gap-2 bg-brand-primary text-brand-text font-semibold px-5 py-3 rounded-full shadow-lg shadow-brand-primary/30 hover:translate-y-[-1px] transition-transform duration-200"
                >
                  {t('Começar agora', 'Start now')}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#como-funciona"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-gray-200 text-brand-text bg-white/70 hover:bg-white"
                >
                  {t('Ver como funciona', 'See how it works')}
                  <Clock3 className="w-4 h-4" />
                </a>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-brand-primary" />
                  </div>
                  {t('Missão diária no seu e-mail', 'Daily mission in your email')}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-brand-secondary/30 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-brand-text" />
                  </div>
                  {t('Streak para manter a motivação', 'Streak to stay motivated')}
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-white to-brand-secondary/20 rounded-3xl blur-3xl" />
              <div className="relative bg-white rounded-3xl border border-white shadow-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-brand-primary fill-brand-primary/50" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">{t('Dia 07', 'Day 07')}</p>
                      <p className="font-serif text-lg text-brand-text">{t('Comunicação sem ruído', 'No-noise communication')}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-brand-primary bg-brand-primary/15 px-3 py-1 rounded-full">3 min</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-brand-text">{t('Missão de hoje', 'Today’s mission')}</p>
                  <p className="text-sm text-gray-600">{t('Envie uma mensagem curta de gratidão para seu parceiro (ou para você). Sem contexto, só carinho.', 'Send a short gratitude message to your partner (or yourself). No context, just care.')}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Shield className="w-4 h-4 text-brand-secondary" />
                    {t('Rápido, seguro e sem exposição pública.', 'Fast, safe, and no public exposure.')}
                  </div>
                </div>
                <button
                  onClick={onStart}
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-text text-white py-3 rounded-2xl font-semibold hover:translate-y-[-1px] transition-transform duration-200"
                >
                  {t('Ver painel e concluir missão', 'Open dashboard and finish mission')}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-3 gap-3 pt-3">
                  {lpBonuses.map((item) => (
                    <div key={item.label} className="p-3 rounded-xl border border-gray-100 bg-brand-bg/60">
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-brand-text" />
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">{item.accent}</span>
                      </div>
                      <p className="text-xs text-brand-text mt-1 leading-snug">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="relative">
          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16">
            <div className="md:w-5/12 space-y-4">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">
                {t('Processo simples', 'Simple process')}
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-brand-text">
                {t('Mais conexão em quatro movimentos curtos.', 'More connection in four short moves.')}
              </h2>
              <p className="text-gray-600">
                {t('Cada passo foi pensado para reduzir atrito: missão clara, lembrete automático, registro rápido e celebração final. Você sente progresso todos os dias.',
                  'Each step reduces friction: clear mission, automatic reminder, quick log, and final celebration. You feel progress every day.')}
              </p>
            </div>
            <div className="md:w-7/12 grid sm:grid-cols-2 gap-4">
              {lpSteps.map((step, idx) => (
                <div key={step.title} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm soft-hover transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/15 flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-brand-text" />
                    </div>
                    <span className="text-xs font-bold text-gray-400">0{idx + 1}</span>
                  </div>
                  <h3 className="font-serif text-lg text-brand-text mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative rounded-3xl bg-brand-primary/8 border border-brand-primary/20 p-8 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">
                {t('Por que funciona', 'Why it works')}
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-brand-text">
                {t('Diferenciais que mantêm vocês perto todos os dias.', 'Signals that keep you close every day.')}
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
              <Flame className="w-4 h-4 text-amber-500" />
              {t('30 dias para solidificar o hábito', '30 days to cement the habit')}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {lpSelling.map((item) => (
              <div key={item.title} className="p-4 rounded-2xl bg-white border border-white shadow-sm soft-hover transition-all duration-200">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-4 h-4 text-brand-primary" />
                  <p className="font-semibold text-brand-text">{item.title}</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative bg-brand-primary/8 border border-brand-primary/20 rounded-3xl p-8 space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">{t('Conteúdo premium diário', 'Daily premium content')}</p>
          <h2 className="font-serif text-2xl sm:text-3xl text-brand-text">{lpPremium.title}</h2>
          <p className="text-gray-600 max-w-2xl">{lpPremium.teaser}</p>
          <div className="grid sm:grid-cols-3 gap-3 mt-3">
            {lpPremium.missions.map((m, i) => (
              <div key={m} className="p-4 rounded-2xl bg-white border border-gray-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">{t('Roteiro', 'Script')} {i + 1}</p>
                  <p className="text-sm text-brand-text font-semibold">“{m}”</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-gray-600">
            {t('Teste premium por 7 dias e continue a jornada sem travar.', 'Try premium for 7 days and keep the journey flowing.')}
          </p>
            <button
              onClick={onStart}
              className="inline-flex items-center justify-center gap-2 bg-brand-text text-white px-6 py-3 rounded-full font-semibold hover:translate-y-[-1px] transition-transform duration-200 shadow-lg shadow-brand-primary/30"
            >
              {t('Desbloquear premium', 'Unlock premium')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        <section className="relative rounded-3xl bg-white border border-gray-100 p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">{t('Histórias reais', 'Real stories')}</p>
              <h2 className="font-serif text-2xl sm:text-3xl text-brand-text">{t('Quem já usa e sentiu a diferença.', 'People using it and feeling the difference.')}</h2>
            </div>
            <div className="inline-flex items-center gap-2 text-sm bg-brand-primary/15 text-brand-text px-4 py-2 rounded-full font-semibold">
              <Star className="w-4 h-4 text-amber-500" />
              {t('Confiança construída todo dia', 'Trust built every day')}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {lpTestimonials.map((item) => (
              <div key={item.name} className="p-4 rounded-2xl bg-brand-bg/80 border border-gray-100 soft-hover transition-all duration-200 h-full flex flex-col">
                <p className="text-sm text-brand-text font-semibold">{item.name}</p>
                <p className="text-xs text-gray-500 mb-3">{item.role}</p>
                <p className="text-sm text-gray-700 leading-relaxed flex-1">{item.quote}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 rounded-3xl bg-white border border-gray-100 shadow-lg p-8 space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">{t('Tudo o que você recebe', 'Everything you get')}</p>
            <h2 className="font-serif text-2xl sm:text-3xl text-brand-text">{t('Experiência completa desde o primeiro dia.', 'Full experience from day one.')}</h2>
            <p className="text-gray-600">
              {t('Cada detalhe foi pensado para manter vocês engajados, registrar progresso e transformar pequenas ações em resultado real.',
              'Every detail keeps you engaged, tracks progress, and turns small actions into real results.')}
            </p>
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              {featureList.map((text) => (
                <div key={text} className="flex items-start gap-3 p-3 rounded-2xl bg-brand-bg/80 border border-gray-100">
                  <div className="mt-0.5">
                    <Check className="w-4 h-4 text-brand-primary" />
                  </div>
                  <p className="text-sm text-brand-text">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 rounded-3xl bg-brand-text text-white p-7 space-y-5 shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-brand-primary/25 blur-3xl" />
            <p className="text-xs uppercase tracking-[0.2em] text-white/70 font-semibold">{t('Plano completo', 'Full plan')}</p>
            <h3 className="font-serif text-2xl leading-tight">{t('Assine e mantenha a evolução sem pausa.', 'Subscribe and keep evolving without pauses.')}</h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold">{language === 'en' ? '$0.99' : 'R$ 4,99'}</span>
              <span className="text-sm text-white/80 mb-1">{language === 'en' ? '/ month' : '/ mês'}</span>
            </div>
            <p className="text-white/90">{t('Libere missões premium diárias automaticamente, ganhe PDF premium, rituais exclusivos e histórico ilimitado.', 'Unlock daily premium missions automatically, get premium PDF, exclusive rituals, and unlimited history.')}</p>
            <div className="space-y-2">
              {premiumBullets.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-brand-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <button
              onClick={onStart}
              className="w-full inline-flex items-center justify-center gap-2 bg-white text-brand-text py-3 rounded-full font-semibold hover:translate-y-[-1px] transition-transform duration-200 shadow-lg shadow-brand-primary/30"
            >
              {t('Quero começar agora', 'I want to start now')}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        <section className="relative rounded-3xl bg-white border border-gray-100 p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">{t('Proof > Promessa', 'Proof > Promise')}</p>
              <h2 className="font-serif text-2xl sm:text-3xl text-brand-text">{t('Três minutos que viram assinatura.', 'Three minutes that turn into a subscription.')}</h2>
            </div>
            <div className="inline-flex items-center gap-2 text-sm bg-brand-primary/15 text-brand-text px-4 py-2 rounded-full font-semibold">
              <Lock className="w-4 h-4" />
              {t('Missões futuras ficam bloqueadas até assinar', 'Future missions stay locked until you subscribe')}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {proofList.map((item) => (
              <div key={item.title} className="p-4 rounded-2xl bg-brand-bg/80 border border-gray-100">
                <p className="font-semibold text-brand-text mb-1">{item.title}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative">
          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            <div className="md:w-5/12 p-6 rounded-3xl bg-brand-primary/12 border border-brand-primary/20 space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">{t('Calendário emocional', 'Emotional calendar')}</p>
              <h3 className="font-serif text-2xl text-brand-text">{t('Tema do mês atual: Comunicação sem ruído.', 'Current month theme: No-noise communication.')}</h3>
              <p className="text-gray-600">
                {t('30 missões curtas para aprender a falar, ouvir e negociar sem briga. Cada missão abre um insight diferente.',
                '30 short missions to learn to speak, listen, and negotiate without fights. Each mission unlocks a different insight.')}
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-white border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold">{t('Dia 1', 'Day 1')}</p>
                  <p className="text-sm text-brand-text font-semibold">{t('Rotina com carinho', 'Routine with care')}</p>
                  <p className="text-xs text-gray-500">{t('Abertura leve para engajar rápido.', 'Light opening to engage fast.')}</p>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold">{t('Dia 12', 'Day 12')}</p>
                  <p className="text-sm text-brand-text font-semibold">{t('Ponto cego', 'Blind spot')}</p>
                  <p className="text-xs text-gray-500">{t('Desafio bloqueado para quem não assinou.', 'Challenge locked for non-subscribers.')}</p>
                </div>
              </div>
            </div>
            <div className="md:w-7/12 grid sm:grid-cols-2 gap-4">
              {lpFaqs.map((item) => (
                <div key={item.q} className="p-4 rounded-2xl bg-white border border-gray-100 soft-hover transition-all duration-200">
                  <p className="font-semibold text-brand-text mb-2">{item.q}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative text-center space-y-4 p-8 rounded-3xl bg-brand-text text-white overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-brand-primary blur-3xl" />
            <div className="absolute right-0 bottom-0 w-52 h-52 bg-brand-secondary blur-3xl" />
          </div>
          <div className="relative space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70 font-semibold">{t('Hora de começar', 'Time to start')}</p>
            <h3 className="font-serif text-3xl sm:text-4xl">{t('Três minutos por dia para não viver no piloto automático.', 'Three minutes a day to stop living on autopilot.')}</h3>
            <p className="text-white/80 max-w-2xl mx-auto">
              {t('Entre agora, receba o Dia Zero imediatamente e sinta o impacto já na primeira conversa.',
              'Join now, get Day Zero immediately, and feel the impact in the first conversation.')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onStart}
                className="inline-flex items-center justify-center gap-2 bg-white text-brand-text px-6 py-3 rounded-full font-semibold hover:translate-y-[-1px] transition-transform duration-200 shadow-lg shadow-black/10"
              >
                {t('Entrar no painel', 'Go to dashboard')}
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Star className="w-4 h-4 text-amber-300" />
                {t('Missão diária + PDF + próxima etapa já desenhada.', 'Daily mission + PDF + next step already mapped.')}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
