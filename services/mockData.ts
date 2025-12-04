import { Mission, Theme } from '../types';

const LONG_SUFFIXES = [
  ' Termine contando em uma frase o que sentiram e o que querem repetir amanhã.',
  ' Fechem com uma micro-ação concreta para manter essa sensação no dia seguinte.',
  ' Antes de encerrar, anotem em 1 linha o que aprendem sobre o outro e como isso muda o clima de vocês.',
];

const enrichInsights = (insights: string[]): string[] =>
  insights.map((text, idx) => {
    const suffix = LONG_SUFFIXES[idx % LONG_SUFFIXES.length];
    const trimmed = text.trim();
    const hasPunctuation = /[.!?]"?$/.test(trimmed);
    return hasPunctuation ? `${trimmed}${suffix}` : `${trimmed}.${suffix}`;
  });

const withInsights = (mission: Omit<Mission, 'insights'>, insights: string[]): Mission => ({
  ...mission,
  insights: enrichInsights(insights),
});

export const MISSIONS: Mission[] = [
  withInsights(
    {
      id: 1,
      day: 1,
      theme: Theme.COMMUNICATION,
      title: "Olhar de 2 Minutos",
      shortDescription: "Reconectem-se em silêncio.",
      action: "Sente de frente, olhem-se nos olhos por 2 minutos sem falar. Respirem juntos.",
      quote: "O silêncio compartilhado é a linguagem da intimidade."
    },
    [
      "Olhar sustentado reduz batimentos e sinaliza segurança; use um cronômetro para não apressar.",
      "Respirar no mesmo ritmo acalma o sistema nervoso e tira o casal do modo de defesa.",
      "Evite rir por nervoso: se vier, só volte a focar na respiração; a ideia é presença, não perfeição.",
      "O contato visual prolongado resgata a sensação de 'eu te vejo' que se perde na rotina.",
      "Dois minutos de silêncio valem mais do que um dia de conversa apressada.",
      "Antes de falar, permita sentir: o corpo entende primeiro, a cabeça vem depois."
    ]
  ),
  withInsights(
    {
      id: 2,
      day: 2,
      theme: Theme.GRATITUDE,
      title: "Elogio Específico",
      shortDescription: "Apreciação clara cria segurança.",
      action: "Diga hoje uma coisa específica que admira e por quê. Seja concreto, não genérico.",
      quote: "O que é admirado, floresce."
    },
    [
      "Elogios detalhados soam verdadeiros: cite o gesto e o impacto que teve em você.",
      "Foque em esforço e caráter, não só em resultado; isso motiva continuidade.",
      "Olhe nos olhos ao elogiar: o corpo reforça a mensagem e evita mal-entendidos.",
      "Evite 'você é incrível' e prefira 'quando você fez X, me senti cuidado porque...'.",
      "Elogio frequente cria colchão emocional que protege em momentos tensos.",
      "Apreciação reduz defensividade e abre espaço para conversas difíceis depois."
    ]
  ),
  withInsights(
    {
      id: 3,
      day: 3,
      theme: Theme.COMMUNICATION,
      title: "Pergunta Diferente",
      shortDescription: "Troque o automático.",
      action: "Pergunte: “Qual foi o melhor minuto do seu dia e por quê?” e ouça sem interromper.",
      quote: "Escutar é abraçar com atenção."
    },
    [
      "Perguntas novas tiram o cérebro do piloto automático e revelam o que importa de verdade.",
      "Ouvir sem interromper diminui o cortisol do outro e aumenta a sensação de ser acolhido.",
      "Quando a pessoa explica o porquê, você entende valores e necessidades escondidas.",
      "Faça contato visual e devolva uma palavra-chave para mostrar que está presente.",
      "Silêncio na resposta não é rejeição: é processamento; espere antes de comentar.",
      "Curiosidade genuína aproxima mais do que conselhos rápidos."
    ]
  ),
  withInsights(
    {
      id: 4,
      day: 4,
      theme: Theme.INTIMACY,
      title: "Abraço de 20s",
      shortDescription: "Toque que acalma.",
      action: "Façam um abraço de 20 segundos. Apenas respirem e sintam.",
      quote: "Um abraço longo é um lar temporário."
    },
    [
      "Vinte segundos liberam ocitocina, o hormônio do vínculo; segure firme e respire fundo.",
      "Abraço longo comunica 'você está seguro comigo' sem precisar de palavras.",
      "Afrouxe os ombros e deixe o corpo pesar: isso sinaliza confiança.",
      "Use este abraço como reinício depois de um dia tenso antes de conversar.",
      "Abraços consistentes criam memória corporal de calma para momentos de crise.",
      "Termine com um 'obrigado por estar aqui'; verbalizar reforça o gesto."
    ]
  ),
  withInsights(
    {
      id: 5,
      day: 5,
      theme: Theme.GRATITUDE,
      title: "Gratidão do Dia",
      shortDescription: "Feche o dia com apreço.",
      action: "Antes de dormir, agradeça por algo que seu parceiro fez hoje ou esta semana.",
      quote: "A gratidão transforma o que temos em suficiente."
    },
    [
      "Fechar o dia com gratidão reduz ruminação e melhora o sono dos dois.",
      "Agradeça pelo comportamento e pelo esforço por trás dele para reforçar repetição.",
      "Use frases curtas: 'hoje, quando você fez X, me senti Y'.",
      "Gratidão diária constrói cultura de reconhecimento e dilui pequenas mágoas.",
      "Ser visto por algo pequeno previne a sensação de que nada é notado.",
      "Registrar mentalmente três motivos de gratidão protege contra o viés negativo."
    ]
  ),
  withInsights(
    {
      id: 6,
      day: 6,
      theme: Theme.PLANS,
      title: "Mini Plano Juntos",
      shortDescription: "Alinhe expectativas.",
      action: "Escolham uma coisa simples para fazer juntos nesta semana (café, passeio curto).",
      quote: "Sonhos pequenos construídos viram grandes laços."
    },
    [
      "Planos pequenos cabem na agenda e evitam frustração de planos grandiosos que nunca saem.",
      "Escolher juntos cria sensação de equipe e compromisso compartilhado.",
      "Coloque no calendário com horário: sem data vira boa intenção esquecida.",
      "Uma microatividade semanal mantém o casal em modo namoro, não só gestão de tarefas.",
      "Planejar algo leve diminui a pressão e aumenta a chance de virar hábito.",
      "Revisem depois como se sentiram para ajustar próximos encontros."
    ]
  ),
  withInsights(
    {
      id: 7,
      day: 7,
      theme: Theme.COMMUNICATION,
      title: "Sem Corretor",
      shortDescription: "Fale na primeira pessoa.",
      action: "Compartilhe um incômodo usando “Eu me sinto...” sem apontar dedos. Depois ouça o outro.",
      quote: "Culpa fecha, vulnerabilidade abre."
    },
    [
      "Usar 'eu sinto' em vez de 'você sempre' evita defesa e abre espaço para escuta.",
      "Descreva o fato e a emoção: 'quando X aconteceu, me senti Y'; clareza é cuidado.",
      "Peça uma ação específica em vez de listar erros; pedidos são mais fáceis de atender.",
      "Ouça a resposta sem interromper; a validação vem antes da solução.",
      "Generalizações ('sempre/nunca') aumentam conflito; foque no episódio.",
      "Validar o sentimento do outro não significa concordar, significa reconhecer."
    ]
  ),
  withInsights(
    {
      id: 8,
      day: 8,
      theme: Theme.INTIMACY,
      title: "Toque nas Mãos",
      shortDescription: "Presença simples.",
      action: "Segurem as mãos por 1 minuto enquanto contam algo bom do dia.",
      quote: "Pequenos gestos sustentam grandes histórias."
    },
    [
      "Mãos dadas dizem 'estou aqui' sem discursos; acalmam o sistema nervoso.",
      "Associe toque a uma história boa: o cérebro grava o carinho junto com a lembrança.",
      "Foque no toque: sinta textura e temperatura para ficar presente.",
      "Um minuto é curto o suficiente para caber em qualquer rotina.",
      "Segurar mãos em dias difíceis lembra que existe um time, não só um problema.",
      "Evite falar de logística nesse momento; mantenha leveza e gratidão."
    ]
  ),
  withInsights(
    {
      id: 9,
      day: 9,
      theme: Theme.GRATITUDE,
      title: "Agradeça o Esforço",
      shortDescription: "Valide energia gasta.",
      action: "Note um esforço invisível que o outro fez (trabalho, cuidado, atenção) e agradeça.",
      quote: "Ser visto é ser amado em ação."
    },
    [
      "Esforços invisíveis viram mágoa quando ninguém nota; nomeie o gesto e a intenção.",
      "Fale do impacto: 'quando você fez X, fiquei mais tranquilo para Y'.",
      "Reconhecer bastidores distribui justiça emocional e motivação.",
      "A falta de reconhecimento é uma das maiores fontes de ressentimento em casais.",
      "Gratidão por tarefas domésticas reduz sensação de sobrecarga mental.",
      "Ser visto pelo que ninguém vê reforça parceria em vez de contabilidade."
    ]
  ),
  withInsights(
    {
      id: 10,
      day: 10,
      theme: Theme.CELEBRATION,
      title: "Pequena Vitória",
      shortDescription: "Celebrem o micro.",
      action: "Escolham algo que vocês venceram esta semana e comemorem com um gesto simples (brinde com água, abraço, foto).",
      quote: "Celebrar pequenas vitórias prepara terreno para as grandes."
    },
    [
      "Celebrar o micro treina o cérebro a procurar o que funciona, não só problemas.",
      "Rituais de vitória liberam dopamina e aumentam motivação para próximos passos.",
      "Não espere conquista gigante; a consistência diária é o que segura o relacionamento.",
      "Registrar com foto ou áudio cria memória positiva para dias difíceis.",
      "Compartilhar a vitória reforça identidade de time e diminui comparação.",
      "Comemorar o progresso evita sensação de estagnação e fortalece o vínculo."
    ]
  ),
  withInsights(
    {
      id: 11,
      day: 11,
      theme: Theme.COMMUNICATION,
      title: "Escuta 5-5",
      shortDescription: "Revezem o microfone.",
      action: "Cada um fala 5 minutos sobre um tema que gosta; o outro só ouve e depois troca.",
      quote: "Escutar é doar tempo sem interrupção."
    },
    [
      "Tempo delimitado dá segurança para falar sem ser cortado e sem pressa.",
      "Ouvir sobre o que o outro ama revela valores e desejos fora da rotina.",
      "Evite comentários e conselhos: apenas sinalize que está acompanhando.",
      "Revezar a fala mostra que ambos têm espaço igual; isso reduz sentimento de abandono.",
      "Use um timer para respeitar o tempo e evitar interrupções por ansiedade.",
      "Depois, agradeça a partilha; reconhecimento é parte da escuta ativa."
    ]
  ),
  withInsights(
    {
      id: 12,
      day: 12,
      theme: Theme.INTIMACY,
      title: "Cheiro e Memória",
      shortDescription: "Ative sentidos.",
      action: "Cheire algo que lembre o outro (perfume, café, travesseiro) e conte uma memória boa ligada a isso.",
      quote: "O olfato guarda chaves do coração."
    },
    [
      "Aromas acessam emoção mais rápido que palavras; use isso a seu favor.",
      "Memórias olfativas criam nostalgia positiva e reativam o começo da relação.",
      "Compartilhar a história por trás do cheiro mostra vulnerabilidade e afeto.",
      "Perfume, café ou travesseiro viram âncoras emocionais para dias corridos.",
      "Cheiros podem ser gatilhos de cuidado: associe um aroma a um momento de calma.",
      "Revisitar um cheiro do início de vocês reforça a sensação de escolha mútua."
    ]
  ),
  withInsights(
    {
      id: 13,
      day: 13,
      theme: Theme.PLANS,
      title: "Lista de 3 Desejos",
      shortDescription: "Direção compartilhada.",
      action: "Cada um escreve 3 desejos para o próximo mês. Compare e escolham um para fazer juntos.",
      quote: "Amar é olhar juntos na mesma direção."
    },
    [
      "Desejos revelam valores atuais; alinhar evita surpresas e frustrações.",
      "Escolher um desejo comum cria foco e senso de conquista compartilhada.",
      "Listas curtas evitam paralisia de escolha e aumentam execução.",
      "Desejos divergentes são convite para negociar, não brigar.",
      "Anotar torna o plano concreto e rastreável; sem registro vira promessa vazia.",
      "Cumprir um desejo juntos aumenta confiança de que vocês conseguem em dupla."
    ]
  ),
  withInsights(
    {
      id: 14,
      day: 14,
      theme: Theme.CELEBRATION,
      title: "Recorde em 60s",
      shortDescription: "Relembre o porquê.",
      action: "Gravem um áudio de 60s dizendo uma lembrança marcante que viveram juntos.",
      quote: "Memória compartilhada fortalece o hoje."
    },
    [
      "Um áudio curto vira cápsula de memória que pode ser ouvida em momentos difíceis.",
      "Relembrar o porquê aproxima e resgata emoção do início da relação.",
      "Sessenta segundos forçam foco no essencial, sem discursos longos.",
      "Ouvir a voz do outro contando a história reacende o afeto.",
      "Guardar o áudio cria um acervo de provas de carinho para revisitar.",
      "Recontar boas lembranças reduz a sensação de que o presente é só problema."
    ]
  ),
  withInsights(
    {
      id: 15,
      day: 15,
      theme: Theme.GRATITUDE,
      title: "Obrigado por existir",
      shortDescription: "Reconheça a pessoa, não só o feito.",
      action: "Diga: “Gosto de como você...” e cite um traço de caráter (gentileza, humor, coragem).",
      quote: "Ver o ser, não só o fazer."
    },
    [
      "Elogiar traços de caráter mostra que você valoriza quem a pessoa é, não só o que entrega.",
      "Admiração pelo ser alimenta autoestima e reduz comparação tóxica.",
      "Traços são estáveis; reconhecer isso dá sensação de ser amado sem condicionais.",
      "Use exemplos: 'gosto de como você traz leveza quando a casa está caótica'.",
      "Ver o ser diminui a lógica transacional e aumenta parceria genuína.",
      "Ser admirado pelo caráter incentiva a pessoa a oferecer mais do melhor dela."
    ]
  ),
  withInsights(
    {
      id: 16,
      day: 16,
      theme: Theme.COMMUNICATION,
      title: "Pausa de Tela",
      shortDescription: "Presença sem distração.",
      action: "Façam uma refeição de 15 minutos sem celular. Apenas conversem ou fiquem em silêncio juntos.",
      quote: "Atenção é a moeda do afeto."
    },
    [
      "Quinze minutos sem tela já diminuem a sensação de isolamento dentro de casa.",
      "Guardar o celular comunica com o corpo que o outro é prioridade agora.",
      "Silêncio compartilhado vale tanto quanto papo; não force assunto para preencher.",
      "Refeição sem distração melhora digestão emocional: vocês digerem o dia juntos.",
      "Criar um espaço livre de notificações reduz tensão e evita discussões por 'falta de atenção'.",
      "Micro detox diário treina o cérebro a buscar conexão humana antes do feed."
    ]
  ),
  withInsights(
    {
      id: 17,
      day: 17,
      theme: Theme.INTIMACY,
      title: "Mapa do Corpo",
      shortDescription: "Toque consciente e leve.",
      action: "Toque no ombro, costas ou mãos do parceiro e pergunte onde ele gosta mais de carinho. Respeite limites.",
      quote: "Consentimento e cuidado andam juntos."
    },
    [
      "Perguntar onde tocar mostra respeito e evita repetir gestos que não agradam mais.",
      "Preferências mudam com o tempo; atualizar o 'mapa' mantém a intimidade viva.",
      "Toque lento e pedido de feedback ('aqui está bom?') reduzem ansiedade.",
      "Consentimento explícito gera confiança e liberdade para explorar mais no futuro.",
      "Observar linguagem corporal ajuda a ajustar pressão e ritmo sem precisar adivinhar.",
      "Gentileza no toque comunica: 'eu cuido de você', não 'eu tomo de você'."
    ]
  ),
  withInsights(
    {
      id: 18,
      day: 18,
      theme: Theme.PLANS,
      title: "Próxima Data",
      shortDescription: "Planeje leveza.",
      action: "Marquem uma mini-saída de 30 minutos nesta semana (caminhada, sorvete, banca de jornal).",
      quote: "Planejar prazer é investir no vínculo."
    },
    [
      "Datas curtas são mais sustentáveis e evitam a desculpa de falta de tempo.",
      "Sair de casa muda o cenário mental e reduz a sensação de rotina pesada.",
      "Antecipar a saída cria dopamina e melhora o humor antes mesmo de acontecer.",
      "Mantenha simples: objetivo é rir e conversar, não produzir perfeição.",
      "Repetir esse hábito semanal cria consistência afetiva.",
      "Proteja o horário como protegeria uma reunião importante: isso mostra prioridade."
    ]
  ),
  withInsights(
    {
      id: 19,
      day: 19,
      theme: Theme.COMMUNICATION,
      title: "Traduza um Pedido",
      shortDescription: "Evite suposições.",
      action: "Cada um diz um pedido claro para amanhã: “Preciso que você...”. Seja específico e gentil.",
      quote: "Claridade é carinho."
    },
    [
      "Pedidos claros evitam a frustração de ter que adivinhar o que o outro quer.",
      "Seja específico: o quê, quando e por quê; isso reduz conflito e aumenta colaboração.",
      "Tom gentil aumenta a chance de concordância; foco no comportamento, não na pessoa.",
      "Receber um pedido direto é mais fácil do que interpretar indiretas.",
      "Combinar expectativas diárias tira pressão de conversas longas no final do dia.",
      "Clareza poupa energia emocional e evita contabilidade de 'quem faz mais'."
    ]
  ),
  withInsights(
    {
      id: 20,
      day: 20,
      theme: Theme.GRATITUDE,
      title: "Aplauso ao Invisível",
      shortDescription: "Veja o bastidor.",
      action: "Liste 2 tarefas que o outro faz sem você ver (lavou louça, organizou algo) e agradeça.",
      quote: "O invisível sustenta o visível."
    },
    [
      "Reconhecer tarefas invisíveis previne ressentimento por carga mental.",
      "Fale da tarefa e do efeito: 'quando você fez X, fiquei mais leve para Y'.",
      "Ver o bastidor mostra que vocês são um time, não um fiscal do outro.",
      "Gratidão por pequenas coisas mantém a balança emocional equilibrada.",
      "Ignorar o invisível leva à sensação de injustiça silenciosa.",
      "Aplauso sincero aumenta motivação e vontade de manter o cuidado."
    ]
  ),
  withInsights(
    {
      id: 21,
      day: 21,
      theme: Theme.CELEBRATION,
      title: "Brinde do Nada",
      shortDescription: "Celebre o cotidiano.",
      action: "Façam um brinde com água ou chá a algo simples de hoje. Foto opcional para memória.",
      quote: "Quem celebra o pouco recebe o muito."
    },
    [
      "Brindar o cotidiano treina o olhar para abundância em vez de falta.",
      "Rituais simples criam âncoras de leveza e evitam que a relação vire só logística.",
      "Uma foto do brinde registra a cultura de celebração que vocês estão criando.",
      "Celebrar algo pequeno protege contra a sensação de estagnação.",
      "A forma não importa (água, chá); a intenção de marcar importa.",
      "Brinde diário pode virar código do casal para 'sobrevivemos juntos hoje'."
    ]
  ),
  withInsights(
    {
      id: 22,
      day: 22,
      theme: Theme.INTIMACY,
      title: "Respirem Juntos",
      shortDescription: "Sincronize ritmos.",
      action: "Por 2 minutos, alinhem a respiração. Inale quando o outro inala, exale junto.",
      quote: "Respirar junto é lembrar que são equipe."
    },
    [
      "Respiração sincronizada baixa o ritmo cardíaco e reduz estresse dos dois.",
      "Use contagem 4-4 (inala 4, exala 4) para facilitar o alinhamento.",
      "Essa prática antes de conversas difíceis evita reatividade.",
      "O corpo entende a mensagem de 'estamos juntos' antes da cabeça.",
      "Dois minutos são suficientes para resetar o humor e melhorar escuta.",
      "Respirar junto cria sensação de time mesmo em silêncio."
    ]
  ),
  withInsights(
    {
      id: 23,
      day: 23,
      theme: Theme.PLANS,
      title: "Coisa Nova",
      shortDescription: "Novidade cria dopamina.",
      action: "Escolham algo que nunca fizeram juntos (receita nova, música nova) e façam por 10 minutos.",
      quote: "Novidade é vitamina para vínculos."
    },
    [
      "Novidade desperta dopamina e aumenta o interesse mútuo.",
      "Dez minutos de algo inédito já quebram a rotina sem exigir logística.",
      "Escolham algo leve para reduzir perfeccionismo e aumentar diversão.",
      "Novas experiências criam histórias internas e piadas do casal.",
      "Explorar juntos mostra flexibilidade e disposição para aprender.",
      "Variedade impede que a relação vire só repetição de tarefas."
    ]
  ),
  withInsights(
    {
      id: 24,
      day: 24,
      theme: Theme.COMMUNICATION,
      title: "Sem Resolver",
      shortDescription: "Apenas escute.",
      action: "Pergunte: “Você quer apoio ou solução?” e siga o que ele pedir. Sem corrigir.",
      quote: "Apoio não é consertar; é sustentar."
    },
    [
      "Perguntar o que o outro precisa evita oferecer ajuda errada e frustrações.",
      "Às vezes a pessoa quer ser ouvida, não consertada; valide antes de agir.",
      "Apoio é presença e empatia; solução é plano de ação. Separe as duas coisas.",
      "Seguir o pedido mostra respeito e diminui sensação de ser controlado.",
      "Validar o sentir reduz defensividade e abre espaço para soluções depois.",
      "Pergunta simples, efeito grande: menos desgaste e mais conexão."
    ]
  ),
  withInsights(
    {
      id: 25,
      day: 25,
      theme: Theme.GRATITUDE,
      title: "Bilhete Rápido",
      shortDescription: "Deixe um traço.",
      action: "Escreva um bilhete ou mensagem curta com algo que admira. Deixe em um lugar que ele vá achar.",
      quote: "Pequenos bilhetes, grandes ecos."
    },
    [
      "Bilhetes físicos surpreendem e viram lembrança palpável.",
      "Texto curto e específico tem efeito maior que mensagem automática.",
      "Esconda em locais de uso diário para ser achado sem aviso e mudar o humor.",
      "Palavras escritas são revisitas possíveis em dias ruins.",
      "Pequenos gestos frequentes constroem trilha de afeto contínua.",
      "Um post-it pode ser o reforço que falta para o dia ser mais leve."
    ]
  ),
  withInsights(
    {
      id: 26,
      day: 26,
      theme: Theme.INTIMACY,
      title: "Ritual de Boa Noite",
      shortDescription: "Crie fechamento.",
      action: "Antes de dormir, façam um toque (mão, beijo na testa) e uma frase padrão: “Boa noite, estamos juntos”.",
      quote: "Rituais selam segurança."
    },
    [
      "Ritual de fechamento reduz ansiedade antes de dormir e melhora o descanso.",
      "Frase repetida cria âncora de segurança emocional diária.",
      "Toque suave libera hormônios de calma e quebra o clima de distância.",
      "Mesmo em dias tensos, manter o ritual evita dormir em clima de guerra.",
      "Gestos pequenos e consistentes constroem previsibilidade, algo que o cérebro ama.",
      "Esse hábito protege o vínculo de ruídos acumulados durante o dia."
    ]
  ),
  withInsights(
    {
      id: 27,
      day: 27,
      theme: Theme.PLANS,
      title: "Orçamento de Tempo",
      shortDescription: "Invistam 30 min.",
      action: "Reservem 30 minutos em um dia próximo para algo que ambos querem. Marquem no calendário.",
      quote: "Tempo marcado é compromisso emocional."
    },
    [
      "Bloquear horário mostra que a relação tem prioridade igual a compromissos de trabalho.",
      "Calendário compartilhado evita ressentimento de 'você nunca tem tempo'.",
      "Trinta minutos focados valem mais do que horas com atenção dividida.",
      "Marcar antecipado reduz cancelamentos por cansaço ou esquecimento.",
      "Proteger esse tempo ensina aos outros (e a você) que o casal é importante.",
      "Consistência semanal cria previsibilidade e diminui sensação de abandono."
    ]
  ),
  withInsights(
    {
      id: 28,
      day: 28,
      theme: Theme.COMMUNICATION,
      title: "Traduza Emoções",
      shortDescription: "Dê nome ao sentir.",
      action: "Cada um compartilha uma emoção de hoje e o gatilho. Use palavras simples: alegria, medo, cansaço, esperança.",
      quote: "Nomear é diminuir a distância."
    },
    [
      "Nomear emoções organiza o cérebro e evita explosões por acúmulo.",
      "Citar o gatilho ajuda o outro a entender contexto e apoiar melhor.",
      "Palavras simples funcionam melhor que discursos longos; foque no sentir.",
      "Quando você nomeia, o outro não precisa adivinhar ou minimizar.",
      "Vocabulário emocional rico é fator de proteção em casais, segundo pesquisas de comunicação não violenta.",
      "Falar de emoção diariamente evita efeito panela de pressão."
    ]
  ),
  withInsights(
    {
      id: 29,
      day: 29,
      theme: Theme.CELEBRATION,
      title: "Top 3 do Mês",
      shortDescription: "Revise o caminho.",
      action: "Liste três momentos favoritos deste mês e por que marcaram vocês.",
      quote: "Relembrar é reviver com gratidão."
    },
    [
      "Revisar o mês consolida memória positiva e combate viés de negatividade.",
      "Dizer por que marcou revela valores e necessidades atendidas.",
      "Top 3 cria narrativa do casal: vocês escolhem quais histórias guardar.",
      "Revisão ajuda a repetir o que funcionou e ajustar o que não funcionou.",
      "Compartilhar essas memórias aumenta sensação de time e continuidade.",
      "Esse ritual é combustível emocional para o próximo mês."
    ]
  ),
  withInsights(
    {
      id: 30,
      day: 30,
      theme: Theme.CELEBRATION,
      title: "Carta ao Futuro",
      shortDescription: "Mensagem para vocês de amanhã.",
      action: "Gravem um áudio ou escrevam uma carta para ouvirem daqui a 3 meses. Falem do que querem manter vivo.",
      quote: "O amor é uma construção diária."
    },
    [
      "Carta ao futuro cria responsabilidade afetiva: vocês prometem algo a si mesmos.",
      "Registrar desejos e conquistas ajuda a medir progresso e celebrar evolução.",
      "O áudio/carta vira lembrete em dias difíceis de que vocês já superaram fases.",
      "Projetar o que querem manter vivo evita que o próximo mês vire piloto automático.",
      "Ouvir a própria voz depois reativa intenção e compromisso.",
      "Fechar o mês com carta sinaliza fim de ciclo e começo do próximo com clareza."
    ]
  )
].sort((a, b) => a.day - b.day);

export const getMissionByDay = (day: number): Mission | undefined => {
  return MISSIONS.find(m => m.day === day);
};
