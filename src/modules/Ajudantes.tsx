import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HELPERS, Helper, BODY_PARTS, BodyPart } from '../data';
import type { TherapistSettings } from '../App';
import type { AvatarConfig } from '../data';
import { Avatar } from '../Avatar';
import { Shield, ChevronRight, CheckCircle2, RotateCcw, ChevronLeft } from 'lucide-react';

interface Props {
  settings: TherapistSettings; say:(t:string)=>void;
  onComplete:(id:string)=>void; onNavigate:(s:any)=>void; avatar:AvatarConfig;
  customHelpers: Helper[];
}

export function ModuleAjudantes({ say, onComplete, customHelpers, avatar }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [interactingWith, setInteractingWith] = useState<string | null>(null);
  const [helperParts, setHelperParts] = useState<Record<string, string[]>>({});
  const [view, setView] = useState<'front' | 'back'>('front');
  const [done, setDone] = useState(false);

  const allHelpers = [...HELPERS, ...customHelpers];

  function toggleHelper(id: string) {
    const s = new Set(selected);
    if(s.has(id)) {
      s.delete(id);
      const newParts = { ...helperParts };
      delete newParts[id];
      setHelperParts(newParts);
    } else {
      s.add(id);
      setInteractingWith(id);
      say(`Vamos escolher onde este ajudante pode tocar em você.`);
    }
    setSelected(s);
  }

  function togglePart(partId: string) {
    if(!interactingWith) return;
    const parts = helperParts[interactingWith] || [];
    const newParts = parts.includes(partId) 
      ? parts.filter(p => p !== partId) 
      : [...parts, partId];
    
    setHelperParts({ ...helperParts, [interactingWith]: newParts });
    const part = BODY_PARTS.find(p => p.id === partId);
    if(part) say(part.label);
  }

  function confirm() {
    if(selected.size < 2) { say('Escolha pelo menos 2 ajudantes!'); return; }
    setDone(true);
    onComplete('ajudantes');
    say('Muito bem! Você definiu quem são seus ajudantes e onde eles podem tocar.');
  }

  const currentHelper = interactingWith ? allHelpers.find(h => h.id === interactingWith) : null;

  if(done) return (
    <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}
      className="card p-12 text-center space-y-6">
      <div className="text-8xl">🤝</div>
      <h3 className="text-4xl text-teal font-bold">Sua rede de segurança está pronta!</h3>
      <div className="grid sm:grid-cols-2 gap-4 text-left">
        {[...selected].map(id => {
          const h = allHelpers.find(x=>x.id===id)!;
          const parts = helperParts[id] || [];
          return (
            <div key={id} className="card p-4 bg-teal/5 border border-teal/20 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{h.icon}</span>
                <span className="font-bold text-teal">{h.label}</span>
              </div>
              <p className="text-[10px] text-muted uppercase font-bold">Pode tocar em:</p>
              <div className="flex flex-wrap gap-1">
                {parts.length > 0 ? parts.map(p => (
                  <span key={p} className="px-2 py-0.5 bg-white rounded-full text-[10px] border border-teal/10">{BODY_PARTS.find(bp=>bp.id===p)?.label}</span>
                )) : <span className="text-[10px] text-rose">Nenhuma parte selecionada</span>}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-muted italic">"Lembre-se: seu corpo é seu, e você decide quem pode tocar nele!"</p>
      <button onClick={()=>{setDone(false);setSelected(new Set());setHelperParts({});}} className="btn-ghost px-8 py-3 flex items-center gap-2 mx-auto">
        <RotateCcw size={16}/> Refazer Rede
      </button>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {!interactingWith ? (
          <motion.div key="selection" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}} className="space-y-8">
            <header>
              <h2 className="text-4xl text-teal font-bold">Minha Rede de Segurança 🤝</h2>
              <p className="text-muted mt-1">Quem são os adultos seguros que você confia?</p>
            </header>

            <div className="card p-6 bg-blue/5 border border-blue/20 flex items-start gap-4">
              <div className="w-10 h-10 bg-blue/10 rounded-xl flex items-center justify-center shrink-0">
                <Shield size={20} className="text-blue" />
              </div>
              <p className="text-sm text-muted">Escolha pessoas que te escutam e te protegem. Você vai decidir onde cada uma pode tocar.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {allHelpers.map(h => (
                <button key={h.id} onClick={() => toggleHelper(h.id)}
                  className={`card card-hover p-6 text-center space-y-3 border-2 transition-all group ${selected.has(h.id) ? 'border-teal bg-teal/5' : 'border-warm grayscale hover:grayscale-0'}`}>
                  <span className="text-5xl block group-hover:scale-110 transition-transform">{h.icon}</span>
                  <p className="font-bold text-sm">{h.label}</p>
                  {selected.has(h.id) && (
                    <button onClick={(e) => { e.stopPropagation(); setInteractingWith(h.id); }} 
                      className="text-[10px] font-bold text-teal hover:underline flex items-center justify-center gap-1 mx-auto mt-2">
                      Ajustar Toques <ChevronRight size={10}/>
                    </button>
                  )}
                </button>
              ))}
            </div>

            {selected.size >= 2 && (
              <button onClick={confirm} className="btn-primary w-full py-4 text-lg">
                Finalizar Minha Rede! ✨
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div key="interaction" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="space-y-6">
            <header className="flex items-center justify-between">
              <button onClick={() => setInteractingWith(null)} className="flex items-center gap-2 text-muted hover:text-teal transition-colors">
                <ChevronLeft size={20}/> <span className="font-bold uppercase text-[10px] tracking-widest">Voltar</span>
              </button>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentHelper?.icon}</span>
                <h3 className="text-2xl font-bold text-teal">Onde {currentHelper?.label} pode tocar?</h3>
              </div>
              <div className="w-20" /> {/* Spacer */}
            </header>

            <div className="flex flex-col md:flex-row items-center gap-12 py-8 bg-white/40 rounded-[3rem] border border-white/60">
              <div className="relative">
                <Avatar 
                  config={avatar} 
                  size="xl" 
                  backView={view === 'back'}
                  onPartClick={togglePart}
                  highlightPart={helperParts[interactingWith!]?.[helperParts[interactingWith!]?.length - 1]}
                />
                <button onClick={() => setView(v => v === 'front' ? 'back' : 'front')}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 btn-secondary px-4 py-2 rounded-full text-xs flex items-center gap-2 border-2 border-teal/20 bg-white shadow-lg">
                  <RotateCcw size={14}/> {view === 'front' ? 'Ver as Costas' : 'Ver a Frente'}
                </button>
              </div>

              <div className="flex-1 space-y-6 px-8 w-full">
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-muted uppercase tracking-widest">Partes selecionadas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {(helperParts[interactingWith!] || []).length === 0 && <p className="text-xs text-muted italic">Clique no corpo para selecionar...</p>}
                    {(helperParts[interactingWith!] || []).map(pid => (
                      <span key={pid} onClick={() => togglePart(pid)}
                        className="px-4 py-2 bg-teal text-white rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-teal-dark transition-colors">
                        {BODY_PARTS.find(p=>p.id===pid)?.label} ✕
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-warm/50 rounded-3xl space-y-3">
                  <p className="text-xs font-bold text-teal uppercase tracking-widest">Dicas do Ajudante:</p>
                  <p className="text-sm text-muted"><strong>{currentHelper?.label}</strong> costuma se aproximar assim: <span className="italic">"{currentHelper?.approach}"</span></p>
                  <p className="text-sm text-muted">Toque geralmente permitido: <span className="italic">"{currentHelper?.allowedTouch}"</span></p>
                </div>

                <button onClick={() => setInteractingWith(null)} className="btn-primary w-full py-4 text-lg">
                  Salvar Escolha para {currentHelper?.label} ✅
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
