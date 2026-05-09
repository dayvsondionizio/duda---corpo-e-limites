import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, Loader2, MessageSquare, Plus, Delete, X, Send } from 'lucide-react';
import type { TherapistSettings } from '../App';
import type { AvatarConfig } from '../data';
import { generateContent } from '../services/GroqService';
import { AAC_CATEGORIES } from '../data';

interface Props {
  settings: TherapistSettings; say:(t:string, force?: boolean)=>void;
  onComplete:(id:string)=>void; onNavigate:(s:any)=>void; avatar:AvatarConfig;
}

const DEFAULT_PHRASES = [
  { text: 'Meu corpo é meu!', emoji: '💪', tip: 'Diga com confiança!' },
  { text: 'Eu posso dizer NÃO!', emoji: '✋', tip: 'Sua voz é importante!' },
  { text: 'Isso me deixa desconfortável.', emoji: '😕', tip: 'Falar como você se sente é corajoso!' },
  { text: 'Pare! Não gostei disso.', emoji: '🛑', tip: 'Você tem o direito de pedir para parar!' },
  { text: 'Vou contar para um adulto seguro.', emoji: '🤝', tip: 'Pedir ajuda é muito inteligente!' },
];

export function ModuleVoz({ say, onComplete, settings }: Props) {
  const [tab, setTab] = useState<'practice' | 'aac'>('practice');
  const [practiced, setPracticed] = useState<Set<number>>(new Set());
  const [activePower, setActivePower] = useState(0);
  const [phrases, setPhrases] = useState(DEFAULT_PHRASES);
  const [loading, setLoading] = useState(false);
  
  // AAC State
  const [selectedCategory, setSelectedCategory] = useState(AAC_CATEGORIES[0].id);
  const [sentence, setSentence] = useState<{id: string, label: string, icon: string}[]>([]);

  const practice = useCallback((i: number) => {
    // Actionable items always play sound (force: true)
    say(phrases[i].text, true);
    const newSet = new Set(practiced).add(i);
    setPracticed(newSet);
    const power = Math.round((newSet.size / phrases.length) * 100);
    setActivePower(power);
    if (newSet.size === phrases.length) {
      onComplete('voz');
    }
  }, [phrases, practiced, say, onComplete]);

  const addToSentence = (item: any) => {
    setSentence([...sentence, item]);
    // Actionable items always play sound (force: true)
    say(item.label, true);
  };

  const clearSentence = () => {
    setSentence([]);
  };

  const speakSentence = () => {
    if (sentence.length === 0) return;
    const fullText = sentence.map(s => s.label).join(' ');
    // Actionable items always play sound (force: true)
    say(fullText, true);
  };

  async function personalizePhrases() {
    if (!settings.groqApiKey) {
      // System feedback respects audioEnabled (force: false)
      say('Configure a chave da Groq para personalizar.');
      return;
    }
    setLoading(true);
    // User requested: Clicking "Personalizar com IA" should NOT have sound
    // say('A IA está preparando frases especiais para você...'); // Removed sound feedback

    const prompt = `Crie 5 frases curtas (max 4 palavras), empoderadoras e fáceis para uma criança com este perfil: "${settings.childProfile || 'Perfil geral'}". 
    Foco em autonomia corporal. Retorne APENAS JSON: [{"text": "...", "emoji": "...", "tip": "..."}]`;

    try {
      const result = await generateContent(settings.groqApiKey, prompt);
      const jsonStr = result.match(/\[[\s\S]*\]/)?.[0];
      if (jsonStr) {
        setPhrases(JSON.parse(jsonStr));
        setPracticed(new Set());
        setActivePower(0);
        // User requested: Only phrases and board have sound. 
        // This is a system success message, so we keep it silent if main audio is off.
        say('Frases personalizadas prontas!'); 
      }
    } catch (e) {
      say('Erro ao criar frases.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl text-teal font-bold">Minha Voz 📢</h2>
          <p className="text-muted mt-1">Use sua voz ou símbolos para se comunicar!</p>
        </div>
        
        <div className="flex bg-warm p-1 rounded-2xl border border-border self-start sm:self-center">
          <button onClick={() => setTab('practice')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === 'practice' ? 'bg-teal text-white shadow-md' : 'text-muted'}`}>
            Praticar Fala
          </button>
          <button onClick={() => setTab('aac')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === 'aac' ? 'bg-teal text-white shadow-md' : 'text-muted'}`}>
            Prancha de Símbolos
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {tab === 'practice' ? (
          <motion.div key="practice" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="space-y-6">
            <div className="card p-6 bg-teal/5 border-teal/10 flex items-center justify-between">
               <div className="space-y-1">
                 <p className="font-bold text-teal">Poder da Sua Voz: {activePower}%</p>
                 <p className="text-xs text-muted">Pratique todas as frases para fortalecer sua voz!</p>
               </div>
               <button onClick={personalizePhrases} disabled={loading} className="btn-secondary px-4 py-2 text-xs flex items-center gap-2">
                 {loading ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14}/>}
                 Personalizar com IA
               </button>
            </div>

            <div className="grid gap-3">
              {phrases.map((p, i) => (
                <button key={i} onClick={() => practice(i)}
                  className={`card p-5 text-left flex items-center gap-4 transition-all border-2 ${practiced.has(i) ? 'border-teal bg-teal/5 shadow-inner' : 'border-warm hover:border-teal/30 hover:bg-white'}`}>
                  <span className="text-4xl">{p.emoji}</span>
                  <div className="flex-1">
                    <p className="text-xl font-bold text-text leading-tight">{p.text}</p>
                    <p className="text-[10px] text-muted uppercase tracking-widest mt-1">{p.tip}</p>
                  </div>
                  <Volume2 size={24} className={practiced.has(i) ? 'text-teal' : 'text-muted'} />
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="aac" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="space-y-4">
            {/* Sentence Builder */}
            <div className="card p-4 min-h-[80px] bg-white border-teal/20 flex items-center gap-2 overflow-x-auto">
              {sentence.length === 0 ? (
                <p className="text-muted text-sm italic mx-auto">Toque nos símbolos abaixo para montar sua frase...</p>
              ) : (
                <>
                  <div className="flex gap-2 flex-1">
                    {sentence.map((s, idx) => (
                      <motion.div key={idx} initial={{scale:0}} animate={{scale:1}} className="flex flex-col items-center p-2 bg-teal/10 rounded-xl border border-teal/20 min-w-[60px]">
                        <span className="text-2xl">{s.icon}</span>
                        <span className="text-[8px] font-bold text-teal uppercase text-center mt-1">{s.label}</span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={clearSentence} className="p-3 bg-rose/10 text-rose rounded-full hover:bg-rose/20 transition-colors">
                      <X size={20} />
                    </button>
                    <button onClick={speakSentence} className="p-3 bg-teal text-white rounded-full shadow-lg hover:scale-105 transition-transform">
                      <Send size={20} />
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {AAC_CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 whitespace-nowrap transition-all ${selectedCategory === cat.id ? 'bg-teal text-white shadow-md' : 'bg-warm text-muted border border-border'}`}>
                  <span>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>

            {/* Symbols Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {AAC_CATEGORIES.find(c => c.id === selectedCategory)?.items.map(item => (
                <button key={item.id} onClick={() => addToSentence(item)}
                  className="card p-3 flex flex-col items-center gap-2 hover:border-teal transition-all active:scale-95 bg-white border-2 border-transparent shadow-sm">
                  <span className="text-4xl">{item.icon}</span>
                  <span className="text-[10px] font-bold text-center text-muted-dark uppercase tracking-tight">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
