import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Heart, BookOpen, Smile, Shield, Users, Volume2, VolumeX, BrainCircuit, ChevronRight, Settings2, Star, RotateCcw, Lock, Save, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarCustomizer } from './Avatar';
import { AvatarConfig, Section, Difficulty, BODY_PARTS, TOUCH_LEVELS, STORIES, EMOTIONS, HELPERS, Helper, AFFIRMATIONS, DEFAULT_AVATAR, HELP_EMOJIS } from './data';
import { ModuleCorpo } from './modules/Corpo';
import { ModuleEspaco } from './modules/Espaco';
import { ModuleSemaforo } from './modules/Semaforo';
import { ModuleHistorias } from './modules/Historias';
import { ModuleEmocoes } from './modules/Emocoes';
import { ModuleAjudantes } from './modules/Ajudantes';
import { ModuleVoz } from './modules/Voz';
import { ModuleProgresso } from './modules/Progresso';
import { ModulePrancha } from './modules/Prancha';

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

function speak(text: string, enabled: boolean, gender: string, force: boolean = false) {
  if ((!enabled && !force) || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'pt-BR'; 
  u.rate = 0.9;
  u.pitch = gender === 'menina' ? 1.35 : (gender === 'menino' ? 1.15 : 1.25);
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
  const [phase, setPhase] = useState<'setup'|'intro'|'customize'|'app'|'hub'>('setup');
  const [activeSubApp, setActiveSubApp] = useState<'corpo_e_limites'|'prancha_simbolos'|null>(null);
  const [avatarCustomized, setAvatarCustomized] = useState(false);
  const [gender, setGender] = useState<string>('');
  const [avatar, setAvatar] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const [section, setSection] = useState<Section>('home');
  const [settings, setSettings] = useState<TherapistSettings>(DEFAULT_SETTINGS);
  const [completed, setCompleted] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [affirmIdx, setAffirmIdx] = useState(0);
  const [customHelpers, setCustomHelpers] = useState<Helper[]>([]);

  const say = useCallback((t: string, force: boolean = false) => {
    speak(t, settings.audioEnabled, gender, force);
  }, [settings.audioEnabled, gender]);

  const resetApp = () => {
    if (confirm('Deseja reiniciar o aplicativo? Todo o progresso da sessão será perdido.')) {
      setResetKey(prev => prev + 1);
      setPhase('setup');
      setActiveSubApp(null);
      setAvatarCustomized(false);
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
    <div key={resetKey} className="min-h-screen flex flex-col bg-cream font-sans text-text selection:bg-teal/20 selection:text-teal-dark overflow-x-hidden relative">
      
      {/* Ambient mesh background shapes */}
      <div className="bg-glow-container">
        <div className="bg-glow-1" />
        <div className="bg-glow-2" />
        <div className="bg-glow-3" />
      </div>

      {/* Header (Only in App phase) */}
      {phase === 'app' && (
        <header className="sticky top-0 z-[70] bg-white/70 backdrop-blur-md border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)]">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => { if (activeSubApp === 'corpo_e_limites') setSection('home'); }}
                disabled={activeSubApp !== 'corpo_e_limites'}
                className={`w-10 h-10 bg-gradient-to-br from-teal to-teal-dark rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal/25 transition-transform ${activeSubApp === 'corpo_e_limites' ? 'hover:scale-105 active:scale-95 cursor-pointer' : 'opacity-80'}`}>
                <Heart size={18} fill="currentColor" />
              </button>
              <div>
                <h1 className="text-base font-extrabold bg-gradient-to-r from-teal via-teal-dark to-blue bg-clip-text text-transparent leading-none tracking-tight">
                  {activeSubApp === 'prancha_simbolos' ? 'Prancha de Símbolos' : 'Corpo e Limites'}
                </h1>
                <p className="text-[10px] text-muted uppercase tracking-widest font-black mt-1">
                  {activeSubApp === 'prancha_simbolos' ? 'Comunicação Alternativa (AAC)' : 'Crescendo com Autonomia'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activeSubApp === 'corpo_e_limites' && (
                <div className="hidden md:flex items-center gap-2 bg-teal/10 border border-teal/20 rounded-full px-4 py-1.5">
                  <div className="w-2 h-2 bg-teal rounded-full animate-pulse" />
                  <span className="text-xs text-muted">Módulos:</span>
                  <span className="text-xs font-extrabold text-teal">{completed.length}/{HOME_MODULES.length}</span>
                </div>
              )}
              
              <button onClick={() => { setActiveSubApp(null); setPhase('hub'); say('Voltando ao painel principal.'); }}
                className="px-3.5 py-2 bg-warm hover:bg-teal/15 text-muted hover:text-teal border border-border/80 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm">
                Voltar ao HUB
              </button>

              <button onClick={() => setSettings(s=>({...s, audioEnabled:!s.audioEnabled}))}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer ${settings.audioEnabled ? 'bg-teal/10 border-teal/20 text-teal' : 'bg-rose/10 border-rose/20 text-rose'}`}>
                {settings.audioEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 flex">
        {phase === 'app' && activeSubApp === 'corpo_e_limites' && (
          <nav className="fixed bottom-4 left-4 right-4 md:bottom-auto md:left-auto md:right-auto z-[60] bg-white/80 backdrop-blur-xl border border-white/60 flex justify-around p-2.5 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] md:static md:flex md:flex-col md:w-52 md:shrink-0 md:p-4 md:border-t-0 md:border-r md:bg-white/50 lg:w-64 md:rounded-none md:shadow-none md:border-none">
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => navigate(item.id as Section)}
                className={`nav-pill ${section === item.id ? 'active' : ''}`}>
                <item.icon size={20} />
                <span className="text-[10px] font-bold hidden md:block">{item.label}</span>
              </button>
            ))}
            <div className="hidden md:block mt-auto pt-6 border-t border-border">
              <button onClick={resetApp} className="w-full flex items-center gap-2 p-3 text-muted hover:text-rose transition-colors text-xs font-bold uppercase tracking-widest cursor-pointer">
                <RotateCcw size={14} /> Reiniciar App
              </button>
            </div>
          </nav>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-4 md:py-8 pb-20 md:pb-8">
            <AnimatePresence mode="wait">

              {/* ── SETUP (Professional) ── */}
              {phase === 'setup' && (
                <motion.div key="setup" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                  className="max-w-2xl mx-auto space-y-8 py-12">
                  <div className="text-center space-y-2">
                    <div className="text-5xl">🧠</div>
                    <h2 className="text-3xl font-bold text-teal">Configuração da Sessão</h2>
                    <p className="text-muted">Terapeuta, configure os detalhes antes de começar com a criança.</p>
                  </div>

                  <div className="card p-8 space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    <section className="space-y-4">
                      <h3 className="text-sm font-bold text-teal uppercase tracking-widest flex items-center gap-2">
                        <Smile size={18}/> 1. Perfil da Criança
                      </h3>
                      <div className="space-y-2">
                        <p className="text-xs text-muted">Descreva as necessidades específicas para que a IA personalize a sessão.</p>
                        <textarea value={settings.childProfile} 
                          onChange={e => setSettings(s=>({...s, childProfile: e.target.value}))}
                          className="w-full h-32 p-4 rounded-2xl bg-warm/50 border border-border outline-none focus:border-teal transition-all text-sm"
                          placeholder="Ex: Criança de 6 anos com TEA leve, foco em limites corporais..."/>
                      </div>
                    </section>

                    <section className="space-y-4 border-t border-border pt-6">
                      <h3 className="text-sm font-bold text-teal uppercase tracking-widest flex items-center gap-2">
                        <Shield size={18}/> 2. Configurações Técnicas
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted uppercase">Dificuldade</label>
                          <select value={settings.difficulty} 
                            onChange={e => setSettings(s=>({...s, difficulty: e.target.value as Difficulty}))}
                            className="w-full p-3 rounded-xl bg-warm border border-border text-sm">
                            <option value="basico">Básico</option>
                            <option value="intermediario">Intermediário</option>
                            <option value="avancado">Avançado</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted uppercase">Voz do App</label>
                          <button onClick={() => { setSettings(s=>({...s, audioEnabled: !s.audioEnabled})); say(!settings.audioEnabled ? 'Áudio ligado' : 'Áudio desligado', true); }}
                            className={`w-full p-3 rounded-xl border-2 transition-all font-bold text-sm ${settings.audioEnabled ? 'border-teal bg-teal/5 text-teal' : 'border-rose/20 bg-rose/5 text-rose'}`}>
                            {settings.audioEnabled ? '🔊 Ligado' : '🔇 Desligado'}
                          </button>
                        </div>
                      </div>
                    </section>

                    <section className="space-y-4 border-t border-border pt-6">
                      <h3 className="text-sm font-bold text-teal uppercase tracking-widest flex items-center gap-2">
                        <Users size={18}/> 3. Ajudantes Personalizados
                      </h3>
                      <p className="text-xs text-muted">Adicione pessoas específicas que a criança deve reconhecer como seguras.</p>
                      
                      <div className="bg-warm/30 p-4 rounded-2xl space-y-4 border border-border">
                        <div className="grid grid-cols-2 gap-3">
                          <input id="setup-helper-name" className="w-full bg-white border border-border rounded-xl px-3 py-2 text-xs" placeholder="Nome (Ex: Tio João)"/>
                          <div className="flex items-center gap-2">
                            <span id="setup-emoji-display" className="text-xl">🧑</span>
                            <input type="hidden" id="setup-emoji-val" defaultValue="🧑" />
                          </div>
                        </div>
                        <div className="grid grid-cols-6 gap-2 p-2 bg-white/50 rounded-xl max-h-24 overflow-y-auto">
                          {HELP_EMOJIS.map(e => (
                            <button key={e} onClick={() => {
                              const display = document.getElementById('setup-emoji-display');
                              const input = document.getElementById('setup-emoji-val') as HTMLInputElement;
                              if(display && input) { display.innerText = e; input.value = e; }
                            }} className="text-lg hover:scale-125 transition-transform">{e}</button>
                          ))}
                        </div>
                        <div className="space-y-2">
                           <textarea id="setup-helper-touch" className="w-full bg-white border border-border rounded-xl p-2 text-xs resize-none h-12" placeholder="Toque permitido..."/>
                           <textarea id="setup-helper-approach" className="w-full bg-white border border-border rounded-xl p-2 text-xs resize-none h-12" placeholder="Como se aproxima..."/>
                        </div>
                        <button onClick={() => {
                          const nameEl = document.getElementById('setup-helper-name') as HTMLInputElement;
                          const emojiEl = document.getElementById('setup-emoji-val') as HTMLInputElement;
                          const touchEl = document.getElementById('setup-helper-touch') as HTMLTextAreaElement;
                          const approachEl = document.getElementById('setup-helper-approach') as HTMLTextAreaElement;
                          if(nameEl.value) {
                            addCustomHelper({ id: Date.now().toString(), label: nameEl.value, icon: emojiEl.value, desc: 'Ajudante personalizado.', allowedTouch: touchEl.value, approach: approachEl.value });
                            nameEl.value = ''; touchEl.value = ''; approachEl.value = '';
                            say('Ajudante adicionado!');
                          }
                        }} className="btn-primary w-full py-2 text-xs bg-teal/80">Adicionar Ajudante</button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {customHelpers.map(h => (
                          <div key={h.id} className="flex items-center gap-2 bg-white border border-teal/20 px-3 py-1.5 rounded-full text-xs font-bold text-teal shadow-sm">
                            <span>{h.icon}</span> <span>{h.label}</span>
                            <button onClick={() => setCustomHelpers(prev => prev.filter(x => x.id !== h.id))} className="text-rose hover:scale-110 transition-transform ml-1">✕</button>
                          </div>
                        ))}
                      </div>
                    </section>

                    <button onClick={() => {
                      if(!settings.childProfile) { alert('Por favor, descreva o perfil da criança primeiro.'); return; }
                      setPhase('hub');
                      say('Tudo pronto! Bem-vindo à central de atividades.');
                    }}
                      className="btn-primary w-full py-4 text-xl shadow-2xl shadow-teal/30">
                      Iniciar Sessão com a Criança 🚀
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── HUB SELECTION SCREEN ── */}
              {phase === 'hub' && (
                <motion.div key="hub" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}}
                  className="max-w-4xl mx-auto space-y-8 py-8 md:py-12">
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/40 pb-6">
                    <div className="text-center sm:text-left space-y-1">
                      <h2 className="text-4xl font-extrabold bg-gradient-to-r from-teal via-teal-dark to-blue bg-clip-text text-transparent tracking-tight">Central de Atividades 🧠</h2>
                      <p className="text-muted text-sm">Selecione uma ferramenta terapêutica para iniciar a sessão com a criança.</p>
                    </div>
                    <button onClick={() => setPhase('setup')}
                      className="px-4 py-2.5 bg-white border border-border hover:border-teal rounded-2xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all text-muted hover:text-teal cursor-pointer">
                      ⚙️ Ajustar Configurações
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {/* App 1 Card: Corpo e Limites */}
                    <motion.div 
                      whileHover={{ y: -8, scale: 1.01 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="card p-8 flex flex-col justify-between border-2 border-teal/15 hover:border-teal/40 hover:shadow-2xl relative overflow-hidden"
                    >
                      <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-teal/5 blur-xl pointer-events-none" />
                      <div className="space-y-5">
                        <div className="w-16 h-16 bg-teal/10 rounded-3xl flex items-center justify-center text-4xl shadow-sm">
                          🖐️
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-2xl font-extrabold text-teal tracking-tight">Corpo e Limites</h3>
                          <p className="text-muted text-sm leading-relaxed">
                            Um jogo educativo e interativo para aprender sobre segurança corporal, limites de toque e regras do espaço pessoal com um personagem personalizado.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {['Meu Corpo', 'Semáforo do Toque', 'Histórias', 'Emoções'].map(tag => (
                            <span key={tag} className="text-[10px] font-bold text-teal bg-teal/10 px-2.5 py-1 rounded-full">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setActiveSubApp('corpo_e_limites');
                          if (avatarCustomized) {
                            setPhase('app');
                          } else {
                            setPhase('intro');
                          }
                          say('Abrindo Corpo e Limites!');
                        }}
                        className="btn-primary w-full py-4 text-sm font-extrabold mt-8 shadow-lg shadow-teal/20"
                      >
                        Começar Atividade 🚀
                      </button>
                    </motion.div>

                    {/* App 2 Card: Prancha de Símbolos */}
                    <motion.div 
                      whileHover={{ y: -8, scale: 1.01 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="card p-8 flex flex-col justify-between border-2 border-purple/15 hover:border-purple/40 hover:shadow-2xl relative overflow-hidden"
                    >
                      <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-purple/5 blur-xl pointer-events-none" />
                      <div className="space-y-5">
                        <div className="w-16 h-16 bg-purple/10 rounded-3xl flex items-center justify-center text-4xl shadow-sm">
                          💬
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-2xl font-extrabold text-purple tracking-tight">Prancha de Símbolos</h3>
                          <p className="text-muted text-sm leading-relaxed">
                            Comunicação alternativa e ampliada (AAC). Permite à criança expressar suas emoções, desejos e necessidades imediatas combinando símbolos visuais e fala por voz.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {['Comunicação AAC', 'Voz Inteligente', 'Acesso Rápido', 'Personalizável'].map(tag => (
                            <span key={tag} className="text-[10px] font-bold text-purple bg-purple/10 px-2.5 py-1 rounded-full">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setActiveSubApp('prancha_simbolos');
                          setPhase('app');
                          say('Abrindo Prancha de Símbolos!');
                        }}
                        className="btn-primary w-full py-4 text-sm font-extrabold mt-8 shadow-lg shadow-teal/20"
                        style={{ background: 'linear-gradient(135deg, var(--color-purple) 0%, var(--color-purple-light) 100%)', boxShadow: '0 8px 22px -6px rgba(139, 126, 190, 0.4)' }}
                      >
                        Abrir Prancha 📢
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              )}

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
                    <button onClick={() => { setPhase('customize'); say('Vamos criar seu personagem!'); }}
                      className="btn-primary py-4 px-12 text-2xl shadow-xl hover:scale-105 transition-transform flex items-center gap-4">
                      Criar Personagem ✨ <span className="text-4xl">🎨</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── CUSTOMIZE ── */}
              {phase === 'customize' && (
                <motion.div key="customize" initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}}>
                  <AvatarCustomizer config={avatar} onChange={setAvatar}
                    onDone={() => { setAvatarCustomized(true); setPhase('app'); say('Seu personagem está pronto! Vamos explorar!'); }} />
                </motion.div>
              )}

              {/* ── APP ── */}
              {phase === 'app' && (
                <motion.div key={activeSubApp === 'prancha_simbolos' ? 'prancha' : section} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}}
                  transition={{duration:0.3}} className="w-full">

                  {activeSubApp === 'corpo_e_limites' && (
                    <>
                      {section === 'home' && (
                        <div className="space-y-8">
                          {/* Welcome card */}
                          <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-teal/10 via-sage-light/30 to-peach/10 border border-teal/15 p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-[0_12px_40px_-12px_rgba(42,157,143,0.15)]">
                            {/* Decorative circles */}
                            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-teal/5 blur-2xl pointer-events-none" />
                            <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-peach/8 blur-xl pointer-events-none" />

                            <div className="animate-float-slow shrink-0 relative z-10">
                              <Avatar config={avatar} size="md" />
                            </div>
                            <div className="space-y-4 relative z-10">
                              <h2 className="text-3xl md:text-4xl font-extrabold text-teal tracking-tight">Olá! Que bom te ver! 😊</h2>
                              <p className="text-muted leading-relaxed">Hoje vamos aprender sobre o seu corpo, suas emoções e seus limites. <strong className="text-text">Você é incrível!</strong></p>
                              <div className="p-4 bg-white/70 backdrop-blur rounded-3xl border border-teal/15 flex items-start gap-3">
                                <span className="text-2xl shrink-0">💬</span>
                                <div>
                                  <p className="text-teal font-bold italic text-sm leading-relaxed">"{AFFIRMATIONS[affirmIdx % AFFIRMATIONS.length]}"</p>
                                  <button onClick={() => { setAffirmIdx(i=>i+1); say(AFFIRMATIONS[(affirmIdx+1)%AFFIRMATIONS.length]); }}
                                    className="mt-2 text-[11px] text-muted hover:text-teal transition-colors flex items-center gap-1 font-semibold">
                                    <RotateCcw size={11}/> Nova mensagem
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Progress */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-muted uppercase tracking-widest">Progresso da Sessão</span>
                              <span className="text-xs font-extrabold text-teal bg-teal/10 px-3 py-1 rounded-full">{completed.length} / {HOME_MODULES.length} módulos</span>
                            </div>
                            <div className="progress-track">
                              <div className="progress-fill" style={{width:`${(completed.length/HOME_MODULES.length)*100}%`}} />
                            </div>
                          </div>

                          {/* Module grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                            {HOME_MODULES.map((m, i) => (
                              <motion.button key={m.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => { navigate(m.id as Section); say(m.title); }}
                                className={`card card-hover p-5 text-center space-y-2 border-2 ${m.color} ${m.border} relative group`}>
                                {completed.includes(m.id) && (
                                  <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-green rounded-full flex items-center justify-center text-[10px] text-white font-bold">✓</span>
                                )}
                                <span className="text-4xl block group-hover:scale-110 transition-transform duration-200">{m.emoji}</span>
                                <p className="font-extrabold text-text text-sm leading-tight">{m.title}</p>
                                <p className="text-[11px] text-muted leading-tight">{m.desc}</p>
                              </motion.button>
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
                      {section === 'ajudantes' && <ModuleAjudantes {...sharedProps} />}
                      {section === 'progresso' && <ModuleProgresso {...sharedProps} completed={completed} totalModules={HOME_MODULES.length} />}
                    </>
                  )}

                  {activeSubApp === 'prancha_simbolos' && (
                    <ModulePrancha
                      settings={settings}
                      say={say}
                      onNavigate={(s) => {
                        if (s === 'home') {
                          setActiveSubApp(null);
                          setPhase('hub');
                        }
                      }}
                      avatar={avatar}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
