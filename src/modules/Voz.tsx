import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, Sparkles, Loader2 } from 'lucide-react';
import type { TherapistSettings } from '../App';
import type { AvatarConfig } from '../data';
import { generateContent } from '../services/GroqService';

interface Props {
  settings: TherapistSettings; say:(t:string)=>void;
  onComplete:(id:string)=>void; onNavigate:(s:any)=>void; avatar:AvatarConfig;
}

const DEFAULT_PHRASES = [
  { text: 'Meu corpo é meu!', emoji: '💪', tip: 'Diga com confiança!' },
  { text: 'Eu posso dizer NÃO!', emoji: '✋', tip: 'Sua voz é importante!' },
  { text: 'Isso me deixa desconfortável.', emoji: '😕', tip: 'Falar como você se sente é corajoso!' },
  { text: 'Pare! Não gostei disso.', emoji: '🛑', tip: 'Você tem o direito de pedir para parar!' },
  { text: 'Vou contar para um adulto seguro.', emoji: '🤝', tip: 'Pedir ajuda é muito inteligente!' },
  { text: 'Adultos seguros me escutam.', emoji: '👂', tip: 'Você merece ser ouvido!' },
  { text: 'Meu espaço merece respeito.', emoji: '⭕', tip: 'Seu espaço é importante!' },
];

export function ModuleVoz({ say, onComplete, settings }: Props) {
  const [practiced, setPracticed] = useState<Set<number>>(new Set());
  const [activePower, setActivePower] = useState(0);
  const [done, setDone] = useState(false);
  const [phrases, setPhrases] = useState(DEFAULT_PHRASES);
  const [loading, setLoading] = useState(false);

  async function personalizePhrases() {
    if (!settings.groqApiKey) {
      say('Por favor, configure a chave da Groq no modo profissional.');
      return;
    }
    setLoading(true);
    say('A IA está preparando frases especiais para você...');

    const prompt = `Crie 5 frases curtas, empoderadoras e fáceis de falar para uma criança com o seguinte perfil: "${settings.childProfile || 'Perfil não especificado'}". 
    As frases devem focar em autonomia e limites (ex: "Meu corpo é meu", "Não gosto disso", "Pare, por favor"). 
    Retorne APENAS um array JSON de objetos no formato:
    [{"text": "frase curta", "emoji": "emoji", "tip": "dica curta"}]`;

    try {
      const result = await generateContent(settings.groqApiKey, prompt);
      const jsonStr = result.match(/\[[\s\S]*\]/)?.[0];
      if (jsonStr) {
        const newPhrases = JSON.parse(jsonStr);
        setPhrases(newPhrases);
        setPracticed(new Set());
        setActivePower(0);
        say('Novas frases prontas!');
      }
    } catch (e) {
      console.error(e);
      say('Problema ao criar frases.');
    } finally {
      setLoading(false);
    }
  }

  function practice(i: number) {
    say(phrases[i].text);
    const newSet = new Set(practiced).add(i);
    setPracticed(newSet);
    const power = Math.round((newSet.size / phrases.length) * 100);
    setActivePower(power);
    if (newSet.size === phrases.length) {
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
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-3xl sm:text-4xl text-teal truncate">Minha Voz 📢</h2>
          <p className="text-muted mt-1 text-sm">Pratique dizer estas frases em voz alta.</p>
        </div>
        <button onClick={personalizePhrases} disabled={loading}
          className="btn-primary px-4 py-2 text-xs flex items-center gap-2 shrink-0 bg-purple hover:bg-purple-dark border-none shadow-none">
          {loading ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14}/>}
          <span className="hidden sm:inline">{loading ? 'Personalizando...' : 'IA: Frases Curtas'}</span>
        </button>
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
      </div>

      {/* Phrases */}
      <div className="space-y-3">
        {phrases.map((p, i) => (
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
    </div>
  );
}
