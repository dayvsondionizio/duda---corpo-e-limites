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
      <svg width={px} height={px * 1.4} viewBox="0 0 200 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
        {/* Legs */}
        <g onClick={(e) => click(e, 'pernas')} style={partStyle('pernas')}>
          <rect x="80" y="235" width="22" height="60" rx="11" fill={config.skin} />
          <rect x="108" y="235" width="22" height="60" rx="11" fill={config.skin} />
        </g>
        
        {/* Coxas */}
        <g onClick={(e) => click(e, 'coxas')} style={partStyle('coxas')}>
           <rect x="80" y="225" width="22" height="20" fill={config.skin} opacity="0" />
           <rect x="108" y="225" width="22" height="20" fill={config.skin} opacity="0" />
        </g>

        {/* Feet */}
        <g onClick={(e) => click(e, 'pe')} style={partStyle('pe')}>
          <ellipse cx="88" cy="295" rx="15" ry="8" fill={config.skin} />
          <ellipse cx="119" cy="295" rx="15" ry="8" fill={config.skin} />
        </g>

        {/* Torso Base */}
        <rect x="68" y="130" width="64" height="110" rx="28" fill={config.clothing} />

        {/* Peito */}
        <g onClick={(e) => click(e, 'peito')} style={partStyle('peito')}>
          <rect x="70" y="135" width="60" height="40" rx="15" fill="transparent" />
        </g>

        {/* Barriga */}
        <g onClick={(e) => click(e, 'barriga')} style={partStyle('barriga')}>
          <rect x="70" y="175" width="60" height="35" rx="10" fill="transparent" />
          <circle cx="100" cy="195" r="2" fill="rgba(0,0,0,0.1)" />
        </g>

        {/* Partes Íntimas */}
        <g onClick={(e) => click(e, 'vulva_penis')} style={partStyle('vulva_penis')}>
          <rect x="85" y="210" width="30" height="30" rx="15" fill="transparent" />
          {highlightPart === 'vulva_penis' && (
             <circle cx="100" cy="222" r="18" fill="rgba(231,111,81,0.1)" stroke="#E76F51" strokeWidth="1" strokeDasharray="2 2" />
          )}
        </g>

        {/* Left Arm */}
        <g onClick={(e) => click(e, 'braco')} style={partStyle('braco')}>
          <rect x="34" y="130" width="22" height="75" rx="11" fill={config.skin} />
        </g>
        {/* Left Hand */}
        <g onClick={(e) => click(e, 'mao')} style={partStyle('mao')}>
          <ellipse cx="45" cy="210" rx="13" ry="12" fill={config.skin} />
        </g>

        {/* Right Arm */}
        <g onClick={(e) => click(e, 'braco')} style={partStyle('braco')}>
          <rect x="144" y="130" width="22" height="75" rx="11" fill={config.skin} />
        </g>
        {/* Right Hand */}
        <g onClick={(e) => click(e, 'mao')} style={partStyle('mao')}>
          <ellipse cx="155" cy="210" rx="13" ry="12" fill={config.skin} />
        </g>

        {/* Neck */}
        <g onClick={(e) => click(e, 'pescoco')} style={partStyle('pescoco')}>
          <rect x="88" y="105" width="24" height="30" rx="12" fill={config.skin} />
        </g>

        {/* Head */}
        <g onClick={(e) => click(e, 'cabeca')} style={partStyle('cabeca')}>
          <ellipse cx="100" cy="70" rx="45" ry="48" fill={config.skin} />
        </g>

        {/* Hair Styles */}
        {config.hair !== 'bald' && (
          <g style={{ pointerEvents: 'none' }}>
            {config.hair === 'short' && (
              <path d="M55 70 Q55 30 100 30 Q145 30 145 70 L145 75 Q100 65 55 75 Z" fill={config.hairColor} />
            )}
            {config.hair === 'long' && (
              <>
                <path d="M55 70 Q55 25 100 25 Q145 25 145 70 L145 150 Q100 140 55 150 Z" fill={config.hairColor} />
                <rect x="55" y="70" width="90" height="10" fill={config.hairColor} />
              </>
            )}
            {config.hair === 'curly' && (
              <g fill={config.hairColor}>
                <circle cx="100" cy="35" r="25" />
                <circle cx="70" cy="45" r="20" />
                <circle cx="130" cy="45" r="20" />
                <circle cx="60" cy="70" r="15" />
                <circle cx="140" cy="70" r="15" />
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
          <path d="M90 93 Q100 101 110 93" stroke="#C07D50" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>

        {/* Shoulder indicators */}
        <g onClick={(e) => click(e, 'ombro')} style={partStyle('ombro')}>
          <circle cx="68" cy="135" r="12" fill={config.clothing} opacity="0.5" />
          <circle cx="132" cy="135" r="12" fill={config.clothing} opacity="0.5" />
        </g>

        {/* Pointer Arrow */}
        {partData && (
          <motion.g initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ repeat: Infinity, duration: 1, repeatType: 'reverse' }}>
            <path 
              d={`M ${partData.svgX - 50} ${partData.svgY} L ${partData.svgX - 25} ${partData.svgY}`} 
              stroke="#2A9D8F" strokeWidth="4" strokeLinecap="round" 
            />
            <path 
              d={`M ${partData.svgX - 35} ${partData.svgY - 8} L ${partData.svgX - 25} ${partData.svgY} L ${partData.svgX - 35} ${partData.svgY + 8}`} 
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
  return (
    <div className="flex flex-col md:flex-row gap-10 items-start justify-center w-full max-w-3xl mx-auto">
      {/* Preview */}
      <div className="flex-shrink-0 card p-8 flex items-center justify-center bg-gradient-to-b from-teal/5 to-sage-light/30 mx-auto">
        <Avatar config={config} size="lg" animated />
      </div>

      {/* Options */}
      <div className="flex-1 space-y-6 w-full">
        <h3 className="text-3xl text-teal">Monte seu Personagem</h3>

        <div className="space-y-2">
          <p className="text-sm font-bold text-muted uppercase tracking-wider">Tom de Pele</p>
          <div className="flex gap-3 flex-wrap">
            {SKIN_COLORS.map(c => (
              <button key={c} onClick={() => onChange({ ...config, skin: c })}
                className={`w-10 h-10 rounded-full border-4 transition-all ${config.skin === c ? 'border-teal scale-110 shadow-lg' : 'border-white shadow-sm'}`}
                style={{ background: c }} />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-bold text-muted uppercase tracking-wider">Estilo de Cabelo</p>
          <div className="flex gap-2 flex-wrap">
            {[['short','Curto'],['long','Longo'],['curly','Cacheado'],['bald','Sem']] .map(([id, lbl]) => (
              <button key={id} onClick={() => onChange({ ...config, hair: id })}
                className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${config.hair === id ? 'bg-teal text-white border-teal' : 'bg-white border-border text-muted'}`}>
                {lbl}
              </button>
            ))}
          </div>
          {config.hair !== 'bald' && (
            <div className="flex gap-3 flex-wrap mt-2">
              {HAIR_COLORS.map(c => (
                <button key={c} onClick={() => onChange({ ...config, hairColor: c })}
                  className={`w-8 h-8 rounded-full border-4 transition-all ${config.hairColor === c ? 'border-teal scale-110' : 'border-white shadow-sm'}`}
                  style={{ background: c }} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-bold text-muted uppercase tracking-wider">Cor da Roupa</p>
          <div className="flex gap-3 flex-wrap">
            {CLOTHING_COLORS.map(c => (
              <button key={c} onClick={() => onChange({ ...config, clothing: c })}
                className={`w-10 h-10 rounded-full border-4 transition-all ${config.clothing === c ? 'border-teal scale-110 shadow-lg' : 'border-white shadow-sm'}`}
                style={{ background: c }} />
            ))}
          </div>
        </div>

        <button onClick={onDone} className="btn-primary w-full py-4 text-lg mt-4">
          Vamos Começar! 🎉
        </button>
      </div>
    </div>
  );
}
