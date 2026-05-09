import React from 'react';
import { AvatarConfig, SKIN_COLORS, HAIR_COLORS, CLOTHING_COLORS } from './data';

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

  const partStyle = (id: string) => ({
    filter: highlightPart === id ? 'drop-shadow(0 0 6px rgba(42,157,143,0.8))' : undefined,
    cursor: onPartClick ? 'pointer' : 'default',
    transition: 'filter 0.3s',
  });

  const click = (id: string) => onPartClick?.(id);

  return (
    <div className={`${anim} flex items-center justify-center`} style={{ width: px, height: px * 1.4 }}>
      <svg width={px} height={px * 1.4} viewBox="0 0 200 290" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Legs */}
        <g onClick={() => click('pe')} style={partStyle('pe')}>
          <rect x="80" y="235" width="22" height="50" rx="11" fill={config.skin} />
          <rect x="108" y="235" width="22" height="50" rx="11" fill={config.skin} />
          {/* Feet */}
          <ellipse cx="88" cy="283" rx="15" ry="8" fill={config.skin} />
          <ellipse cx="119" cy="283" rx="15" ry="8" fill={config.skin} />
        </g>
        {/* Shoes */}
        <ellipse cx="88" cy="284" rx="16" ry="7" fill={config.clothing} opacity="0.5" />
        <ellipse cx="119" cy="284" rx="16" ry="7" fill={config.clothing} opacity="0.5" />

        {/* Torso */}
        <g onClick={() => click('cintura')} style={partStyle('cintura')}>
          <rect x="68" y="140" width="64" height="100" rx="28" fill={config.clothing} />
        </g>

        {/* Left Arm */}
        <g onClick={() => click('braco')} style={partStyle('braco')}>
          <rect x="34" y="140" width="22" height="70" rx="11" fill={config.skin} />
        </g>
        {/* Left Hand */}
        <g onClick={() => click('mao')} style={partStyle('mao')}>
          <ellipse cx="45" cy="215" rx="13" ry="12" fill={config.skin} />
        </g>

        {/* Right Arm */}
        <g onClick={() => click('braco')} style={partStyle('braco')}>
          <rect x="144" y="140" width="22" height="70" rx="11" fill={config.skin} />
        </g>
        {/* Right Hand */}
        <g onClick={() => click('mao')} style={partStyle('mao')}>
          <ellipse cx="155" cy="215" rx="13" ry="12" fill={config.skin} />
        </g>

        {/* Neck */}
        <rect x="88" y="105" width="24" height="40" rx="12" fill={config.skin} />

        {/* Head */}
        <g onClick={() => click('cabeca')} style={partStyle('cabeca')}>
          <ellipse cx="100" cy="75" rx="45" ry="48" fill={config.skin} />
        </g>

        {/* Hair */}
        {config.hair !== 'bald' && (
          <g onClick={() => click('cabeca')} style={{ cursor: onPartClick ? 'pointer' : 'default' }}>
            {config.hair === 'short' && (
              <ellipse cx="100" cy="50" rx="44" ry="26" fill={config.hairColor} />
            )}
            {config.hair === 'long' && (
              <>
                <ellipse cx="100" cy="48" rx="44" ry="24" fill={config.hairColor} />
                <rect x="56" y="55" width="14" height="60" rx="7" fill={config.hairColor} />
                <rect x="130" y="55" width="14" height="60" rx="7" fill={config.hairColor} />
              </>
            )}
            {config.hair === 'curly' && (
              <>
                <ellipse cx="100" cy="45" rx="46" ry="28" fill={config.hairColor} />
                <circle cx="70" cy="45" r="12" fill={config.hairColor} />
                <circle cx="130" cy="45" r="12" fill={config.hairColor} />
                <circle cx="100" cy="32" r="12" fill={config.hairColor} />
              </>
            )}
          </g>
        )}

        {/* Eyes */}
        <g onClick={() => click('olho')} style={partStyle('olho')}>
          <ellipse cx="86" cy="72" rx="7" ry="8" fill="white" />
          <circle cx="87" cy="73" r="4" fill="#3D3D3D" />
          <circle cx="89" cy="71" r="1.5" fill="white" />
          <ellipse cx="114" cy="72" rx="7" ry="8" fill="white" />
          <circle cx="115" cy="73" r="4" fill="#3D3D3D" />
          <circle cx="117" cy="71" r="1.5" fill="white" />
        </g>

        {/* Eyebrows */}
        <g onClick={() => click('sobrancelha')} style={partStyle('sobrancelha')}>
          <path d="M80 63 Q87 59 94 63" stroke="#5C3317" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M106 63 Q113 59 120 63" stroke="#5C3317" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>

        {/* Nose */}
        <ellipse cx="100" cy="84" rx="5" ry="3.5" fill={config.skin} stroke="#C07D50" strokeWidth="0.8" opacity="0.5" />

        {/* Mouth */}
        <g onClick={() => click('boca')} style={partStyle('boca')}>
          <path d="M90 93 Q100 101 110 93" stroke="#C07D50" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>

        {/* Cheeks */}
        <ellipse cx="74" cy="87" rx="10" ry="7" fill="#FDDCB5" opacity="0.5" />
        <ellipse cx="126" cy="87" rx="10" ry="7" fill="#FDDCB5" opacity="0.5" />

        {/* Shoulder indicators */}
        <g onClick={() => click('ombro')} style={partStyle('ombro')}>
          <ellipse cx="68" cy="138" rx="16" ry="12" fill={config.clothing} opacity="0.8" />
          <ellipse cx="132" cy="138" rx="16" ry="12" fill={config.clothing} opacity="0.8" />
        </g>

        {/* Private zone indicator (subtle dots) */}
        {highlightPart === 'zona_intima' && (
          <g>
            <ellipse cx="100" cy="200" rx="30" ry="25" fill="rgba(231,111,81,0.15)" stroke="#E76F51" strokeWidth="2" strokeDasharray="4 2" />
            <text x="100" y="204" textAnchor="middle" fontSize="12" fill="#E76F51">🔒</text>
          </g>
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
