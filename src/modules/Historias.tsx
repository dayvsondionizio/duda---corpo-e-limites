import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { STORIES } from '../data';
import type { TherapistSettings } from '../App';
import type { AvatarConfig } from '../data';

interface Props {
  settings: TherapistSettings; say:(t:string)=>void;
  onComplete:(id:string)=>void; onNavigate:(s:any)=>void; avatar:AvatarConfig;
}

export function ModuleHistorias({ say, onComplete }: Props) {
  const [storyIdx, setStoryIdx] = useState(0);
  const [sceneIdx, setSceneIdx] = useState(0);
  const [picked, setPicked] = useState<boolean|null>(null);
  const [feedback, setFeedback] = useState('');
  const [storyDone, setStoryDone] = useState(false);
  const [allDone, setAllDone] = useState(false);

  const story = STORIES[storyIdx];
  const scene = story.scenes[sceneIdx];
  const isLast = sceneIdx === story.scenes.length - 1;

  function next() {
    if (isLast) { setStoryDone(true); return; }
    setPicked(null); setFeedback('');
    setSceneIdx(i=>i+1);
    say(story.scenes[sceneIdx+1].text);
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
    if (storyIdx + 1 >= STORIES.length) { setAllDone(true); onComplete('historias'); return; }
    setStoryIdx(i=>i+1);
    setSceneIdx(0); setPicked(null); setFeedback(''); setStoryDone(false);
    say(STORIES[storyIdx+1].scenes[0].text);
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
      <div className="text-8xl">{story.icon}</div>
      <h3 className="text-3xl text-teal">Fim de "{story.title}"!</h3>
      <p className="text-lg text-muted">Você terminou essa história. O que aprendeu?</p>
      <div className="card p-4 bg-teal/5 border border-teal/20">
        <p className="font-bold text-teal">💡 Lição: Todo mundo merece ter seus limites respeitados!</p>
      </div>
      {storyIdx + 1 < STORIES.length ? (
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl text-teal">Histórias Sociais 📖</h2>
          <p className="text-muted mt-1">História {storyIdx+1} de {STORIES.length}: <strong>{story.title}</strong></p>
        </div>
        <span className="text-4xl">{story.icon}</span>
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

          {/* Scene card */}
          <div className="card p-8 space-y-4 min-h-44">
            {scene.emoji && <span className="text-5xl block">{scene.emoji}</span>}
            {scene.speaker && <p className="text-xs font-bold text-teal uppercase tracking-wider">{scene.speaker}:</p>}
            <p className="text-2xl text-text leading-relaxed font-medium">"{scene.text}"</p>
            <button onClick={()=>say(scene.text)} className="text-sm text-teal hover:underline">🔊 Ouvir</button>
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
