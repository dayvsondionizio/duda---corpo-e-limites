import React from 'react';
import { motion } from 'motion/react';
import { AvatarConfig, SKIN_COLORS, HAIR_COLORS, CLOTHING_COLORS, BODY_PARTS } from './data';

/* ─── Avatar SVG ──────────────────────────────────────────── */
interface AvatarProps {
  config: AvatarConfig;
  size?: 'sm'|'md'|'lg'|'xl';
  highlightPart?: string;
  onPartClick?: (id: string) => void;
  animated?: boolean;
  backView?: boolean;
}

const SIZE_MAP = { sm:120, md:180, lg:240, xl:320 };

export function Avatar({ config, size='md', highlightPart, onPartClick, animated, backView }: AvatarProps) {
  const px = SIZE_MAP[size];
  const anim = animated ? 'animate-float' : '';

  // Get coordinates for the pointer arrow if a part is highlighted
  const partData = BODY_PARTS.find(p => p.id === highlightPart);

  const partStyle = (id: string) => ({
    cursor: onPartClick ? 'pointer' : 'default',
    transition: 'all 0.3s ease',
    opacity: highlightPart && highlightPart !== id ? 0.4 : 1,
  });

  const click = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onPartClick?.(id);
  };

  const hairColor = config.hairColor;

  return (
    <div className={`${anim} flex items-center justify-center relative`} style={{ width: px, height: px * 1.4 }}>
      <svg width={px} height={px * 1.4} viewBox="0 0 200 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
        
        {/* Legs Base */}
        <g onClick={(e) => click(e, 'pernas')} style={partStyle('pernas')}>
          <rect x="80" y="235" width="18" height="70" rx="9" fill={config.skin} />
          <rect x="102" y="235" width="18" height="70" rx="9" fill={config.skin} />
        </g>

        {/* Pants / Shorts */}
        <g onClick={(e) => click(e, 'cintura')} style={partStyle('cintura')}>
          {config.pantsType === 'pants' ? (
            <>
              <rect x="78" y="215" width="22" height="70" rx="4" fill={config.clothing} filter="brightness(0.9)" />
              <rect x="100" y="215" width="22" height="70" rx="4" fill={config.clothing} filter="brightness(0.9)" />
              <rect x="78" y="215" width="44" height="25" rx="10" fill={config.clothing} filter="brightness(0.9)" />
            </>
          ) : (
            <rect x="70" y="215" width="60" height="30" rx="10" fill={config.clothing} filter="brightness(0.9)" />
          )}
        </g>

        {/* Bumbum (Only in Back View) */}
        {backView && (
          <g onClick={(e) => click(e, 'bumbum')} style={partStyle('bumbum')}>
            <circle cx="85" cy="225" r="14" fill={config.clothing} filter="brightness(0.8)" />
            <circle cx="115" cy="225" r="14" fill={config.clothing} filter="brightness(0.8)" />
          </g>
        )}

        {/* Shoes / Sandals */}
        <g onClick={(e) => click(e, 'pe')} style={partStyle('pe')}>
          {config.shoesType !== 'none' && (
            <>
              <path d="M75 305 Q75 295 95 295 L100 305 Z" fill={config.shoesType === 'shoes' ? '#3D3D3D' : '#C07D50'} />
              <path d="M105 305 Q125 295 125 305 L100 305 Z" fill={config.shoesType === 'shoes' ? '#3D3D3D' : '#C07D50'} />
            </>
          )}
          {config.shoesType === 'none' && (
            <>
              <ellipse cx="88" cy="305" rx="12" ry="7" fill={config.skin} />
              <ellipse cx="112" cy="305" rx="12" ry="7" fill={config.skin} />
            </>
          )}
        </g>

        {/* Torso Base (Shirt) */}
        <rect x="68" y="130" width="64" height="95" rx="28" fill={config.clothing} />
        {config.clothingType === 'longshirt' && (
          <rect x="68" y="180" width="64" height="40" rx="10" fill={config.clothing} />
        )}

        {/* Arms */}
        <g onClick={(e) => click(e, 'braco')} style={partStyle('braco')}>
          {/* Left Arm */}
          <rect x="44" y="135" width="24" height="70" rx="12" fill={config.skin} />
          {config.clothingType === 'longshirt' && (
             <rect x="44" y="135" width="24" height="40" rx="12" fill={config.clothing} />
          )}
          
          {/* Right Arm */}
          <rect x="132" y="135" width="24" height="70" rx="12" fill={config.skin} />
          {config.clothingType === 'longshirt' && (
             <rect x="132" y="135" width="24" height="40" rx="12" fill={config.clothing} />
          )}
        </g>

        {/* Hands */}
        <g onClick={(e) => click(e, 'mao')} style={partStyle('mao')}>
          <circle cx="56" cy="210" r="14" fill={config.skin} />
          <circle cx="144" cy="210" r="14" fill={config.skin} />
        </g>

        {/* Neck */}
        <g onClick={(e) => click(e, 'pescoco')} style={partStyle('pescoco')}>
          <rect x="88" y="105" width="24" height="35" rx="12" fill={config.skin} />
        </g>

        {/* 1. Behind Hair (Back View & Long hair) */}
        {config.hair !== 'bald' && (
          <g style={{ pointerEvents: 'none' }}>
            {config.hair === 'long' && (
               <path d="M55 70 L55 165 Q100 150 145 165 L145 70 Q145 20 100 20 Q55 20 55 70" fill={hairColor} />
            )}
            {config.hair === 'curly' && (
               <g fill={hairColor}>
                 <circle cx="100" cy="30" r="35" />
                 <circle cx="75" cy="40" r="30" />
                 <circle cx="125" cy="40" r="30" />
               </g>
            )}
          </g>
        )}

        {/* Head Base */}
        <g onClick={(e) => click(e, 'cabeca')} style={partStyle('cabeca')}>
          <ellipse cx="100" cy="70" rx="42" ry="46" fill={config.skin} />
        </g>

        {/* 2. Top Hair (Back view overlay or Front hair) */}
        {config.hair !== 'bald' && (
          <g style={{ pointerEvents: 'none' }}>
            {/* Back View Full Coverage */}
            {backView ? (
              <g fill={hairColor}>
                {config.hair === 'short' && (
                   <path d="M58 70 Q58 20 100 20 Q142 20 142 70 L142 95 Q100 85 58 95 Z" />
                )}
                {config.hair === 'long' && (
                   <path d="M58 70 Q58 20 100 20 Q142 20 142 70 Q142 100 142 100 Q100 90 58 100 L58 70" />
                )}
                {config.hair === 'curly' && (
                   <g>
                     <circle cx="65" cy="70" r="25" />
                     <circle cx="135" cy="70" r="25" />
                     <circle cx="75" cy="100" r="22" />
                     <circle cx="125" cy="100" r="22" />
                     <circle cx="100" cy="60" r="30" />
                   </g>
                )}
              </g>
            ) : (
              /* Front View Fringe */
              <g fill={hairColor}>
                {config.hair === 'short' && (
                  <path d="M58 70 Q58 20 100 20 Q142 20 142 70 Q100 50 58 70" />
                )}
                {config.hair === 'long' && (
                  <path d="M58 70 Q58 20 100 20 Q142 20 142 70 Q120 60 100 65 Q80 60 58 70" />
                )}
                {config.hair === 'curly' && (
                  <g>
                    <circle cx="70" cy="35" r="15" />
                    <circle cx="100" cy="25" r="15" />
                    <circle cx="130" cy="35" r="15" />
                    <circle cx="65" cy="60" r="12" />
                    <circle cx="135" cy="60" r="12" />
                  </g>
                )}
              </g>
            )}
          </g>
        )}

        {/* Face Details (Only if Front View) */}
        {!backView && (
          <>
            {/* Eyes */}
            <g onClick={(e) => click(e, 'olho')} style={partStyle('olho')}>
              <ellipse cx="86" cy="72" rx="7" ry="8" fill="white" />
              <circle cx="87" cy="73" r="4" fill="#3D3D3D" />
              <ellipse cx="114" cy="72" rx="7" ry="8" fill="white" />
              <circle cx="113" cy="73" r="4" fill="#3D3D3D" />
            </g>

            {/* Nose */}
            <path d="M96 85 Q100 90 104 85" stroke="rgba(0,0,0,0.1)" strokeWidth="2" strokeLinecap="round" />

            {/* Mouth */}
            <g onClick={(e) => click(e, 'boca')} style={partStyle('boca')}>
              <path d="M88 95 Q100 105 112 95" stroke="#E57373" strokeWidth="4" strokeLinecap="round" />
            </g>
          </>
        )}

        {/* Pointer Arrow */}
        {partData && (
          <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
            <path d={`M${partData.svgX - 30} ${partData.svgY} L${partData.svgX - 10} ${partData.svgY}`} 
              stroke="#30D5C8" strokeWidth="6" strokeLinecap="round" />
            <path d={`M${partData.svgX - 15} ${partData.svgY - 5} L${partData.svgX - 5} ${partData.svgY} L${partData.svgX - 15} ${partData.svgY + 5}`} 
              fill="#30D5C8" />
          </motion.g>
        )}

      </svg>
    </div>
  );
}

/* ─── Customizer ─────────────────────────────────────────── */
interface CustomizerProps {
  config: AvatarConfig;
  onChange: (config: AvatarConfig) => void;
  onDone: () => void;
}

export function AvatarCustomizer({ config, onChange, onDone }: CustomizerProps) {
  const update = (key: keyof AvatarConfig, val: string) => onChange({ ...config, [key]: val });

  return (
    <div className="flex flex-col md:flex-row items-center gap-10 p-6 md:p-12 card bg-white/40 backdrop-blur-md border-none shadow-2xl">
      <div className="bg-gradient-to-b from-teal/5 to-white p-12 rounded-[4rem] shadow-inner relative">
        <div className="absolute top-4 left-4 bg-white/80 px-3 py-1 rounded-full text-[10px] font-bold text-teal uppercase tracking-widest border border-teal/20">Seu Personagem</div>
        <Avatar config={config} size="xl" animated />
      </div>

      <div className="flex-1 space-y-8 w-full max-w-md">
        <header className="space-y-1">
          <h2 className="text-3xl font-bold text-teal">Crie seu Avatar</h2>
          <p className="text-muted text-sm uppercase tracking-widest font-medium">Escolha como você quer ser!</p>
        </header>

        <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
          {/* Skin */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Tom de Pele</h3>
            <div className="flex flex-wrap gap-3">
              {SKIN_COLORS.map(c => (
                <button key={c} onClick={() => update('skin', c)}
                  className={`w-10 h-10 rounded-2xl border-2 transition-all hover:scale-110 shadow-sm ${config.skin === c ? 'border-teal ring-4 ring-teal/20 scale-110':'border-white'}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </section>

          {/* Hair Style */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Estilo do Cabelo</h3>
            <div className="flex flex-wrap gap-2">
              {[
                {id:'bald', label:'Sem Cabelo', ico:'🥚'},
                {id:'short', label:'Curto', ico:'👦'},
                {id:'long', label:'Longo', ico:'👧'},
                {id:'curly', label:'Cacheado', ico:'🌀'},
              ].map(h => (
                <button key={h.id} onClick={() => update('hair', h.id)}
                  className={`px-4 py-3 rounded-2xl border-2 font-bold text-sm transition-all flex items-center gap-2 ${config.hair === h.id ? 'border-teal bg-teal/5 text-teal shadow-md':'border-warm bg-white text-muted hover:border-teal/30'}`}>
                  <span className="text-xl">{h.ico}</span> {h.label}
                </button>
              ))}
            </div>
          </section>

          {/* Hair Color */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Cor do Cabelo</h3>
            <div className="flex flex-wrap gap-3">
              {HAIR_COLORS.map(c => (
                <button key={c} onClick={() => update('hairColor', c)}
                  className={`w-8 h-8 rounded-xl border-2 transition-all hover:scale-110 ${config.hairColor === c ? 'border-teal ring-2 ring-teal/20 scale-110':'border-white'}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </section>

          {/* Clothing Type */}
          <section className="space-y-3">
             <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Parte Superior</h3>
             <div className="flex gap-2">
                {[
                  {id:'shirt', label:'Camiseta', ico:'👕'},
                  {id:'longshirt', label:'Manga Longa', ico:'🥋'}
                ].map(t => (
                  <button key={t.id} onClick={() => update('clothingType', t.id as any)}
                    className={`flex-1 py-3 rounded-2xl border-2 font-bold text-xs transition-all flex items-center justify-center gap-2 ${config.clothingType === t.id ? 'border-teal bg-teal/5 text-teal shadow-md':'border-warm bg-white text-muted hover:border-teal/30'}`}>
                    <span>{t.ico}</span> {t.label}
                  </button>
                ))}
             </div>
          </section>

          {/* Pants Type */}
          <section className="space-y-3">
             <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Parte Inferior</h3>
             <div className="flex gap-2">
                {[
                  {id:'shorts', label:'Shorts', ico:'🩳'},
                  {id:'pants', label:'Calça', ico:'👖'}
                ].map(t => (
                  <button key={t.id} onClick={() => update('pantsType', t.id as any)}
                    className={`flex-1 py-3 rounded-2xl border-2 font-bold text-xs transition-all flex items-center justify-center gap-2 ${config.pantsType === t.id ? 'border-teal bg-teal/5 text-teal shadow-md':'border-warm bg-white text-muted hover:border-teal/30'}`}>
                    <span>{t.ico}</span> {t.label}
                  </button>
                ))}
             </div>
          </section>

          {/* Shoes Type */}
          <section className="space-y-3">
             <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Calçados</h3>
             <div className="flex gap-2">
                {[
                  {id:'none', label:'Descalço', ico:'👣'},
                  {id:'shoes', label:'Sapato', ico:'👟'},
                  {id:'sandals', label:'Sandália', ico:'🩴'}
                ].map(t => (
                  <button key={t.id} onClick={() => update('shoesType', t.id as any)}
                    className={`flex-1 py-3 rounded-2xl border-2 font-bold text-xs transition-all flex items-center justify-center gap-2 ${config.shoesType === t.id ? 'border-teal bg-teal/5 text-teal shadow-md':'border-warm bg-white text-muted hover:border-teal/30'}`}>
                    <span>{t.ico}</span> {t.label}
                  </button>
                ))}
             </div>
          </section>

          {/* Clothing Color */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Cor da Roupa</h3>
            <div className="flex flex-wrap gap-3">
              {CLOTHING_COLORS.map(c => (
                <button key={c} onClick={() => update('clothing', c)}
                  className={`w-8 h-8 rounded-xl border-2 transition-all hover:scale-110 ${config.clothing === c ? 'border-teal ring-2 ring-teal/20 scale-110':'border-white'}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </section>
        </div>

        <button onClick={onDone} className="btn-primary w-full py-4 text-lg shadow-xl shadow-teal/20 active:scale-95 transition-transform">
          Ficou Incrível! Começar ✨
        </button>
      </div>
    </div>
  );
}
