export type Section = 'home'|'corpo'|'espaco'|'semaforo'|'historias'|'emocoes'|'voz'|'ajudantes'|'progresso'|'terapeuta';
export type Difficulty = 'basico'|'intermediario'|'avancado';

export interface AvatarConfig {
  characterId: string;
}

export const CHARACTERS = [
  { id: 'menina_padrao', label: 'Menina Ruiva', type: 'menina', img: '/char_menina.png' },
  { id: 'menina_loira', label: 'Menina Loira', type: 'menina', img: '/char_menina_loira.png' },
  { id: 'menina_morena', label: 'Menina Morena', type: 'menina', img: '/char_menina_morena.png' },
  { id: 'menina_negra', label: 'Menina Negra', type: 'menina', img: '/char_menina_negra.png' },
  { id: 'menino_padrao', label: 'Menino', type: 'menino', img: '/char_menino.png' },
];

export const HELP_EMOJIS = ['👩','👨','👵','👴','🧑‍🏫','👨‍🏫','👩‍⚕️','👨‍⚕️','🧑‍🦰','🧑‍🍼','🧑‍🤝‍🧑','👮','👩‍🚒','🦸','🦹','👼'];

export const DEFAULT_AVATAR: AvatarConfig = {
  characterId: 'menina_padrao',
};

export interface BodyPart {
  id: string; label: string; difficulty: Difficulty;
  description: string; isPrivate?: boolean; isBack?: boolean;
  x: number; y: number; // Porcentagem em relação à imagem (0-100)
}

export const BODY_PARTS: BodyPart[] = [
  { id:'cabeca',     label:'Cabeça',         difficulty:'basico',        description:'Onde pensamos e sentimos o mundo.',                                                                            x:50, y:10 },
  { id:'olho',       label:'Olho',           difficulty:'basico',        description:'Para ver as cores do mundo.',                                                                                  x:50, y:16 },
  { id:'boca',       label:'Boca',           difficulty:'basico',        description:'Uso minha boca para falar, comer e sorrir!',                                                                  x:50, y:21 },
  { id:'pescoco',    label:'Pescoço',        difficulty:'intermediario', description:'O pescoço segura minha cabeça e me ajuda a olhar para os lados.',                                              x:50, y:26 },
  { id:'ombro',      label:'Ombro',          difficulty:'basico',        description:'Onde apoiamos nossa mochila.',                                                                                 x:30, y:31 },
  { id:'peito',      label:'Peito',          difficulty:'basico',        description:'Onde sentimos nosso coração bater. É uma parte que fica protegida pela roupa.', isPrivate:true,               x:50, y:36 },
  { id:'barriga',    label:'Barriga',        difficulty:'basico',        description:'Onde a comida vai e onde fica o nosso umbigo.',                                                               x:50, y:45 },
  { id:'braco',      label:'Braço',          difficulty:'basico',        description:'Para brincar e dar abraços.',                                                                                 x:20, y:38 },
  { id:'cotovelo',   label:'Cotovelo',       difficulty:'intermediario', description:'A dobrinha do braço.',                                                                                        x:15, y:48 },
  { id:'pulso',      label:'Pulso',          difficulty:'avancado',      description:'Onde o relógio fica.',                                                                                        x:18, y:55 },
  { id:'mao',        label:'Mão',            difficulty:'basico',        description:'Para fazer carinho e criar coisas.',                                                                          x:20, y:60 },
  { id:'dedos',      label:'Dedos',          difficulty:'intermediario', description:'Pequenos ajudantes das mãos.',                                                                                x:20, y:63 },
  { id:'cintura',    label:'Cintura',        difficulty:'avancado',      description:'Onde seguramos a calça.',                                                                                     x:50, y:52 },
  { id:'vulva_penis',label:'Partes Íntimas', difficulty:'basico',        description:'Ficam cobertas pela roupa de baixo. São só suas e ninguém deve tocar sem um motivo de saúde ou higiene.', isPrivate:true, x:50, y:58 },
  { id:'pernas',     label:'Pernas',         difficulty:'basico',        description:'Fortes para nos fazer correr e pular.',                                                                       x:43, y:74 },
  { id:'coxas',      label:'Coxas',          difficulty:'intermediario', description:'A parte de cima das nossas pernas.',                                                                          x:43, y:65 },
  { id:'joelho',     label:'Joelho',         difficulty:'intermediario', description:'A dobrinha da perna.',                                                                                        x:43, y:81 },
  { id:'tornozelo',  label:'Tornozelo',      difficulty:'avancado',      description:'Perto do pé.',                                                                                               x:43, y:90 },
  { id:'pe',         label:'Pé',             difficulty:'basico',        description:'Nos leva para todos os lugares.',                                                                             x:43, y:95 },
  { id:'costas',     label:'Costas',         difficulty:'intermediario', description:'A parte de trás do corpo.',                                                               isBack:true,        x:50, y:36 },
  { id:'bum_bum',    label:'Bumbum',         difficulty:'basico',        description:'Parte de trás que usamos para sentar. É uma parte privada.', isPrivate:true, isBack:true,                   x:50, y:58 },
];

export const AAC_CATEGORIES = [
  { id:'basic', label:'Básico', icon:'💬', items:[
    { id:'sim', label:'Sim', icon:'✅' },
    { id:'nao', label:'Não', icon:'❌' },
    { id:'oi', label:'Oi', icon:'👋' },
    { id:'tchau', label:'Tchau', icon:'🙋' },
    { id:'por favor', label:'Por favor', icon:'🙏' },
    { id:'obrigado', label:'Obrigado', icon:'🤝' },
  ]},
  { id:'needs', label:'Necessidades', icon:'🆘', items:[
    { id:'agua', label:'Água', icon:'💧' },
    { id:'comida', label:'Comida', icon:'🍎' },
    { id:'banheiro', label:'Banheiro', icon:'🚽' },
    { id:'dor', label:'Dor', icon:'🤕' },
    { id:'ajuda', label:'Ajuda', icon:'🆘' },
    { id:'descansar', label:'Descansar', icon:'🛌' },
  ]},
  { id:'emotions', label:'Emoções', icon:'😊', items:[
    { id:'feliz', label:'Feliz', icon:'😊' },
    { id:'triste', label:'Triste', icon:'😢' },
    { id:'bravo', label:'Bravo', icon:'😠' },
    { id:'medo', label:'Medo', icon:'😨' },
    { id:'assustado', label:'Assustado', icon:'😱' },
    { id:'calmo', label:'Calmo', icon:'😌' },
  ]},
  { id:'actions', label:'Ações', icon:'🏃', items:[
    { id:'brincar', label:'Brincar', icon:'🧸' },
    { id:'estudar', label:'Estudar', icon:'📚' },
    { id:'ouvir', label:'Ouvir', icon:'👂' },
    { id:'ver', label:'Ver', icon:'👁️' },
    { id:'falar', label:'Falar', icon:'🗣️' },
    { id:'parar', label:'Parar', icon:'🛑' },
  ]},
  { id:'numbers', label:'Números', icon:'🔢', items:[
    { id:'1', label:'1', icon:'1️⃣' },
    { id:'2', label:'2', icon:'2️⃣' },
    { id:'3', label:'3', icon:'3️⃣' },
    { id:'4', label:'4', icon:'4️⃣' },
    { id:'5', label:'5', icon:'5️⃣' },
  ]}
];

export interface TouchLevel {
  id: string; label: string; color: string; bg: string; icon: string;
  description: string; examples: { text: string; icon: string }[];
}

export const TOUCH_LEVELS: TouchLevel[] = [
  {
    id:'verde', label:'Toque Seguro', color:'#52B788', bg:'#C7E8D6', icon:'🟢',
    description:'Toques carinhosos de pessoas que você conhece e confia.',
    examples:[
      { text:'Abraço da mamãe', icon:'🤗' },
      { text:'Beijo do papai', icon:'😘' },
      { text:'Dar as mãos', icon:'🤝' },
      { text:'Carinho no cabelo', icon:'💆' },
    ]
  },
  {
    id:'amarelo', label:'Perguntar Antes', color:'#E9C46A', bg:'#FAF0C4', icon:'🟡',
    description:'Alguns toques precisam de permissão. Sempre pergunte!',
    examples:[
      { text:'Cócegas', icon:'😂' },
      { text:'Sentar no colo', icon:'🪑' },
      { text:'Fotos', icon:'📸' },
      { text:'Massagem', icon:'🙌' },
    ]
  },
  {
    id:'vermelho', label:'Não Pode!', color:'#E76F51', bg:'#FADDD5', icon:'🔴',
    description:'Esses toques nunca são permitidos. Você pode dizer NÃO!',
    examples:[
      { text:'Partes privadas', icon:'🔒' },
      { text:'Guardar segredo ruim', icon:'🤫' },
      { text:'Toque que machuca', icon:'❌' },
      { text:'Toque que incomoda', icon:'😣' },
    ]
  },
];

export interface Story {
  id: number; title: string; icon: string;
  scenes: {
    text: string; speaker?: string; emoji?: string;
    question?: string;
    options?: { text: string; correct: boolean; feedback: string; emoji: string }[];
  }[];
}

export const STORIES: Story[] = [
  {
    id:1, title:'O Abraço de João', icon:'🤗',
    scenes:[
      { text:'João está brincando no parque com seu carrinho favorito.', emoji:'🚗', speaker:'Narrador' },
      { text:'Um amigo chega correndo e dá um abraço muito apertado em João, sem perguntar.', emoji:'😣', speaker:'Narrador' },
      { text:'João sentiu o coração acelerado e não gostou do abraço.', emoji:'💗', speaker:'Narrador' },
      {
        text:'João pode dizer que não queria o abraço?',
        question:'O que João pode fazer?',
        options:[
          { text:'Sim! João pode dizer "Não quero abraço agora."', correct:true, feedback:'Isso mesmo! Todo mundo pode dizer não para um toque.', emoji:'✅' },
          { text:'Não, João tem que aceitar para não ser mal-educado.', correct:false, feedback:'Não! Nosso corpo é nosso. Podemos sempre dizer não.', emoji:'❌' },
        ]
      },
      { text:'João disse: "Não quero abraço agora, mas podemos brincar juntos!"', emoji:'😊', speaker:'João' },
    ]
  },
  {
    id:2, title:'O Segredo Estranho', icon:'🤫',
    scenes:[
      { text:'Ana estava brincando quando um adulto disse para ela guardar um segredo.', emoji:'🤔', speaker:'Narrador' },
      { text:'O segredo fez Ana sentir a barriga estranha e vontade de chorar.', emoji:'😕', speaker:'Narrador' },
      {
        text:'O que Ana deve fazer com um segredo que deixa ela mal?',
        question:'Ana deve guardar esse segredo?',
        options:[
          { text:'Contar para um adulto seguro (mamãe, papai, professora)', correct:true, feedback:'Muito bem! Segredos que nos fazem sentir mal devem ser contados!', emoji:'✅' },
          { text:'Guardar o segredo sem contar para ninguém.', correct:false, feedback:'Não! Segredos que incomodam devem sempre ser contados.', emoji:'❌' },
        ]
      },
      { text:'Ana contou para a mamãe. A mamãe ficou feliz que Ana falou e a abraçou com carinho.', emoji:'💕', speaker:'Narrador' },
    ]
  },
  {
    id:3, title:'O Espaço de Maria', icon:'⭕',
    scenes:[
      { text:'Maria tem um círculo invisível ao redor dela. É o espaço pessoal dela!', emoji:'⭕', speaker:'Narrador' },
      { text:'Na escola, um colega fica muito perto de Maria e ela se sente desconfortável.', emoji:'😟', speaker:'Narrador' },
      {
        text:'O que Maria pode fazer?',
        question:'Como Maria pode se sentir melhor?',
        options:[
          { text:'Pedir educadamente: "Por favor, você pode dar um espaço?"', correct:true, feedback:'Perfeito! Podemos pedir nosso espaço de forma gentil.', emoji:'✅' },
          { text:'Ficar calada e aguentar o desconforto.', correct:false, feedback:'Não! Maria tem o direito de pedir seu espaço.', emoji:'❌' },
        ]
      },
      { text:'Maria falou com calma e seu colega entendeu. Os dois continuaram amigos!', emoji:'😊', speaker:'Narrador' },
    ]
  },
];

export interface Emotion {
  id: string; label: string; icon: string; color: string; bg: string;
  signals: string[]; tip: string;
}

export const EMOTIONS: Emotion[] = [
  { id:'alegria', label:'Alegria', icon:'😄', color:'#E9C46A', bg:'#FAF0C4', signals:['Sorriso no rosto','Energia no corpo','Vontade de brincar','Coração quentinho'], tip:'A alegria é um presente! Compartilhe com quem você ama.' },
  { id:'medo', label:'Medo', icon:'😨', color:'#8B7EBE', bg:'#DDD8F0', signals:['Coração acelerado','Frio na barriga','Vontade de fugir','Pernas bambas'], tip:'Sinto medo às vezes. Posso contar para um adulto seguro!' },
  { id:'tristeza', label:'Tristeza', icon:'😢', color:'#457B9D', bg:'#C8DCEA', signals:['Vontade de chorar','Corpo pesado','Cabeça abaixada','Saudade'], tip:'Tudo bem sentir tristeza. Um abraço pode ajudar!' },
  { id:'raiva', label:'Raiva', icon:'😡', color:'#E76F51', bg:'#FADDD5', signals:['Calor no rosto','Punhos fechados','Respiração rápida','Vontade de gritar'], tip:'Quando sinto raiva, respiro fundo 3 vezes.' },
  { id:'nervoso', label:'Nervoso', icon:'😰', color:'#F4A261', bg:'#FDDCBE', signals:['Mãos suadas','Barriga estranha','Quero fugir','Fico inquieto'], tip:'Nervosismo avisa que algo é importante para mim.' },
  { id:'calma', label:'Calma', icon:'😌', color:'#52B788', bg:'#C7E8D6', signals:['Respiração lenta','Corpo relaxado','Pensamentos claros','Sorriso suave'], tip:'A calma me ajuda a pensar melhor.' },
  { id:'surpresa', label:'Surpresa', icon:'😲', color:'#2A9D8F', bg:'#A8D5CF', signals:['Olhos abertos','Boca aberta','Coração pulando','Uau!'], tip:'Surpresas podem ser boas ou ruins. Tudo bem!' },
  { id:'desconforto', label:'Desconforto', icon:'😣', color:'#E76F51', bg:'#FADDD5', signals:['Barriga estranha','Quero sair','Não gosto disso','Tensão no corpo'], tip:'Desconforto avisa: algo não está certo. Pode pedir ajuda!' },
];

export interface Helper { 
  id: string; label: string; icon: string; desc: string; 
  allowedTouch: string; approach: string;
}

export const HELPERS: Helper[] = [
  { 
    id:'mae', label:'Mamãe', icon:'👩', 
    desc:'Minha mãe me ama e me protege.',
    allowedTouch:'Pode tocar em quase todo o corpo para carinho. Partes íntimas apenas para limpeza e saúde.',
    approach:'Sempre avisa antes de dar banho ou ajudar a trocar de roupa.'
  },
  { 
    id:'pai', label:'Papai', icon:'👨', 
    desc:'Meu pai está sempre aqui.',
    allowedTouch:'Pode tocar em quase todo o corpo para carinho. Partes íntimas apenas para limpeza e saúde.',
    approach:'Respeita quando eu digo que quero me trocar sozinho.'
  },
  { 
    id:'vovo', label:'Vovó/Vovô', icon:'👵', 
    desc:'Meus avós me cuidam muito.',
    allowedTouch:'Abraços, beijos no rosto e mãos dadas.',
    approach:'Pede permissão antes de dar um abraço muito apertado.'
  },
  { 
    id:'professora', label:'Professora', icon:'👩‍🏫', 
    desc:'Na escola, ela pode ajudar.',
    allowedTouch:'Mãos dadas, ombro ou cabeça para orientação.',
    approach:'Mantém uma distância respeitosa e fala calmamente.'
  },
  { 
    id:'to', label:'Minha TO', icon:'👩‍⚕️', 
    desc:'A terapeuta é minha amiga segura.',
    allowedTouch:'Pode tocar em braços e pernas para exercícios. Partes íntimas nunca durante a sessão.',
    approach:'Explica cada movimento que vamos fazer juntos.'
  },
  { 
    id:'medico', label:'Médico', icon:'👨‍⚕️', 
    desc:'O médico cuida da minha saúde.',
    allowedTouch:'Pode examinar qualquer parte do corpo para saúde, sempre com você e um responsável junto.',
    approach:'Usa luvas, explica o que vai fazer e pede permissão.'
  },
  { 
    id:'tio', label:'Tio/Tia', icon:'🧑‍🦰', 
    desc:'Meus tios que eu confio.',
    allowedTouch:'Abraços e beijos no rosto.',
    approach:'Respeitam se eu não quiser dar um abraço agora.'
  },
  { 
    id:'cuidador', label:'Cuidador(a)', icon:'🧑‍🍼', 
    desc:'Pessoa que me ajuda no dia a dia.',
    allowedTouch:'Ajudar no banho e troca de roupa (higiene).',
    approach:'Sempre explica o que vai fazer antes de tocar.'
  },
  { 
    id:'amigo_familia', label:'Amigo da Família', icon:'🧑‍🤝‍🧑', 
    desc:'Pessoas que visitam minha casa.',
    allowedTouch:'Um "toca aqui" 👋 ou aceno.',
    approach:'Mantêm uma distância respeitosa e são gentis.'
  },
];

export const AFFIRMATIONS = [
  'Seu corpo é seu. Você decide!',
  'Você pode dizer NÃO quando quiser.',
  'Adultos seguros sempre escutam você.',
  'Seu espaço é importante e merece respeito.',
  'Se algo incomodar, você pode pedir ajuda.',
  'Você é incrível e merece se sentir seguro.',
  'Seus sentimentos são importantes.',
  'Seu corpo merece cuidado e respeito.',
];
