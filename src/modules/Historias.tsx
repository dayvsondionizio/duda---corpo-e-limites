import React, { useState } from 'react';
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
    
    const prompt = `Crie uma história social terapêutica curta para uma criança com o seguinte perfil: "${settings.childProfile || 'Perfil não especificado'}". 
    A história deve ter 3 cenas. Cada cena deve ter um texto, um emoji e a última cena deve ter uma pergunta de múltipla escolha com 2 opções (uma correta e uma incorreta com feedback). 
    Retorne APENAS um JSON no formato:
    {
      "title": "Título da História",
      "icon": "Emoji",
      "scenes": [
        {"text": "texto da cena 1", "emoji": "emoji1", "speaker": "Narrador"},
        {"text": "texto da cena 2", "emoji": "emoji2", "speaker": "Narrador"},
        {
          "text": "texto da cena 3", "emoji": "emoji3", "speaker": "Narrador",
          "question": "Pergunta sobre a história?",
          "options": [
            {"text": "Opção correta", "correct": true, "feedback": "Feedback positivo", "emoji": "✅"},
            {"text": "Opção incorreta", "correct": false, "feedback": "Feedback educativo", "emoji": "❌"}
          ]
        }
      ]
    }`;

    try {
      const result = await generateContent(settings.groqApiKey, prompt);
      const jsonStr = result.match(/\{[\s\S]*\}/)?.[0];
      if (jsonStr) {
        const newStory = JSON.parse(jsonStr);
        newStory.id = Date.now();
        setLocalStories([newStory, ...localStories]);
        setStoryIdx(0);
        setSceneIdx(0);
        setPicked(null);
        setStoryDone(false);
        say(`Nova história criada: ${newStory.title}`);
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
      className="card p-12 text-center space-y-6">
      <div className="text-8xl">📖</div>
      <h3 className="text-4xl text-teal">Você é um leitor incrível!</h3>
      <p className="text-lg text-muted">Completou todas as histórias. Você aprendeu muito sobre respeito e limites!</p>
      <button onClick={()=>{setAllDone(false);setStoryIdx(0);setSceneIdx(0);setPicked(null);setFeedback('');setStoryDone(false);}}
        className="btn-ghost px-8 py-3">Ler de novo</button>
    </motion.div>
  );

  if (storyDone) return (
    <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}}
      className="card p-12 text-center space-y-6">
      <div className="text-8xl">{story?.icon}</div>
      <h3 className="text-3xl text-teal">Fim de "{story?.title}"!</h3>
      <p className="text-lg text-muted">Você terminou essa história. O que aprendeu?</p>
      <div className="card p-4 bg-teal/5 border border-teal/20">
        <p className="font-bold text-teal">💡 Lição: Todo mundo merece ter seus limites respeitados!</p>
      </div>
      {storyIdx + 1 < localStories.length ? (
        <button onClick={nextStory} className="btn-primary px-10 py-4 text-lg flex items-center gap-2 mx-auto">
          Próxima história <ChevronRight size={20}/>
        </button>
      ) : (
        <button onClick={nextStory} className="btn-primary px-10 py-4 text-lg mx-auto">
          Finalizar! 🎉
        </button>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-3xl sm:text-4xl text-teal truncate">Histórias 📖</h2>
          <p className="text-muted mt-1 text-sm">História {storyIdx+1} de {localStories.length}: <strong>{story?.title}</strong></p>
        </div>
        <button onClick={generateAIStory} disabled={loading}
          className="btn-primary px-4 py-2 text-xs flex items-center gap-2 shrink-0 bg-purple hover:bg-purple-dark border-none shadow-none">
          {loading ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14}/>}
          <span className="hidden sm:inline">{loading ? 'Criando...' : 'IA: Nova História'}</span>
        </button>
      </div>

      {/* Progress */}
      <div className="space-y-1">
        <p className="text-xs text-muted font-bold">Cena {sceneIdx+1} de {story.scenes.length}</p>
        <div className="progress-track">
          <div className="progress-fill" style={{width:`${((sceneIdx+1)/story.scenes.length)*100}%`}}/>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={sceneIdx} initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}}
          className="space-y-6">

          {/* Visual Scene Animation Box */}
          <div className="relative h-64 bg-gradient-to-b from-teal/10 to-cream rounded-4xl flex items-center justify-center overflow-hidden border-2 border-white/50 shadow-inner">
             {/* Background elements */}
             <motion.span animate={{y: [0,-20,0], opacity: [0.3,0.6,0.3]}} transition={{duration:4, repeat:Infinity}} className="absolute top-10 left-10 text-3xl opacity-20">☁️</motion.span>
             <motion.span animate={{y: [0,20,0], opacity: [0.3,0.6,0.3]}} transition={{duration:5, repeat:Infinity}} className="absolute top-20 right-10 text-3xl opacity-20">✨</motion.span>
             <motion.span animate={{scale: [1,1.2,1]}} transition={{duration:3, repeat:Infinity}} className="absolute bottom-10 left-1/4 text-2xl opacity-10">🌱</motion.span>
             
             {/* Main emoji / character */}
             <motion.div key={sceneIdx} initial={{scale:0, rotate:-20}} animate={{scale:1, rotate:0}} transition={{type:'spring', damping:12}}
               className="text-8xl filter drop-shadow-xl z-10">
               {scene.emoji || '📖'}
             </motion.div>

             {/* Dynamic feedback elements */}
             {picked === true && (
                <motion.div initial={{scale:0}} animate={{scale:1.5}} className="absolute text-6xl">🎉</motion.div>
             )}
          </div>

          {/* Text card */}
          <div className="card p-8 space-y-4 shadow-xl">
            {scene.speaker && <p className="text-xs font-bold text-teal uppercase tracking-[0.2em]">{scene.speaker}:</p>}
            <p className="text-2xl text-text leading-relaxed font-bold">"{scene.text}"</p>
            <button onClick={()=>say(scene.text)} className="btn-ghost px-4 py-2 text-xs flex items-center gap-2">
               🔊 Ouvir Narrador
            </button>
          </div>

          {/* Question */}
          {scene.question && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-text text-center">{scene.question}</h3>
              <div className="space-y-3">
                {scene.options?.map((opt, i) => (
                  <button key={i} onClick={()=>answer(opt)}
                    className={`btn-option flex items-center gap-4 ${
                      picked !== null
                        ? opt.correct ? 'border-green bg-green/10 text-green' : 'opacity-50'
                        : ''
                    }`}>
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="font-bold">{opt.text}</span>
                  </button>
                ))}
              </div>
              <AnimatePresence>
                {feedback && (
                  <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
                    className={`p-4 rounded-3xl font-bold text-center ${picked ? 'bg-green/10 text-green':'bg-rose/10 text-rose'}`}>
                    {feedback}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <button onClick={prev} disabled={sceneIdx===0}
          className="btn-ghost px-6 py-3 flex items-center gap-2 disabled:opacity-30">
          <ChevronLeft size={18}/> Anterior
        </button>
        {(!scene.question || picked !== null) && (
          <button onClick={next} className="btn-primary px-8 py-3 flex items-center gap-2">
            {isLast ? 'Finalizar história' : 'Próxima cena'} <ChevronRight size={18}/>
          </button>
        )}
      </div>
    </div>
  );
}
