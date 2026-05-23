import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Sparkles, Loader2 } from 'lucide-react';
import { STORIES, Story, AvatarConfig, HELP_EMOJIS } from '../data';
import { generateContent } from '../services/GroqService';
import type { TherapistSettings } from '../App';

interface Props {
  settings: TherapistSettings; say:(t:string)=>void;
  onComplete:(id:string)=>void; onNavigate:(s:any)=>void; avatar:AvatarConfig;
}

export function ModuleHistorias({ say, onComplete, settings }: Props) {
  const [localStories, setLocalStories] = useState<Story[]>(STORIES);
  const [storyIdx, setStoryIdx] = useState(0);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [picked, setPicked] = useState<boolean|null>(null);
  const [feedback, setFeedback] = useState('');
  const [storyDone, setStoryDone] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [loading, setLoading] = useState(false);

  // Mobile responsiveness
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const story = localStories[storyIdx];
  const scene = story?.scenes[sceneIdx];
  const isLast = sceneIdx === (story?.scenes.length ?? 0) - 1;

  async function generateAIStory() {
    if (!settings.groqApiKey) {
      say('Por favor, configure a chave da Groq no modo profissional.');
      return;
    }
    
    setLoading(true);
    say('A IA está criando uma história especial para você...');
    
    const prompt = `Gere uma história social baseada em limites corporais e toques seguros.
    Perfil da criança: "${settings.childProfile || 'Criança neurotípica em aprendizado básico'}".
    A história deve conter exatamente 3 cenas e a última deve incluir um questionário.
    MUITO IMPORTANTE: Retorne APENAS o JSON puro, sem marcações de markdown (como \`\`\`json).
    Use o seguinte formato exato:
    {
      "title": "Título Criativo",
      "icon": "Emoji",
      "scenes": [
        {"text": "texto lúdico da cena 1", "emoji": "emoji1", "speaker": "Narrador"},
        {"text": "texto lúdico da cena 2", "emoji": "emoji2", "speaker": "Narrador"},
        {
          "text": "texto de fechamento da cena 3", "emoji": "emoji3", "speaker": "Narrador",
          "question": "Como o personagem deve agir?",
          "options": [
            {"text": "Opção segura (certa)", "correct": true, "feedback": "Muito bem! O corpo é seu e você manda nele.", "emoji": "✅"},
            {"text": "Opção insegura (errada)", "correct": false, "feedback": "Não, você pode sempre dizer 'não' para toques que não quer.", "emoji": "❌"}
          ]
        }
      ]
    }`;

    try {
      const result = await generateContent(settings.groqApiKey, prompt);
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const newStory = JSON.parse(jsonMatch[0]);
        newStory.id = Date.now();
        setLocalStories([newStory, ...localStories]);
        setStoryIdx(0);
        setSceneIdx(0);
        setPicked(null);
        setStoryDone(false);
        say(`Nova história criada: ${newStory.title}`);
      } else {
        throw new Error('JSON não encontrado na resposta.');
      }
    } catch (e) {
      console.error(e);
      say('Desculpe, tive um problema ao criar a história.');
    } finally {
      setLoading(false);
    }
  }

  function next() {
    if (isLast) { setStoryDone(true); return; }
    setPicked(null); setFeedback('');
    setSceneIdx(i=>i+1);
    const sText = localStories[storyIdx].scenes[sceneIdx+1].text;
    say(sText);
  }

  function prev() {
    if (sceneIdx > 0) { setSceneIdx(i=>i-1); setPicked(null); setFeedback(''); }
  }

  function answer(opt: { text:string; correct:boolean; feedback:string; emoji:string }) {
    if (picked !== null) return;
    setPicked(opt.correct);
    setFeedback(opt.feedback);
    say(opt.feedback);
  }

  function nextStory() {
    if (storyIdx + 1 >= localStories.length) { setAllDone(true); onComplete('historias'); return; }
    setStoryIdx(i=>i+1);
    setSceneIdx(0); setPicked(null); setFeedback(''); setStoryDone(false);
    say(localStories[storyIdx+1].scenes[0].text);
  }

  if (allDone) return (
    <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}
      className="card p-8 md:p-12 text-center space-y-6 max-w-lg mx-auto">
      <div className="text-7xl md:text-8xl">📖</div>
      <h3 className="text-3xl md:text-4xl text-teal font-bold">Você é um leitor incrível!</h3>
      <p className="text-lg text-muted">Completou todas as histórias. Você aprendeu muito sobre respeito e limites!</p>
      <button onClick={()=>{setAllDone(false);setStoryIdx(0);setSceneIdx(0);setPicked(null);setFeedback('');setStoryDone(false);}}
        className="btn-ghost px-8 py-3 mx-auto cursor-pointer">Ler de novo</button>
    </motion.div>
  );

  if (storyDone) return (
    <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}}
      className="card p-8 md:p-12 text-center space-y-6 max-w-lg mx-auto">
      <div className="text-7xl md:text-8xl">{story?.icon}</div>
      <h3 className="text-2xl md:text-3xl text-teal font-bold">Fim de "{story?.title}"!</h3>
      <p className="text-base text-muted">Você terminou essa história. O que aprendeu?</p>
      <div className="card p-4 bg-teal/5 border border-teal/20">
        <p className="font-bold text-teal text-sm">💡 Lição: Todo mundo merece ter seus limites respeitados!</p>
      </div>
      {storyIdx + 1 < localStories.length ? (
        <button onClick={nextStory} className="btn-primary px-10 py-4 text-base flex items-center gap-2 mx-auto cursor-pointer">
          Próxima história <ChevronRight size={18}/>
        </button>
      ) : (
        <button onClick={nextStory} className="btn-primary px-10 py-4 text-base mx-auto cursor-pointer">
          Finalizar! 🎉
        </button>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-5 flex flex-col min-h-[75vh] justify-between">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-2xl sm:text-3xl text-teal truncate font-bold">Histórias 📖</h2>
            <p className="text-muted mt-1 text-xs">História {storyIdx+1} de {localStories.length}: <strong className="text-text">{story?.title}</strong></p>
          </div>
          <button onClick={generateAIStory} disabled={loading}
            className="btn-primary px-4 py-2 text-xs flex items-center gap-2 shrink-0 bg-purple hover:bg-purple-dark border-none shadow-none cursor-pointer">
            {loading ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14}/>}
            <span>{loading ? 'Criando...' : 'Criar com IA'}</span>
          </button>
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <p className="text-[10px] text-muted font-bold">Cena {sceneIdx+1} de {story.scenes.length}</p>
          <div className="progress-track">
            <div className="progress-fill" style={{width:`${((sceneIdx+1)/story.scenes.length)*100}%`}}/>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={sceneIdx} initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}}
          className="space-y-4 flex-1 flex flex-col justify-center">

          {/* Visual Scene Animation Box */}
          <div className={`relative ${isMobile ? 'h-36' : 'h-64'} bg-gradient-to-b from-teal/10 to-cream rounded-4xl flex items-center justify-center overflow-hidden border-2 border-white/50 shadow-inner shrink-0`}>
             {/* Background elements */}
             <motion.span animate={{y: [0,-15,0], opacity: [0.3,0.6,0.3]}} transition={{duration:4, repeat:Infinity}} className="absolute top-6 left-6 text-2xl opacity-20 pointer-events-none">☁️</motion.span>
             <motion.span animate={{y: [0,15,0], opacity: [0.3,0.6,0.3]}} transition={{duration:5, repeat:Infinity}} className="absolute top-10 right-6 text-2xl opacity-20 pointer-events-none">✨</motion.span>
             
             {/* Main emoji */}
             <motion.div key={sceneIdx} initial={{scale:0, rotate:-20}} animate={{scale:1, rotate:0}} transition={{type:'spring', damping:12}}
               className={`${isMobile ? 'text-6xl' : 'text-8xl'} filter drop-shadow-xl z-10`}>
               {scene.emoji || '📖'}
             </motion.div>

             {/* Dynamic feedback elements */}
             {picked === true && (
                <motion.div initial={{scale:0}} animate={{scale:1.4}} className="absolute text-5xl z-20">🎉</motion.div>
             )}
          </div>

          {/* Text card */}
          <div className={`card ${isMobile ? 'p-5' : 'p-8'} space-y-3 shadow-md flex-1 flex flex-col justify-between max-h-[220px] overflow-y-auto`}>
            <div>
              {scene.speaker && <p className="text-[10px] font-bold text-teal uppercase tracking-[0.2em]">{scene.speaker}:</p>}
              <p className={`${isMobile ? 'text-base' : 'text-2xl'} text-text leading-relaxed font-bold`}>"{scene.text}"</p>
            </div>
            <button onClick={()=>say(scene.text)} className="btn-ghost px-3 py-1.5 text-[10px] flex items-center gap-1.5 w-fit mt-2 cursor-pointer bg-warm/30">
               🔊 Ouvir Narrador
             </button>
          </div>

          {/* Question inside quiz scene */}
          {scene.question && (
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-bold text-text text-center">{scene.question}</h3>
              <div className="grid gap-2.5 max-w-md mx-auto w-full">
                {scene.options?.map((opt, i) => (
                  <button key={i} onClick={()=>answer(opt)}
                    className={`btn-option flex items-center gap-3 p-3.5 text-sm ${
                      picked !== null
                        ? opt.correct ? 'border-green bg-green/10 text-green' : 'opacity-50'
                        : ''
                    }`}>
                    <span className="text-xl">{opt.emoji}</span>
                    <span className="font-bold text-left">{opt.text}</span>
                  </button>
                ))}
              </div>
              
              <div className="min-h-[44px] flex items-center justify-center">
                <AnimatePresence>
                  {feedback && (
                    <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
                      className={`p-3 rounded-2xl font-bold text-xs text-center w-full max-w-md ${picked ? 'bg-green/10 text-green':'bg-rose/10 text-rose'}`}>
                      {feedback}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <button onClick={prev} disabled={sceneIdx===0}
          className="btn-ghost px-5 py-2.5 text-sm flex items-center gap-1.5 disabled:opacity-30 cursor-pointer">
          <ChevronLeft size={16}/> Anterior
        </button>
        {(!scene.question || picked !== null) && (
          <button onClick={next} className="btn-primary px-6 py-2.5 text-sm flex items-center gap-1.5 cursor-pointer">
            {isLast ? 'Finalizar' : 'Próxima'} <ChevronRight size={16}/>
          </button>
        )}
      </div>
    </div>
  );
}
