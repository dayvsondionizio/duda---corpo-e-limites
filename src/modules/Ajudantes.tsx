import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HELPERS } from '../data';
import type { TherapistSettings } from '../App';
import type { AvatarConfig } from '../data';

interface Props {
  settings: TherapistSettings; say:(t:string)=>void;
  onComplete:(id:string)=>void; onNavigate:(s:any)=>void; avatar:AvatarConfig;
}

export function ModuleAjudantes({ say, onComplete }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [done, setDone] = useState(false);

  function toggle(id: string) {
    const s = new Set(selected);
    if(s.has(id)) s.delete(id); else s.add(id);
    setSelected(s);
    const h = HELPERS.find(h=>h.id===id)!;
    say(`${h.label}: ${h.desc}`);
  }

  function confirm() {
    if(selected.size < 2) { say('Escolha pelo menos 2 ajudantes!'); return; }
    setDone(true);
    onComplete('ajudantes');
    say('Muito bem! Você tem uma rede de adultos seguros!');
  }

  if(done) return (
    <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}
      className="card p-12 text-center space-y-6">
      <div className="text-8xl">🤝</div>
      <h3 className="text-4xl text-teal">Sua rede de segurança está pronta!</h3>
      <div className="flex flex-wrap justify-center gap-3">
        {[...selected].map(id => {
          const h = HELPERS.find(h=>h.id===id)!;
          return <span key={id} className="px-4 py-2 bg-teal/10 rounded-full text-teal font-bold">{h.icon} {h.label}</span>;
        })}
      </div>
      <p className="text-muted">Se precisar de ajuda, você pode contar com essas pessoas!</p>
      <button onClick={()=>{setDone(false);setSelected(new Set());}} className="btn-ghost px-8 py-3">Refazer escolha</button>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl text-teal">Minha Rede de Segurança 🤝</h2>
        <p className="text-muted mt-1">Quem são os adultos seguros que você pode chamar quando precisar de ajuda?</p>
      </div>

      <div className="card p-6 bg-blue/5 border border-blue/20 flex items-start gap-4">
        <span className="text-3xl">💡</span>
        <p className="text-sm text-muted"><strong className="text-blue">Dica:</strong> Escolha pelo menos 2 adultos em quem você confia. Adultos seguros sempre escutam você!</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {HELPERS.map(h => (
          <motion.button key={h.id} whileTap={{scale:0.95}}
            onClick={()=>toggle(h.id)}
            className={`flex flex-col items-center gap-3 p-6 rounded-4xl border-2 transition-all ${
              selected.has(h.id)
                ? 'bg-teal/10 border-teal scale-105 shadow-md'
                : 'bg-warm border-border hover:border-teal/30 grayscale hover:grayscale-0'
            }`}>
            <span className="text-5xl">{h.icon}</span>
            <p className="font-bold text-sm text-text text-center">{h.label}</p>
            {selected.has(h.id) && <span className="text-teal text-xs font-bold">✓ Selecionado</span>}
          </motion.button>
        ))}
      </div>

      {selected.size > 0 && (
        <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
          className="card p-5 bg-teal/5 border border-teal/20 space-y-2">
          <p className="font-bold text-teal">Sua equipe de segurança:</p>
          <div className="flex flex-wrap gap-2">
            {[...selected].map(id => {
              const h = HELPERS.find(h=>h.id===id)!;
              return <span key={id} className="px-3 py-1 bg-white border border-teal/30 rounded-full text-sm font-medium text-teal">{h.icon} {h.label}</span>;
            })}
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        <button onClick={confirm} disabled={selected.size<2}
          className={`btn-primary w-full py-4 text-lg disabled:opacity-40 disabled:cursor-not-allowed`}>
          Confirmar minha equipe! 🛡️
        </button>
        {selected.size < 2 && (
          <p className="text-center text-sm text-muted">Escolha pelo menos {2 - selected.size} pessoa(s) mais.</p>
        )}
      </div>

      <div className="card p-6 space-y-3">
        <p className="font-bold text-teal">🌟 O que fazer se precisar de ajuda?</p>
        <div className="space-y-2">
          {[
            '1. Fale para um adulto seguro o que aconteceu.',
            '2. Se um adulto não acreditar, conte para outro.',
            '3. Continue falando até alguém te ajudar.',
            '4. Você não vai se meter em problema por contar a verdade!',
          ].map((t,i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-warm rounded-2xl">
              <span className="text-teal font-bold shrink-0">{i+1}.</span>
              <p className="text-sm text-muted">{t.slice(3)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
