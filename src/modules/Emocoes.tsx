import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EMOTIONS } from '../data';
import type { TherapistSettings } from '../App';
import type { AvatarConfig } from '../data';
import { BottomSheet } from '../components/BottomSheet';
import { Sparkles, RotateCcw } from 'lucide-react';

interface Props {
  settings: TherapistSettings; say:(t:string)=>void;
  onComplete:(id:string)=>void; onNavigate:(s:any)=>void; avatar:AvatarConfig;
}

export function ModuleEmocoes({ say, onComplete }: Props) {
  const [selected, setSelected] = useState<string|null>(null);
  const [mode, setMode] = useState<'explore'|'quiz'>('explore');
  const [quizEmotion, setQuizEmotion] = useState(EMOTIONS[0]);
  const [quizSignal, setQuizSignal] = useState('');
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [picked, setPicked] = useState<string|null>(null);
  const [score, setScore] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [done, setDone] = useState(false);

  // Mobile responsiveness and state
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const current = EMOTIONS.find(e=>e.id===selected);

  function startQuiz() {
    setMode('quiz'); nextQuiz();
  }

  function nextQuiz() {
    const e = EMOTIONS[Math.floor(Math.random()*EMOTIONS.length)];
    const signal = e.signals[Math.floor(Math.random()*e.signals.length)];
    const others = EMOTIONS.filter(x=>x.id!==e.id).sort(()=>Math.random()-0.5).slice(0,3);
    const opts = [...others.map(x=>x.label), e.label].sort(()=>Math.random()-0.5);
    setQuizEmotion(e); setQuizSignal(signal); setQuizOptions(opts); setPicked(null);
    say(`Quando você sente ${signal}... qual emoção pode ser essa?`);
  }

  function answer(opt: string) {
    if (picked) return;
    setPicked(opt);
    const correct = opt === quizEmotion.label;
    if(correct){ setScore(s=>s+1); say('Muito bem! Você reconhece suas emoções!'); }
    else say(`Era ${quizEmotion.label}! Tudo bem, você está aprendendo!`);
    const r = rounds+1;
    setRounds(r);
    if(r>=6){ setTimeout(()=>{ setDone(true); onComplete('emocoes'); },1500); }
    else setTimeout(nextQuiz, 1800);
  }

  if(done) return (
    <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}
      className="card p-8 md:p-12 text-center space-y-6 max-w-lg mx-auto">
      <div className="text-7xl md:text-8xl animate-bounce-in">💛</div>
      <h3 className="text-3xl md:text-4xl text-teal font-bold">Você é um expert em emoções!</h3>
      <p className="text-lg md:text-xl text-muted">Acertou <strong className="text-teal">{score} de 6</strong> perguntas!</p>
      <button onClick={()=>{setDone(false);setMode('explore');setScore(0);setRounds(0);}} className="btn-ghost px-8 py-3 mx-auto cursor-pointer">Explorar mais</button>
    </motion.div>
  );

  if(mode==='quiz') return (
    <div className="space-y-6 flex flex-col min-h-[70vh] justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl md:text-3xl text-teal font-bold">Quiz das Emoções</h2>
          <span className="bg-teal/10 px-4 py-1.5 rounded-full text-sm font-bold text-teal">⭐ {score}/6</span>
        </div>
        <div className="progress-track"><div className="progress-fill" style={{width:`${(rounds/6)*100}%`}}/></div>
      </div>

      <div className="card p-6 text-center space-y-3 flex-1 flex flex-col justify-center min-h-[140px]" style={{background: quizEmotion.bg}}>
        <p className="text-xs font-bold text-muted uppercase tracking-wider">Quando você sente...</p>
        <p className="text-2xl md:text-3xl font-bold text-text leading-tight">"{quizSignal}"</p>
        <p className="text-xs text-muted">Qual emoção pode ser essa?</p>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto w-full">
        {quizOptions.map(opt => {
          const e = EMOTIONS.find(x=>x.label===opt)!;
          const isCorrect = opt === quizEmotion.label;
          return (
            <button key={opt} onClick={()=>answer(opt)}
              className={`flex items-center gap-3 p-3.5 rounded-3xl border-2 font-bold text-sm transition-all cursor-pointer ${
                picked ? (isCorrect?'border-green bg-green/10 text-green scale-105':'opacity-40 border-border')
                       : 'bg-warm border-border hover:border-teal/40'
              }`}>
              <span className="text-2xl">{e?.icon}</span>
              <span className="truncate">{opt}</span>
            </button>
          );
        })}
      </div>
      <div className="min-h-[44px] flex items-center justify-center">
        {picked && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
            className={`p-3 rounded-2xl text-center font-bold text-xs w-full max-w-md ${picked===quizEmotion.label?'bg-green/10 text-green':'bg-rose/10 text-rose'}`}>
            {picked===quizEmotion.label ? '✅ Isso mesmo!' : `Era ${quizEmotion.label}! ${quizEmotion.icon}`}
          </motion.div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 flex flex-col min-h-[75vh]">
      <div>
        <h2 className="text-3xl md:text-4xl text-teal font-bold">Emoções 💛</h2>
        <p className="text-muted mt-1 text-sm md:text-base">Aprenda a reconhecer como o seu corpo avisa sobre suas emoções.</p>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-w-lg mx-auto w-full">
        {EMOTIONS.map(e => (
          <button key={e.id} onClick={()=>{ setSelected(e.id); say(e.label); if (isMobile) setIsDetailOpen(true); }}
            className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-3xl border-2 transition-all cursor-pointer ${selected===e.id?'scale-105 shadow-md':'bg-warm border-border hover:border-teal/30 active:scale-95'}`}
            style={selected===e.id ? {background:e.bg, borderColor:e.color} : {}}>
            <span className="text-4xl">{e.icon}</span>
            <span className="text-xs font-bold text-text">{e.label}</span>
          </button>
        ))}
      </div>

      {!isMobile ? (
        // Desktop Inline Details Card
        <div className="flex-1 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {current ? (
              <motion.div key={current.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}
                className="card p-6 space-y-4" style={{borderLeft:`4px solid ${current.color}`,background:current.bg+'40'}}>
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{current.icon}</span>
                  <div>
                    <h3 className="text-2xl font-bold" style={{color:current.color}}>{current.label}</h3>
                    <button onClick={()=>say(current.tip)} className="text-xs text-muted hover:text-teal mt-1 font-bold">🔊 Ouvir dica</button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Sinais do Corpo:</p>
                  <div className="flex flex-wrap gap-2">
                    {current.signals.map(s => (
                      <span key={s} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-border text-text">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-white/70 rounded-3xl border border-border">
                  <p className="text-sm font-medium text-text italic">💡 {current.tip}</p>
                </div>
              </motion.div>
            ) : (
              <div className="card p-6 text-center text-muted space-y-2 bg-warm/20 flex-1 flex flex-col justify-center min-h-[140px]">
                <span className="text-3xl animate-bounce">👆</span>
                <p className="text-xs uppercase tracking-widest font-bold">Toque em uma emoção para aprender mais sobre ela!</p>
              </div>
            )}
          </AnimatePresence>

          <button onClick={startQuiz} className="btn-primary w-full py-4 text-base shadow-lg mt-6">
            🎯 Testar o que aprendi!
          </button>
        </div>
      ) : (
        // Mobile Layout: Only show the CTA quiz button (details open in BottomSheet)
        <div className="pt-6">
          <button onClick={startQuiz} className="btn-primary w-full py-4 text-base shadow-lg">
            🎯 Testar o que aprendi!
          </button>
        </div>
      )}

      {/* Mobile Emotion Details Bottom Sheet */}
      <BottomSheet isOpen={isMobile && isDetailOpen} onClose={() => setIsDetailOpen(false)} title={current?.label}>
        {current && (
          <div className="space-y-4 text-center">
            <span className="text-6xl block">{current.icon}</span>
            
            <div className="space-y-2 text-left">
              <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Sinais que o corpo dá:</p>
              <div className="flex flex-wrap gap-2">
                {current.signals.map(s => (
                  <span key={s} className="px-3.5 py-2 rounded-full text-xs font-bold bg-warm border border-border text-text">{s}</span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-3xl text-left border-2" style={{borderColor: current.color, backgroundColor: current.bg+'30'}}>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{color: current.color}}>Dica de ouro:</p>
              <p className="text-sm text-text leading-relaxed font-semibold">"{current.tip}"</p>
            </div>

            <div className="space-y-2 pt-2">
              <button onClick={() => say(current.tip)} className="btn-secondary w-full py-3.5 flex items-center justify-center gap-2 text-sm font-bold">
                🔊 Ouvir Dica
              </button>
              <button onClick={() => setIsDetailOpen(false)} className="btn-primary w-full py-3.5 text-sm font-bold">
                Entendi! 👍
              </button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
