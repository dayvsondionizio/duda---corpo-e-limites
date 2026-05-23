import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TOUCH_LEVELS, TouchLevel } from '../data';
import type { TherapistSettings } from '../App';
import type { AvatarConfig } from '../data';
import { BottomSheet } from '../components/BottomSheet';
import { Sparkles, RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  settings: TherapistSettings; say:(t:string)=>void;
  onComplete:(id:string)=>void; onNavigate:(s:any)=>void; avatar:AvatarConfig;
}

const QUIZ_ITEMS = [
  { text:'Abraço da mamãe', correct:'verde', emoji:'🤗' },
  { text:'Tocar partes privadas de outra pessoa', correct:'vermelho', emoji:'🔒' },
  { text:'Dar as mãos para atravessar a rua', correct:'verde', emoji:'🤝' },
  { text:'Cócegas sem pedir', correct:'amarelo', emoji:'😂' },
  { text:'Toque que incomoda e faz sentir mal', correct:'vermelho', emoji:'😣' },
  { text:'Abraço do amigo pedindo permissão', correct:'verde', emoji:'😊' },
  { text:'Sentar no colo de alguém', correct:'amarelo', emoji:'🪑' },
  { text:'Guardar segredo que dá medo', correct:'vermelho', emoji:'😨' },
];

export function ModuleSemaforo({ say, onComplete }: Props) {
  const [tab, setTab] = useState<'learn'|'quiz'>('learn');
  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState<string|null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  // Mobile responsiveness and state
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const q = QUIZ_ITEMS[qIdx];
  const selectedLevel = TOUCH_LEVELS.find(l => l.id === selectedLevelId);

  function pickAnswer(id: string) {
    if (picked) return;
    setPicked(id);
    const correct = id === q.correct;
    if (correct) { setScore(s=>s+1); say('Certo! Muito bem!'); }
    else say('Quase! Vamos pensar juntos.');
    setTimeout(() => {
      if (qIdx + 1 >= QUIZ_ITEMS.length) { setDone(true); onComplete('semaforo'); }
      else { setQIdx(i=>i+1); setPicked(null); }
    }, 1800);
  }

  function handleLightClick(id: string) {
    setSelectedLevelId(id);
    const level = TOUCH_LEVELS.find(l => l.id === id);
    if (level) {
      say(level.label + ". " + level.description);
    }
  }

  if (done) return (
    <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}
      className="card p-8 md:p-12 text-center space-y-6 max-w-lg mx-auto">
      <div className="text-7xl md:text-8xl">🚦</div>
      <h3 className="text-3xl md:text-4xl text-teal font-bold">Você aprendeu o Semáforo do Toque!</h3>
      <p className="text-lg md:text-xl text-muted">Acertou <strong className="text-teal">{score} de {QUIZ_ITEMS.length}</strong> perguntas!</p>
      <div className="card p-4 bg-green/10 border border-green/20">
        <p className="font-bold text-green text-sm md:text-base">Lembre-se: Seu corpo é seu! Você sempre pode dizer NÃO! 💚</p>
      </div>
      <button onClick={()=>{setDone(false);setQIdx(0);setPicked(null);setScore(0);setTab('learn');}} className="btn-ghost px-8 py-3 mx-auto cursor-pointer">Ver de novo</button>
    </motion.div>
  );

  return (
    <div className="space-y-6 flex flex-col min-h-[75vh]">
      <div>
        <h2 className="text-3xl md:text-4xl text-teal font-bold">Semáforo do Toque 🚦</h2>
        <p className="text-muted mt-1 text-sm md:text-base">Aprenda quais toques são seguros, quais precisam de permissão e quais nunca são permitidos.</p>
      </div>

      <div className="flex gap-2">
        {[['learn','📚 Aprender'],['quiz','🎯 Quiz']].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id as any)}
            className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all cursor-pointer ${tab===id ? 'bg-teal text-white shadow-md':'bg-warm text-muted hover:text-text'}`}>
            {lbl}
          </button>
        ))}
      </div>

      {tab === 'learn' && (
        <div className="flex-1 flex flex-col justify-between">
          <div className="grid md:grid-cols-12 gap-8 items-center flex-1">
            {/* Interactive Traffic Light Graphic */}
            <div className="md:col-span-5 flex flex-col items-center py-4">
              <p className="text-xs font-bold text-muted uppercase tracking-widest mb-4">Toque em cada cor do semáforo:</p>
              
              <div className="flex flex-col items-center p-5 bg-slate-800 rounded-[3rem] shadow-xl w-36 md:w-40 border-4 border-slate-700 relative gap-5 shrink-0">
                <div className="absolute top-full w-6 h-8 bg-slate-700 -z-10" />
                
                {/* Red Light */}
                <button
                  onClick={() => handleLightClick('vermelho')}
                  className={`w-20 h-20 rounded-full border-4 border-slate-900 cursor-pointer flex items-center justify-center transition-all duration-300 relative group ${selectedLevelId === 'vermelho' ? 'scale-105' : ''}`}
                  style={{
                    backgroundColor: selectedLevelId === 'vermelho' ? '#E76F51' : '#1e293b',
                    boxShadow: selectedLevelId === 'vermelho' ? '0 0 30px #E76F51' : 'none'
                  }}
                >
                  <div className="absolute top-1 left-2 w-12 h-6 bg-white/20 rounded-full blur-[1px] rotate-[-15deg] pointer-events-none" />
                  <span className={`text-3xl transition-transform ${selectedLevelId === 'vermelho' ? 'opacity-100 scale-110' : 'opacity-40 grayscale-[10%]'}`}>🔴</span>
                </button>

                {/* Yellow Light */}
                <button
                  onClick={() => handleLightClick('amarelo')}
                  className={`w-20 h-20 rounded-full border-4 border-slate-900 cursor-pointer flex items-center justify-center transition-all duration-300 relative group ${selectedLevelId === 'amarelo' ? 'scale-105' : ''}`}
                  style={{
                    backgroundColor: selectedLevelId === 'amarelo' ? '#E9C46A' : '#1e293b',
                    boxShadow: selectedLevelId === 'amarelo' ? '0 0 30px #E9C46A' : 'none'
                  }}
                >
                  <div className="absolute top-1 left-2 w-12 h-6 bg-white/20 rounded-full blur-[1px] rotate-[-15deg] pointer-events-none" />
                  <span className={`text-3xl transition-transform ${selectedLevelId === 'amarelo' ? 'opacity-100 scale-110' : 'opacity-40 grayscale-[10%]'}`}>🟡</span>
                </button>

                {/* Green Light */}
                <button
                  onClick={() => handleLightClick('verde')}
                  className={`w-20 h-20 rounded-full border-4 border-slate-900 cursor-pointer flex items-center justify-center transition-all duration-300 relative group ${selectedLevelId === 'verde' ? 'scale-105' : ''}`}
                  style={{
                    backgroundColor: selectedLevelId === 'verde' ? '#52B788' : '#1e293b',
                    boxShadow: selectedLevelId === 'verde' ? '0 0 30px #52B788' : 'none'
                  }}
                >
                  <div className="absolute top-1 left-2 w-12 h-6 bg-white/20 rounded-full blur-[1px] rotate-[-15deg] pointer-events-none" />
                  <span className={`text-3xl transition-transform ${selectedLevelId === 'verde' ? 'opacity-100 scale-110' : 'opacity-40 grayscale-[10%]'}`}>🟢</span>
                </button>
              </div>
            </div>

            {/* Details (Desktop Inline / Mobile uses BottomSheet too) */}
            <div className="md:col-span-7 space-y-4">
              <AnimatePresence mode="wait">
                {selectedLevel ? (
                  <motion.div
                    key={selectedLevel.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="card p-6 border-l-4 space-y-4"
                    style={{ borderLeftColor: selectedLevel.color }}
                  >
                    <h3 className="text-2xl font-bold" style={{ color: selectedLevel.color }}>
                      {selectedLevel.icon} {selectedLevel.label}
                    </h3>
                    <p className="text-text leading-relaxed text-sm md:text-base">{selectedLevel.description}</p>
                    
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Exemplos (Toque para ouvir):</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedLevel.examples.map(ex => (
                          <button key={ex.text} onClick={() => say(ex.text)}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold bg-warm border border-border hover:border-teal/30 active:scale-95 transition-all cursor-pointer">
                            <span>{ex.icon}</span> {ex.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="card p-6 text-center text-muted space-y-2 bg-warm/20">
                    <span className="text-3xl animate-bounce block">👆</span>
                    <p className="font-bold text-xs uppercase tracking-widest">Toque nas luzes para ver as regras e exemplos!</p>
                  </div>
                )}
              </AnimatePresence>

              {!isMobile && (
                <div className="card p-6 bg-teal/5 border-2 border-teal/20 text-center space-y-2">
                  <p className="text-xl font-bold text-teal">🛡️ Regra de Ouro</p>
                  <p className="text-sm text-text font-semibold">"Seu corpo é seu. Você pode dizer NÃO para qualquer toque que incomoda!"</p>
                  <button onClick={() => say('Seu corpo é seu. Você pode dizer não para qualquer toque que incomoda!')}
                    className="text-xs text-teal hover:underline font-bold cursor-pointer">🔊 Ouvir Regra</button>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 space-y-4">
            {isMobile && (
              <button 
                onClick={() => say('Seu corpo é seu. Você pode dizer não para qualquer toque que incomoda!')}
                className="w-full flex items-center justify-center gap-2 p-3 bg-teal/5 border border-teal/15 rounded-2xl text-xs font-bold text-teal cursor-pointer"
              >
                🔊 Ouvir Regra de Ouro
              </button>
            )}
            <button onClick={() => setTab('quiz')} className="btn-primary w-full py-4 text-base shadow-lg">
              Pronto para o Quiz? 🎯
            </button>
          </div>

          {/* Bottom Sheet for touch level info (Active only on Mobile when a light is tapped) */}
          <BottomSheet isOpen={isMobile && !!selectedLevelId} onClose={() => setSelectedLevelId(null)} title={selectedLevel?.label}>
            {selectedLevel && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedLevel.icon}</span>
                  <p className="text-sm font-bold uppercase tracking-wider" style={{ color: selectedLevel.color }}>Categoria de segurança</p>
                </div>
                <p className="text-text text-base leading-relaxed">{selectedLevel.description}</p>
                
                <div className="space-y-2 pt-2">
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Exemplos (Toque para ouvir):</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedLevel.examples.map(ex => (
                      <button key={ex.text} onClick={() => say(ex.text)}
                        className="flex flex-col items-center justify-center p-3 rounded-2xl bg-warm border border-border text-center text-xs font-bold gap-2 hover:border-teal/30 active:scale-95 transition-all cursor-pointer">
                        <span className="text-2xl">{ex.icon}</span>
                        <span>{ex.text}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={() => setSelectedLevelId(null)} className="btn-primary w-full py-3.5 font-bold text-sm mt-4">
                  Voltar ao semáforo 👍
                </button>
              </div>
            )}
          </BottomSheet>
        </div>
      )}

      {tab === 'quiz' && (
        <div className="space-y-5 flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-muted uppercase">Pergunta {qIdx+1} de {QUIZ_ITEMS.length}</p>
              <span className="text-sm font-bold text-teal bg-teal/10 px-3 py-1 rounded-full">⭐ {score}</span>
            </div>
            <div className="progress-track"><div className="progress-fill" style={{width:`${(qIdx/QUIZ_ITEMS.length)*100}%`}}/></div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={qIdx} initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}}
              className="card p-6 text-center space-y-4 max-w-md mx-auto w-full flex-1 flex flex-col justify-center min-h-[160px]">
              <span className="text-5xl block animate-bounce">{q.emoji}</span>
              <h3 className="text-xl md:text-2xl font-bold text-text leading-snug">"{q.text}"</h3>
              <p className="text-xs text-muted uppercase tracking-wider">Como classificamos esse toque?</p>
            </motion.div>
          </AnimatePresence>

          <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto w-full">
            {TOUCH_LEVELS.map(level => {
              const isCorrect = level.id === q.correct;
              const isPicked = picked === level.id;
              return (
                <button key={level.id} onClick={()=>pickAnswer(level.id)}
                  className={`flex flex-col items-center gap-2 p-3.5 rounded-3xl border-2 font-bold transition-all cursor-pointer ${
                    picked ? (isCorrect ? 'scale-105 shadow-md' : isPicked ? 'opacity-60':'opacity-30')
                           : 'border-border bg-warm hover:border-teal/40'
                  }`}
                  style={picked&&isCorrect ? {background:level.bg,borderColor:level.color} : {}}>
                  <span className="text-2xl">{level.icon}</span>
                  <span className="text-[10px] text-center uppercase tracking-tighter leading-none">{level.label}</span>
                </button>
              );
            })}
          </div>

          <div className="min-h-[50px] flex items-center justify-center">
            <AnimatePresence>
              {picked && (
                <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  className={`p-3 rounded-2xl text-center font-bold text-xs w-full max-w-md ${picked===q.correct ? 'bg-green/10 text-green':'bg-rose/10 text-rose'}`}>
                  {picked===q.correct ? '✅ Certo! Muito bem!' : `Hmm... Era "${TOUCH_LEVELS.find(l=>l.id===q.correct)?.label}". Você consegue da próxima vez!`}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
