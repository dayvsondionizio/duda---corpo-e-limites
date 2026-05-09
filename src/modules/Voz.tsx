import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2 } from 'lucide-react';
import type { TherapistSettings } from '../App';
import type { AvatarConfig } from '../data';

interface Props {
  settings: TherapistSettings; say:(t:string)=>void;
  onComplete:(id:string)=>void; onNavigate:(s:any)=>void; avatar:AvatarConfig;
}

const PHRASES = [
  { text: 'Meu corpo é meu!', emoji: '💪', tip: 'Diga com confiança!' },
  { text: 'Eu posso dizer NÃO!', emoji: '✋', tip: 'Sua voz é importante!' },
  { text: 'Isso me deixa desconfortável.', emoji: '😕', tip: 'Falar como você se sente é corajoso!' },
  { text: 'Pare! Não gostei disso.', emoji: '🛑', tip: 'Você tem o direito de pedir para parar!' },
  { text: 'Vou contar para um adulto seguro.', emoji: '🤝', tip: 'Pedir ajuda é muito inteligente!' },
  { text: 'Adultos seguros me escutam.', emoji: '👂', tip: 'Você merece ser ouvido!' },
  { text: 'Meu espaço merece respeito.', emoji: '⭕', tip: 'Seu espaço é importante!' },
];

export function ModuleVoz({ say, onComplete }: Props) {
  const [practiced, setPracticed] = useState<Set<number>>(new Set());
  const [activePower, setActivePower] = useState(0);
  const [done, setDone] = useState(false);

  function practice(i: number) {
    say(PHRASES[i].text);
    const newSet = new Set(practiced).add(i);
    setPracticed(newSet);
    const power = Math.round((newSet.size / PHRASES.length) * 100);
    setActivePower(power);
    if (newSet.size === PHRASES.length) {
      setTimeout(() => { setDone(true); onComplete('voz'); }, 800);
    }
  }

  if (done) return (
    <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}
      className="card p-12 text-center space-y-6">
      <div className="text-8xl animate-bounce-in">📢</div>
      <h3 className="text-4xl text-teal">Sua voz é forte e poderosa!</h3>
      <p className="text-lg text-muted">Você praticou todas as frases. Continue usando sua voz para se proteger!</p>
      <button onClick={()=>{setDone(false);setPracticed(new Set());setActivePower(0);}} className="btn-ghost px-8 py-3">Praticar mais</button>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl text-teal">Minha Voz 📢</h2>
        <p className="text-muted mt-1">Pratique dizer estas frases em voz alta. Toque em cada uma para ouvir!</p>
      </div>

      {/* Power bar */}
      <div className="card p-6 space-y-3">
        <div className="flex justify-between items-center">
          <p className="font-bold text-text">Poder da Sua Voz</p>
          <p className="font-bold text-teal text-xl">{activePower}%</p>
        </div>
        <div className="progress-track h-5">
          <motion.div animate={{width:`${activePower}%`}} transition={{type:'spring',stiffness:60}}
            className="h-full bg-gradient-to-r from-teal to-green rounded-full shadow-inner"/>
        </div>
        <p className="text-sm text-muted">
          {activePower===0 && 'Toque nas frases para começar!'}
          {activePower>0 && activePower<50 && 'Continue praticando! 💪'}
          {activePower>=50 && activePower<100 && 'Você está indo muito bem! 🔥'}
          {activePower===100 && 'Poder máximo! Você é incrível! ⚡'}
        </p>
      </div>

      {/* Phrases */}
      <div className="space-y-3">
        {PHRASES.map((p, i) => (
          <motion.button key={i} whileHover={{x:6}} whileTap={{scale:0.98}}
            onClick={()=>practice(i)}
            className={`w-full flex items-center gap-5 p-5 rounded-4xl border-2 text-left transition-all ${
              practiced.has(i)
                ? 'bg-teal/10 border-teal/30'
                : 'bg-warm border-border hover:border-teal/30 hover:bg-teal/5'
            }`}>
            <span className="text-3xl shrink-0">{p.emoji}</span>
            <div className="flex-1">
              <p className={`font-bold text-lg ${practiced.has(i) ? 'text-teal':'text-text'}`}>{p.text}</p>
              {practiced.has(i) && <p className="text-xs text-muted mt-0.5">{p.tip}</p>}
            </div>
            <div className={`p-2.5 rounded-2xl transition-all ${practiced.has(i)?'bg-teal text-white':'bg-white border border-border text-muted'}`}>
              <Volume2 size={18}/>
            </div>
            {practiced.has(i) && <span className="text-green font-bold">✓</span>}
          </motion.button>
        ))}
      </div>

      <div className="card p-5 bg-teal/5 border-2 border-teal/20 flex items-start gap-4">
        <span className="text-3xl">🛡️</span>
        <div>
          <p className="font-bold text-teal">Sua voz é seu superpoder!</p>
          <p className="text-sm text-muted mt-1">Quando você fala com confiança, as pessoas te ouvem. Pratique sempre!</p>
        </div>
      </div>

      {practiced.size > 0 && practiced.size < PHRASES.length && (
        <p className="text-center text-sm text-muted">
          Praticou {practiced.size} de {PHRASES.length} frases. Continue! 🌟
        </p>
      )}
    </div>
  );
}
