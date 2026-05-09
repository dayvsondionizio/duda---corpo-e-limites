import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { Avatar } from '../Avatar';
import { BODY_PARTS, BodyPart } from '../data';
import type { TherapistSettings } from '../App';
import type { AvatarConfig } from '../data';

interface Props {
  settings: TherapistSettings; say:(t:string)=>void;
  onComplete:(id:string)=>void; onNavigate:(s:any)=>void; avatar:AvatarConfig;
}

export function ModuleCorpo({ settings, say, onComplete, avatar }: Props) {
  const [activePart, setActivePart] = useState<string|null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [quizPart, setQuizPart] = useState<BodyPart|null>(null);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [quizResult, setQuizResult] = useState<'correct'|'wrong'|null>(null);
  const [score, setScore] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [done, setDone] = useState(false);
  const [view, setView] = useState<'front' | 'back'>('front');

  const filtered = BODY_PARTS.filter(p => {
    if (settings.difficulty === 'basico') return p.difficulty === 'basico';
    if (settings.difficulty === 'intermediario') return p.difficulty === 'basico' || p.difficulty === 'intermediario';
    return true;
  });
  const current = filtered.find(p => p.id === activePart);

  function startQuiz() {
    setQuizMode(true);
    nextQuestion();
  }

  function nextQuestion() {
    const pool = filtered;
    const target = pool[Math.floor(Math.random() * pool.length)];
    const others = pool.filter(p => p.id !== target.id).sort(() => Math.random() - 0.5).slice(0, 3);
    const opts = [...others.map(p => p.label), target.label].sort(() => Math.random() - 0.5);
    setQuizPart(target);
    setQuizOptions(opts);
    setQuizResult(null);
    say(`Qual é essa parte do corpo?`);
  }

  function answer(opt: string) {
    if (!quizPart) return;
    const correct = opt === quizPart.label;
    setQuizResult(correct ? 'correct' : 'wrong');
    if (correct) { setScore(s => s + 1); say('Muito bem! Acertou!'); }
    else say(`Quase! Era ${quizPart.label}.`);
    setRounds(r => r + 1);
    if (rounds + 1 >= 5) { setTimeout(() => { setDone(true); onComplete('corpo'); }, 1500); }
    else setTimeout(nextQuestion, 1500);
  }

  if (done) return (
    <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}
      className="card p-12 text-center space-y-6">
      <div className="text-8xl animate-bounce-in">🎉</div>
      <h3 className="text-4xl text-teal font-bold">Incrível! Você conhece seu corpo!</h3>
      <p className="text-xl text-muted">Você acertou <strong className="text-teal">{score} de 5</strong> perguntas!</p>
      <button onClick={() => { setDone(false); setQuizMode(false); setScore(0); setRounds(0); setActivePart(null); }}
        className="btn-ghost px-8 py-3 flex items-center gap-2 mx-auto"><RotateCcw size={16}/> Explorar mais</button>
    </motion.div>
  );

  if (quizMode) return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl text-teal font-bold">Quiz do Corpo</h2>
        <div className="flex items-center gap-2 bg-teal/10 px-4 py-2 rounded-full">
          <span className="text-sm font-bold text-teal">⭐ {score}/5</span>
        </div>
      </div>
      <div className="progress-track"><div className="progress-fill" style={{width:`${(rounds/5)*100}%`}}/></div>
      <div className="card p-8 flex justify-center bg-gradient-to-b from-teal/5 to-cream relative">
        {quizPart && <Avatar config={avatar} size="lg" highlightPart={quizPart.id} backView={quizPart.isBack} />}
        {quizPart?.isBack && (
           <div className="absolute top-4 right-4 bg-teal/10 text-teal text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">Vista de Costas</div>
        )}
      </div>
      <p className="text-center text-xl font-bold text-text">Qual parte do corpo está brilhando?</p>
      <div className="grid grid-cols-2 gap-4">
        {quizOptions.map(opt => (
          <button key={opt} onClick={() => answer(opt)}
            className={`btn-option text-center justify-center text-lg ${
              quizResult && opt === quizPart?.label ? 'border-green bg-green/10 text-green' :
              quizResult === 'wrong' && opt !== quizPart?.label ? 'opacity-40' : ''
            }`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-4xl text-teal font-bold">Meu Corpo 🖐️</h2>
        <p className="text-muted mt-1">Toque no personagem ou nas partes abaixo para aprender!</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="card p-8 flex flex-col items-center justify-center bg-gradient-to-b from-teal/5 to-cream relative group">
          <Avatar config={avatar} size="lg" highlightPart={activePart ?? undefined} backView={view === 'back'}
            onPartClick={(id) => { setActivePart(id); const p = BODY_PARTS.find(b=>b.id===id); if(p) say(p.label); }} />
          
          <button onClick={() => setView(v => v === 'front' ? 'back' : 'front')}
            className="mt-6 btn-secondary px-6 py-2 rounded-full text-xs font-bold flex items-center gap-2 border-2 border-teal/10 hover:border-teal transition-all">
            <RotateCcw size={14} className={view === 'back' ? 'rotate-180' : ''} /> {view === 'front' ? 'Ver as Costas' : 'Ver a Frente'}
          </button>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {current ? (
              <motion.div key={current.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                className={`card p-6 space-y-4 ${current.isPrivate ? 'border-2 border-rose/30 bg-rose/5' : 'bg-sage-light/20'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${current.isPrivate ? 'bg-rose/20':'bg-teal/10'}`}>
                    {current.isPrivate ? '🔒':'🔍'}
                  </div>
                  <h3 className="text-3xl text-teal font-bold">{current.label}</h3>
                </div>
                <p className="text-muted leading-relaxed">{current.description}</p>
                {current.isPrivate && (
                  <div className="bg-rose/10 border border-rose/20 rounded-2xl p-3">
                    <p className="text-sm font-bold text-rose">🔒 Parte privada — fica protegida pela roupa de baixo. É só sua!</p>
                  </div>
                )}
                {current.isBack && (
                  <div className="bg-teal/5 border border-teal/10 rounded-2xl p-3 flex items-center gap-2">
                    <span className="text-sm">🔄</span>
                    <p className="text-xs text-teal font-bold">Esta parte fica nas suas costas!</p>
                  </div>
                )}
                <button onClick={() => say(current.description)} className="text-xs text-teal font-bold hover:underline flex items-center gap-2 bg-white/50 px-3 py-2 rounded-xl w-fit">
                  🔊 Ouvir Explicação
                </button>
              </motion.div>
            ) : (
              <motion.div key="empty" className="card p-8 text-center text-muted space-y-2 bg-warm/20">
                <span className="text-4xl animate-bounce block">👆</span>
                <p className="font-bold text-sm uppercase tracking-widest">Toque no boneco ou escolha abaixo!</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto max-h-64 pr-2 custom-scrollbar">
            {filtered.map(p => (
              <button key={p.id} onClick={() => { setActivePart(p.id); setView(p.isBack ? 'back' : 'front'); say(p.label); }}
                className={`p-3 rounded-2xl border-2 font-bold text-[10px] uppercase tracking-tighter transition-all ${activePart === p.id ? 'border-teal bg-teal/10 text-teal shadow-md' : 'bg-white border-warm text-muted hover:border-teal/30'}`}>
                {p.label}
              </button>
            ))}
          </div>

          <button onClick={startQuiz} className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg shadow-xl shadow-teal/20">
            <Sparkles size={20}/> Fazer o Quiz!
          </button>
        </div>
      </div>
    </div>
  );
}
