import React from 'react';

export function SunflowerSvg({
  className = 'w-16 h-16',
  spinSlow = false,
}: {
  className?: string;
  spinSlow?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={`${className} ${spinSlow ? 'animate-[spin_28s_linear_infinite]' : ''}`}
      fill="none"
      aria-hidden="true"
    >
      {/* Back layer of warm amber petals */}
      <g stroke="#2B2230" strokeWidth="1.8" fill="#E59B1A">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <ellipse
            key={`back-${deg}`}
            cx="60"
            cy="22"
            rx="9"
            ry="23"
            transform={`rotate(${deg + 15} 60 60)`}
          />
        ))}
      </g>
      {/* Front layer of bright golden petals */}
      <g stroke="#2B2230" strokeWidth="1.8" fill="#F4B52E">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <ellipse
            key={`front-${deg}`}
            cx="60"
            cy="20"
            rx="9.5"
            ry="25"
            transform={`rotate(${deg} 60 60)`}
          />
        ))}
      </g>
      {/* Center seed disc */}
      <circle cx="60" cy="60" r="21" fill="#4A321F" stroke="#2B2230" strokeWidth="2.2" />
      <circle cx="60" cy="60" r="16" fill="none" stroke="#D9961A" strokeWidth="1.2" strokeDasharray="2.5 3.5" />
      <circle cx="60" cy="60" r="10.5" fill="none" stroke="#F4B52E" strokeWidth="1.2" strokeDasharray="2 3" />
      <circle cx="55" cy="55" r="1.8" fill="#FFF3D6" />
      <circle cx="65" cy="56" r="1.6" fill="#FFF3D6" />
      <circle cx="60" cy="65" r="1.8" fill="#FFF3D6" />
      <circle cx="53" cy="63" r="1.5" fill="#FFF3D6" />
      <circle cx="66" cy="63" r="1.5" fill="#FFF3D6" />
    </svg>
  );
}

export function LilySvg({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      {/* Outer blush-cream lily petals */}
      <g stroke="#2B2230" strokeWidth="1.8" fill="#FFFDF7">
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <path
            key={deg}
            d="M60 60 C46 38, 49 14, 60 8 C71 14, 74 38, 60 60 Z"
            transform={`rotate(${deg} 60 60)`}
          />
        ))}
      </g>
      {/* Subtle blush midribs */}
      <g stroke="#D37B58" strokeWidth="1.3" strokeLinecap="round" opacity="0.75">
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <line
            key={`rib-${deg}`}
            x1="60"
            y1="56"
            x2="60"
            y2="24"
            transform={`rotate(${deg} 60 60)`}
          />
        ))}
      </g>
      {/* Golden stamens */}
      <circle cx="60" cy="60" r="6" fill="#D9EDE1" stroke="#2B2230" strokeWidth="1.5" />
      {[15, 75, 135, 195, 255, 315].map((deg) => (
        <g key={`stamen-${deg}`} transform={`rotate(${deg} 60 60)`}>
          <line x1="60" y1="56" x2="60" y2="41" stroke="#5E7153" strokeWidth="1.4" />
          <ellipse cx="60" cy="39" rx="2.8" ry="1.8" fill="#D9961A" stroke="#2B2230" strokeWidth="1" />
        </g>
      ))}
    </svg>
  );
}

/**
 * Heirloom Botanical Glasshouse Cloche & Terrarium Logo for the Garden Section (#/4 & #/4/garden)
 */
export function GardenConservatoryLogoSvg({ className = 'w-44 h-36' }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 195" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="clocheSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FCE3B4" />
          <stop offset="55%" stopColor="#FFF6DF" />
          <stop offset="100%" stopColor="#DCE8D4" />
        </linearGradient>
        <linearGradient id="terracottaBase" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C96D4B" />
          <stop offset="50%" stopColor="#DF8766" />
          <stop offset="100%" stopColor="#B85C3B" />
        </linearGradient>
      </defs>

      {/* Soft ground shadow */}
      <ellipse cx="120" cy="182" rx="84" ry="8" fill="rgba(43,34,48,0.12)" />

      {/* Top Brass Finial Ring on the Glass Cloche */}
      <circle cx="120" cy="18" r="9" fill="#F4B52E" stroke="#2B2230" strokeWidth="2.4" />
      <circle cx="120" cy="18" r="3.5" fill="#FFF3D6" stroke="#2B2230" strokeWidth="1.6" />

      {/* Arching Victorian Glass Cloche Dome */}
      <path
        d="M46 154 L46 92 C46 46, 80 24, 120 24 C160 24, 194 46, 194 92 L194 154 Z"
        fill="url(#clocheSky)"
        stroke="#2B2230"
        strokeWidth="2.8"
      />

      {/* Architectural Glass Mullion Ribs */}
      <path
        d="M120 24 L120 154"
        stroke="#2B2230"
        strokeWidth="1.6"
        strokeDasharray="3 3"
        opacity="0.35"
      />
      <path
        d="M84 32 C68 62, 68 108, 68 154"
        stroke="#2B2230"
        strokeWidth="1.4"
        opacity="0.25"
      />
      <path
        d="M156 32 C172 62, 172 108, 172 154"
        stroke="#2B2230"
        strokeWidth="1.4"
        opacity="0.25"
      />
      <path d="M48 86 Q120 72 192 86" stroke="#2B2230" strokeWidth="1.5" opacity="0.28" />

      {/* Warm Golden Sunbeam Orb inside the Dome */}
      <circle cx="156" cy="58" r="14" fill="#F4B52E" opacity="0.55" />
      <circle cx="156" cy="58" r="9" fill="#F4B52E" stroke="#2B2230" strokeWidth="1.5" />

      {/* Lush Botanical Foliage & Stems inside Cloche */}
      <path
        d="M96 146 Q90 112 88 82"
        stroke="#4B6340"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <path
        d="M138 146 Q142 116 146 92"
        stroke="#4B6340"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      {/* Leaves */}
      <path
        d="M91 122 C74 114, 66 124, 80 132 C86 135, 90 128, 91 122 Z"
        fill="#7C9070"
        stroke="#2B2230"
        strokeWidth="1.8"
      />
      <path
        d="M91 106 C108 98, 114 108, 102 116 C96 119, 92 112, 91 106 Z"
        fill="#6A825D"
        stroke="#2B2230"
        strokeWidth="1.8"
      />
      <path
        d="M142 122 C158 114, 166 124, 152 132 C146 135, 142 128, 142 122 Z"
        fill="#7C9070"
        stroke="#2B2230"
        strokeWidth="1.8"
      />

      {/* Left Blooming Sunflower Head inside Dome */}
      <g transform="translate(56, 48) scale(0.54)">
        <g stroke="#2B2230" strokeWidth="2.4" fill="#E59B1A">
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <ellipse
              key={`gb-${deg}`}
              cx="60"
              cy="22"
              rx="9"
              ry="23"
              transform={`rotate(${deg + 15} 60 60)`}
            />
          ))}
        </g>
        <g stroke="#2B2230" strokeWidth="2.4" fill="#F4B52E">
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <ellipse
              key={`gf-${deg}`}
              cx="60"
              cy="20"
              rx="9.5"
              ry="25"
              transform={`rotate(${deg} 60 60)`}
            />
          ))}
        </g>
        <circle cx="60" cy="60" r="20" fill="#4A321F" stroke="#2B2230" strokeWidth="2.6" />
        <circle cx="60" cy="60" r="12" fill="none" stroke="#F4B52E" strokeWidth="2" strokeDasharray="3 3" />
      </g>

      {/* Right Blooming White Lily Head inside Dome */}
      <g transform="translate(116, 60) scale(0.52)">
        <g stroke="#2B2230" strokeWidth="2.4" fill="#FFFDF7">
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <path
              key={`gl-${deg}`}
              d="M60 60 C46 38, 49 14, 60 8 C71 14, 74 38, 60 60 Z"
              transform={`rotate(${deg} 60 60)`}
            />
          ))}
        </g>
        <circle cx="60" cy="60" r="8" fill="#F4B52E" stroke="#2B2230" strokeWidth="2" />
      </g>

      {/* Rolling Mossy Earth inside Base of Dome */}
      <path
        d="M47 144 Q86 132 122 142 T193 140 L193 155 L47 155 Z"
        fill="#5D7452"
        stroke="#2B2230"
        strokeWidth="2.2"
      />

      {/* Specular Glass Highlight Curve */}
      <path
        d="M58 88 C58 58, 76 40, 102 34"
        stroke="#FFFDF7"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* Molded Terracotta & Brass Conservatory Plinth */}
      <rect
        x="36"
        y="152"
        width="168"
        height="14"
        rx="7"
        fill="url(#terracottaBase)"
        stroke="#2B2230"
        strokeWidth="2.6"
      />
      <rect
        x="44"
        y="166"
        width="152"
        height="14"
        rx="5"
        fill="#B85C3B"
        stroke="#2B2230"
        strokeWidth="2.6"
      />
      {/* Brass Nameplate on Plinth */}
      <rect
        x="88"
        y="156"
        width="64"
        height="10"
        rx="3"
        fill="#F4B52E"
        stroke="#2B2230"
        strokeWidth="1.8"
      />
      <circle cx="94" cy="161" r="1.3" fill="#2B2230" />
      <circle cx="146" cy="161" r="1.3" fill="#2B2230" />
    </svg>
  );
}

/**
 * Heirloom Sealed Love Letter & Botanical Sprig Logo for Room II (#/4)
 */
export function SealedEnvelopeLogoSvg({ className = 'w-44 h-36' }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 195" className={className} fill="none" aria-hidden="true">
      <ellipse cx="120" cy="180" rx="80" ry="8" fill="rgba(43,34,48,0.12)" />

      {/* Back opened envelope flap */}
      <path
        d="M34 68 L120 14 L206 68 L206 164 C206 169, 202 173, 197 173 L43 173 C38 173, 34 169, 34 164 Z"
        fill="#EED9B3"
        stroke="#2B2230"
        strokeWidth="2.6"
      />

      {/* Rising Parchment Letter Sheet with handwritten lines */}
      <g transform="rotate(-2 120 95)">
        <rect
          x="52"
          y="28"
          width="136"
          height="118"
          rx="6"
          fill="#FFFDF7"
          stroke="#2B2230"
          strokeWidth="2.4"
        />
        <text
          x="68"
          y="52"
          fill="#2B2230"
          fontFamily="'Cormorant Garamond', Georgia, serif"
          fontSize="16"
          fontWeight="700"
          fontStyle="italic"
        >
          to rishika
        </text>
        <line x1="68" y1="66" x2="168" y2="66" stroke="#7C9070" strokeWidth="2" strokeLinecap="round" />
        <line x1="68" y1="78" x2="156" y2="78" stroke="#7C9070" strokeWidth="2" strokeLinecap="round" />
        <line x1="68" y1="90" x2="162" y2="90" stroke="#7C9070" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Envelope side & bottom folds */}
      <path
        d="M34 68 L120 126 L206 68 L206 164 C206 169, 202 173, 197 173 L43 173 C38 173, 34 169, 34 164 Z"
        fill="#FFF3D6"
        stroke="#2B2230"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path
        d="M36 170 L120 116 L204 170"
        fill="#F7E3BA"
        stroke="#2B2230"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />

      {/* Crimson Wax Seal with R Monogram in center */}
      <circle cx="120" cy="124" r="22" fill="#B94A3E" stroke="#2B2230" strokeWidth="2.4" />
      <circle
        cx="120"
        cy="124"
        r="16"
        fill="#9E392E"
        stroke="#F4B52E"
        strokeWidth="1.4"
        strokeDasharray="3 2"
      />
      <text
        x="120"
        y="131"
        textAnchor="middle"
        fill="#FFF3D6"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="22"
        fontWeight="700"
        fontStyle="italic"
      >
        R
      </text>
    </svg>
  );
}

/**
 * Heirloom Vintage Turntable & Cassette Mixtape Logo for Room III (#/4)
 */
export function VintageMusicLogoSvg({ className = 'w-44 h-36' }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 195" className={className} fill="none" aria-hidden="true">
      <ellipse cx="120" cy="180" rx="82" ry="8" fill="rgba(43,34,48,0.12)" />

      {/* Warm Walnut & Cream Turntable Plinth */}
      <rect
        x="34"
        y="34"
        width="172"
        height="136"
        rx="18"
        fill="#D37B58"
        stroke="#2B2230"
        strokeWidth="2.6"
      />
      <rect
        x="42"
        y="42"
        width="156"
        height="120"
        rx="12"
        fill="#FFF3D6"
        stroke="#2B2230"
        strokeWidth="2.2"
      />

      {/* Vinyl Disc */}
      <circle cx="106" cy="102" r="48" fill="#1C1830" stroke="#2B2230" strokeWidth="2.4" />
      <circle cx="106" cy="102" r="38" stroke="rgba(255,253,247,0.16)" strokeWidth="1.2" />
      <circle cx="106" cy="102" r="28" stroke="rgba(255,253,247,0.16)" strokeWidth="1.2" />
      <circle cx="106" cy="102" r="17" fill="#F4B52E" stroke="#2B2230" strokeWidth="2" />
      <circle cx="106" cy="102" r="4" fill="#FFFDF7" stroke="#2B2230" strokeWidth="1.6" />

      {/* Tonearm */}
      <circle cx="174" cy="64" r="10" fill="#F4B52E" stroke="#2B2230" strokeWidth="2.2" />
      <path
        d="M174 64 L162 118 L142 128"
        stroke="#2B2230"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="136"
        y="122"
        width="10"
        height="8"
        rx="2"
        transform="rotate(-24 136 122)"
        fill="#B94A3E"
        stroke="#2B2230"
        strokeWidth="1.8"
      />

      {/* Floating Musical Notes */}
      <text x="54" y="30" fill="#2B2230" fontSize="18" fontWeight="700">
        ♪
      </text>
      <text x="176" y="30" fill="#8A5A12" fontSize="18" fontWeight="700">
        ♫
      </text>
    </svg>
  );
}

/**
 * Ornate Scalloped Botanical Cameo Lock Emblem for the Passcode Screen (#/lock)
 */
export function ScallopedCameoLockSvg({
  unlocked = false,
  filledCount = 0,
}: {
  unlocked?: boolean;
  filledCount?: number;
}) {
  const petals = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2;
    const cx = 120 + Math.cos(angle) * 72;
    const cy = 128 + Math.sin(angle) * 72;
    return { cx: Number(cx.toFixed(1)), cy: Number(cy.toFixed(1)) };
  });

  return (
    <svg viewBox="0 0 240 230" className="w-48 h-48 sm:w-56 sm:h-56 mx-auto overflow-visible" fill="none" aria-hidden="true">
      {/* Brass Padlock Shackle at top */}
      <g
        style={{
          transform: unlocked ? 'translateY(-14px) rotate(12deg)' : 'translateY(0px)',
          transformOrigin: '152px 60px',
          transition: 'transform 420ms cubic-bezier(0.34, 1.45, 0.64, 1)',
        }}
      >
        <path
          d="M88 74 L88 42 C88 18, 152 18, 152 42 L152 74"
          stroke="#2B2230"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M88 74 L88 42 C88 18, 152 18, 152 42 L152 74"
          stroke="#F4B52E"
          strokeWidth="9"
          strokeLinecap="round"
        />
      </g>

      {/* Scalloped Cameo Outer Garland */}
      <g fill="#F4B52E" stroke="#2B2230" strokeWidth="2">
        {petals.map((p, idx) => (
          <circle
            key={idx}
            cx={p.cx}
            cy={p.cy}
            r="16"
            fill={idx < filledCount * 5 ? '#F4B52E' : '#FFF3D6'}
          />
        ))}
      </g>

      {/* Inner Cameo Medallion */}
      <circle cx="120" cy="128" r="68" fill="#FFFDF7" stroke="#2B2230" strokeWidth="3" />
      <circle
        cx="120"
        cy="128"
        r="58"
        fill="#FFF3D6"
        stroke="#D9961A"
        strokeWidth="1.8"
        strokeDasharray="4 4"
      />

      {/* Center Keyhole & Sunflower Crest */}
      <g transform="translate(120, 118) scale(0.54)">
        <g transform="translate(-60, -60)">
          <g stroke="#2B2230" strokeWidth="1.8" fill="#E59B1A">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <ellipse
                key={`cb-${deg}`}
                cx="60"
                cy="22"
                rx="9"
                ry="23"
                transform={`rotate(${deg + 15} 60 60)`}
              />
            ))}
          </g>
          <g stroke="#2B2230" strokeWidth="1.8" fill="#F4B52E">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <ellipse
                key={`cf-${deg}`}
                cx="60"
                cy="20"
                rx="9.5"
                ry="25"
                transform={`rotate(${deg} 60 60)`}
              />
            ))}
          </g>
          <circle cx="60" cy="60" r="21" fill="#4A321F" stroke="#2B2230" strokeWidth="2.2" />
          <circle cx="60" cy="60" r="14" fill="none" stroke="#D9961A" strokeWidth="1.4" strokeDasharray="3 3" />
        </g>
      </g>

      {/* Vintage Brass Keyhole badge at bottom of medallion */}
      <circle cx="120" cy="158" r="14" fill="#F4B52E" stroke="#2B2230" strokeWidth="2.2" />
      <circle cx="120" cy="154" r="4" fill="#2B2230" />
      <path d="M117 156 L114.5 166 L125.5 166 L123 156 Z" fill="#2B2230" />
    </svg>
  );
}

export function InlineSunflowerIcon() {
  return (
    <span
      className="inline-flex items-center justify-center align-middle mx-1 w-6 h-6 animate-[spin_20s_linear_infinite]"
      title="Sunflower for Rishika"
    >
      <SunflowerSvg className="w-6 h-6" />
    </span>
  );
}

export function InlineWhiteHeartIcon() {
  return (
    <svg
      viewBox="0 0 28 28"
      className="inline-white-heart inline-block w-6 h-6 mx-1 align-[-5px]"
      role="img"
      aria-label="pulsing white heart"
    >
      <path
        d="M14 24.2 C14 24.2 3.5 17.4 3.5 9.8 C3.5 6.1 6.4 3.5 9.8 3.5 C11.9 3.5 13.4 4.6 14 6.1 C14.6 4.6 16.1 3.5 18.2 3.5 C21.6 3.5 24.5 6.1 24.5 9.8 C24.5 17.4 14 24.2 14 24.2 Z"
        fill="#FFFDF7"
        stroke="#2B2230"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.2 8.2 C7.2 9.1 6.8 10.4 7.0 11.7"
        stroke="#D37B58"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function WaxSealSvg({ broken = false }: { broken?: boolean }) {
  return (
    <svg viewBox="0 0 110 110" className="w-24 h-24 drop-shadow-md" fill="none" aria-hidden="true">
      <path
        d="M55 8 C67 7, 75 13, 84 19 C94 26, 102 39, 101 53 C100 66, 96 79, 86 89 C76 99, 66 102, 53 102 C39 102, 26 97, 17 87 C8 77, 7 64, 9 50 C11 36, 18 24, 29 16 C39 9, 45 9, 55 8 Z"
        fill="#B94A3E"
        stroke="#2B2230"
        strokeWidth="2.4"
      />
      <circle
        cx="55"
        cy="55"
        r="34"
        fill="#9E392E"
        stroke="#F4B52E"
        strokeWidth="1.6"
        strokeDasharray="4 3"
      />
      {/* Embossed R monogram + small sprig */}
      <text
        x="55"
        y="65"
        textAnchor="middle"
        fill="#FFF3D6"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="36"
        fontWeight="700"
        fontStyle="italic"
      >
        R
      </text>
      {broken && (
        <path
          d="M36 22 L53 49 L46 61 L69 89"
          stroke="#2B2230"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function ChocolateFoilSvg({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      <rect
        x="24"
        y="16"
        width="72"
        height="88"
        rx="8"
        fill="#5C3A28"
        stroke="#2B2230"
        strokeWidth="2.2"
      />
      <rect x="31" y="24" width="25" height="20" rx="3" fill="#754B34" stroke="#2B2230" strokeWidth="1.6" />
      <rect x="64" y="24" width="25" height="20" rx="3" fill="#754B34" stroke="#2B2230" strokeWidth="1.6" />
      <rect x="31" y="50" width="25" height="20" rx="3" fill="#754B34" stroke="#2B2230" strokeWidth="1.6" />
      <rect x="64" y="50" width="25" height="20" rx="3" fill="#754B34" stroke="#2B2230" strokeWidth="1.6" />
      {/* Gold foil wrapper */}
      <path
        d="M20 58 L100 48 L100 102 C100 105, 97 108, 94 108 L26 108 C23 108, 20 105, 20 102 Z"
        fill="#F4B52E"
        stroke="#2B2230"
        strokeWidth="2.2"
      />
      <path d="M20 58 Q60 66 100 48" stroke="#FFFDF7" strokeWidth="3" fill="none" />
      <text
        x="60"
        y="86"
        textAnchor="middle"
        fill="#2B2230"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="15"
        fontWeight="700"
        fontStyle="italic"
      >
        Milk Cacao
      </text>
    </svg>
  );
}

export function RomanceBookSvg({ className = 'w-16 h-16' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      {/* Open hardcover novel */}
      <path
        d="M16 30 Q38 22 60 32 Q82 22 104 30 L104 92 Q82 84 60 94 Q38 84 16 92 Z"
        fill="#4A2535"
        stroke="#2B2230"
        strokeWidth="2.4"
      />
      <path
        d="M20 26 Q40 18 60 28 L60 90 Q40 80 20 88 Z"
        fill="#FFFDF7"
        stroke="#2B2230"
        strokeWidth="1.8"
      />
      <path
        d="M60 28 Q80 18 100 26 L100 88 Q80 80 60 90 Z"
        fill="#FFF8EA"
        stroke="#2B2230"
        strokeWidth="1.8"
      />
      {/* Lines of prose */}
      <line x1="28" y1="40" x2="52" y2="42" stroke="#7C9070" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="28" y1="50" x2="52" y2="52" stroke="#7C9070" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="28" y1="60" x2="48" y2="62" stroke="#7C9070" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="68" y1="42" x2="92" y2="40" stroke="#7C9070" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="68" y1="52" x2="92" y2="50" stroke="#7C9070" strokeWidth="1.6" strokeLinecap="round" />
      {/* Crimson silk bookmark ribbon */}
      <path
        d="M60 28 L64 106 L58 100 L52 106 Z"
        fill="#B94A3E"
        stroke="#2B2230"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function BouquetVaseSvg({ stemCount }: { stemCount: number }) {
  const stems = [
    { x: 105, y: 88, angle: -28, type: 'sunflower' },
    { x: 195, y: 86, angle: 26, type: 'lily' },
    { x: 125, y: 66, angle: -15, type: 'sunflower' },
    { x: 175, y: 66, angle: 16, type: 'lily' },
    { x: 88, y: 112, angle: -38, type: 'sunflower' },
    { x: 212, y: 110, angle: 36, type: 'lily' },
    { x: 148, y: 52, angle: -4, type: 'sunflower' },
    { x: 156, y: 78, angle: 6, type: 'lily' },
  ];

  return (
    <svg viewBox="0 0 300 320" className="w-full max-w-[290px] h-auto mx-auto overflow-visible">
      {stemCount >= 8 && (
        <circle cx="150" cy="115" r="95" fill="url(#bouquetGlow)" opacity="0.7" />
      )}
      <defs>
        <radialGradient id="bouquetGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F4B52E" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#F4B52E" stopOpacity="0" />
        </radialGradient>
      </defs>

      {stems.slice(0, stemCount).map((stem, idx) => (
        <g
          key={idx}
          className="transition-all duration-500 ease-out"
          style={{ transformOrigin: '150px 210px' }}
        >
          <path
            d={`M150 215 Q150 155 ${stem.x} ${stem.y}`}
            stroke="#58724E"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse
            cx={(150 + stem.x) / 2 + (idx % 2 === 0 ? -10 : 10)}
            cy={(215 + stem.y) / 2}
            rx="10"
            ry="5"
            transform={`rotate(${stem.angle} ${(150 + stem.x) / 2} ${(215 + stem.y) / 2})`}
            fill="#7C9070"
            stroke="#2B2230"
            strokeWidth="1.5"
          />
          <g transform={`translate(${stem.x - 32}, ${stem.y - 32}) scale(0.54)`}>
            {stem.type === 'sunflower' ? (
              <>
                <g stroke="#2B2230" strokeWidth="2.2" fill="#F4B52E">
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                    <ellipse
                      key={deg}
                      cx="60"
                      cy="20"
                      rx="9.5"
                      ry="24"
                      transform={`rotate(${deg} 60 60)`}
                    />
                  ))}
                </g>
                <circle cx="60" cy="60" r="20" fill="#4A321F" stroke="#2B2230" strokeWidth="2.4" />
                <circle cx="60" cy="60" r="12" fill="none" stroke="#F4B52E" strokeWidth="1.6" strokeDasharray="3 3" />
              </>
            ) : (
              <>
                <g stroke="#2B2230" strokeWidth="2.2" fill="#FFFDF7">
                  {[0, 60, 120, 180, 240, 300].map((deg) => (
                    <path
                      key={deg}
                      d="M60 60 C46 38, 49 14, 60 8 C71 14, 74 38, 60 60 Z"
                      transform={`rotate(${deg} 60 60)`}
                    />
                  ))}
                </g>
                <circle cx="60" cy="60" r="8" fill="#F4B52E" stroke="#2B2230" strokeWidth="1.8" />
              </>
            )}
          </g>
        </g>
      ))}

      <g>
        <ellipse cx="150" cy="296" rx="52" ry="8" fill="rgba(43,34,48,0.12)" />
        <path
          d="M118 192 L182 192 C186 208, 198 232, 194 264 C191 284, 176 294, 150 294 C124 294, 109 284, 106 264 C102 232, 114 208, 118 192 Z"
          fill="#FFFDF7"
          stroke="#2B2230"
          strokeWidth="2.5"
        />
        <ellipse cx="150" cy="192" rx="32" ry="6.5" fill="#EDE3CF" stroke="#2B2230" strokeWidth="2.2" />
        <path
          d="M142 268 Q150 245 158 228"
          stroke="#7C9070"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <ellipse cx="144" cy="248" rx="6" ry="3" transform="rotate(-25 144 248)" fill="#7C9070" />
        <ellipse cx="156" cy="242" rx="6" ry="3" transform="rotate(25 156 242)" fill="#7C9070" />
      </g>

      {stemCount >= 8 && (
        <g className="animate-[fadeIn_500ms_ease-out]">
          <rect
            x="116"
            y="204"
            width="68"
            height="10"
            rx="4"
            fill="#D37B58"
            stroke="#2B2230"
            strokeWidth="2"
          />
          <path
            d="M150 209 C132 195, 120 206, 134 217 C142 221, 148 214, 150 209 Z"
            fill="#F2D5D4"
            stroke="#2B2230"
            strokeWidth="2"
          />
          <path
            d="M150 209 C168 195, 180 206, 166 217 C158 221, 152 214, 150 209 Z"
            fill="#F2D5D4"
            stroke="#2B2230"
            strokeWidth="2"
          />
          <path
            d="M146 212 L136 242 M154 212 L164 244"
            stroke="#D37B58"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="150" cy="209" r="4.5" fill="#F4B52E" stroke="#2B2230" strokeWidth="1.8" />
        </g>
      )}
    </svg>
  );
}

/**
 * Ambient Floating Sunflower & White Lily Petals Overlay across the entire website
 */
export function FloatingPetalsOverlay() {
  const petals = [
    { id: 0, left: '6%', delay: '-2.5s', duration: '15s', kind: 'sunflower', size: 19 },
    { id: 1, left: '13%', delay: '-8.2s', duration: '18s', kind: 'lily', size: 17 },
    { id: 2, left: '21%', delay: '-12.4s', duration: '16s', kind: 'sunflower', size: 16 },
    { id: 3, left: '29%', delay: '-4.5s', duration: '19s', kind: 'lily', size: 20 },
    { id: 4, left: '38%', delay: '-10.1s', duration: '14s', kind: 'sunflower', size: 18 },
    { id: 5, left: '47%', delay: '-1.8s', duration: '17s', kind: 'lily', size: 16 },
    { id: 6, left: '55%', delay: '-6.8s', duration: '16.5s', kind: 'sunflower', size: 20 },
    { id: 7, left: '64%', delay: '-13.3s', duration: '18.5s', kind: 'lily', size: 18 },
    { id: 8, left: '73%', delay: '-3.7s', duration: '15.5s', kind: 'sunflower', size: 17 },
    { id: 9, left: '81%', delay: '-9.4s', duration: '17.5s', kind: 'lily', size: 19 },
    { id: 10, left: '89%', delay: '-5.2s', duration: '16s', kind: 'sunflower', size: 18 },
    { id: 11, left: '95%', delay: '-11.6s', duration: '18s', kind: 'lily', size: 16 },
  ];

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden select-none"
    >
      {petals.map((p) => (
        <div
          key={p.id}
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
          className="floating-petal absolute -top-8"
        >
          {p.kind === 'sunflower' ? (
            <svg
              width={p.size}
              height={p.size * 1.4}
              viewBox="0 0 24 34"
              fill="none"
              className="drop-shadow-[0_2px_6px_rgba(244,181,46,0.45)]"
            >
              <path
                d="M12 2 C5 10, 4 22, 12 32 C20 22, 19 10, 12 2 Z"
                fill="#F4B52E"
                stroke="#D9961A"
                strokeWidth="1.2"
              />
              <path d="M12 7 L12 26" stroke="#FFF3D6" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
            </svg>
          ) : (
            <svg
              width={p.size}
              height={p.size * 1.4}
              viewBox="0 0 24 34"
              fill="none"
              className="drop-shadow-[0_2px_6px_rgba(211,123,88,0.28)]"
            >
              <path
                d="M12 2 C4 11, 5 24, 12 32 C19 24, 20 11, 12 2 Z"
                fill="#FFFDF7"
                stroke="#D37B58"
                strokeWidth="1.1"
              />
              <path d="M12 8 L12 26" stroke="#F2D5D4" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Rich, Painterly Multi-Bloom Botanical Plant for the Full-Screen Landscape Garden
 * Replaces flat single-stick CSS flowers with organic multi-stemmed clusters, veined leaves,
 * side buds, and golden dewdrop highlights proportioned realistically to the meadow hills.
 */
export function GardenLandscapePlantSvg({
  kind,
  variantIndex = 0,
}: {
  kind: 'sunflower' | 'lily';
  variantIndex?: number;
}) {
  const hasTwinBloom = variantIndex % 3 !== 1;
  return (
    <svg
      viewBox="0 0 130 155"
      className="w-20 h-24 sm:w-24 sm:h-28 overflow-visible drop-shadow-[0_4px_10px_rgba(43,34,48,0.22)]"
      fill="none"
      aria-hidden="true"
    >
      {/* Basal grass blades anchoring plant into the meadow */}
      <path
        d="M65 150 Q52 132 42 122 M65 150 Q78 130 88 118 M65 150 Q58 136 53 124"
        stroke="#3A5430"
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Secondary curved side stem */}
      {hasTwinBloom && (
        <path
          d="M65 148 Q50 118 36 78"
          stroke="#49653D"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      )}

      {/* Primary curved botanical stem */}
      <path
        d="M65 150 Q69 108 66 52"
        stroke="#3F5A34"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Veined Botanical Leaves */}
      <g>
        <path
          d="M65 116 C42 106, 30 118, 46 128 C54 132, 62 124, 65 116 Z"
          fill="#6E8B5E"
          stroke="#2B2230"
          strokeWidth="1.6"
        />
        <path d="M63 117 Q49 118 43 122" stroke="#DCE8D4" strokeWidth="1" strokeLinecap="round" />

        <path
          d="M67 98 C90 88, 102 100, 86 110 C78 114, 70 106, 67 98 Z"
          fill="#5C7A4D"
          stroke="#2B2230"
          strokeWidth="1.6"
        />
        <path d="M69 99 Q82 100 88 104" stroke="#DCE8D4" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* Secondary Side Blossom / Opening Bud */}
      {hasTwinBloom && (
        <g transform="translate(36, 74) rotate(-22) scale(0.32)">
          <g transform="translate(-60, -60)">
            {kind === 'sunflower' ? (
              <>
                <g stroke="#2B2230" strokeWidth="2.2" fill="#F4B52E">
                  {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg) => (
                    <ellipse
                      key={deg}
                      cx="60"
                      cy="20"
                      rx="9.5"
                      ry="24"
                      transform={`rotate(${deg} 60 60)`}
                    />
                  ))}
                </g>
                <circle cx="60" cy="60" r="19" fill="#4A321F" stroke="#2B2230" strokeWidth="2.4" />
              </>
            ) : (
              <>
                <g stroke="#2B2230" strokeWidth="2.2" fill="#FFFDF7">
                  {[0, 60, 120, 180, 240, 300].map((deg) => (
                    <path
                      key={deg}
                      d="M60 60 C46 38, 49 14, 60 8 C71 14, 74 38, 60 60 Z"
                      transform={`rotate(${deg} 60 60)`}
                    />
                  ))}
                </g>
                <circle cx="60" cy="60" r="8" fill="#F4B52E" />
              </>
            )}
          </g>
        </g>
      )}

      {/* Primary Detailed Blossom Head */}
      <g transform="translate(66, 48) scale(0.52)">
        <g transform="translate(-60, -60)">
          {kind === 'sunflower' ? (
            <>
              <g stroke="#2B2230" strokeWidth="1.9" fill="#E59B1A">
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <ellipse
                    key={`sb-${deg}`}
                    cx="60"
                    cy="21"
                    rx="9"
                    ry="24"
                    transform={`rotate(${deg + 15} 60 60)`}
                  />
                ))}
              </g>
              <g stroke="#2B2230" strokeWidth="1.9" fill="#F4B52E">
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <ellipse
                    key={`sf-${deg}`}
                    cx="60"
                    cy="19"
                    rx="9.5"
                    ry="26"
                    transform={`rotate(${deg} 60 60)`}
                  />
                ))}
              </g>
              <circle cx="60" cy="60" r="21" fill="#4A321F" stroke="#2B2230" strokeWidth="2.2" />
              <circle cx="60" cy="60" r="14" fill="none" stroke="#F4B52E" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="54" cy="54" r="2" fill="#FFFDF7" />
              <circle cx="65" cy="56" r="1.8" fill="#FFFDF7" />
              <circle cx="60" cy="65" r="2" fill="#FFFDF7" />
            </>
          ) : (
            <>
              <g stroke="#2B2230" strokeWidth="1.9" fill="#F2D5D4">
                {[30, 90, 150, 210, 270, 330].map((deg) => (
                  <path
                    key={`lb-${deg}`}
                    d="M60 60 C47 38, 50 15, 60 9 C70 15, 73 38, 60 60 Z"
                    transform={`rotate(${deg} 60 60)`}
                  />
                ))}
              </g>
              <g stroke="#2B2230" strokeWidth="1.9" fill="#FFFDF7">
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <path
                    key={`lf-${deg}`}
                    d="M60 60 C45 36, 48 12, 60 6 C72 12, 75 36, 60 60 Z"
                    transform={`rotate(${deg} 60 60)`}
                  />
                ))}
              </g>
              <g stroke="#D37B58" strokeWidth="1.4" strokeLinecap="round">
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <line
                    key={`rib-${deg}`}
                    x1="60"
                    y1="56"
                    x2="60"
                    y2="24"
                    transform={`rotate(${deg} 60 60)`}
                  />
                ))}
              </g>
              <circle cx="60" cy="60" r="7" fill="#F4B52E" stroke="#2B2230" strokeWidth="1.6" />
            </>
          )}
        </g>
      </g>

      {/* Shiny Golden Dewdrop Sparkle near the blossom */}
      <circle cx="88" cy="34" r="2.5" fill="#FFFDF7" className="shiny-sparkle" />
      <circle cx="42" cy="48" r="2" fill="#F4B52E" className="shiny-sparkle" />
    </svg>
  );
}

/**
 * Rich Celestial Sunflower & White Lily Botanical Archway Illustration
 * Replaces bare CSS/SVG sunflower + lily icons with a lush heirloom centerpiece.
 */
export function BotanicalUniverseArchSvg({ className = 'w-64 h-40' }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 185" className={className} fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="archHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F4B52E" stopOpacity="0.42" />
          <stop offset="65%" stopColor="#F2D5D4" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#FFFDF7" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Warm Golden Constellation Halo */}
      <ellipse cx="160" cy="95" rx="135" ry="76" fill="url(#archHalo)" />

      {/* Ornate Golden Filigree Arch & Starry Constellation Lines */}
      <path
        d="M44 148 C44 64, 102 24, 160 24 C218 24, 276 64, 276 148"
        stroke="#D9961A"
        strokeWidth="1.8"
        strokeDasharray="4 4"
      />
      <path
        d="M64 148 C64 78, 110 42, 160 42 C210 42, 256 78, 256 148"
        stroke="#2B2230"
        strokeWidth="1.5"
        opacity="0.3"
      />

      {/* Twinkling Four-Point Stars */}
      <path d="M160 10 L163 18 L171 21 L163 24 L160 32 L157 24 L149 21 L157 18 Z" fill="#F4B52E" stroke="#2B2230" strokeWidth="1" />
      <path d="M68 42 L70 47 L75 49 L70 51 L68 56 L66 51 L61 49 L66 47 Z" fill="#F4B52E" />
      <path d="M252 42 L254 47 L259 49 L254 51 L252 56 L250 51 L245 49 L250 47 Z" fill="#F4B52E" />

      {/* Intertwined Botanical Vines & Foliage */}
      <path
        d="M75 156 Q116 118 134 86 M245 156 Q204 118 186 86 M160 158 L160 92"
        stroke="#4B6340"
        strokeWidth="3.6"
        strokeLinecap="round"
      />
      <ellipse cx="102" cy="128" rx="14" ry="6" transform="rotate(-28 102 128)" fill="#7C9070" stroke="#2B2230" strokeWidth="1.6" />
      <ellipse cx="218" cy="128" rx="14" ry="6" transform="rotate(28 218 128)" fill="#7C9070" stroke="#2B2230" strokeWidth="1.6" />
      <ellipse cx="138" cy="134" rx="12" ry="5.5" transform="rotate(22 138 134)" fill="#5C7A4D" stroke="#2B2230" strokeWidth="1.6" />
      <ellipse cx="182" cy="134" rx="12" ry="5.5" transform="rotate(-22 182 134)" fill="#5C7A4D" stroke="#2B2230" strokeWidth="1.6" />

      {/* Left Lush Sunflower Bloom */}
      <g transform="translate(116, 86) scale(0.58)">
        <g transform="translate(-60, -60)">
          <g stroke="#2B2230" strokeWidth="2" fill="#E59B1A">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <ellipse key={`ab-${deg}`} cx="60" cy="21" rx="9" ry="23" transform={`rotate(${deg + 15} 60 60)`} />
            ))}
          </g>
          <g stroke="#2B2230" strokeWidth="2" fill="#F4B52E">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <ellipse key={`af-${deg}`} cx="60" cy="19" rx="9.5" ry="25" transform={`rotate(${deg} 60 60)`} />
            ))}
          </g>
          <circle cx="60" cy="60" r="20" fill="#4A321F" stroke="#2B2230" strokeWidth="2.2" />
          <circle cx="60" cy="60" r="13" fill="none" stroke="#F4B52E" strokeWidth="1.5" strokeDasharray="3 3" />
        </g>
      </g>

      {/* Right Lush White Lily Bloom */}
      <g transform="translate(204, 86) scale(0.58)">
        <g transform="translate(-60, -60)">
          <g stroke="#2B2230" strokeWidth="2" fill="#F2D5D4">
            {[30, 90, 150, 210, 270, 330].map((deg) => (
              <path key={`alb-${deg}`} d="M60 60 C46 38, 49 14, 60 8 C71 14, 74 38, 60 60 Z" transform={`rotate(${deg} 60 60)`} />
            ))}
          </g>
          <g stroke="#2B2230" strokeWidth="2" fill="#FFFDF7">
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <path key={`alf-${deg}`} d="M60 60 C45 36, 48 12, 60 6 C72 12, 75 36, 60 60 Z" transform={`rotate(${deg} 60 60)`} />
            ))}
          </g>
          <circle cx="60" cy="60" r="7.5" fill="#F4B52E" stroke="#2B2230" strokeWidth="1.8" />
        </g>
      </g>

      {/* Center Crown White Heart & Silk Ribbon Knot */}
      <g transform="translate(160, 68)">
        <circle cx="0" cy="0" r="20" fill="#FFF3D6" stroke="#2B2230" strokeWidth="2" />
        <path
          d="M0 9 C0 9 -10 2.5 -10 -4 C-10 -7.5 -7 -10 -4 -10 C-1.8 -10 -0.5 -8.8 0 -7.2 C0.5 -8.8 1.8 -10 4 -10 C7 -10 10 -7.5 10 -4 C10 2.5 0 9 0 9 Z"
          fill="#FFFDF7"
          stroke="#2B2230"
          strokeWidth="2"
        />
      </g>

      {/* Silk Ribbon Bow tying the bouquet stems at bottom */}
      <path
        d="M160 144 C140 130, 126 142, 142 154 C150 158, 157 150, 160 144 Z"
        fill="#F2D5D4"
        stroke="#2B2230"
        strokeWidth="2"
      />
      <path
        d="M160 144 C180 130, 194 142, 178 154 C170 158, 163 150, 160 144 Z"
        fill="#F2D5D4"
        stroke="#2B2230"
        strokeWidth="2"
      />
      <circle cx="160" cy="144" r="5" fill="#F4B52E" stroke="#2B2230" strokeWidth="1.8" />
    </svg>
  );
}

