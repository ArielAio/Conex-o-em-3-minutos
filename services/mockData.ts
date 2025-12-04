import { Mission, Theme } from '../types';

export const MISSIONS: Mission[] = [
  {
    id: 1,
    day: 1,
    theme: Theme.COMMUNICATION,
    title: "O Olhar de 2 Minutos",
    shortDescription: "Reconecte-se sem palavras.",
    action: "Sentem-se de frente um para o outro e olhem-se nos olhos por 2 minutos sem falar nada. Apenas respirem juntos.",
    quote: "O silêncio compartilhado é a linguagem da intimidade."
  },
  {
    id: 2,
    day: 2,
    theme: Theme.COMMUNICATION,
    title: "O Elogio Inesperado",
    shortDescription: "Quebre a rotina com apreciação.",
    action: "Envie uma mensagem ou diga pessoalmente algo que você admira no seu parceiro e que não diz há muito tempo.",
    quote: "O que é admirado, floresce."
  },
  {
    id: 3,
    day: 3,
    theme: Theme.COMMUNICATION,
    title: "Pergunta Curiosa",
    shortDescription: "Saia do automático 'como foi seu dia?'.",
    action: "Pergunte hoje: 'Qual foi a melhor parte do seu dia e por quê?' e ouça a resposta sem interromper.",
    quote: "Escutar é abraçar com a atenção."
  },
  {
    id: 4,
    day: 4,
    theme: Theme.COMMUNICATION,
    title: "Toque Consciente",
    shortDescription: "A pele também se comunica.",
    action: "Dê um abraço de pelo menos 20 segundos hoje. Estudos mostram que esse tempo libera ocitocina.",
    quote: "Um abraço longo é um lar temporário."
  },
  {
    id: 5,
    day: 5,
    theme: Theme.COMMUNICATION,
    title: "A Gratidão do Café",
    shortDescription: "Comece ou termine o dia com gratidão.",
    action: "Agradeça por uma atitude específica que o parceiro fez por você esta semana.",
    quote: "A gratidão transforma o que temos em suficiente."
  },
  // Missões de Dezembro - Celebrando Juntos (IDs 31-35 para exemplo)
  {
    id: 31,
    day: 31,
    theme: Theme.CELEBRATION,
    title: "O Pote da Vitória",
    shortDescription: "Relembrem as conquistas do ano.",
    action: "Escrevam juntos 3 coisas que vocês venceram como casal este ano e coloquem em um lugar visível.",
    quote: "Celebrar pequenas vitórias prepara o terreno para as grandes."
  },
  {
    id: 32,
    day: 32,
    theme: Theme.CELEBRATION,
    title: "A Foto do Ano",
    shortDescription: "Eternize o momento atual.",
    action: "Tirem uma foto juntos hoje que represente como vocês estão se sentindo. Sem filtros, apenas vocês.",
    quote: "A memória é o perfume da alma."
  },
  {
    id: 33,
    day: 33,
    theme: Theme.CELEBRATION,
    title: "Planejando Sonhos",
    shortDescription: "Olhem para a mesma direção.",
    action: "Definam um objetivo divertido para fazerem juntos no próximo mês (uma viagem, um jantar, um curso).",
    quote: "Amar não é olhar um para o outro, é olhar juntos na mesma direção."
  },
  {
    id: 34,
    day: 34,
    theme: Theme.CELEBRATION,
    title: "Noite da Desconexão",
    shortDescription: "Presenteie com sua presença.",
    action: "Desliguem os celulares por 1 hora antes de dormir e apenas conversem ou fiquem juntos.",
    quote: "O maior presente é a presença."
  },
  {
    id: 35,
    day: 35,
    theme: Theme.CELEBRATION,
    title: "Carta ao Futuro",
    shortDescription: "Uma mensagem para o 'nós' de amanhã.",
    action: "Gravem um áudio ou vídeo curto para vocês mesmos assistirem daqui a 6 meses.",
    quote: "O amor é uma construção diária."
  },
  // Filler missions
  ...Array.from({ length: 25 }, (_, i) => ({
    id: i + 6,
    day: i + 6,
    theme: Theme.COMMUNICATION,
    title: `Missão do Dia ${i + 6}`,
    shortDescription: "Desbloqueie para ver o conteúdo.",
    action: "Conteúdo exclusivo para assinantes ou dias futuros.",
    quote: "A constância é a chave."
  }))
].sort((a, b) => a.day - b.day); // Ensure order

export const getMissionByDay = (day: number): Mission | undefined => {
  return MISSIONS.find(m => m.day === day);
};