import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AvatarConfig, CHARACTERS, BODY_PARTS } from './data';

interface AvatarProps {
  config: AvatarConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  highlightPart?: string;
  onPartClick?: (id: string) => void;
  animated?: boolean;
  backView?: boolean;
}

const SIZE_MAP = { sm: 100, md: 160, lg: 220, xl: 300 };

/* ─── colour palette derived from characterId ─── */
function getPalette(id: string) {
  switch (id) {
    case 'menina_loira':
      return { skin:'#F5C5A3', skinShad:'#E5A882', hair:'#D4A017', hairShad:'#A87800', clothing:'#E8C53A', pants:'#4A7FC1' };
    case 'menina_morena':
      return { skin:'#C68642', skinShad:'#A0622A', hair:'#3B1F0A', hairShad:'#1A0A00', clothing:'#4CAF50', pants:'#3A5FA0' };
    case 'menina_negra':
      return { skin:'#6B3A2A', skinShad:'#4A2215', hair:'#1A0A00', hairShad:'#0D0500', clothing:'#9C27B0', pants:'#2E4A80' };
    case 'menino_padrao':
      return { skin:'#F5C5A3', skinShad:'#E5A882', hair:'#5C3A1E', hairShad:'#3A2010', clothing:'#E53935', pants:'#3A5FA0' };
    default: // menina_padrao - ruiva
      return { skin:'#F5C5A3', skinShad:'#E5A882', hair:'#C0392B', hairShad:'#8B0000', clothing:'#26C6DA', pants:'#4A7FC1' };
  }
}

function isBoy(id: string) { return id === 'menino_padrao'; }

export function Avatar({ config, size = 'md', highlightPart, onPartClick, animated, backView }: AvatarProps) {
  const px = SIZE_MAP[size];
  const h = px * 2;
  const anim = animated ? 'animate-float-slow' : '';
  const partData = BODY_PARTS.find(p => p.id === highlightPart);
  const pal = getPalette(config.characterId);
  const boy = isBoy(config.characterId);

  /* SVG draws in a 200×400 coordinate space */
  const vw = 200, vh = 400;

  return (
    <div className={`${anim} relative mx-auto`} style={{ width: px, height: h }}>
      <svg
        width="100%" height="100%"
        viewBox={`0 0 ${vw} ${vh}`}
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
        style={{ transform: backView ? 'scaleX(-1)' : 'none' }}
      >
        <defs>
          {/* Skin gradient */}
          <radialGradient id={`sk-${size}`} cx="45%" cy="35%" r="60%">
            <stop offset="0%" stopColor={pal.skin} stopOpacity="1" />
            <stop offset="100%" stopColor={pal.skinShad} stopOpacity="1" />
          </radialGradient>
          {/* Hair gradient */}
          <radialGradient id={`hr-${size}`} cx="40%" cy="30%" r="65%">
            <stop offset="0%" stopColor={pal.hairShad} stopOpacity="0.7" />
            <stop offset="100%" stopColor={pal.hair} stopOpacity="1" />
          </radialGradient>
          {/* Clothing gradient */}
          <linearGradient id={`cl-${size}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={pal.clothing} stopOpacity="0.9" />
            <stop offset="100%" stopColor={pal.clothing} stopOpacity="0.6" />
          </linearGradient>
          {/* Pants gradient */}
          <linearGradient id={`pt-${size}`} x1="0" y1="0" x2="0.1" y2="1">
            <stop offset="0%" stopColor={pal.pants} stopOpacity="1" />
            <stop offset="100%" stopColor={pal.pants} stopOpacity="0.7" />
          </linearGradient>
          <filter id={`sh-${size}`}>
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000" floodOpacity="0.18" />
          </filter>
          <filter id={`glow-${size}`}>
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={pal.clothing} floodOpacity="0.3" />
          </filter>
        </defs>

        {/* ── SHOES ── */}
        <g filter={`url(#sh-${size})`}>
          <ellipse cx="83" cy="378" rx="16" ry="7" fill="#fff" stroke="#ddd" strokeWidth="1" />
          <ellipse cx="117" cy="378" rx="16" ry="7" fill="#fff" stroke="#ddd" strokeWidth="1" />
          <rect x="68" y="372" width="30" height="8" rx="4" fill="#e8e8e8" />
          <rect x="102" y="372" width="30" height="8" rx="4" fill="#e8e8e8" />
        </g>

        {/* ── LEGS ── */}
        <g filter={`url(#sh-${size})`}>
          {/* Left leg - starts higher to connect with shorts */}
          <path d="M80 230 Q74 295 76 368 Q86 372 92 368 Q90 295 88 230 Z" fill={`url(#sk-${size})`} />
          {/* Right leg */}
          <path d="M120 230 Q126 295 124 368 Q114 372 108 368 Q110 295 112 230 Z" fill={`url(#sk-${size})`} />
        </g>

        {/* ── PANTS ── */}
        <g filter={`url(#sh-${size})`}>
          {boy ? (
            // Boy: longer shorts
            <path d="M72 198 Q100 208 128 198 L124 258 Q112 252 108 244 Q100 240 92 244 Q88 252 76 258 Z"
              fill={`url(#pt-${size})`} />
          ) : (
            // Girl: shorter shorts
            <path d="M74 198 Q100 206 126 198 L122 240 Q110 234 108 228 Q100 224 92 228 Q90 234 78 240 Z"
              fill={`url(#pt-${size})`} />
          )}
          {/* Belt line */}
          <path d="M74 198 Q100 205 126 198" fill="none" stroke={pal.pants} strokeWidth="4" strokeOpacity="0.4" />
        </g>

        {/* ── SHIRT ── */}
        <g filter={`url(#sh-${size})`}>
          {/* Body */}
          <path d="M68 132 Q100 124 132 132 L130 200 Q100 208 70 200 Z" fill={`url(#cl-${size})`} />
          {/* Left sleeve */}
          <path d="M68 132 Q48 145 44 170 Q54 178 60 172 Q62 155 72 145 Z" fill={`url(#cl-${size})`} />
          {/* Right sleeve */}
          <path d="M132 132 Q152 145 156 170 Q146 178 140 172 Q138 155 128 145 Z" fill={`url(#cl-${size})`} />
          {/* Collar shadow */}
          <path d="M88 132 Q100 128 112 132" fill="none" stroke={pal.clothing} strokeWidth="3" strokeOpacity="0.5" />
        </g>

        {/* ── ARMS (forearms below sleeve) ── */}
        <g filter={`url(#sh-${size})`}>
          <path d="M50 168 Q46 192 48 218" fill="none" stroke={pal.skin} strokeWidth="13" strokeLinecap="round" />
          <path d="M150 168 Q154 192 152 218" fill="none" stroke={pal.skin} strokeWidth="13" strokeLinecap="round" />
        </g>

        {/* ── HANDS ── */}
        <g filter={`url(#sh-${size})`}>
          <circle cx="48" cy="222" r="10" fill={pal.skin} />
          <circle cx="152" cy="222" r="10" fill={pal.skin} />
          {/* Thumb hint */}
          <circle cx="40" cy="218" r="5" fill={pal.skin} />
          <circle cx="160" cy="218" r="5" fill={pal.skin} />
        </g>

        {/* ── NECK ── */}
        <path d="M91 108 Q100 112 109 108 L109 132 Q100 128 91 132 Z" fill={`url(#sk-${size})`} />

        {/* ── BACK HAIR (long, for girls) ── */}
        {!boy && !backView && (
          <path d="M62 70 Q40 160 48 220 Q58 210 65 200 Q60 150 68 75 Z
                   M138 70 Q160 160 152 220 Q142 210 135 200 Q140 150 132 75 Z"
            fill={pal.hair} fillOpacity="0.9" filter={`url(#sh-${size})`} />
        )}

        {/* ── HEAD ── */}
        <ellipse cx="100" cy="72" rx="40" ry="44" fill={`url(#sk-${size})`} filter={`url(#sh-${size})`} />

        {/* ── EARS ── */}
        <ellipse cx="60" cy="76" rx="7" ry="9" fill={pal.skin} />
        <ellipse cx="140" cy="76" rx="7" ry="9" fill={pal.skin} />

        {!backView ? (
          <g>
            {/* ── HAIR (front) ── */}
            {boy ? (
              // Boy: full dome hair covering top of head
              <g filter={`url(#sh-${size})`}>
                {/* Full top dome */}
                <path d="M61 75 C59 25 141 25 139 75 C130 58 115 50 100 52 C85 50 70 58 61 75 Z"
                  fill={`url(#hr-${size})`} />
                {/* Side volume */}
                <path d="M61 75 C58 50 62 32 72 28 C65 40 63 58 65 72 Z" fill={pal.hair} opacity="0.7" />
                <path d="M139 75 C142 50 138 32 128 28 C135 40 137 58 135 72 Z" fill={pal.hair} opacity="0.7" />
              </g>
            ) : (
              // Girl: two pigtails + hair cap
              <g filter={`url(#sh-${size})`}>
                {/* Full hair dome on top */}
                <path d="M63 72 C61 25 139 25 137 72 C128 56 115 50 100 52 C85 50 72 56 63 72 Z" fill={`url(#hr-${size})`} />
                {/* Left pigtail - positioned above shoulders */}
                <ellipse cx="58" cy="52" rx="13" ry="16" fill={pal.hair} />
                <path d="M46 46 Q40 34 46 24 Q56 18 63 32 Q56 40 52 52 Z" fill={pal.hair} />
                {/* Right pigtail */}
                <ellipse cx="142" cy="52" rx="13" ry="16" fill={pal.hair} />
                <path d="M154 46 Q160 34 154 24 Q144 18 137 32 Q144 40 148 52 Z" fill={pal.hair} />
                {/* Hair ties */}
                <circle cx="58" cy="38" r="5" fill={pal.clothing} opacity="0.95" />
                <circle cx="142" cy="38" r="5" fill={pal.clothing} opacity="0.95" />
                {/* Long strands going down beside head */}
                <path d="M50 52 Q42 100 46 140 Q52 130 56 120 Q54 90 58 60 Z" fill={pal.hair} fillOpacity="0.8" />
                <path d="M150 52 Q158 100 154 140 Q148 130 144 120 Q146 90 142 60 Z" fill={pal.hair} fillOpacity="0.8" />
              </g>
            )}

            {/* ── EYES ── */}
            {/* Left eye */}
            <ellipse cx="83" cy="76" rx="10" ry="11" fill="white" />
            <ellipse cx="84" cy="77" rx="6.5" ry="7" fill="#2B4A8C" />
            <ellipse cx="84" cy="77" rx="4" ry="4.5" fill="#0D1B3E" />
            <circle cx="86" cy="74" r="2" fill="white" />
            <path d="M73 68 Q83 64 93 68" fill="none" stroke={pal.hair} strokeWidth="2.5" strokeLinecap="round" />
            {/* Right eye */}
            <ellipse cx="117" cy="76" rx="10" ry="11" fill="white" />
            <ellipse cx="116" cy="77" rx="6.5" ry="7" fill="#2B4A8C" />
            <ellipse cx="116" cy="77" rx="4" ry="4.5" fill="#0D1B3E" />
            <circle cx="118" cy="74" r="2" fill="white" />
            <path d="M107 68 Q117 64 127 68" fill="none" stroke={pal.hair} strokeWidth="2.5" strokeLinecap="round" />

            {/* ── NOSE ── */}
            <path d="M97 88 Q100 93 103 88" fill="none" stroke={pal.skinShad} strokeWidth="2" strokeLinecap="round" opacity="0.7" />

            {/* ── MOUTH ── */}
            <path d="M88 100 Q100 111 112 100" fill="none" stroke="#C0392B" strokeWidth="3" strokeLinecap="round" />
            <path d="M91 100 Q100 109 109 100 Q100 115 91 100 Z" fill="#E74C3C" opacity="0.25" />

            {/* ── BLUSH ── */}
            <ellipse cx="73" cy="88" rx="9" ry="6" fill="#FF8A80" opacity="0.3" />
            <ellipse cx="127" cy="88" rx="9" ry="6" fill="#FF8A80" opacity="0.3" />

            {/* ── FRECKLES for ruiva ── */}
            {config.characterId === 'menina_padrao' && (
              <g fill={pal.hairShad} opacity="0.4">
                <circle cx="76" cy="84" r="1.5" /><circle cx="80" cy="87" r="1.5" /><circle cx="72" cy="87" r="1.5" />
                <circle cx="124" cy="84" r="1.5" /><circle cx="120" cy="87" r="1.5" /><circle cx="128" cy="87" r="1.5" />
              </g>
            )}
          </g>
        ) : (
          // Back of head
          <g>
            {boy ? (
              <path d="M62 68 C62 28 138 28 138 68 C135 90 115 96 100 96 C85 96 65 90 62 68 Z"
                fill={`url(#hr-${size})`} filter={`url(#sh-${size})`} />
            ) : (
              <g filter={`url(#sh-${size})`}>
                <path d="M62 68 C62 28 138 28 138 68 C135 90 115 96 100 96 C85 96 65 90 62 68 Z" fill={pal.hair} />
                <ellipse cx="63" cy="62" rx="14" ry="18" fill={pal.hair} />
                <ellipse cx="137" cy="62" rx="14" ry="18" fill={pal.hair} />
                <path d="M50 55 Q42 45 48 35 Q56 28 66 40 Q58 48 55 60 Z" fill={pal.hair} />
                <path d="M150 55 Q158 45 152 35 Q144 28 134 40 Q142 48 145 60 Z" fill={pal.hair} />
                <circle cx="63" cy="48" r="5" fill={pal.clothing} opacity="0.9" />
                <circle cx="137" cy="48" r="5" fill={pal.clothing} opacity="0.9" />
              </g>
            )}
          </g>
        )}
      </svg>

      {/* ── HIT ZONES ── */}
      {onPartClick && BODY_PARTS.map(part => {
        const nx = ((backView ? (100 - part.x) : part.x) / 100) * px;
        const ny = (part.y / 100) * h;
        return (
          <div key={part.id}
            onClick={e => { e.stopPropagation(); onPartClick(part.id); }}
            className="absolute w-12 h-12 -ml-6 -mt-6 rounded-full cursor-pointer hover:bg-teal/10 transition-colors z-10"
            style={{ left: nx, top: ny }}
            title={part.label}
          />
        );
      })}

      {/* ── HIGHLIGHT TARGET ── */}
      <AnimatePresence>
        {partData && (() => {
          const nx = ((backView ? (100 - partData.x) : partData.x) / 100) * px;
          const ny = (partData.y / 100) * h;
          return (
            <motion.div
              key={partData.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="pointer-target z-20"
              style={{ left: nx, top: ny }}
            >
              <div className="absolute left-10 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur text-teal font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap border border-teal/20 text-sm">
                {partData.label}
              </div>
              <div className="pointer-line w-8 top-1/2 left-4" />
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

/* ─── GALLERY / CUSTOMIZER ─── */
export function AvatarCustomizer({ config, onChange, onDone }: {
  config: AvatarConfig;
  onChange: (c: AvatarConfig) => void;
  onDone: () => void;
}) {
  const chars = [
    { id: 'menina_padrao',  label: 'Menina Ruiva',   emoji: '👧🏻' },
    { id: 'menina_loira',   label: 'Menina Loira',   emoji: '👱‍♀️' },
    { id: 'menina_morena',  label: 'Menina Morena',  emoji: '👧🏽' },
    { id: 'menina_negra',   label: 'Menina Negra',   emoji: '👧🏿' },
    { id: 'menino_padrao',  label: 'Menino',         emoji: '👦🏻' },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center gap-10 p-6 md:p-12 card glass-premium border-none shadow-2xl">
      {/* Preview */}
      <div className="bg-gradient-to-b from-teal/5 to-white/60 p-8 md:p-12 rounded-[4rem] shadow-inner relative flex-shrink-0">
        <div className="absolute top-4 left-4 bg-white/80 px-3 py-1 rounded-full text-[10px] font-bold text-teal uppercase tracking-widest border border-teal/20 z-10">
          Seu Personagem
        </div>
        <Avatar config={config} size="xl" animated />
      </div>

      {/* Selector */}
      <div className="flex-1 space-y-8 w-full max-w-md">
        <header className="space-y-1">
          <h2 className="text-3xl font-bold text-teal">Escolha seu Personagem</h2>
          <p className="text-muted text-sm uppercase tracking-widest font-medium">Quem mais se parece com você?</p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {chars.map(ch => (
            <button
              key={ch.id}
              onClick={() => onChange({ ...config, characterId: ch.id })}
              className={`relative flex flex-col items-center gap-3 p-4 rounded-[2rem] border-2 transition-all duration-300 hover:scale-[1.04] active:scale-95 shadow-sm group
                ${config.characterId === ch.id
                  ? 'border-teal bg-teal/5 ring-4 ring-teal/15 shadow-md'
                  : 'border-white/50 bg-white/40 hover:bg-white/60 hover:border-teal/30'
                }`}
            >
              {config.characterId === ch.id && (
                <div className="absolute top-2 right-2 bg-teal text-white p-1 rounded-full shadow">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
              {/* Mini avatar preview */}
              <Avatar config={{ characterId: ch.id }} size="sm" />
              <span className="text-[11px] font-black text-teal uppercase tracking-widest text-center">{ch.label}</span>
            </button>
          ))}
        </div>

        <button onClick={onDone} className="btn-primary w-full py-4 text-lg shadow-xl shadow-teal/20 active:scale-95 transition-transform">
          Ficou Incrível! Começar ✨
        </button>
      </div>
    </div>
  );
}
