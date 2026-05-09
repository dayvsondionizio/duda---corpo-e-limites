export type Section = 'home'|'corpo'|'espaco'|'semaforo'|'historias'|'emocoes'|'voz'|'ajudantes'|'progresso'|'terapeuta';
export type Difficulty = 'basico'|'intermediario'|'avancado';

export interface AvatarConfig {
  skin: string; hair: string; hairColor: string; clothing: string;
}

export const SKIN_COLORS = ['#FDDCB5','#F4C48A','#D4956A','#C07D50','#8D5524','#5C3317'];
export const HAIR_COLORS = ['#1a1a1a','#8B4513','#DAA520','#FF6B6B','#4A90D9','#FF69B4'];
export const CLOTHING_COLORS = ['#2A9D8F','#E76F51','#457B9D','#8B7EBE','#52B788','#E9C46A'];

export interface BodyPart {
  id: string; label: string; difficulty: Difficulty;
  description: string; isPrivate?: boolean;
  svgX: number; svgY: number;
}

export const BODY_PARTS: BodyPart[] = [
  { id:'cabeca', label:'Cabeça', difficulty:'basico', description:'Onde pensamos e sentimos o mundo.', svgX:100, svgY:45 },
  { id:'olho', label:'Olho', difficulty:'basico', description:'Para ver as cores do mundo.', svgX:100, svgY:65 },
  { id:'boca', label:'Boca', difficulty:'basico', description:'Para falar, sorrir e comer.', svgX:100, svgY:82 },
  { id:'braco', label:'Braço', difficulty:'basico', description:'Para brincar e dar abraços.', svgX:60, svgY:145 },
  { id:'mao', label:'Mão', difficulty:'basico', description:'Para fazer carinho e criar coisas.', svgX:38, svgY:190 },
  { id:'pe', label:'Pé', difficulty:'basico', description:'Nos leva para todos os lugares.', svgX:95, svgY:290 },
  { id:'ombro', label:'Ombro', difficulty:'intermediario', description:'Onde apoiamos nossa mochila.', svgX:65, svgY:115 },
  { id:'cotovelo', label:'Cotovelo', difficulty:'intermediario', description:'A dobrinha do braço.', svgX:55, svgY:162 },
  { id:'joelho', label:'Joelho', difficulty:'intermediario', description:'A dobrinha da perna.', svgX:90, svgY:250 },
  { id:'dedos', label:'Dedos', difficulty:'intermediario', description:'Pequenos ajudantes das mãos.', svgX:38, svgY:205 },
  { id:'costas', label:'Costas', difficulty:'intermediario', description:'A parte de trás do corpo.', svgX:145, svgY:155 },
  { id:'sobrancelha', label:'Sobrancelha', difficulty:'avancado', description:'Ficam em cima dos olhos.', svgX:100, svgY:58 },
  { id:'pulso', label:'Pulso', difficulty:'avancado', description:'Onde o relógio fica.', svgX:42, svgY:193 },
  { id:'tornozelo', label:'Tornozelo', difficulty:'avancado', description:'Perto do pé.', svgX:90, svgY:280 },
  { id:'cintura', label:'Cintura', difficulty:'avancado', description:'Onde seguramos a calça.', svgX:100, svgY:185 },
  { id:'zona_intima', label:'Partes Privadas', difficulty:'basico', description:'Ficam cobertas pela roupa de banho. São só suas!', isPrivate:true, svgX:100, svgY:200 },
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

export interface Helper { id: string; label: string; icon: string; desc: string; }

export const HELPERS: Helper[] = [
  { id:'mae', label:'Mamãe', icon:'👩', desc:'Minha mãe me ama e me protege.' },
  { id:'pai', label:'Papai', icon:'👨', desc:'Meu pai está sempre aqui.' },
  { id:'vovo', label:'Vovó/Vovô', icon:'👵', desc:'Meus avós me cuidam muito.' },
  { id:'professora', label:'Professora', icon:'👩‍🏫', desc:'Na escola, ela pode ajudar.' },
  { id:'to', label:'Minha TO', icon:'👩‍⚕️', desc:'A terapeuta é minha amiga segura.' },
  { id:'medico', label:'Médico', icon:'👨‍⚕️', desc:'O médico cuida da minha saúde.' },
  { id:'irmao', label:'Irmão/Irmã', icon:'🧑', desc:'Meu irmão ou irmã me ajuda.' },
  { id:'policia', label:'Polícia', icon:'👮', desc:'A polícia protege as crianças.' },
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
