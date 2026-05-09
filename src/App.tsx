import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Heart, BookOpen, Smile, Shield, Users, Volume2, VolumeX, BrainCircuit, ChevronRight, Settings2, Star, RotateCcw, Lock, Save, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarCustomizer } from './Avatar';
import { AvatarConfig, Section, Difficulty, BODY_PARTS, TOUCH_LEVELS, STORIES, EMOTIONS, HELPERS, Helper, AFFIRMATIONS, SKIN_COLORS, DEFAULT_AVATAR, HELP_EMOJIS } from './data';
import { ModuleCorpo } from './modules/Corpo';
import { ModuleEspaco } from './modules/Espaco';
import { ModuleSemaforo } from './modules/Semaforo';
import { ModuleHistorias } from './modules/Historias';
import { ModuleEmocoes } from './modules/Emocoes';
import { ModuleAjudantes } from './modules/Ajudantes';
import { ModuleProgresso } from './modules/Progresso';

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
  { id: 'ajudantes', icon: Users,    label: 'Ajudantes' },
  { id: 'progresso', icon: Star,     label: 'Conquistas' },
];

const HOME_MODULES = [
  { id:'corpo',     emoji:'🖐️', title:'Meu Corpo',     desc:'Conheço meu corpo!',      color:'bg-teal/10',   border:'border-teal/30' },
  { id:'espaco',    emoji:'⭕',  title:'Meu Espaço',    desc:'Espaço pessoal',           color:'bg-blue/10',   border:'border-blue/30' },
  { id:'semaforo',  emoji:'🚦',  title:'Semáforo',      desc:'Tipos de toque',           color:'bg-green/10',  border:'border-green/30' },
  { id:'historias', emoji:'📖',  title:'Histórias',     desc:'Aprendo com histórias',    color:'bg-yellow/10', border:'border-yellow/30' },
  { id:'emocoes',   emoji:'💛',  title:'Emoções',       desc:'Reconheço meus sentimentos',color:'bg-peach/10', border:'border-peach/30' },
  { id:'ajudantes', emoji:'🤝',  title:'Ajudantes',     desc:'Adultos seguros',          color:'bg-rose/10',   border:'border-rose/30' },
  { id:'progresso', emoji:'⭐',  title:'Conquistas',    desc:'Meu progresso',            color:'bg-sage/10',   border:'border-sage/30' },
];

export default function App() {
  const [resetKey, setResetKey] = useState(0);
  const [phase, setPhase] = useState<'setup'|'intro'|'customize'|'app'>('setup');
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
    speak(t, settings.audioEnabled, gender, force);
  }, [settings.audioEnabled, gender]);

  const resetApp = () => {
    if (confirm('Deseja reiniciar o aplicativo? Todo o progresso da sessão será perdido.')) {
      setResetKey(prev => prev + 1);
      setPhase('setup');
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
    <div key={resetKey} className="min-h-screen flex flex-col bg-cream font-sans text-text selection:bg-teal/20 selection:text-teal-dark overflow-x-hidden">
      
      {/* Header (Only in App phase) */}
      {phase === 'app' && (
        <header className="sticky top-0 z-[70] bg-white/70 backdrop-blur-xl border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSection('home')} className="w-10 h-10 bg-teal rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal/20 hover:scale-105 transition-transform">
                <Heart size={20} fill="currentColor" />
              </button>
              <div className="hidden sm:block">
                <h1 className="text-lg text-teal leading-none font-bold">Corpo e Limites</h1>
                <p className="text-[10px] text-muted uppercase tracking-widest font-medium">Crescendo com autonomia</p>
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

              <button onClick={() => { say('Modo profissional aberto', true); setShowTherapist(p=>!p); }}
                className="p-2.5 rounded-2xl bg-warm hover:bg-border transition-colors">
                <BrainCircuit size={20} className="text-muted" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 flex">
        {phase === 'app' && (
          <nav className="fixed bottom-0 left-0 right-0 z-[60] bg-white/90 backdrop-blur-xl border-t border-border flex justify-around p-2 md:static md:flex md:flex-col md:w-52 md:shrink-0 md:p-4 md:border-t-0 md:border-r md:bg-white/50 lg:w-64">
            {NAV_ITEMS.map(item => (
              <button key={item.id} onClick={() => navigate(item.id as Section)}
                className={`nav-pill ${section === item.id ? 'active' : ''}`}>
                <item.icon size={20} />
                <span className="text-xs font-bold">{item.label}</span>
              </button>
            ))}
            <div className="hidden md:block mt-auto pt-6 border-t border-border">
              <button onClick={resetApp} className="w-full flex items-center gap-2 p-3 text-muted hover:text-rose transition-colors text-xs font-bold uppercase tracking-widest">
                <RotateCcw size={14} /> Reiniciar App
              </button>
            </div>
          </nav>
        )}

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-4 md:py-8 pb-32">
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
                      setPhase('intro');
                      say('Tudo pronto! Vamos começar a sessão.');
                    }}
                      className="btn-primary w-full py-4 text-xl shadow-2xl shadow-teal/30">
                      Iniciar Sessão com a Criança 🚀
                    </button>
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
                  {section === 'ajudantes' && <ModuleAjudantes {...sharedProps} customHelpers={customHelpers} />}
                  {section === 'progresso' && <ModuleProgresso {...sharedProps} completed={completed} totalModules={HOME_MODULES.length} />}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Therapist Panel Overlay */}
      <AnimatePresence>
        {showTherapist && (
          <motion.div initial={{opacity:0, x:'100%'}} animate={{opacity:1, x:0}} exit={{opacity:0, x:'100%'}}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#1a2332] text-white z-[200] flex flex-col shadow-2xl overflow-y-auto custom-scrollbar">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal rounded-2xl flex items-center justify-center"><BrainCircuit size={20}/></div>
                <div>
                  <p className="font-bold">Painel Terapeuta</p>
                  <p className="text-xs text-white/40">Sessão em curso</p>
                </div>
              </div>
              <button onClick={() => setShowTherapist(false)} className="text-white/40 hover:text-white transition-colors">
                <ChevronRight size={28}/>
              </button>
            </div>

            <div className="p-6 space-y-8">
               {/* Minimal mid-session settings */}
               <section className="space-y-4">
                 <h3 className="text-xs uppercase tracking-[0.2em] text-white/30 font-bold">Ajustes Rápidos</h3>
                 <div className="space-y-2">
                    <button onClick={() => setSettings(s=>({...s, audioEnabled:!s.audioEnabled}))}
                      className="w-full flex items-center justify-between bg-white/5 p-4 rounded-2xl text-sm">
                      <span>Voz do App</span>
                      <span className={settings.audioEnabled ? 'text-teal':'text-rose'}>{settings.audioEnabled ? 'Ligada':'Desligada'}</span>
                    </button>
                    <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl text-sm">
                       <span>Dificuldade</span>
                       <span className="text-teal font-bold">{settings.difficulty.toUpperCase()}</span>
                    </div>
                 </div>
               </section>

               <section className="space-y-4">
                 <h3 className="text-xs uppercase tracking-[0.2em] text-white/30 font-bold">Perfil Ativo</h3>
                 <div className="bg-white/5 p-4 rounded-2xl text-[11px] text-white/60 leading-relaxed max-h-40 overflow-y-auto">
                    {settings.childProfile || 'Nenhum perfil definido.'}
                 </div>
               </section>

               <section className="space-y-4">
                 <h3 className="text-xs uppercase tracking-[0.2em] text-white/30 font-bold">Notas da Sessão</h3>
                 <textarea value={notes} onChange={e => setNotes(e.target.value)}
                   className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white outline-none focus:border-teal/50 transition-colors placeholder:text-white/20 resize-none"
                   placeholder="Anote as reações e aprendizados da criança..."/>
               </section>

               <button onClick={() => setShowTherapist(false)}
                 className="btn-primary w-full py-4 text-xs flex items-center justify-center gap-2">
                 <Save size={14}/> Salvar e Voltar
               </button>

               <div className="h-px bg-white/10 my-4" />
               <p className="text-[10px] text-white/20 text-center italic">Para mudanças estruturais profundas, reinicie o aplicativo.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
