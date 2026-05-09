import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EMOTIONS } from '../data';
import type { TherapistSettings } from '../App';
import type { AvatarConfig } from '../data';

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
      className="card p-12 text-center space-y-6">
      <div className="text-8xl animate-bounce-in">💛</div>
      <h3 className="text-4xl text-teal">Você é um expert em emoções!</h3>
      <p className="text-xl text-muted">Acertou <strong className="text-teal">{score} de 6</strong>!</p>
      <button onClick={()=>{setDone(false);setMode('explore');setScore(0);setRounds(0);}} className="btn-ghost px-8 py-3">Explorar mais</button>
    </motion.div>
  );

  if(mode==='quiz') return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl text-teal">Quiz das Emoções</h2>
        <span className="bg-teal/10 px-4 py-2 rounded-full text-sm font-bold text-teal">⭐ {score}/6</span>
      </div>
      <div className="progress-track"><div className="progress-fill" style={{width:`${(rounds/6)*100}%`}}/></div>

      <div className="card p-8 text-center space-y-4" style={{background: quizEmotion.bg}}>
        <p className="text-sm font-bold text-muted uppercase tracking-wider">Quando você sente...</p>
        <p className="text-3xl font-bold text-text">"{quizSignal}"</p>
        <p className="text-muted">Qual emoção pode ser essa?</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {quizOptions.map(opt => {
          const e = EMOTIONS.find(x=>x.label===opt)!;
          const isCorrect = opt === quizEmotion.label;
          return (
            <button key={opt} onClick={()=>answer(opt)}
              className={`flex items-center gap-4 p-5 rounded-4xl border-2 font-bold transition-all ${
                picked ? (isCorrect?'border-green bg-green/10 text-green scale-105':'opacity-40 border-border')
                       : 'bg-warm border-border hover:border-teal/40'
              }`}>
              <span className="text-3xl">{e?.icon}</span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
      {picked && (
        <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
          className={`p-4 rounded-3xl text-center font-bold ${picked===quizEmotion.label?'bg-green/10 text-green':'bg-rose/10 text-rose'}`}>
          {picked===quizEmotion.label ? '✅ Isso mesmo!' : `Era ${quizEmotion.label}! ${quizEmotion.icon}`}
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl text-teal">Emoções 💛</h2>
        <p className="text-muted mt-1">Aprenda a reconhecer como o seu corpo avisa sobre suas emoções.</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {EMOTIONS.map(e => (
          <button key={e.id} onClick={()=>{ setSelected(selected===e.id?null:e.id); say(e.label); }}
            className={`flex flex-col items-center gap-2 p-4 rounded-4xl border-2 transition-all ${selected===e.id?'scale-105 shadow-lg':'bg-warm border-border hover:border-teal/30'}`}
            style={selected===e.id ? {background:e.bg, borderColor:e.color} : {}}>
            <span className="text-4xl">{e.icon}</span>
            <span className="text-xs font-bold text-text">{e.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {current && (
          <motion.div key={current.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}
            className="card p-8 space-y-6" style={{borderLeft:`4px solid ${current.color}`,background:current.bg+'40'}}>
            <div className="flex items-center gap-4">
              <span className="text-5xl">{current.icon}</span>
              <div>
                <h3 className="text-3xl" style={{color:current.color}}>{current.label}</h3>
                <button onClick={()=>say(current.tip)} className="text-sm text-muted hover:text-teal mt-1">🔊 Ouvir dica</button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-muted uppercase tracking-wider">Sinais do Corpo:</p>
              <div className="flex flex-wrap gap-2">
                {current.signals.map(s => (
                  <span key={s} className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-border text-text">{s}</span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-white/70 rounded-3xl border border-border">
              <p className="text-sm font-medium text-text italic">💡 {current.tip}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!current && (
        <div className="card p-6 text-center text-muted space-y-2 bg-warm">
          <span className="text-3xl">👆</span>
          <p>Toque em uma emoção para aprender mais sobre ela!</p>
        </div>
      )}

      <button onClick={startQuiz} className="btn-primary w-full py-4 text-lg">
        🎯 Testar o que aprendi!
      </button>
    </div>
  );
}
