import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HELPERS, Helper, BODY_PARTS, BodyPart } from '../data';
import type { TherapistSettings } from '../App';
import type { AvatarConfig } from '../data';
import { Avatar } from '../Avatar';
import { Shield, ChevronRight, CheckCircle2, RotateCcw, ChevronLeft, Info } from 'lucide-react';
import { BottomSheet } from '../components/BottomSheet';

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

  // Mobile responsiveness and state
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [isHelperTipOpen, setIsHelperTipOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      className="card p-6 md:p-12 text-center space-y-6 max-w-2xl mx-auto">
      <div className="text-7xl md:text-8xl">🤝</div>
      <h3 className="text-3xl md:text-4xl text-teal font-bold">Sua rede de segurança está pronta!</h3>
      <div className="grid sm:grid-cols-2 gap-4 text-left max-h-[40vh] overflow-y-auto p-1 custom-scrollbar">
        {[...selected].map(id => {
          const h = allHelpers.find(x=>x.id===id)!;
          const parts = helperParts[id] || [];
          return (
            <div key={id} className="card p-4 bg-teal/5 border border-teal/20 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{h.icon}</span>
                <span className="font-bold text-teal">{h.label}</span>
              </div>
              <p className="text-[9px] text-muted uppercase font-bold">Pode tocar em:</p>
              <div className="flex flex-wrap gap-1">
                {parts.length > 0 ? parts.map(p => (
                  <span key={p} className="px-2 py-0.5 bg-white rounded-full text-[9px] border border-teal/10">{BODY_PARTS.find(bp=>bp.id===p)?.label}</span>
                )) : <span className="text-[9px] text-rose font-bold">Nenhuma parte selecionada</span>}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-muted italic text-sm md:text-base">"Lembre-se: seu corpo é seu, e você decide quem pode tocar nele!"</p>
      <button onClick={()=>{setDone(false);setSelected(new Set());setHelperParts({});}} className="btn-ghost px-8 py-3 flex items-center gap-2 mx-auto cursor-pointer">
        <RotateCcw size={16}/> Refazer Rede
      </button>
    </motion.div>
  );

  return (
    <div className="space-y-6 flex flex-col min-h-[75vh]">
      <AnimatePresence mode="wait">
        {!interactingWith ? (
          <motion.div key="selection" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}} className="space-y-6 flex flex-col justify-between flex-1">
            <div className="space-y-4">
              <header>
                <h2 className="text-3xl md:text-4xl text-teal font-bold">Rede de Segurança 🤝</h2>
                <p className="text-muted mt-1 text-xs md:text-sm">Quem são os adultos seguros em quem você confia?</p>
              </header>

              <div className="card p-4 bg-blue/5 border border-blue/20 flex items-start gap-3">
                <div className="w-8 h-8 bg-blue/10 rounded-xl flex items-center justify-center shrink-0">
                  <Shield size={16} className="text-blue" />
                </div>
                <p className="text-xs md:text-sm text-muted">Escolha pessoas que te escutam e te protegem. Você vai decidir onde cada uma pode tocar.</p>
              </div>

              {/* Scrollable list frame to avoid page scroll */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-h-[42vh] overflow-y-auto p-1 custom-scrollbar">
                {allHelpers.map(h => (
                  <button key={h.id} onClick={() => toggleHelper(h.id)}
                    className={`card card-hover p-4 md:p-6 text-center space-y-2 border-2 transition-all cursor-pointer group ${selected.has(h.id) ? 'border-teal bg-teal/5' : 'border-warm grayscale hover:grayscale-0'}`}>
                    <span className="text-4xl md:text-5xl block group-hover:scale-110 transition-transform">{h.icon}</span>
                    <p className="font-bold text-xs md:text-sm truncate">{h.label}</p>
                    {selected.has(h.id) && (
                      <button onClick={(e) => { e.stopPropagation(); setInteractingWith(h.id); }} 
                        className="text-[9px] font-bold text-teal hover:underline flex items-center justify-center gap-1 mx-auto mt-2 cursor-pointer">
                        Toques <ChevronRight size={8}/>
                      </button>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {selected.size >= 2 && (
              <button onClick={confirm} className="btn-primary w-full py-4 text-base shadow-lg pt-4">
                Finalizar Minha Rede! ✨
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div key="interaction" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} className="space-y-6 flex flex-col justify-between flex-1">
            <header className="flex items-center justify-between gap-4">
              <button onClick={() => setInteractingWith(null)} className="flex items-center gap-1.5 text-muted hover:text-teal transition-colors cursor-pointer">
                <ChevronLeft size={18}/> <span className="font-bold uppercase text-[9px] tracking-widest">Voltar</span>
              </button>
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-3xl shrink-0">{currentHelper?.icon}</span>
                <h3 className="text-lg md:text-xl font-bold text-teal truncate">Toques para: {currentHelper?.label}</h3>
              </div>
              <button
                onClick={() => { setIsHelperTipOpen(true); say(`Dicas para ${currentHelper?.label}: ${currentHelper?.allowedTouch}`); }}
                className="btn-ghost p-2 rounded-xl text-xs flex items-center gap-1 bg-teal/5 border-teal/20 text-teal font-bold cursor-pointer shrink-0"
              >
                <Info size={14} />
              </button>
            </header>

            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 py-5 px-4 md:px-8 bg-white/40 rounded-[2.5rem] border border-white/60 flex-1 justify-center">
              {/* Responsive Avatar display */}
              <div className="relative">
                <Avatar 
                  config={avatar} 
                  size={isMobile ? 'md' : 'xl'} 
                  backView={view === 'back'}
                  onPartClick={togglePart}
                  highlightPart={helperParts[interactingWith!]?.[helperParts[interactingWith!]?.length - 1]}
                />
                <button onClick={() => setView(v => v === 'front' ? 'back' : 'front')}
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 btn-secondary px-4 py-1.5 rounded-full text-[10px] flex items-center gap-1.5 border-2 border-teal/20 bg-white/95 shadow-md cursor-pointer">
                  <RotateCcw size={12}/> {view === 'front' ? 'Costas' : 'Frente'}
                </button>
              </div>

              <div className="flex-1 space-y-4 w-full">
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-bold text-muted uppercase tracking-widest">Toques permitidos:</h4>
                  <div className="flex flex-wrap gap-1.5 max-h-[20vh] overflow-y-auto pr-1">
                    {(helperParts[interactingWith!] || []).length === 0 && <p className="text-xs text-muted italic">Toque no corpo do boneco para escolher...</p>}
                    {(helperParts[interactingWith!] || []).map(pid => (
                      <span key={pid} onClick={() => togglePart(pid)}
                        className="px-3 py-1.5 bg-teal text-white rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-teal-dark transition-colors">
                        {BODY_PARTS.find(p=>p.id===pid)?.label} ✕
                      </span>
                    ))}
                  </div>
                </div>

                {!isMobile && (
                  <div className="p-5 bg-warm/50 rounded-3xl space-y-2 text-xs md:text-sm">
                    <p className="text-[10px] font-bold text-teal uppercase tracking-widest leading-none">Dicas do Ajudante:</p>
                    <p className="text-muted leading-relaxed"><strong>{currentHelper?.label}</strong> costuma se aproximar assim: <span className="italic">"{currentHelper?.approach}"</span></p>
                    <p className="text-muted leading-relaxed">Toque geralmente permitido: <span className="italic">"{currentHelper?.allowedTouch}"</span></p>
                  </div>
                )}

                <button onClick={() => setInteractingWith(null)} className="btn-primary w-full py-4 text-base shadow-lg">
                  Salvar Toques de {currentHelper?.label} ✅
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helper Tips Mobile Sheet */}
      <BottomSheet isOpen={isMobile && isHelperTipOpen} onClose={() => setIsHelperTipOpen(false)} title={`Dicas do Ajudante`}>
        {currentHelper && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 justify-center pb-2">
              <span className="text-5xl">{currentHelper.icon}</span>
              <div className="text-left">
                <h4 className="text-xl font-bold text-teal">{currentHelper.label}</h4>
                <p className="text-xs text-muted font-medium">{currentHelper.desc}</p>
              </div>
            </div>
            
            <div className="p-4 bg-teal/5 border border-teal/15 rounded-2xl space-y-3 text-left">
              <div>
                <p className="text-[9px] font-bold text-teal uppercase tracking-wider mb-1">Como se aproxima:</p>
                <p className="text-sm text-text font-semibold">"{currentHelper.approach}"</p>
              </div>
              
              <div className="border-t border-teal/10 pt-2">
                <p className="text-[9px] font-bold text-teal uppercase tracking-wider mb-1">Toques permitidos pela regra:</p>
                <p className="text-sm text-text font-semibold">"{currentHelper.allowedTouch}"</p>
              </div>
            </div>

            <button onClick={() => setIsHelperTipOpen(false)} className="btn-primary w-full py-3.5 font-bold text-sm">
              Entendi! 👍
            </button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
