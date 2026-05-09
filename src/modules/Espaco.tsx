import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Avatar } from '../Avatar';
import { AvatarConfig, DEFAULT_AVATAR, SKIN_COLORS, HAIR_COLORS, CLOTHING_COLORS } from '../data';
import type { TherapistSettings } from '../App';

interface Props {
  settings: TherapistSettings; say: (t:string)=>void;
  onComplete: (id:string)=>void; onNavigate:(s:any)=>void; avatar: AvatarConfig;
}

const REACTIONS = [
  { id:'confortavel', label:'Confortável!',    emoji:'🙂', color:'bg-green/10 border-green/40 text-green' },
  { id:'desconforto', label:'Desconfortável',  emoji:'😕', color:'bg-yellow/10 border-yellow/50 text-yellow-600' },
  { id:'assustador',  label:'Assustador!',     emoji:'😨', color:'bg-rose/10 border-rose/40 text-rose' },
];

function getRandomAvatar(): AvatarConfig {
  const hairs = ['short', 'long', 'curly'];
  return {
    ...DEFAULT_AVATAR,
    skin: SKIN_COLORS[Math.floor(Math.random() * SKIN_COLORS.length)],
    hair: hairs[Math.floor(Math.random() * hairs.length)],
    hairColor: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)],
    clothing: CLOTHING_COLORS[Math.floor(Math.random() * CLOTHING_COLORS.length)],
  };
}

export function ModuleEspaco({ say, onComplete, avatar }: Props) {
  const [distance, setDistance] = useState(3);
  const [characterConfig, setCharacterConfig] = useState<AvatarConfig>(getRandomAvatar());
  const [charType, setCharType] = useState('Amigo');
  const [reaction, setReaction] = useState<string|null>(null);
  const [done, setDone] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);

  const CHAR_TYPES = ['Amigo', 'Pessoa que não conheço', 'Familiar'];

  useEffect(() => {
    setCharacterConfig(getRandomAvatar());
    setCharType(CHAR_TYPES[answeredCount % CHAR_TYPES.length]);
  }, [answeredCount]);

  function pickReaction(id: string) {
    setReaction(id);
    const r = REACTIONS.find(r=>r.id===id)!;
    say(r.label);
    const count = answeredCount + 1;
    setAnsweredCount(count);
    if (count >= 3) { setTimeout(()=>{ setDone(true); onComplete('espaco'); }, 1000); }
    else setTimeout(()=>{ setReaction(null); setDistance(2+Math.floor(Math.random()*3)); }, 1500);
  }

  if (done) return (
    <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}
      className="card p-12 text-center space-y-6">
      <div className="text-8xl">⭕</div>
      <h3 className="text-4xl text-teal">Você sabe reconhecer seu espaço!</h3>
      <p className="text-lg text-muted">Muito bem! Seu espaço pessoal é importante e merece respeito!</p>
      <button onClick={()=>{setDone(false);setAnsweredCount(0);}} className="btn-ghost px-8 py-3">Praticar mais</button>
    </motion.div>
  );

  const proximityPx = [220, 160, 100, 60, 30][distance - 1];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl text-teal">Meu Espaço Pessoal ⭕</h2>
        <p className="text-muted mt-1">Todo mundo tem um círculo invisível ao redor. Como você se sente quando alguém chega perto?</p>
      </div>

      <div className="card p-8 text-center space-y-6">
        <p className="text-lg font-bold text-text">Este <strong>{charType}</strong> está se aproximando de você...</p>

        {/* Visual distance */}
        <div className="relative h-72 bg-gradient-to-b from-teal/5 to-cream rounded-4xl flex items-center justify-center overflow-hidden border border-teal/10">
          {/* Concentric circles */}
          {[160,110,80,50].map((r,i) => (
            <div key={i} className="absolute rounded-full border-2 border-teal/10"
              style={{width:r*2, height:r*2}} />
          ))}
          {/* Avatar (child) */}
          <div className="absolute" style={{zIndex:10}}>
            <Avatar config={avatar} size="sm" />
          </div>
          {/* Other character */}
          <motion.div animate={{x: -proximityPx}} className="absolute" style={{zIndex:5}}>
            <Avatar config={characterConfig} size="sm" />
          </motion.div>
        </div>

        {/* Distance slider */}
        <div className="space-y-3">
          <div className="flex justify-between text-[10px] text-muted font-bold uppercase tracking-widest">
            <span>Muito longe</span><span>Muito Perto</span>
          </div>
          <input type="range" min="1" max="5" value={distance}
            onChange={e => { setDistance(+e.target.value); setReaction(null); }}
            className="w-full accent-teal cursor-pointer" />
          <p className="text-sm font-bold text-teal">
            {distance===1 && 'Bem longe — tranquilo!'}
            {distance===2 && 'Um pouco longe — confortável.'}
            {distance===3 && 'Distância normal.'}
            {distance===4 && 'Perto — como você se sente?'}
            {distance===5 && 'Muito perto! 😬'}
          </p>
        </div>

        <p className="font-bold text-lg text-text">Como você se sente com este {charType} nesta distância?</p>
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {REACTIONS.map(r => (
            <button key={r.id} onClick={() => pickReaction(r.id)}
              className={`flex flex-col items-center gap-2 md:gap-3 p-4 md:p-5 rounded-4xl border-2 font-bold transition-all ${reaction===r.id ? r.color + ' scale-105 shadow-md' : 'bg-warm/50 border-border text-muted hover:border-teal/30 hover:bg-teal/5'}`}>
              <span className="text-3xl md:text-4xl">{r.emoji}</span>
              <span className="text-[10px] md:text-sm uppercase tracking-wider">{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card p-6 bg-blue/5 border border-blue/20 flex items-start gap-4">
        <span className="text-3xl">💡</span>
        <div>
          <p className="font-bold text-blue">Dica importante:</p>
          <p className="text-sm text-muted mt-1">Seu espaço pessoal é importante! Você pode pedir educadamente para alguém se afastar se sentir desconforto.</p>
        </div>
      </div>
    </div>
  );
}
