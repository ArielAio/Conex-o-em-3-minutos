import React from 'react';
import { ArrowRight, CalendarRange, Check, Clock3, FileText, Flame, Heart, Lock, Mail, Shield, Sparkles, Star, Unlock } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const sellingPoints = [
  { title: 'Missão diária guiada', desc: '3 minutos por dia para quebrar a rotina automática e abrir conversa de verdade.' },
  { title: 'Envio por e-mail', desc: 'Receba a missão às 07h para criar hábito e não depender da memória.' },
  { title: 'PDF do mês', desc: 'Transforme as conquistas em um presente digital que fica para sempre.' },
  { title: 'Assinatura leve', desc: 'R$ 24,90 para destravar o próximo mês e manter o progresso correndo.' },
];

const steps = [
  { icon: Heart, title: 'Dia Zero imediato', desc: 'Crie a conta e já recebe a primeira missão que gera conexão real.' },
  { icon: Mail, title: 'Gatilho diário', desc: 'Às 07h chega o e-mail lembrando que a relação é prioridade, não obrigação.' },
  { icon: Flame, title: 'Marca como concluída', desc: 'Um clique para registrar, ganhar streak e desbloquear insights.' },
  { icon: FileText, title: 'Fecha o mês', desc: 'Exporta o PDF, celebra e decide continuar para o Mês 2.' },
];

const bonuses = [
  { icon: Unlock, label: '30 dias destravados um a um', accent: 'Hábito' },
  { icon: Shield, label: 'Conteúdo pensado para casais e solos', accent: 'Seguro' },
  { icon: CalendarRange, label: 'Temas mensais já prontos', accent: 'Rápido' },
  { icon: Star, label: 'Rituais extras no plano premium', accent: 'Premium' },
];

const nextTheme = {
  title: 'Mês 2: Conflitos sem guerra',
  teaser: 'Estratégias práticas para discordar sem machucar e retomar o carinho rápido.',
  missions: ['Pausa antes de responder', 'Regra do relógio', 'Debrief sem culpa'],
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

const faqs = [
  { q: 'Por que 3 minutos por dia funcionam?', a: 'Porque é curto o bastante para caber em qualquer rotina e longo o suficiente para abrir espaço emocional diário. A constância pesa mais que a intensidade.' },
  { q: 'Preciso estar em um relacionamento?', a: 'Não. O painel funciona para quem quer melhorar a relação consigo ou se preparar para um relacionamento mais saudável.' },
  { q: 'E se eu esquecer de entrar?', a: 'O e-mail diário traz a missão com link direto. Você recebe, clica e conclui em menos de 3 minutos.' },
  { q: 'O que ganho ao assinar?', a: 'Desbloqueia o próximo mês automaticamente, rituais semanais extras, PDF premium e histórico ilimitado. Sem travar o progresso.' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="bg-brand-bg text-brand-text min-h-screen overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-16 w-72 h-72 bg-gradient-to-br from-brand-primary/25 to-brand-secondary/30 blur-3xl" />
        <div className="absolute top-40 -right-12 w-64 h-64 bg-gradient-to-br from-amber-200/30 to-brand-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-10 w-40 h-40 bg-gradient-to-br from-brand-secondary/40 to-transparent blur-2xl" />
      </div>

      <header className="relative app-shell px-safe pt-8 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-8 h-8 text-brand-primary fill-brand-primary drop-shadow-sm" />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">Conexão em 3 minutos</p>
            <p className="font-serif text-lg text-brand-text leading-none">Três minutos por dia. Uma relação inteira melhor.</p>
          </div>
        </div>
        <button
          onClick={onStart}
          className="hidden sm:inline-flex items-center gap-2 bg-brand-text text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:translate-y-[-1px] transition-transform duration-200"
        >
          Entrar no painel
          <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      <main className="relative app-shell px-safe pb-16 space-y-24">
        <section className="relative rounded-3xl bg-white/80 border border-white/60 shadow-[0_30px_80px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="absolute -right-16 -top-16 w-72 h-72 bg-gradient-to-br from-brand-primary/25 to-brand-secondary/25 blur-3xl" />
          <div className="grid md:grid-cols-2 gap-10 lg:gap-14 p-8 sm:p-10 md:p-12 relative z-10">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/15 text-brand-primary font-semibold rounded-full text-xs tracking-wide">
                <Sparkles className="w-4 h-4" />
                Seu ritual diário de 3 minutos
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight text-brand-text">
                Um relacionamento mais leve e seguro, começando hoje.
              </h1>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Missões guiadas, lembretes diários e um painel que acompanha seu progresso. Só 3 minutos por dia para conversar melhor,
                diminuir ruídos e aumentar o carinho. Sem complicar a rotina.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onStart}
                  className="inline-flex items-center justify-center gap-2 bg-brand-primary text-brand-text font-semibold px-5 py-3 rounded-full shadow-lg shadow-brand-primary/30 hover:translate-y-[-1px] transition-transform duration-200"
                >
                  Começar agora
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#como-funciona"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-gray-200 text-brand-text bg-white/70 hover:bg-white"
                >
                  Ver como funciona
                  <Clock3 className="w-4 h-4" />
                </a>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-brand-primary" />
                  </div>
                  Missão diária no seu e-mail
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-brand-secondary/30 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-brand-text" />
                  </div>
                  Streak para manter a motivação
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
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">Dia 07</p>
                      <p className="font-serif text-lg text-brand-text">Comunicação sem ruído</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-brand-primary bg-brand-primary/15 px-3 py-1 rounded-full">3 min</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-brand-text">Missão de hoje</p>
                  <p className="text-sm text-gray-600">Envie uma mensagem curta de gratidão para seu parceiro (ou para você). Sem contexto, só carinho.</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Shield className="w-4 h-4 text-brand-secondary" />
                    Rápido, seguro e sem exposição pública.
                  </div>
                </div>
                <button
                  onClick={onStart}
                  className="w-full inline-flex items-center justify-center gap-2 bg-brand-text text-white py-3 rounded-2xl font-semibold hover:translate-y-[-1px] transition-transform duration-200"
                >
                  Ver painel e concluir missão
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-3 gap-3 pt-3">
                  {bonuses.map((item) => (
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
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">Processo simples</p>
              <h2 className="font-serif text-2xl sm:text-3xl text-brand-text">Mais conexão em quatro movimentos curtos.</h2>
              <p className="text-gray-600">
                Cada passo foi pensado para reduzir atrito: missão clara, lembrete automático, registro rápido e celebração final.
                Você sente progresso todos os dias.
              </p>
            </div>
            <div className="md:w-7/12 grid sm:grid-cols-2 gap-4">
              {steps.map((step, idx) => (
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
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">Por que funciona</p>
              <h2 className="font-serif text-2xl sm:text-3xl text-brand-text">Diferenciais que mantêm vocês perto todos os dias.</h2>
            </div>
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-semibold shadow-sm">
              <Flame className="w-4 h-4 text-amber-500" />
              30 dias para solidificar o hábito
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sellingPoints.map((item) => (
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
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">Próximo mês liberado no premium</p>
          <h2 className="font-serif text-2xl sm:text-3xl text-brand-text">{nextTheme.title}</h2>
          <p className="text-gray-600 max-w-2xl">{nextTheme.teaser}</p>
          <div className="grid sm:grid-cols-3 gap-3 mt-3">
            {nextTheme.missions.map((m, i) => (
              <div key={m} className="p-4 rounded-2xl bg-white border border-gray-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Missão {i + 1}</p>
                  <p className="text-sm text-brand-text font-semibold">“{m}”</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-gray-600">Teste premium por 7 dias e continue a jornada sem travar.</p>
            <button
              onClick={onStart}
              className="inline-flex items-center justify-center gap-2 bg-brand-text text-white px-6 py-3 rounded-full font-semibold hover:translate-y-[-1px] transition-transform duration-200 shadow-lg shadow-brand-primary/30"
            >
              Desbloquear mês 2
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        <section className="relative rounded-3xl bg-white border border-gray-100 p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">Histórias reais</p>
              <h2 className="font-serif text-2xl sm:text-3xl text-brand-text">Quem já usa e sentiu a diferença.</h2>
            </div>
            <div className="inline-flex items-center gap-2 text-sm bg-brand-primary/15 text-brand-text px-4 py-2 rounded-full font-semibold">
              <Star className="w-4 h-4 text-amber-500" />
              Confiança construída todo dia
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {testimonials.map((item) => (
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
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">Tudo o que você recebe</p>
            <h2 className="font-serif text-2xl sm:text-3xl text-brand-text">Experiência completa desde o primeiro dia.</h2>
            <p className="text-gray-600">
              Cada detalhe foi pensado para manter vocês engajados, registrar progresso e transformar pequenas ações em resultado real.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              {[
                'Painel com missão do dia, progresso e streak visível',
                'Envio diário por e-mail com link direto para concluir',
                'Exportação em PDF do mês com suas conquistas',
                'Missões futuras sinalizadas e bloqueadas até assinar',
                'Rituais semanais extras para aprofundar a conexão',
                'Histórico completo para revisitar aprendizados',
              ].map((text) => (
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
            <p className="text-xs uppercase tracking-[0.2em] text-white/70 font-semibold">Plano completo</p>
            <h3 className="font-serif text-2xl leading-tight">Assine e mantenha a evolução sem pausa.</h3>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold">R$ 24,90</span>
              <span className="text-sm text-white/80 mb-1">/ mês</span>
            </div>
            <p className="text-white/90">Libere o próximo mês automaticamente, ganhe PDF premium, rituais exclusivos e histórico ilimitado.</p>
            <div className="space-y-2">
              {['Próximo mês destravado sem esforço', 'PDF premium com registros e insights', 'Rituais semanais exclusivos', 'Sem fidelidade: cancele quando quiser'].map((item) => (
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
              Quero começar agora
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        <section className="relative rounded-3xl bg-white border border-gray-100 p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">Proof &gt; Promessa</p>
              <h2 className="font-serif text-2xl sm:text-3xl text-brand-text">Três minutos que viram assinatura.</h2>
            </div>
            <div className="inline-flex items-center gap-2 text-sm bg-brand-primary/15 text-brand-text px-4 py-2 rounded-full font-semibold">
              <Lock className="w-4 h-4" />
              Missões futuras ficam bloqueadas até assinar
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Valor diário', desc: 'Entregue algo pequeno todos os dias e o usuário sente falta quando não recebe.' },
              { title: 'Hábito emocional', desc: 'Streak e barra de progresso criam comprometimento com o próprio casal.' },
              { title: 'Oferta natural', desc: 'Ao terminar o mês, o botão “Prontos para o Mês 2?” já está lá.' },
            ].map((item) => (
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
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">Calendário emocional</p>
              <h3 className="font-serif text-2xl text-brand-text">Tema do mês atual: Comunicação sem ruído.</h3>
              <p className="text-gray-600">
                30 missões curtas para aprender a falar, ouvir e negociar sem briga. Cada missão abre um insight diferente.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-white border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Dia 1</p>
                  <p className="text-sm text-brand-text font-semibold">Rotina com carinho</p>
                  <p className="text-xs text-gray-500">Abertura leve para engajar rápido.</p>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Dia 12</p>
                  <p className="text-sm text-brand-text font-semibold">Ponto cego</p>
                  <p className="text-xs text-gray-500">Desafio bloqueado para quem não assinou.</p>
                </div>
              </div>
            </div>
            <div className="md:w-7/12 grid sm:grid-cols-2 gap-4">
              {faqs.map((item) => (
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
            <p className="text-xs uppercase tracking-[0.2em] text-white/70 font-semibold">Hora de começar</p>
            <h3 className="font-serif text-3xl sm:text-4xl">Três minutos por dia para não viver no piloto automático.</h3>
            <p className="text-white/80 max-w-2xl mx-auto">Entre agora, receba o Dia Zero imediatamente e sinta o impacto já na primeira conversa.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onStart}
                className="inline-flex items-center justify-center gap-2 bg-white text-brand-text px-6 py-3 rounded-full font-semibold hover:translate-y-[-1px] transition-transform duration-200 shadow-lg shadow-black/10"
              >
                Entrar no painel
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Star className="w-4 h-4 text-amber-300" />
                Missão diária + PDF + próxima etapa já desenhada.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
