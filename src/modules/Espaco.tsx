import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Avatar } from '../Avatar';
import { AvatarConfig, DEFAULT_AVATAR, CHARACTERS } from '../data';
import type { TherapistSettings } from '../App';
import { BottomSheet } from '../components/BottomSheet';
import { RotateCcw, Lightbulb } from 'lucide-react';

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
  return {
    characterId: CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)].id
  };
}

export function ModuleEspaco({ say, onComplete, avatar }: Props) {
  const [distance, setDistance] = useState(3);
  const [characterConfig, setCharacterConfig] = useState<AvatarConfig>(getRandomAvatar());
  const [charType, setCharType] = useState('Amigo');
  const [reaction, setReaction] = useState<string|null>(null);
  const [done, setDone] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);

  // Mobile responsiveness and state
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [isTipOpen, setIsTipOpen] = useState(false);

  const CHAR_TYPES = ['Amigo', 'Pessoa que não conheço', 'Familiar'];

  useEffect(() => {
    setCharacterConfig(getRandomAvatar());
    setCharType(CHAR_TYPES[answeredCount % CHAR_TYPES.length]);
  }, [answeredCount]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      className="card p-8 md:p-12 text-center space-y-6 max-w-lg mx-auto">
      <div className="text-7xl md:text-8xl">⭕</div>
      <h3 className="text-3xl md:text-4xl text-teal font-bold">Você sabe reconhecer seu espaço!</h3>
      <p className="text-lg text-muted">Muito bem! Seu espaço pessoal é importante e merece respeito!</p>
      <button onClick={()=>{setDone(false);setAnsweredCount(0);}} className="btn-ghost px-8 py-3 mx-auto cursor-pointer">Praticar mais</button>
    </motion.div>
  );

  const proximityPx = isMobile
    ? [120, 85, 55, 32, 12][distance - 1] // Smaller coordinates for mobile container
    : [220, 160, 100, 60, 30][distance - 1];

  return (
    <div className="space-y-6 flex flex-col min-h-[75vh]">
      <header className="flex justify-between items-start gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl text-teal font-bold">Espaço Pessoal ⭕</h2>
          <p className="text-muted mt-1 text-xs md:text-sm">Como você se sente quando alguém se aproxima?</p>
        </div>
        <button
          onClick={() => { setIsTipOpen(true); say("Seu espaço pessoal é importante! Você pode pedir educadamente para alguém se afastar se sentir desconforto."); }}
          className="btn-ghost px-3 py-1.5 rounded-2xl text-xs flex items-center gap-1.5 bg-blue/5 border-blue/20 text-blue font-bold cursor-pointer hover:bg-blue/10 shrink-0"
        >
          <Lightbulb size={14} /> {isMobile ? 'Dica' : 'Ver Dica'}
        </button>
      </header>

      <div className="card p-5 md:p-8 text-center space-y-5 flex-1 flex flex-col justify-between">
        <p className="text-base md:text-lg font-bold text-text leading-tight">Este <strong>{charType}</strong> está se aproximando de você...</p>

        {/* Visual distance */}
        <div className={`relative ${isMobile ? 'h-44' : 'h-72'} bg-gradient-to-b from-teal/5 to-cream rounded-4xl flex items-center justify-center overflow-hidden border border-teal/10`}>
          {/* Concentric circles */}
          {(isMobile ? [100, 70, 45, 25] : [160, 110, 80, 50]).map((r, i) => (
            <div key={i} className="absolute rounded-full border-2 border-teal/10 pointer-events-none"
              style={{ width: r * 2, height: r * 2 }} />
          ))}
          {/* Avatar (child) */}
          <div className="absolute" style={{ zIndex: 10 }}>
            <Avatar config={avatar} size={isMobile ? 'sm' : 'md'} />
          </div>
          {/* Other character */}
          <motion.div animate={{ x: -proximityPx }} className="absolute" style={{ zIndex: 5 }}>
            <Avatar config={characterConfig} size={isMobile ? 'sm' : 'md'} />
          </motion.div>
        </div>

        {/* Distance slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-[9px] text-muted font-bold uppercase tracking-widest leading-none">
            <span>Muito longe</span><span>Muito Perto</span>
          </div>
          <input type="range" min="1" max="5" value={distance}
            onChange={e => { setDistance(+e.target.value); setReaction(null); }}
            className="w-full accent-teal cursor-pointer h-2 bg-warm rounded-lg appearance-none" />
          <p className="text-sm font-bold text-teal leading-none min-h-[16px]">
            {distance===1 && 'Bem longe — tranquilo!'}
            {distance===2 && 'Um pouco longe — confortável.'}
            {distance===3 && 'Distância normal.'}
            {distance===4 && 'Perto — como você se sente?'}
            {distance===5 && 'Muito perto! 😬'}
          </p>
        </div>

        <div className="space-y-4">
          <p className="font-bold text-base md:text-lg text-text">Como você se sente nesta distância?</p>
          <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto w-full">
            {REACTIONS.map(r => (
              <button key={r.id} onClick={() => pickReaction(r.id)}
                className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-3xl border-2 font-bold transition-all cursor-pointer ${reaction===r.id ? r.color + ' scale-105 shadow-md' : 'bg-warm/50 border-border text-muted hover:border-teal/30 active:scale-95'}`}>
                <span className="text-3xl">{r.emoji}</span>
                <span className="text-[9px] uppercase tracking-wider text-center leading-none">{r.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {!isMobile && (
        <div className="card p-6 bg-blue/5 border border-blue/20 flex items-start gap-4">
          <span className="text-3xl">💡</span>
          <div>
            <p className="font-bold text-blue">Dica importante:</p>
            <p className="text-sm text-muted mt-1">Seu espaço pessoal é importante! Você pode pedir educadamente para alguém se afastar se sentir desconforto.</p>
          </div>
        </div>
      )}

      {/* Mobile Tip Bottom Sheet */}
      <BottomSheet isOpen={isTipOpen} onClose={() => setIsTipOpen(false)} title="Dica de Segurança">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 bg-blue/10 text-blue rounded-full flex items-center justify-center text-3xl mx-auto">💡</div>
          <h4 className="text-xl font-bold text-blue">Seu Espaço é Importante!</h4>
          <p className="text-text leading-relaxed text-sm">
            Todo mundo tem um círculo invisível ao seu redor. Se alguém chegar muito perto e você se sentir desconfortável ou assustado, você tem todo o direito de pedir educadamente para a pessoa dar um passo para trás.
          </p>
          <div className="p-4 bg-warm/50 border border-border rounded-2xl italic text-xs font-semibold">
            "Por favor, você pode dar um espaço?" ⭕
          </div>
          <button onClick={() => setIsTipOpen(false)} className="btn-primary w-full py-3 font-bold text-sm mt-2">
            Entendi! 👍
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
