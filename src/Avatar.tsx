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
}

const SIZE_MAP = { sm:120, md:180, lg:240, xl:320 };

export function Avatar({ config, size='md', highlightPart, onPartClick, animated }: AvatarProps) {
  const px = SIZE_MAP[size];
  const anim = animated ? 'animate-float' : '';

  // Get coordinates for the pointer arrow if a part is highlighted
  const partData = BODY_PARTS.find(p => p.id === highlightPart);

  const partStyle = (id: string) => ({
    cursor: onPartClick ? 'pointer' : 'default',
    transition: 'all 0.3s ease',
  });

  const click = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onPartClick?.(id);
  };

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

        {/* Head Base */}
        <g onClick={(e) => click(e, 'cabeca')} style={partStyle('cabeca')}>
          <ellipse cx="100" cy="70" rx="42" ry="46" fill={config.skin} />
        </g>

        {/* Hair Styles */}
        {config.hair !== 'bald' && (
          <g style={{ pointerEvents: 'none' }}>
            {config.hair === 'short' && (
              <path d="M60 70 Q60 25 100 25 Q140 25 140 70 Q100 55 60 70" fill={config.hairColor} />
            )}
            {config.hair === 'long' && (
              <>
                <path d="M58 70 Q58 20 100 20 Q142 20 142 70 L145 150 Q100 135 55 150 Z" fill={config.hairColor} />
                <path d="M60 70 Q100 50 140 70" fill="rgba(0,0,0,0.1)" />
              </>
            )}
            {config.hair === 'curly' && (
              <g fill={config.hairColor}>
                <circle cx="100" cy="30" r="22" />
                <circle cx="75" cy="40" r="20" />
                <circle cx="125" cy="40" r="20" />
                <circle cx="65" cy="65" r="18" />
                <circle cx="135" cy="65" r="18" />
                <circle cx="70" cy="85" r="15" />
                <circle cx="130" cy="85" r="15" />
              </g>
            )}
          </g>
        )}

        {/* Eyes */}
        <g onClick={(e) => click(e, 'olho')} style={partStyle('olho')}>
          <ellipse cx="86" cy="72" rx="7" ry="8" fill="white" />
          <circle cx="87" cy="73" r="4" fill="#3D3D3D" />
          <ellipse cx="114" cy="72" rx="7" ry="8" fill="white" />
          <circle cx="115" cy="73" r="4" fill="#3D3D3D" />
        </g>

        {/* Mouth */}
        <g onClick={(e) => click(e, 'boca')} style={partStyle('boca')}>
          <path d="M90 95 Q100 103 110 95" stroke="#C07D50" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>

        {/* Pointer Arrow */}
        {partData && (
          <motion.g initial={{ x: -15, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ repeat: Infinity, duration: 0.8, repeatType: 'reverse' }}>
            <path 
              d={`M ${partData.svgX - 45} ${partData.svgY} L ${partData.svgX - 22} ${partData.svgY}`} 
              stroke="#2A9D8F" strokeWidth="4" strokeLinecap="round" 
            />
            <path 
              d={`M ${partData.svgX - 32} ${partData.svgY - 8} L ${partData.svgX - 22} ${partData.svgY} L ${partData.svgX - 32} ${partData.svgY + 8}`} 
              fill="#2A9D8F" 
            />
          </motion.g>
        )}
      </svg>
    </div>
  );
}

/* ─── Avatar Customizer ───────────────────────────────────── */
interface CustomizerProps {
  config: AvatarConfig;
  onChange: (c: AvatarConfig) => void;
  onDone: () => void;
}

export function AvatarCustomizer({ config, onChange, onDone }: CustomizerProps) {
  const SectionLabel = ({children}: {children: React.ReactNode}) => (
    <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">{children}</p>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full max-w-5xl mx-auto">
      {/* Preview */}
      <div className="flex-shrink-0 card p-8 lg:p-12 flex items-center justify-center bg-gradient-to-b from-teal/5 to-sage-light/30 mx-auto lg:sticky lg:top-8">
        <Avatar config={config} size="xl" animated />
      </div>

      {/* Options Scrollable */}
      <div className="flex-1 space-y-8 w-full max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
        <h3 className="text-4xl text-teal font-bold">Personalize seu Amigo</h3>

        {/* Skin */}
        <div className="space-y-3">
          <SectionLabel>Tom de Pele</SectionLabel>
          <div className="flex gap-3 flex-wrap">
            {SKIN_COLORS.map(c => (
              <button key={c} onClick={() => onChange({ ...config, skin: c })}
                className={`w-10 h-10 rounded-full border-4 transition-all ${config.skin === c ? 'border-teal scale-110 shadow-lg' : 'border-white shadow-sm'}`}
                style={{ background: c }} />
            ))}
          </div>
        </div>

        {/* Hair */}
        <div className="space-y-4">
          <SectionLabel>Cabelo</SectionLabel>
          <div className="flex gap-2 flex-wrap">
            {[
              ['short','Curto'],['long','Longo'],['curly','Cacheado'],['bald','Sem']
            ].map(([id, lbl]) => (
              <button key={id} onClick={() => onChange({ ...config, hair: id })}
                className={`px-5 py-2 rounded-2xl text-sm font-bold border-2 transition-all ${config.hair === id ? 'bg-teal text-white border-teal shadow-md' : 'bg-white border-border text-muted hover:border-teal/30'}`}>
                {lbl}
              </button>
            ))}
          </div>
          {config.hair !== 'bald' && (
            <div className="flex gap-3 flex-wrap mt-2 p-3 bg-warm/30 rounded-3xl">
              {HAIR_COLORS.map(c => (
                <button key={c} onClick={() => onChange({ ...config, hairColor: c })}
                  className={`w-8 h-8 rounded-full border-4 transition-all ${config.hairColor === c ? 'border-teal scale-110 shadow-md' : 'border-white shadow-sm'}`}
                  style={{ background: c }} />
              ))}
            </div>
          )}
        </div>

        {/* Clothing */}
        <div className="space-y-4">
          <SectionLabel>Parte de Cima</SectionLabel>
          <div className="flex gap-2 mb-3">
             <button onClick={() => onChange({ ...config, clothingType: 'shirt' })}
               className={`flex-1 py-2 rounded-2xl text-xs font-bold border-2 ${config.clothingType === 'shirt' ? 'bg-teal text-white border-teal' : 'bg-white border-border text-muted'}`}>
               Camiseta
             </button>
             <button onClick={() => onChange({ ...config, clothingType: 'longshirt' })}
               className={`flex-1 py-2 rounded-2xl text-xs font-bold border-2 ${config.clothingType === 'longshirt' ? 'bg-teal text-white border-teal' : 'bg-white border-border text-muted'}`}>
               Manga Longa
             </button>
          </div>
          <div className="flex gap-3 flex-wrap">
            {CLOTHING_COLORS.map(c => (
              <button key={c} onClick={() => onChange({ ...config, clothing: c })}
                className={`w-10 h-10 rounded-full border-4 transition-all ${config.clothing === c ? 'border-teal scale-110 shadow-lg' : 'border-white shadow-sm'}`}
                style={{ background: c }} />
            ))}
          </div>
        </div>

        {/* Pants */}
        <div className="space-y-3">
          <SectionLabel>Parte de Baixo</SectionLabel>
          <div className="flex gap-2">
             <button onClick={() => onChange({ ...config, pantsType: 'shorts' })}
               className={`flex-1 py-2 rounded-2xl text-xs font-bold border-2 ${config.pantsType === 'shorts' ? 'bg-teal text-white border-teal' : 'bg-white border-border text-muted'}`}>
               Shorts
             </button>
             <button onClick={() => onChange({ ...config, pantsType: 'pants' })}
               className={`flex-1 py-2 rounded-2xl text-xs font-bold border-2 ${config.pantsType === 'pants' ? 'bg-teal text-white border-teal' : 'bg-white border-border text-muted'}`}>
               Calça
             </button>
          </div>
        </div>

        {/* Shoes */}
        <div className="space-y-3">
          <SectionLabel>Calçados</SectionLabel>
          <div className="grid grid-cols-3 gap-2">
             <button onClick={() => onChange({ ...config, shoesType: 'none' })}
               className={`py-2 rounded-2xl text-xs font-bold border-2 ${config.shoesType === 'none' ? 'bg-teal text-white border-teal' : 'bg-white border-border text-muted'}`}>
               Descalço
             </button>
             <button onClick={() => onChange({ ...config, shoesType: 'shoes' })}
               className={`py-2 rounded-2xl text-xs font-bold border-2 ${config.shoesType === 'shoes' ? 'bg-teal text-white border-teal' : 'bg-white border-border text-muted'}`}>
               Sapato
             </button>
             <button onClick={() => onChange({ ...config, shoesType: 'sandals' })}
               className={`py-2 rounded-2xl text-xs font-bold border-2 ${config.shoesType === 'sandals' ? 'bg-teal text-white border-teal' : 'bg-white border-border text-muted'}`}>
               Sandália
             </button>
          </div>
        </div>

        <button onClick={onDone} className="btn-primary w-full py-5 text-xl mt-6 sticky bottom-0 shadow-2xl">
          Tudo Pronto! 🚀
        </button>
      </div>
    </div>
  );
}
