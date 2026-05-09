import React from 'react';
import { motion } from 'motion/react';
import type { TherapistSettings } from '../App';
import type { AvatarConfig } from '../data';

interface Props {
  settings: TherapistSettings; say:(t:string)=>void;
  onComplete:(id:string)=>void; onNavigate:(s:any)=>void;
  avatar:AvatarConfig; completed:string[]; totalModules:number;
}

const MODULE_INFO: Record<string,{emoji:string;label:string;msg:string}> = {
  corpo:     { emoji:'🖐️', label:'Meu Corpo',     msg:'Você conhece seu corpo!'},
  espaco:    { emoji:'⭕',  label:'Meu Espaço',    msg:'Você sabe sobre espaço pessoal!'},
  semaforo:  { emoji:'🚦',  label:'Semáforo',      msg:'Você aprendeu sobre tipos de toque!'},
  historias: { emoji:'📖',  label:'Histórias',     msg:'Você é um leitor incrível!'},
  emocoes:   { emoji:'💛',  label:'Emoções',       msg:'Você reconhece suas emoções!'},
  voz:       { emoji:'📢',  label:'Minha Voz',     msg:'Sua voz é poderosa!'},
  ajudantes: { emoji:'🤝',  label:'Ajudantes',     msg:'Você tem uma rede de segurança!'},
};

const CERTIFICATES = [
  { min:1, max:3, title:'Explorador Iniciante', emoji:'🌱', color:'bg-sage/20 border-sage/40 text-green' },
  { min:4, max:5, title:'Aprendiz Corajoso',    emoji:'🌟', color:'bg-yellow/20 border-yellow/50 text-yellow-700' },
  { min:6, max:7, title:'Guardião do Corpo',    emoji:'🏆', color:'bg-peach/20 border-peach/50 text-peach' },
];

export function ModuleProgresso({ say, completed, totalModules, onNavigate }: Props) {
  const pct = Math.round((completed.length / totalModules) * 100);
  const cert = CERTIFICATES.find(c => completed.length >= c.min && completed.length <= c.max)
    ?? (completed.length === 0 ? null : CERTIFICATES[CERTIFICATES.length-1]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl text-teal">Minhas Conquistas ⭐</h2>
        <p className="text-muted mt-1">Veja tudo que você aprendeu até agora!</p>
      </div>

      {/* Big progress */}
      <div className="card p-8 text-center space-y-6 bg-gradient-to-br from-teal/5 to-sage-light/30">
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-36 h-36" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#EDE8DF" strokeWidth="12"/>
            <circle cx="60" cy="60" r="50" fill="none" stroke="#2A9D8F" strokeWidth="12"
              strokeDasharray={`${pct * 3.14} 314`} strokeLinecap="round"
              transform="rotate(-90 60 60)" style={{transition:'stroke-dasharray 1s ease'}}/>
          </svg>
          <div className="absolute text-center">
            <p className="text-4xl font-bold text-teal">{pct}%</p>
            <p className="text-xs text-muted">completo</p>
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-text">{completed.length} de {totalModules} módulos</p>
          <p className="text-muted">concluídos nesta sessão</p>
        </div>
      </div>

      {/* Certificate */}
      {cert && (
        <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}}
          className={`card p-6 border-2 text-center space-y-2 ${cert.color}`}>
          <span className="text-5xl">{cert.emoji}</span>
          <p className="text-xl font-bold">{cert.title}</p>
          <p className="text-sm opacity-70">Você conquistou esse título!</p>
        </motion.div>
      )}

      {/* Badges */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-text">Módulos Completados:</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(MODULE_INFO).map(([id, info]) => {
            const done = completed.includes(id);
            return (
              <div key={id}
                className={`card p-5 flex items-center gap-4 transition-all ${done?'bg-teal/5 border-teal/20':'opacity-40 grayscale'}`}>
                <span className="text-3xl">{info.emoji}</span>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-text truncate">{info.label}</p>
                  {done && <p className="text-xs text-teal">{info.msg}</p>}
                  {!done && <p className="text-xs text-muted">Ainda não completado</p>}
                </div>
                {done && <span className="ml-auto text-green text-lg shrink-0">✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Missing modules */}
      {completed.length < totalModules && (
        <div className="card p-6 bg-warm border border-border space-y-4">
          <p className="font-bold text-text">Continue explorando! 🚀</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(MODULE_INFO).filter(([id])=>!completed.includes(id)).map(([id,info])=>(
              <button key={id} onClick={()=>onNavigate(id)}
                className="px-4 py-2 bg-white border border-border rounded-full text-sm font-bold text-muted hover:border-teal/40 hover:text-teal transition-all">
                {info.emoji} {info.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* All done celebration */}
      {completed.length >= totalModules && (
        <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}
          className="card p-10 text-center space-y-6 bg-gradient-to-br from-yellow/20 to-peach/20 border-2 border-yellow/40">
          <div className="text-8xl animate-bounce-in">🏆</div>
          <h3 className="text-3xl text-teal">Parabéns, Guardião do Corpo!</h3>
          <p className="text-muted text-lg">Você completou todos os módulos! Você é incrível e está mais preparado para cuidar de si mesmo!</p>
          <div className="space-y-2">
            {['Você sabe que seu corpo é seu!','Você pode dizer NÃO!','Você tem adultos seguros!','Você reconhece suas emoções!'].map(t=>(
              <p key={t} className="text-sm font-bold text-teal">✅ {t}</p>
            ))}
          </div>
          <button onClick={()=>{ const txt=`CERTIFICADO - CORPO E LIMITES\n${'⭐'.repeat(7)}\n\nParabéns! Você completou todos os módulos do programa Corpo e Limites!\n\nData: ${new Date().toLocaleDateString('pt-BR')}\nMódulos: ${completed.join(', ')}\n\nSeu corpo é seu. Você pode dizer não. Adultos seguros te escutam!`; const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain'})); a.download='certificado-corpo-limites.txt'; a.click(); }}
            className="btn-primary px-8 py-4 text-base">
            🎓 Baixar Certificado
          </button>
        </motion.div>
      )}
    </div>
  );
}
