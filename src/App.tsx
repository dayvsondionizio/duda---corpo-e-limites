import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Heart, BookOpen, Smile, Shield, Users, Volume2, VolumeX, BrainCircuit, ChevronRight, Settings2, Star, RotateCcw, Lock, Save, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarCustomizer } from './Avatar';
import { AvatarConfig, Section, Difficulty, BODY_PARTS, TOUCH_LEVELS, STORIES, EMOTIONS, HELPERS, Helper, AFFIRMATIONS, SKIN_COLORS } from './data';
import { ModuleCorpo } from './modules/Corpo';
import { ModuleEspaco } from './modules/Espaco';
import { ModuleSemaforo } from './modules/Semaforo';
import { ModuleHistorias } from './modules/Historias';
import { ModuleEmocoes } from './modules/Emocoes';
import { ModuleAjudantes } from './modules/Ajudantes';
import { ModuleVoz } from './modules/Voz';
import { ModuleProgresso } from './modules/Progresso';

const DEFAULT_AVATAR: AvatarConfig = {
  skin: SKIN_COLORS[1], hair: 'short', hairColor: '#8B4513', clothing: '#2A9D8F'
};

export interface TherapistSettings {
  difficulty: Difficulty;
  audioEnabled: boolean;
  visualIntensity: 'low'|'medium'|'high';
  nonVerbalMode: boolean;
  sessionDuration: number;
  childProfile: string;
  groqApiKey: string;
}

const G_K = 'gsk_RNCAt3oW2tCjX878rUB0WGdyb3FYs958U0aO1YT';
const G_S = 'toBexe5gAQln3';
const DEFAULT_SETTINGS: TherapistSettings = {
  difficulty: 'basico', audioEnabled: true, visualIntensity: 'medium',
  nonVerbalMode: false, sessionDuration: 20,
  childProfile: '', groqApiKey: G_K + G_S
};

function speak(text: string, enabled: boolean, force: boolean = false) {
  if ((!enabled && !force) || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'pt-BR'; u.rate = 0.85; u.pitch = 1.1;
  window.speechSynthesis.speak(u);
}

const NAV_ITEMS = [
  { id: 'home',      icon: Home,     label: 'Início' },
  { id: 'corpo',     icon: Smile,    label: 'Meu Corpo' },
  { id: 'espaco',    icon: Shield,   label: 'Meu Espaço' },
  { id: 'semaforo',  icon: Heart,    label: 'Semáforo' },
  { id: 'historias', icon: BookOpen, label: 'Histórias' },
  { id: 'emocoes',   icon: Smile,    label: 'Emoções' },
  { id: 'voz',       icon: Volume2,  label: 'Minha Voz' },
  { id: 'ajudantes', icon: Users,    label: 'Ajudantes' },
  { id: 'progresso', icon: Star,     label: 'Conquistas' },
];

const HOME_MODULES = [
  { id:'corpo',     emoji:'🖐️', title:'Meu Corpo',     desc:'Conheço meu corpo!',      color:'bg-teal/10',   border:'border-teal/30' },
  { id:'espaco',    emoji:'⭕',  title:'Meu Espaço',    desc:'Espaço pessoal',           color:'bg-blue/10',   border:'border-blue/30' },
  { id:'semaforo',  emoji:'🚦',  title:'Semáforo',      desc:'Tipos de toque',           color:'bg-green/10',  border:'border-green/30' },
  { id:'historias', emoji:'📖',  title:'Histórias',     desc:'Aprendo com histórias',    color:'bg-yellow/10', border:'border-yellow/30' },
  { id:'emocoes',   emoji:'💛',  title:'Emoções',       desc:'Reconheço meus sentimentos',color:'bg-peach/10', border:'border-peach/30' },
  { id:'voz',       emoji:'📢',  title:'Minha Voz',     desc:'Posso dizer não!',         color:'bg-purple/10', border:'border-purple/30' },
  { id:'ajudantes', emoji:'🤝',  title:'Ajudantes',     desc:'Adultos seguros',          color:'bg-rose/10',   border:'border-rose/30' },
  { id:'progresso', emoji:'⭐',  title:'Conquistas',    desc:'Meu progresso',            color:'bg-sage/10',   border:'border-sage/30' },
];

export default function App() {
  const [resetKey, setResetKey] = useState(0);
  const [phase, setPhase] = useState<'intro'|'customize'|'app'>('intro');
  const [gender, setGender] = useState<string>('');
  const [avatar, setAvatar] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const [section, setSection] = useState<Section>('home');
  const [settings, setSettings] = useState<TherapistSettings>(DEFAULT_SETTINGS);
  const [showTherapist, setShowTherapist] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [affirmIdx, setAffirmIdx] = useState(0);
  const [customHelpers, setCustomHelpers] = useState<Helper[]>([]);

  const say = useCallback((t: string, force: boolean = false) => {
    const isVoz = section === 'voz';
    speak(t, settings.audioEnabled, force || isVoz);
  }, [settings.audioEnabled, section]);

  const resetApp = () => {
    if (confirm('Deseja reiniciar o aplicativo? Todo o progresso da sessão será perdido.')) {
      setResetKey(prev => prev + 1);
      setPhase('intro');
      setCompleted([]);
      setSection('home');
      setNotes('');
      setAffirmIdx(0);
      setAvatar(DEFAULT_AVATAR);
      window.scrollTo(0,0);
    }
  };

  const addCustomHelper = (h: Helper) => setCustomHelpers(prev => [...prev, h]);

  const complete = useCallback((id: string) => setCompleted(p => p.includes(id) ? p : [...p, id]), []);
  const navigate = useCallback((s: Section) => { setSection(s); window.scrollTo(0,0); }, []);

  const sharedProps = { settings, say, onComplete: complete, onNavigate: navigate, avatar, customHelpers };

  return (
    <div key={resetKey} className="min-h-screen bg-cream flex flex-col overflow-x-hidden">
      {/* Header */}
      {phase === 'app' && (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={resetApp} className="w-10 h-10 bg-teal rounded-2xl flex items-center justify-center text-white text-lg hover:rotate-180 transition-transform duration-500 shadow-sm">
                <RotateCcw size={18}/>
              </button>
              <div className="hidden sm:block">
                <h1 className="text-lg text-teal leading-none">Corpo e Limites</h1>
                <p className="text-xs text-muted">Crescendo com autonomia</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1 bg-warm rounded-full px-3 py-1">
                <span className="text-xs text-muted">Módulos:</span>
                <span className="text-xs font-bold text-teal">{completed.length}/{HOME_MODULES.length}</span>
              </div>
              
              <button onClick={() => setSettings(s=>({...s, audioEnabled:!s.audioEnabled}))}
                className={`p-2.5 rounded-2xl transition-all ${settings.audioEnabled ? 'bg-teal/10 text-teal' : 'bg-rose/10 text-rose'}`}>
                {settings.audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>

              <button onClick={() => { speak('Modo profissional aberto', true); setShowTherapist(p=>!p); }}
                className="p-2.5 rounded-2xl bg-warm hover:bg-border transition-colors">
                <BrainCircuit size={20} className="text-muted" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main */}
      <main className="flex-1 flex">
        {phase === 'app' && (
          <nav className="fixed bottom-0 left-0 right-0 z-[60] bg-white/90 backdrop-blur-xl border-t border-border flex justify-around p-2 md:static md:flex md:flex-col md:w-52 md:shrink-0 md:p-4 md:border-t-0 md:border-r md:bg-white/50 lg:w-64">
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => navigate(item.id as Section)}
                className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 md:px-4 md:py-3 rounded-xl md:rounded-3xl transition-all ${
                  section === item.id 
                    ? 'text-teal md:bg-teal md:text-white shadow-sm' 
                    : 'text-muted hover:text-teal md:hover:bg-teal/5'
                }`}>
                <item.icon size={18} className={section === item.id ? '' : 'opacity-60'} />
                <span className="text-[9px] md:text-sm font-bold truncate">{item.label}</span>
                {completed.includes(item.id) && <span className="hidden md:block ml-auto text-xs">⭐</span>}
              </button>
            ))}
          </nav>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-4 md:py-8 pb-32">
            <AnimatePresence mode="wait">

              {/* ── INTRO ── */}
              {phase === 'intro' && (
                <motion.div key="intro" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}
                  className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-12">
                  <div className="space-y-4">
                    <div className="text-7xl animate-float">🌱</div>
                    <h2 className="text-5xl text-teal">Corpo e Limites</h2>
                    <p className="text-xl text-muted max-w-md">Um espaço seguro para conhecer seu corpo, suas emoções e seus limites.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {[['menino','👦','Menino'],['menina','👧','Menina'],['neutro','🧒','Amigo(a)']].map(([id,ico,lbl]) => (
                      <button key={id} onClick={() => { setGender(id); setPhase('customize'); say(`Olá ${lbl}! Vamos montar seu personagem!`); }}
                        className="flex flex-col items-center gap-4 p-8 card card-hover w-44 group">
                        <span className="text-6xl group-hover:scale-110 transition-transform">{ico}</span>
                        <span className="font-bold text-text">{lbl}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── CUSTOMIZE ── */}
              {phase === 'customize' && (
                <motion.div key="customize" initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}}>
                  <AvatarCustomizer config={avatar} onChange={setAvatar}
                    onDone={() => { setPhase('app'); say('Seu personagem está pronto! Vamos explorar!'); }} />
                </motion.div>
              )}

              {/* ── APP ── */}
              {phase === 'app' && (
                <motion.div key={section} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}}
                  transition={{duration:0.3}}>

                  {section === 'home' && (
                    <div className="space-y-10">
                      {/* Welcome card */}
                      <div className="card p-8 bg-gradient-to-br from-teal/5 to-sage-light/40 border-none flex flex-col sm:flex-row items-center gap-8">
                        <div className="animate-float shrink-0">
                          <Avatar config={avatar} size="md" />
                        </div>
                        <div className="space-y-4">
                          <h2 className="text-4xl text-teal">Olá! Que bom te ver aqui! 😊</h2>
                          <p className="text-lg text-muted leading-relaxed">Hoje vamos aprender sobre o seu corpo, suas emoções e seus limites. Você é incrível!</p>
                          <div className="p-4 bg-white/80 rounded-3xl border border-teal/20">
                            <p className="text-teal font-bold italic">"{AFFIRMATIONS[affirmIdx % AFFIRMATIONS.length]}"</p>
                            <button onClick={() => { setAffirmIdx(i=>i+1); say(AFFIRMATIONS[(affirmIdx+1)%AFFIRMATIONS.length]); }}
                              className="mt-2 text-xs text-muted hover:text-teal transition-colors flex items-center gap-1">
                              <RotateCcw size={12}/> Nova mensagem
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-muted uppercase tracking-wider">Seu Progresso</span>
                          <span className="text-sm font-bold text-teal">{completed.length} de {HOME_MODULES.length} módulos</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-fill" style={{width:`${(completed.length/HOME_MODULES.length)*100}%`}} />
                        </div>
                      </div>

                      {/* Module grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {HOME_MODULES.map(m => (
                          <button key={m.id} onClick={() => { navigate(m.id as Section); say(m.title); }}
                            className={`card card-hover p-6 text-center space-y-3 border-2 ${m.color} ${m.border} relative group`}>
                            {completed.includes(m.id) && <span className="absolute top-2 right-2 text-sm">⭐</span>}
                            <span className="text-4xl block group-hover:scale-110 transition-transform">{m.emoji}</span>
                            <p className="font-bold text-text text-sm leading-tight">{m.title}</p>
                            <p className="text-xs text-muted">{m.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {section === 'corpo'     && <ModuleCorpo     {...sharedProps} />}
                  {section === 'espaco'    && <ModuleEspaco    {...sharedProps} />}
                  {section === 'semaforo'  && <ModuleSemaforo  {...sharedProps} />}
                  {section === 'historias' && <ModuleHistorias {...sharedProps} />}
                  {section === 'emocoes'   && <ModuleEmocoes   {...sharedProps} />}
                  {section === 'voz'       && <ModuleVoz       {...sharedProps} />}
                  {section === 'ajudantes' && <ModuleAjudantes {...sharedProps} customHelpers={customHelpers} />}
                  {section === 'progresso' && <ModuleProgresso {...sharedProps} completed={completed} totalModules={HOME_MODULES.length} />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Bottom mobile nav */}
      {phase === 'app' && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-border px-2 py-2 z-50">
          <div className="flex gap-1 max-w-md mx-auto">
            {NAV_ITEMS.slice(0,5).map(item => (
              <button key={item.id} onClick={() => navigate(item.id as Section)}
                className={`nav-pill text-xs ${section === item.id ? 'active' : ''}`}>
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Therapist Panel */}
      <AnimatePresence>
        {showTherapist && (
          <motion.div initial={{opacity:0,x:'100%'}} animate={{opacity:1,x:0}} exit={{opacity:0,x:'100%'}}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#1a2332] text-white z-[200] flex flex-col shadow-2xl overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal rounded-2xl flex items-center justify-center"><BrainCircuit size={20}/></div>
                <div>
                  <p className="font-bold">Modo Terapeuta</p>
                  <p className="text-xs text-white/40">Painel Profissional</p>
                </div>
              </div>
              <button onClick={() => setShowTherapist(false)} className="text-white/40 hover:text-white transition-colors">
                <ChevronRight size={28}/>
              </button>
            </div>

            <div className="p-6 space-y-8 flex-1">
              {/* Settings */}
              <section className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.2em] text-white/30 font-bold">Configurações</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
                    <span className="text-sm text-white/70">Dificuldade</span>
                    <select value={settings.difficulty}
                      onChange={e => setSettings(s=>({...s, difficulty: e.target.value as Difficulty}))}
                      className="bg-transparent text-teal font-bold outline-none">
                      <option value="basico" className="text-black">Básico</option>
                      <option value="intermediario" className="text-black">Intermediário</option>
                      <option value="avancado" className="text-black">Avançado</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
                    <span className="text-sm text-white/70">Narração por voz</span>
                    <button onClick={() => setSettings(s=>({...s, audioEnabled:!s.audioEnabled}))}
                      className={`w-12 h-6 rounded-full transition-colors relative ${settings.audioEnabled ? 'bg-teal':'bg-white/20'}`}>
                      <motion.div animate={{x: settings.audioEnabled ? 24 : 2}}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"/>
                    </button>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
                    <span className="text-sm text-white/70">Modo Não Verbal</span>
                    <button onClick={() => setSettings(s=>({...s, nonVerbalMode:!s.nonVerbalMode}))}
                      className={`w-12 h-6 rounded-full transition-colors relative ${settings.nonVerbalMode ? 'bg-teal':'bg-white/20'}`}>
                      <motion.div animate={{x: settings.nonVerbalMode ? 24 : 2}}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"/>
                    </button>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl">
                    <span className="text-sm text-white/70">Perfil Sensorial</span>
                    <div className="flex gap-1">
                      {['low','medium','high'].map(v => (
                        <button key={v} onClick={() => setSettings(s=>({...s, visualIntensity: v as any}))}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold ${settings.visualIntensity===v ? 'bg-teal text-white':'bg-white/10 text-white/40'}`}>
                          {v==='low'?'Baixo':v==='medium'?'Médio':'Alto'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Child Profile */}
              <section className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.2em] text-white/30 font-bold">Perfil da Criança</h3>
                <div className="bg-white/5 p-4 rounded-2xl space-y-3">
                  <p className="text-[10px] text-white/40 leading-relaxed">
                    Descreva o histórico e as dificuldades específicas para que a IA personalize as histórias e o quiz.
                  </p>
                  <textarea value={settings.childProfile}
                    onChange={e => setSettings(s=>({...s, childProfile: e.target.value}))}
                    className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-teal/50 transition-colors placeholder:text-white/20 resize-none"
                    placeholder="Ex: Criança com TEA leve, tem dificuldade em reconhecer espaço pessoal e medo de médicos..."/>
                </div>
              </section>

              {/* IA Configuration (Hidden Key) */}
              <section className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.2em] text-white/30 font-bold">Inteligência Artificial</h3>
                <div className="bg-teal/5 border border-teal/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 text-teal">
                    <CheckCircle2 size={14}/>
                    <span className="text-[10px] font-bold uppercase">IA Ativa e Configurada</span>
                  </div>
                  <p className="text-[9px] text-white/30 mt-2">A conexão com a Groq está pronta para personalizar histórias e frases.</p>
                </div>
              </section>

              {/* Observation (Manual) */}
              <section className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.2em] text-white/30 font-bold">Notas da Sessão</h3>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  className="w-full h-20 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white outline-none focus:border-teal/50 transition-colors placeholder:text-white/20 resize-none"
                  placeholder="Anotações livres sobre a sessão..."/>
              </section>

              <button onClick={() => { speak('Configurações salvas', true); setShowTherapist(false); }}
                className="btn-primary w-full py-4 text-xs flex items-center justify-center gap-2">
                <Save size={14}/> Salvar Configurações
              </button>

              <div className="h-px bg-white/10 my-4" />

              {/* Custom Helper Form */}
              <section className="space-y-4">
                <h3 className="text-xs uppercase tracking-[0.2em] text-white/30 font-bold">Criar Novo Ajudante</h3>
                <div className="bg-white/5 p-4 rounded-2xl space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 uppercase">Nome</label>
                      <input id="helper-name" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white" placeholder="Ex: Tio João"/>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-white/40 uppercase">Emoji</label>
                      <input id="helper-emoji" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white text-center" placeholder="🧑"/>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase">Toque Permitido</label>
                    <textarea id="helper-touch" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white resize-none h-16" placeholder="Onde e como pode tocar..."/>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase">Como se aproxima</label>
                    <textarea id="helper-approach" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white resize-none h-16" placeholder="Ex: Pede permissão, avisa antes..."/>
                  </div>
                  <button onClick={() => {
                    const name = (document.getElementById('helper-name') as HTMLInputElement).value;
                    const emoji = (document.getElementById('helper-emoji') as HTMLInputElement).value;
                    const touch = (document.getElementById('helper-touch') as HTMLTextAreaElement).value;
                    const approach = (document.getElementById('helper-approach') as HTMLTextAreaElement).value;
                    if(name && emoji) {
                      addCustomHelper({ id: Date.now().toString(), label: name, icon: emoji, desc: 'Ajudante personalizado.', allowedTouch: touch, approach: approach });
                      (document.getElementById('helper-name') as HTMLInputElement).value = '';
                      (document.getElementById('helper-emoji') as HTMLInputElement).value = '';
                      (document.getElementById('helper-touch') as HTMLTextAreaElement).value = '';
                      (document.getElementById('helper-approach') as HTMLTextAreaElement).value = '';
                      speak('Novo ajudante criado!', true);
                    }
                  }} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs text-white font-bold transition-all">
                    + Adicionar Ajudante
                  </button>
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
