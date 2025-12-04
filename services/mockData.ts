import { Mission, Theme } from '../types';

const withInsights = (mission: Omit<Mission, 'insights'>, insights: string[]): Mission => ({
  ...mission,
  insights,
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
      "Olhar sustentado sinaliza segurança e reduz o ritmo interno.",
      "Dois minutos de silêncio conjunto valem mais que um dia de distrações.",
      "Respirar junto sincroniza sistemas nervosos e baixa a ansiedade.",
      "Quando você encara, convida vulnerabilidade; quando foge, alimenta ruído.",
      "Antes de falar, experimente sentir: o corpo entende primeiro.",
      "Silêncio não é vazio; é espaço para perceber o outro sem filtros.",
      "Contemplar o rosto do parceiro reativa memórias de quando tudo começou.",
      "O olho recebe mensagens que a boca não consegue pronunciar.",
      "Fitar o outro por 120 segundos cria um micro ritual de presença.",
      "A intimidade cresce onde há espaço seguro para apenas existir."
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
      "Elogios genéricos soam protocolo; elogios específicos soam verdade.",
      "Detalhe por que você admira: o porquê mostra que você estava atento.",
      "Apreciação é um antídoto diário contra a erosão da rotina.",
      "Ser visto em detalhes reforça que você é lembrado e não apenas tolerado.",
      "Elogiar esforço, não só resultado, incentiva parceria contínua.",
      "Um bom elogio traz contexto, emoção e consequência positiva.",
      "O cérebro registra melhor o elogio associado a um momento concreto.",
      "Quando você diz 'por quê', você abre uma janela do seu olhar interno.",
      "A repetição de apreciação específica vira cultura do casal.",
      "Reconhecimento frequente constrói imunidade contra críticas futuras."
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
      "Perguntas novas desbloqueiam histórias que o 'como foi o dia?' não alcança.",
      "Um minuto marcante revela valores e desejos escondidos.",
      "Escuta sem interrupção é prova prática de respeito.",
      "Quando você não interrompe, o outro organiza o próprio pensamento com segurança.",
      "Perguntar 'por quê' aprofunda, mas só funciona se houver paciência no silêncio.",
      "O melhor minuto pode parecer simples; é aí que mora o significado verdadeiro.",
      "Escuta ativa: olhe, acene, repita uma palavra-chave para mostrar presença.",
      "Curiosidade genuína reconstrói pontes afetivas desgastadas.",
      "Boas perguntas mudam a energia de um dia inteiro.",
      "Ouvir a alegria do outro aumenta a sensação de time."
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
      "20 segundos é tempo suficiente para liberar ocitocina: hormônio do vínculo.",
      "Abraçar sem pressa reprograma o corpo para sentir segurança.",
      "A pausa do toque longo diz: você importa, sem palavras.",
      "Respirar junto no abraço acerta o ritmo cardíaco dos dois.",
      "Abraço longo é diferente de beijo rápido: ele comunica estabilidade.",
      "Postura relaxada no abraço sinaliza entrega; ombros tensos sinalizam defesa.",
      "Abraços frequentes são investimento na conta emocional.",
      "Não preencha o silêncio do abraço; ele é a mensagem.",
      "Um abraço comprido às vezes resolve o que discussões não resolvem.",
      "Comece e termine o dia com um abraço e veja o humor mudar."
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
      "A gratidão noturna encerra o dia com memória positiva.",
      "Agradecer comportamentos reforça que eles se repitam.",
      "Gratidão reduz ruminação: você vai dormir com foco no que deu certo.",
      "Cada 'obrigado' específico vale como mini-recompensa emocional.",
      "Parar para notar o cuidado do outro combate a sensação de rotina vazia.",
      "Gratidão é ação preventiva contra o acúmulo de mágoas.",
      "Dizer 'vi quando você fez X' valida o esforço invisível.",
      "Apreço recorrente forma um colchão emocional para dias difíceis.",
      "Ser grato pelo pequeno mostra maturidade no vínculo.",
      "Gratidão sincera aproxima mais que qualquer presente caro."
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
      "Planos pequenos cabem na agenda e geram sensação de progresso.",
      "Quando agendam algo, vocês dizem 'somos prioridade'.",
      "Planejar leveza vale mais do que esperar a viagem perfeita.",
      "Compromisso com micro-rituais cria identidade do casal.",
      "Um mini plano quebra a inércia e puxa energia de ação.",
      "Agenda compartilhada evita frustrações de última hora.",
      "Alinhar expectativas evita a sensação de 'você não liga'.",
      "Pequenos planos criam memória e piadas internas.",
      "Planejar juntos gera pertença: 'nós decidimos'.",
      "Não subestime um café de 15 minutos: é um check-in afetivo."
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
      "Falar no 'eu' reduz defesa e abre espaço para o outro ouvir.",
      "'Você sempre...' vira ataque; 'Eu sinto...' vira convite.",
      "Sentimento + contexto é mais claro que acusação.",
      "Quem descreve sensação em vez de culpar constrói pontes.",
      "Vulnerabilidade é risco, mas é o caminho para intimidade real.",
      "Quando você fala do que sente, o outro enxerga sua intenção, não só o erro.",
      "A escuta depois do seu 'eu sinto' é metade da cura.",
      "Evite generalizações: foque no episódio, não na pessoa.",
      "Pedir mudança é diferente de culpar; formule como pedido claro.",
      "Corretor de culpa corrige pouco; clareza de sentimento transforma."
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
      "Segurar mãos ativa sensação de 'estamos juntos' física e mental.",
      "Toque + relato bom ancoram a memória em conforto.",
      "O cérebro associa o toque à narrativa positiva contada.",
      "Mãos dadas acalmam a mente em dias cheios.",
      "Esse micro-ritual combate o piloto automático no fim do dia.",
      "Pequeno gesto, grande sinal de disponibilidade.",
      "Mãos quentes transmitem cuidado sem precisar de discurso.",
      "O toque evita que a conversa vire só logística.",
      "Encurtar distância física reduz distância emocional.",
      "Gesto simples é mais sustentável que grandes demonstrações raras."
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
      "Esforços invisíveis pedem reconhecimento explícito.",
      "Agradecer energia gasta demonstra que você percebe bastidores.",
      "Validação reduz sensação de sobrecarga silenciosa.",
      "Atenção ao detalhe cria cultura de colaboração.",
      "Sem reconhecimento, o esforço vira ressentimento.",
      "A palavra 'vi você fazendo X' é mais forte que 'valeu'.",
      "Esforço visto gera vontade de continuar contribuindo.",
      "A falta de reconhecimento diminui motivação com o tempo.",
      "Agradecer o invisível ensina que nada é obrigação automática.",
      "Ver o outro é cuidar do vínculo, não só da tarefa."
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
      "Celebrar o micro ensina o cérebro a procurar o que funciona.",
      "Vitórias pequenas evitam a sensação de 'nada anda'.",
      "Brinde simples ainda é ritual poderoso.",
      "Celebrar juntos fortalece a identidade do time.",
      "Memória de vitória vira combustível para desafios maiores.",
      "Registre: foto, áudio, bilhete. Assim a vitória dura mais.",
      "Pequenas conquistas são a base de grandes conquistas.",
      "Quem celebra o caminho não depende só da linha de chegada.",
      "Comemorar evita que o esforço se perca na rotina.",
      "Rituais de celebração aumentam motivação e prazer compartilhado."
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
      "Tempo delimitado evita interrupção e dá segurança para falar.",
      "Revezar microfone é treino de respeito e curiosidade.",
      "Quando você não interrompe, o outro se aprofunda.",
      "Escuta de 5 minutos revela paixões e interesses esquecidos.",
      "Falar do que gosta aumenta energia positiva no casal.",
      "Revezamento mostra que ambos têm espaço igual.",
      "Ouvir sobre o hobby do outro cria novas conexões entre vocês.",
      "Evite comentários; pratique apenas presença.",
      "Esse exercício ensina ritmo de diálogo saudável.",
      "Alternar fala e escuta é ginástica emocional."
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
      "Cheiros despertam memórias com mais força que imagens.",
      "Compartilhar lembrança olfativa cria nostalgia positiva.",
      "Perfume, café ou travesseiro são âncoras afetivas rápidas.",
      "Histórias ligadas a cheiro são únicas e pessoais.",
      "Olfato ativa emoção mais rápido que raciocínio.",
      "Relembrar via cheiro renova a conexão com o passado de vocês.",
      "Cheiro também comunica cuidado (roupa limpa, ambiente acolhedor).",
      "Traga um aroma que marcou o início de vocês e conte por quê.",
      "Aromas suaves acalmam e preparam terreno para boas conversas.",
      "Memórias olfativas viram gatilhos de carinho no dia a dia."
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
      "Desejos revelam valores e prioridades atuais.",
      "Escolher um desejo comum reduz frustração e aumenta foco.",
      "Listas curtas evitam paralisia de opções.",
      "Compartilhar desejos é convite à vulnerabilidade.",
      "Desejos divergentes são oportunidade de conversa, não de disputa.",
      "Anotar evita que a rotina apague o que vocês querem construir.",
      "Um desejo cumprido gera confiança para os próximos.",
      "Desejos mostram o que faz sentido hoje, não só no futuro distante.",
      "Planejar juntos cria sensação de time estratégico.",
      "Desejos pequenos realizados constroem confiança no casal."
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
      "Um áudio curto vira cápsula de memória acessível depois.",
      "Lembrar bons momentos reforça o motivo de estarem juntos.",
      "60 segundos forçam foco no essencial da história.",
      "Memória falada aciona emoção mais que texto.",
      "Gravar no mesmo dia evita procrastinar o afeto.",
      "Ouvir a voz do parceiro contando lembra o tom de carinho.",
      "Histórias contadas criam arquivo emocional do casal.",
      "Essa gravação pode ser resgatada em dias difíceis.",
      "Recontar um momento reativa sensações boas no corpo.",
      "Narrar juntos é coautorizar a história de vocês."
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
      "Elogiar caráter valida a essência, não só tarefas.",
      "Traço de personalidade é mais estável que comportamento isolado.",
      "Reconhecer o ser cria senso de identidade apreciada.",
      "Falar 'gosto de como você...' mostra admiração, não cobrança.",
      "Traços positivos lembrados geram autoestima no parceiro.",
      "Elogios de caráter são combustível em fases de cansaço.",
      "Olhar além do fazer reduz a lógica transacional do relacionamento.",
      "Quando o outro se sente admirado, ele oferece mais do melhor dele.",
      "Validação do ser cura inseguranças antigas.",
      "Isso reforça que vocês se veem como pessoas, não funções."
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
      "15 minutos sem tela já reduzem sensação de isolamento.",
      "Mesa sem celular comunica: você é mais importante que notificações.",
      "Silêncio junto também é presença; não precisa preencher tudo.",
      "Micro detox digital reabre espaço para perceber o outro.",
      "Olho no olho devolve nuances que a tela rouba.",
      "Refeição sem tela vira ritual de reconexão diário.",
      "Essa prática protege o casal da distração crônica.",
      "Você reeduca o cérebro a não buscar dopamina no celular.",
      "Tempo de qualidade é mais sobre foco do que duração.",
      "Desligar tela é gesto prático de respeito."
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
      "Perguntar onde tocar é ato de respeito e curiosidade.",
      "Toque consciente é diferente de toque automático.",
      "Preferências mudam; perguntar evita suposições antigas.",
      "Respeitar limites aumenta confiança para futuras explorações.",
      "Mapa do corpo é conversa, não só gesto físico.",
      "Perguntar 'aqui está bom?' comunica cuidado.",
      "Tocar devagar permite ao corpo relaxar e responder.",
      "Linguagem corporal é resposta honesta: observe.",
      "Consentimento reforçado gera intimidade mais livre.",
      "O corpo do outro é território sagrado; entre com gentileza."
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
      "Uma mini-saída corta a rotina e injeta novidade.",
      "Marcar no calendário evita que a semana engula o casal.",
      "30 minutos bem vividos renovam a sensação de namoro.",
      "Planejar prazer mostra intenção de cuidar da relação.",
      "Sair do ambiente comum muda o clima mental.",
      "Data curta reduz desculpas de falta de tempo.",
      "Expectativa compartilhada já aumenta dopamina.",
      "Repetir datas curtas cria consistência afetiva.",
      "Não precisa luxo; precisa presença e leveza.",
      "Encontros agendados evitam cair só na logística da casa."
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
      "Pedido claro evita desgaste de adivinhação.",
      "Gentileza no tom aumenta chance de colaboração.",
      "Especificar o quê e quando reduz conflito futuro.",
      "Suposições geram frustração; clareza gera parceria.",
      "Pedir é ato de confiança, não de fraqueza.",
      "Receber um pedido claro é mais fácil que interpretar indiretas.",
      "Combine expectativas diárias para reduzir atrito.",
      "Pequenos pedidos alinhados evitam grandes discussões.",
      "Use frases curtas e positivas: 'gostaria que você...'.",
      "Clareza poupa energia emocional dos dois."
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
      "Bastidores não reconhecidos viram ressentimento.",
      "Ver o invisível é dizer: 'eu te percebo'.",
      "Aplauso ao que não aparece reforça senso de justiça.",
      "Tarefas invisíveis mantêm a casa e o vínculo funcionando.",
      "Agradecer o invisível dá dignidade ao esforço silencioso.",
      "Quem é visto se sente parte, não apenas servindo.",
      "Reconhecer bastidor previne a contabilidade de mágoas.",
      "A cultura de gratidão começa no detalhe.",
      "Aplauso genuíno reduz a sensação de carga desigual.",
      "Valorizar o invisível valoriza a pessoa inteira."
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
      "Brinde simbólico transforma rotina em ritual.",
      "Celebrar algo simples treina o olhar para o que já está bom.",
      "Foto do brinde vira recordação do cuidado diário.",
      "O ato do brinde cria micro-memórias felizes.",
      "Celebrar o nada combate a sensação de escassez.",
      "Brindar com água ou chá prova que intenção vale mais que luxo.",
      "Registro visual ajuda a lembrar em dias difíceis.",
      "Rituais simples constroem cultura do casal.",
      "Brinde diário é âncora para o humor.",
      "Quem celebra o cotidiano se protege do tédio."
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
      "Respiração sincronizada regula o estresse dos dois.",
      "É um lembrete corporal de que vocês são time.",
      "Dois minutos de foco no ar que entra e sai acalmam.",
      "Respirar junto cria coesão sem precisar de palavras.",
      "Ritmo compartilhado melhora escuta depois.",
      "Esse exercício simples é poderoso para reconectar.",
      "Respirar junto ajuda a sair de discussões acaloradas.",
      "O corpo entende a mensagem: estamos em sintonia.",
      "Respiração é ponte entre mente e emoção.",
      "Faça antes de conversas difíceis ou antes de dormir."
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
      "Novidades disparam dopamina e aproximam.",
      "Fazer algo inédito juntos cria memória única.",
      "10 minutos são suficientes para quebrar a rotina.",
      "Novidade tira o casal do piloto automático.",
      "Explorar algo novo mostra flexibilidade e curiosidade.",
      "Variedade mantém o vínculo vivo e interessante.",
      "Pode ser simples: música diferente, receita, documentário.",
      "O objetivo é rir e explorar, não performar.",
      "Novidade em pequenas doses é sustentável.",
      "Cada experiência nova vira história para contar."
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
      "Perguntar necessidade evita oferecer ajuda errada.",
      "Às vezes o outro só quer ser ouvido, não consertado.",
      "Esclarecer 'apoio ou solução?' economiza energia.",
      "Respeitar a resposta demonstra cuidado real.",
      "Forçar solução quando querem apoio gera frustração.",
      "Apoio é presença; solução é ação. Diferencie.",
      "Validar o sentir é tão importante quanto resolver.",
      "Pergunta simples, impacto enorme na comunicação.",
      "Siga o pedido do outro, não sua ansiedade de resolver.",
      "Apoio bem dado gera confiança para futuras conversas."
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
      "Bilhetes físicos criam surpresa tangível.",
      "Mensagem curta bem colocada dura o dia inteiro.",
      "Ser encontrado por acaso aumenta o efeito do carinho.",
      "Bilhete prova intenção, não é automatismo digital.",
      "Palavra escrita vira lembrança guardável.",
      "Bilhetes frequentes constroem trilha de afeto.",
      "Escreva específico: o que admira ou agradece.",
      "Um post-it pode mudar o humor do dia.",
      "Bilhetes criam cultura de expressão afetiva.",
      "A escrita força clareza e sinceridade."
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
      "Ritual de fechamento reduz ansiedade noturna.",
      "Frase padrão cria âncora de segurança.",
      "Toque suave antes de dormir melhora qualidade do sono.",
      "Repetição diária consolida o hábito de cuidado.",
      "Pequeno gesto evita dormir em clima frio.",
      "Rituais dizem 'aqui é seguro' sem grandes discursos.",
      "Beijo na testa comunica proteção e ternura.",
      "Esse ritual protege o vínculo de ruídos do dia.",
      "Adormecer em sintonia melhora o humor ao acordar.",
      "Pequenas frases viram mantras afetivos."
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
      "Bloquear 30 minutos mostra prioridade real.",
      "Tempo reservado evita que a semana engula o casal.",
      "Calendário compartilhado reduz frustrações.",
      "Investir tempo é dizer 'você importa'.",
      "30 minutos focados valem mais que horas distraídas.",
      "Marcar no calendário cria responsabilidade mútua.",
      "Proteja o horário como protegeria uma reunião importante.",
      "Planejar o tempo junto é forma de cuidado.",
      "Tempo é recurso mais valioso; investir nele reforça o vínculo.",
      "Persistência no agendamento cria hábito de conexão."
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
      "Dar nome ao sentir organiza a mente.",
      "Emoção nomeada perde força de explosão.",
      "Compartilhar gatilho ajuda o outro a entender contexto.",
      "Usar palavras simples evita intelectualizar demais.",
      "Emoções nomeadas criam mapa do dia um do outro.",
      "Nomear medo/esperança abre espaço para apoio específico.",
      "Linguagem emocional reduz mal-entendidos.",
      "Quando você nomeia, o outro acolhe sem adivinhar.",
      "Falar de emoção é higiene mental do casal.",
      "Vocabulário emocional rico fortalece o diálogo."
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
      "Top 3 reforça o que deu certo na jornada.",
      "Motivo do 'por que marcou' revela valores do casal.",
      "Revisão cria memória organizada e positiva.",
      "Relembrar bons momentos alimenta resiliência.",
      "Top 3 é filtro contra negatividade.",
      "Esses momentos viram histórias de identidade do casal.",
      "Listar juntos fortalece o sentimento de equipe.",
      "Revisar o mês evita que conquistas se percam.",
      "Top 3 pode virar ritual de fim de mês.",
      "Motivos compartilhados criam alinhamento de prioridades."
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
      "Carta ao futuro cria responsabilidade afetiva consigo mesmos.",
      "Registrar desejos atuais ajuda a medir progresso depois.",
      "Carta é lembrete de que vocês já venceram este mês.",
      "Falar do que querem manter vivo protege as conquistas diárias.",
      "Áudio/carta vira cápsula de motivação para tempos difíceis.",
      "Mensagem futura reforça que o relacionamento é contínuo.",
      "Ouvir a própria voz depois reativa intenção e carinho.",
      "Carta ao futuro marca fechamento de ciclo e abertura de outro.",
      "Esse ritual ajuda a não deixar o mês virar apenas check-list.",
      "Projeção positiva alimenta esperança e direção."
    ]
  )
].sort((a, b) => a.day - b.day);

export const getMissionByDay = (day: number): Mission | undefined => {
  return MISSIONS.find(m => m.day === day);
};
