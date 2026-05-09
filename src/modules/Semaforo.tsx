import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TOUCH_LEVELS } from '../data';
import type { TherapistSettings } from '../App';
import type { AvatarConfig } from '../data';

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

  const q = QUIZ_ITEMS[qIdx];

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

  if (done) return (
    <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}
      className="card p-12 text-center space-y-6">
      <div className="text-8xl">🚦</div>
      <h3 className="text-4xl text-teal">Você aprendeu o Semáforo do Toque!</h3>
      <p className="text-xl text-muted">Acertou <strong className="text-teal">{score} de {QUIZ_ITEMS.length}</strong>!</p>
      <div className="card p-4 bg-green/10 border border-green/20">
        <p className="font-bold text-green">Lembre-se: Seu corpo é seu! Você sempre pode dizer NÃO! 💚</p>
      </div>
      <button onClick={()=>{setDone(false);setQIdx(0);setPicked(null);setScore(0);setTab('learn');}} className="btn-ghost px-8 py-3">Ver de novo</button>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl text-teal">Semáforo do Toque 🚦</h2>
        <p className="text-muted mt-1">Aprenda quais toques são seguros, quais precisam de permissão e quais nunca são permitidos.</p>
      </div>

      <div className="flex gap-2">
        {[['learn','📚 Aprender'],['quiz','🎯 Quiz']].map(([id,lbl])=>(
          <button key={id} onClick={()=>setTab(id as any)}
            className={`px-6 py-3 rounded-full font-bold text-sm transition-all ${tab===id ? 'bg-teal text-white':'bg-warm text-muted hover:text-text'}`}>
            {lbl}
          </button>
        ))}
      </div>

      {tab === 'learn' && (
        <div className="space-y-6">
          {TOUCH_LEVELS.map(level => (
            <motion.div key={level.id} whileHover={{y:-2}}
              className="card p-6 space-y-4" style={{borderLeft:`4px solid ${level.color}`}}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-sm"
                  style={{background:level.bg}}>
                  {level.icon}
                </div>
                <div>
                  <h3 className="text-2xl" style={{color:level.color}}>{level.label}</h3>
                  <p className="text-sm text-muted">{level.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {level.examples.map(ex => (
                  <button key={ex.text} onClick={()=>say(ex.text)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-warm border border-border hover:border-teal/30 transition-all">
                    <span>{ex.icon}</span>{ex.text}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
          <div className="card p-6 bg-teal/5 border-2 border-teal/20 text-center space-y-3">
            <p className="text-2xl font-bold text-teal">🛡️ Regra de Ouro</p>
            <p className="text-lg text-text font-medium">"Seu corpo é seu. Você pode dizer <strong>NÃO</strong> para qualquer toque que incomoda!"</p>
            <button onClick={()=>say('Seu corpo é seu. Você pode dizer não para qualquer toque que incomoda!')}
              className="text-sm text-teal hover:underline">🔊 Ouvir</button>
          </div>
          <button onClick={()=>setTab('quiz')} className="btn-primary w-full py-4 text-lg">
            Pronto para o Quiz? 🎯
          </button>
        </div>
      )}

      {tab === 'quiz' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-muted">Pergunta {qIdx+1} de {QUIZ_ITEMS.length}</p>
            <span className="text-sm font-bold text-teal">⭐ {score}</span>
          </div>
          <div className="progress-track"><div className="progress-fill" style={{width:`${(qIdx/QUIZ_ITEMS.length)*100}%`}}/></div>

          <AnimatePresence mode="wait">
            <motion.div key={qIdx} initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-30}}
              className="card p-8 text-center space-y-4">
              <span className="text-6xl block">{q.emoji}</span>
              <h3 className="text-2xl font-bold text-text">"{q.text}"</h3>
              <p className="text-muted">Esse toque é...</p>
            </motion.div>
          </AnimatePresence>

          <div className="grid grid-cols-3 gap-4">
            {TOUCH_LEVELS.map(level => {
              const isCorrect = level.id === q.correct;
              const isPicked = picked === level.id;
              return (
                <button key={level.id} onClick={()=>pickAnswer(level.id)}
                  className={`flex flex-col items-center gap-3 p-5 rounded-4xl border-2 font-bold transition-all ${
                    picked ? (isCorrect ? 'scale-105 shadow-lg' : isPicked ? 'opacity-60':'opacity-30')
                           : 'border-border bg-warm hover:border-teal/40'
                  }`}
                  style={picked&&isCorrect ? {background:level.bg,borderColor:level.color} : {}}>
                  <span className="text-3xl">{level.icon}</span>
                  <span className="text-sm">{level.label}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {picked && (
              <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                className={`p-4 rounded-3xl text-center font-bold ${picked===q.correct ? 'bg-green/10 text-green':'bg-rose/10 text-rose'}`}>
                {picked===q.correct ? '✅ Certo! Muito bem!' : `Hmm... Era "${TOUCH_LEVELS.find(l=>l.id===q.correct)?.label}". Você consegue da próxima vez!`}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
