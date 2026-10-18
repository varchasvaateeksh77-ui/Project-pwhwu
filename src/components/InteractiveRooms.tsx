import React, { useEffect, useRef, useState } from 'react';
import { STORY_CONFIG } from '../config/storyConfig';
import {
  clampRangeInput,
  computeGardenSunriseProgress,
  createPlantedFlower,
  formatSeconds,
  GARDEN_FULL_SUNRISE_COUNT,
  parseLetterBlocks,
  PlantedFlower,
  tokenizeInlineIcons,
} from '../utils/proposalLogic';
import { soundEngine } from '../utils/soundEngine';
import {
  GardenLandscapePlantSvg,
  InlineSunflowerIcon,
  InlineWhiteHeartIcon,
  SunflowerSvg,
  WaxSealSvg,
} from './BotanicalArt';
import { CatSticker } from './CatSticker';

interface SubRoomProps {
  onBack: () => void;
  onMarkVisited: (room: 'garden' | 'letter' | 'song') => void;
}

const SHINY_MOTES = [
  { left: '8%', top: '24%', size: 6, delay: '0s' },
  { left: '16%', top: '42%', size: 5, delay: '0.6s' },
  { left: '24%', top: '18%', size: 7, delay: '1.3s' },
  { left: '33%', top: '52%', size: 5, delay: '0.3s' },
  { left: '41%', top: '28%', size: 8, delay: '1.8s' },
  { left: '49%', top: '61%', size: 6, delay: '0.9s' },
  { left: '57%', top: '22%', size: 7, delay: '2.1s' },
  { left: '64%', top: '48%', size: 5, delay: '0.4s' },
  { left: '72%', top: '34%', size: 8, delay: '1.5s' },
  { left: '81%', top: '56%', size: 6, delay: '0.7s' },
  { left: '88%', top: '26%', size: 7, delay: '1.1s' },
  { left: '93%', top: '44%', size: 5, delay: '2.4s' },
  { left: '19%', top: '76%', size: 6, delay: '0.8s' },
  { left: '45%', top: '81%', size: 5, delay: '1.6s' },
  { left: '68%', top: '78%', size: 6, delay: '0.2s' },
  { left: '84%', top: '83%', size: 5, delay: '1.9s' },
];

/* ============================================================================
 * ROOM 4A: FULL-SCREEN SHINY LANDSCAPE GREENHOUSE (#/4/garden)
 * ============================================================================ */
export function GreenhouseRoom({ onBack, onMarkVisited }: SubRoomProps) {
  // Starts completely empty (0 flowers) so Rishika plants the entire landscape from scratch
  const [flowers, setFlowers] = useState<PlantedFlower[]>([]);

  useEffect(() => {
    onMarkVisited('garden');
  }, [onMarkVisited]);

  const sunriseProgress = computeGardenSunriseProgress(flowers.length);
  const bloomComplete = flowers.length >= GARDEN_FULL_SUNRISE_COUNT;

  // All on-screen text fades out smoothly as flowers bloom (completely gone by 4 flowers)
  const textFadeOpacity = Number(Math.max(0, 1 - flowers.length * 0.28).toFixed(2));

  const handlePlantOnCanvas = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    plantSeedAt(xPct, yPct);
  };

  const plantSeedAt = (xPct: number, yPct: number) => {
    setFlowers((prev) => {
      const nextId = prev.length;
      const next = [...prev, createPlantedFlower(nextId, xPct, yPct)];
      if (next.length === GARDEN_FULL_SUNRISE_COUNT) {
        soundEngine.playHeartShimmer();
      } else {
        soundEngine.playBloomNote(nextId);
      }
      return next;
    });
  };

  const handlePlantRandomSeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    const meadowSlots = [10, 24, 38, 52, 66, 80, 17, 31, 60, 74, 88, 45];
    const slotX = meadowSlots[flowers.length % meadowSlots.length];
    const jitterX = ((flowers.length * 3) % 5) - 2;
    const randomX = slotX + jitterX;
    // Rooted in the lower meadow (83% to 94% of viewport height)
    const randomY = 83 + ((flowers.length * 3) % 10);
    plantSeedAt(randomX, randomY);
  };

  // Sun rises smoothly from horizon (top: 56%) up into the high sky (top: 14%) as flowers reach 10
  const sunTopPercent = Math.round(56 - sunriseProgress * 42);
  const sunScale = Number((0.78 + sunriseProgress * 0.44).toFixed(2));

  return (
    <section
      aria-label="The Living Greenhouse Fullscreen Landscape"
      onClick={handlePlantOnCanvas}
      className="fixed inset-0 z-40 w-screen h-dvh overflow-hidden select-none cursor-pointer"
    >
      {/* 1. Deep Twilight Base Sky */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#1A142B] via-[#3E2744] to-[#B67665] transition-opacity duration-700"
      />

      {/* 2. Shiny Golden-Hour Sunrise Sky Layer (Opacity scales 0 -> 1 from 0 to 10 flowers) */}
      <div
        aria-hidden="true"
        style={{ opacity: sunriseProgress }}
        className="absolute inset-0 bg-gradient-to-b from-[#F4B52E] via-[#FDE1A8] to-[#FFF8E6] transition-opacity duration-700"
      />

      {/* 3. Shimmering Sunbeams / God-Rays Layer */}
      <div
        aria-hidden="true"
        style={{
          top: `${sunTopPercent}%`,
          opacity: Math.max(0.12, sunriseProgress * 0.85),
          transform: `translate(-50%, -50%) scale(${0.85 + sunriseProgress * 0.55})`,
        }}
        className="absolute left-1/2 w-[760px] h-[760px] rounded-full pointer-events-none transition-all duration-700"
      >
        <div
          className="w-full h-full rounded-full animate-[spin_55s_linear_infinite]"
          style={{
            background:
              'repeating-conic-gradient(from 0deg, rgba(255,253,247,0.32) 0deg 8deg, transparent 8deg 24deg)',
            maskImage: 'radial-gradient(circle, black 10%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(circle, black 10%, transparent 70%)',
          }}
        />
      </div>

      {/* 4. Radiant Rising Sun Orb in Upper Sky */}
      <div
        aria-hidden="true"
        style={{
          top: `${sunTopPercent}%`,
          transform: `translate(-50%, -50%) scale(${sunScale})`,
          opacity: Math.max(0.32, sunriseProgress),
          boxShadow: bloomComplete
            ? '0 0 120px 42px rgba(244, 181, 46, 0.95), 0 0 45px 12px rgba(255, 253, 247, 0.9)'
            : `0 0 ${Math.round(35 + sunriseProgress * 65)}px ${Math.round(
                8 + sunriseProgress * 24
              )}px rgba(244, 181, 46, ${0.38 + sunriseProgress * 0.5})`,
        }}
        className="absolute left-1/2 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-b from-[#FFFDF7] via-[#FCE08B] to-[#F4B52E] border-2 border-[#FFFDF7]/80 transition-all duration-700 pointer-events-none"
      />

      {/* 5. Shiny Twinkling Golden Light Motes across Sky & Meadow */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {SHINY_MOTES.map((mote, idx) => (
          <span
            key={idx}
            style={{
              left: mote.left,
              top: mote.top,
              width: `${mote.size}px`,
              height: `${mote.size}px`,
              animationDelay: mote.delay,
              opacity: 0.25 + sunriseProgress * 0.75,
              boxShadow: '0 0 12px 3px rgba(255, 243, 214, 0.85)',
            }}
            className="shiny-sparkle absolute rounded-full bg-[#FFFDF7]"
          />
        ))}
      </div>

      {/* 6. Top Floating Bar: Shiny Back Button at the Top (helper seed button fades out as flowers bloom) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-30 px-4 sm:px-8 pt-4 sm:pt-6 flex items-center justify-between gap-4"
      >
        <button
          type="button"
          onClick={() => {
            soundEngine.playTap();
            onBack();
          }}
          className="hover-glow-btn min-h-[44px] px-5 py-2.5 rounded-2xl bg-gradient-to-b from-[#FFFDF7] to-[#FFF3D6] border-2 border-[#2B2230] text-sm font-bold text-[#2B2230] shadow-[3px_4px_0px_#2B2230,0_0_20px_rgba(244,181,46,0.55)] cursor-pointer whitespace-nowrap"
        >
          ← Back
        </button>

        <div
          style={{ opacity: bloomComplete ? 0 : textFadeOpacity }}
          className="flex items-center gap-2.5 transition-opacity duration-500"
        >
          <button
            type="button"
            onClick={handlePlantRandomSeed}
            aria-label={`Plant a seed (${flowers.length} of ${GARDEN_FULL_SUNRISE_COUNT})`}
            className="hover-glow-btn min-h-[40px] px-4 py-1.5 rounded-xl bg-[#F4B52E]/95 backdrop-blur-md border-2 border-[#2B2230] text-xs font-bold text-[#2B2230] shadow-[2px_3px_0px_#2B2230] cursor-pointer whitespace-nowrap tabular-nums"
          >
            + Plant Seed
          </button>
        </div>
      </div>

      {/* 7. Fading Screen Text (Fades out completely as flowers bloom!) */}
      <div
        aria-hidden={textFadeOpacity === 0}
        style={{
          opacity: textFadeOpacity,
          transform: `translateY(${Math.round((1 - textFadeOpacity) * -12)}px)`,
        }}
        className="relative z-20 mt-8 sm:mt-12 px-4 flex flex-col items-center text-center pointer-events-none transition-all duration-500"
      >
        <p className="font-['Cormorant_Garamond',serif] italic text-2xl sm:text-4xl font-semibold text-[#FFFDF7] drop-shadow-[0_2px_10px_rgba(43,34,48,0.65)] max-w-xl">
          Tap anywhere across the meadow hills to plant sunflowers and white lilies and bring up the morning sun.
        </p>
      </div>

      {/* 8. Realistic Panoramic Landscape Horizon, Distant Mountains, Golden Mist & Rolling Meadow Hills */}
      <svg
        viewBox="0 0 1440 420"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 right-0 w-full h-[38vh] min-h-[220px] max-h-[340px] pointer-events-none z-10"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="distantRange" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={sunriseProgress > 0.4 ? '#C59B6D' : '#4E3B5C'} />
            <stop offset="100%" stopColor={sunriseProgress > 0.4 ? '#9BB087' : '#3A4649'} />
          </linearGradient>
          <linearGradient id="midHillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8FAF78" />
            <stop offset="100%" stopColor="#5E7C4D" />
          </linearGradient>
          <linearGradient id="foreHillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7A9E64" />
            <stop offset="100%" stopColor="#435E35" />
          </linearGradient>
          <linearGradient id="goldenRim" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F4B52E" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#FFFDF7" stopOpacity={0.35 + sunriseProgress * 0.55} />
            <stop offset="100%" stopColor="#F4B52E" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Distant Panoramic Valley Peaks */}
        <path
          d="M0 150 Q180 65 390 135 T820 105 T1210 125 T1440 95 L1440 420 L0 420 Z"
          fill="url(#distantRange)"
          opacity="0.72"
        />

        {/* Shimmering Golden Valley Mist Ribbon */}
        <ellipse
          cx="720"
          cy="170"
          rx="680"
          ry="28"
          fill="#FFFDF7"
          opacity={0.18 + sunriseProgress * 0.35}
        />

        {/* Midground Sunlit Meadow Hill (Starts around 69% of viewport height) */}
        <path
          d="M0 175 Q320 115 680 168 T1440 145 L1440 420 L0 420 Z"
          fill="url(#midHillGrad)"
          stroke="url(#goldenRim)"
          strokeWidth="3.5"
        />

        {/* Foreground Lush Botanical Meadow Hill */}
        <path
          d="M0 245 Q420 190 860 238 T1440 212 L1440 420 L0 420 Z"
          fill="url(#foreHillGrad)"
          stroke="url(#goldenRim)"
          strokeWidth="3"
        />
      </svg>

      {/* 9. Planted Multi-Bloom Botanical Flowers (Realistic Landscape Scale & Depth Perspective) */}
      {flowers.map((f) => {
        // Depth perspective: flowers further up the hill (80%) are smaller (0.48x), foreground (93%) are 0.72x
        // This guarantees flowers stay proportioned to the green hills and NEVER touch the sky or sun!
        const depthFactor = (f.soilDepthPercent - 80) / 14;
        const landscapeScale = Number(
          clampRangeInput((0.46 + depthFactor * 0.24) * f.scale, 0.42, 0.74, 0.56).toFixed(2)
        );
        return (
          <div
            key={f.id}
            style={{
              left: `${f.xPercent}%`,
              top: `${f.soilDepthPercent}%`,
              zIndex: Math.round(f.soilDepthPercent),
              transform: `translate(-50%, -88%) rotate(${f.swayDeg}deg) scale(${landscapeScale})`,
            }}
            className="absolute flex flex-col items-center pointer-events-none transition-transform duration-500 origin-bottom"
          >
            <GardenLandscapePlantSvg kind={f.kind} variantIndex={f.id} />
          </div>
        );
      })}
    </section>
  );
}


/* ============================================================================
 * ROOM 4B: THE CANDLELIGHT MANUSCRIPT (#/4/letter)
 * ============================================================================ */
export function LetterManuscriptRoom({ onBack, onMarkVisited }: SubRoomProps) {
  const parsed = useRef(parseLetterBlocks(STORY_CONFIG.letter)).current;
  const totalBlocks = parsed.blocks.length;

  const [revealedCount, setRevealedCount] = useState<number>(1);
  const [typedCharsInCurrent, setTypedCharsInCurrent] = useState<number>(0);
  const [sealBroken, setSealBroken] = useState<boolean>(true);
  const [candlePos, setCandlePos] = useState<{ x: number; y: number }>({ x: 50, y: 30 });
  const heartShimmerPlayedRef = useRef<boolean>(false);

  useEffect(() => {
    onMarkVisited('letter');
  }, [onMarkVisited]);

  const currentBlockIndex = revealedCount - 1;
  const currentBlockText = parsed.blocks[currentBlockIndex] || '';
  const currentBlockChars = Array.from(currentBlockText);
  const isAllComplete =
    revealedCount >= totalBlocks && typedCharsInCurrent >= currentBlockChars.length;

  useEffect(() => {
    if (revealedCount > totalBlocks) return;
    if (typedCharsInCurrent < currentBlockChars.length) {
      const nextChar = currentBlockChars[typedCharsInCurrent];
      const delay = nextChar === '\n' ? 95 : 16;
      const timer = window.setTimeout(() => {
        setTypedCharsInCurrent((c) => c + 1);
        if (typedCharsInCurrent % 5 === 0) {
          soundEngine.playSoftKeyTick();
        }
      }, delay);
      return () => window.clearTimeout(timer);
    } else if (revealedCount < totalBlocks) {
      const nextBlockTimer = window.setTimeout(() => {
        setRevealedCount((c) => c + 1);
        setTypedCharsInCurrent(0);
      }, 260);
      return () => window.clearTimeout(nextBlockTimer);
    }
  }, [revealedCount, typedCharsInCurrent, currentBlockChars, totalBlocks]);

  useEffect(() => {
    if (isAllComplete && !heartShimmerPlayedRef.current) {
      heartShimmerPlayedRef.current = true;
      soundEngine.playHeartShimmer();
    }
  }, [isAllComplete]);

  const handleAdvanceBlockOrFinish = () => {
    soundEngine.playTap();
    if (typedCharsInCurrent < currentBlockChars.length) {
      if (revealedCount < totalBlocks) {
        setRevealedCount((c) => c + 1);
        setTypedCharsInCurrent(0);
      } else {
        setTypedCharsInCurrent(currentBlockChars.length);
      }
    } else if (revealedCount < totalBlocks) {
      setRevealedCount((c) => c + 1);
      setTypedCharsInCurrent(0);
    }
  };

  const handleRevealFullLetter = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playHeartShimmer();
    const lastBlock = parsed.blocks[totalBlocks - 1] || '';
    setRevealedCount(totalBlocks);
    setTypedCharsInCurrent(Array.from(lastBlock).length);
  };

  const renderFormattedText = (text: string) => {
    const tokens = tokenizeInlineIcons(text);
    return tokens.map((tok, i) => {
      if (tok.type === 'sunflower') {
        return <InlineSunflowerIcon key={`sf-${i}`} />;
      }
      if (tok.type === 'white-heart') {
        return <InlineWhiteHeartIcon key={`wh-${i}`} />;
      }
      return <React.Fragment key={`tx-${i}`}>{tok.value}</React.Fragment>;
    });
  };

  const progressPct = Math.min(
    100,
    Math.round(
      ((revealedCount - 1 + (currentBlockChars.length ? typedCharsInCurrent / currentBlockChars.length : 1)) /
        totalBlocks) *
        100
    )
  );

  return (
    <section
      aria-label="A Letter for Rishika"
      className="w-full max-w-3xl mx-auto flex flex-col gap-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            soundEngine.playTap();
            onBack();
          }}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-[#FFFDF7] border-2 border-[#2B2230] text-sm font-semibold text-[#2B2230] shadow-[2px_3px_0px_#2B2230] hover:bg-[#FFF3D6] transition-colors cursor-pointer"
        >
          ← Back to Keepsake Desk
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-[#2B2230]/75 tabular-nums">
            Paragraph {Math.min(revealedCount, totalBlocks)} of {totalBlocks} · {progressPct}%
          </span>
          {!isAllComplete && (
            <button
              type="button"
              onClick={handleRevealFullLetter}
              className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#F4B52E] text-[#2B2230] text-xs font-semibold border-2 border-[#2B2230] shadow-[2px_2px_0px_#2B2230] hover:bg-[#e5a620] cursor-pointer whitespace-nowrap"
            >
              Reveal full letter
            </button>
          )}
        </div>
      </div>

      <article
        id="letter-scroll-box"
        onClick={handleAdvanceBlockOrFinish}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setCandlePos({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
          });
        }}
        style={{
          backgroundImage: `radial-gradient(circle 280px at ${candlePos.x}% ${candlePos.y}%, rgba(244, 181, 46, 0.14), transparent 75%)`,
        }}
        className="relative bg-[#FFFDF7] rounded-3xl border-2 border-[#2B2230] shadow-[6px_8px_0px_#2B2230] p-6 sm:p-10 md:p-12 cursor-pointer transition-shadow"
      >
        <div className="flex items-center justify-between gap-4 pb-6 mb-6 border-b border-[#2B2230]/15">
          <div>
            <p className="text-xs tracking-wider uppercase text-[#7C9070] font-semibold">
              Personal Manuscript · Kept for {STORY_CONFIG.herName}
            </p>
            <h1 className="mt-1 font-['EB_Garamond',serif] italic text-2xl sm:text-3xl text-[#2B2230]">
              {renderFormattedText(parsed.greeting)}
            </h1>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundEngine.playHeartShimmer();
              setSealBroken((b) => !b);
            }}
            aria-label="Wax seal monogram R"
            className="shrink-0 transition-transform hover:scale-105 cursor-pointer"
          >
            <WaxSealSvg broken={sealBroken} />
          </button>
        </div>

        <div className="space-y-5 font-['EB_Garamond',serif] text-[18px] sm:text-[20px] leading-[1.78] text-[#2B2230]">
          {parsed.blocks.slice(0, revealedCount).map((blockText, idx) => {
            const isLastRevealed = idx === revealedCount - 1;
            const visibleSlice = isLastRevealed
              ? Array.from(blockText).slice(0, typedCharsInCurrent).join('')
              : blockText;

            return (
              <p key={idx} className="whitespace-pre-line transition-opacity duration-300">
                {renderFormattedText(visibleSlice)}
                {isLastRevealed && !isAllComplete && (
                  <span
                    aria-hidden="true"
                    className="inline-block w-1.5 h-4 ml-1 align-middle bg-[#D9961A] animate-pulse"
                  />
                )}
              </p>
            );
          })}
        </div>

        <div className="mt-8 pt-5 border-t border-[#2B2230]/15 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs text-[#2B2230]/65 italic font-['EB_Garamond',serif]">
            {isAllComplete
              ? 'End of letter · Every word meant.'
              : 'Tap anywhere on the page to advance to the next paragraph…'}
          </span>

          {isAllComplete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.playTap();
                onBack();
              }}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-[#F4B52E] text-[#2B2230] font-semibold text-sm border-2 border-[#2B2230] shadow-[2px_3px_0px_#2B2230] hover:bg-[#e5a620] cursor-pointer"
            >
              Keep this letter & return →
            </button>
          )}
        </div>
      </article>
    </section>
  );
}

/* ============================================================================
 * ROOM 4C: THE VINYL & EMBEDDED SONG LISTENING ROOM (#/4/song)
 * ============================================================================ */
export function VinylSongRoom({ onBack, onMarkVisited }: SubRoomProps) {
  const DURATION_SEC = 208; // 3:28
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(80);
  const [validationMsg, setValidationMsg] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    onMarkVisited('song');
    // Pause background music while inside the dedicated Song Room so she can play the YouTube video or turntable cleanly
    soundEngine.setSongRoomPlaying(true);

    const onWindowBlur = () => {
      // If she taps directly inside the YouTube iframe, sync turntable spinning state and stop BGM
      soundEngine.setSongRoomPlaying(true);
      setIsPlaying(true);
    };
    window.addEventListener('blur', onWindowBlur);

    return () => {
      window.removeEventListener('blur', onWindowBlur);
      soundEngine.setSongRoomPlaying(false);
    };
  }, [onMarkVisited]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = window.setInterval(() => {
      setCurrentTime((prev) => {
        if (prev + 1 >= DURATION_SEC) {
          setIsPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isPlaying]);

  const sendYouTubeCommand = (func: string, args: unknown[] = []) => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    try {
      win.postMessage(
        JSON.stringify({
          event: 'command',
          func,
          args,
        }),
        '*'
      );
    } catch {
      // Ignore cross-origin frame errors
    }
  };

  const togglePlay = () => {
    soundEngine.playTap();
    setIsPlaying((prev) => {
      const next = !prev;
      soundEngine.setSongRoomPlaying(next);
      if (next) {
        sendYouTubeCommand('playVideo');
        soundEngine.playHeartShimmer();
      } else {
        sendYouTubeCommand('pauseVideo');
      }
      return next;
    });
  };

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const clamped = clampRangeInput(raw, 0, DURATION_SEC, currentTime);
    setCurrentTime(clamped);
    sendYouTubeCommand('seekTo', [clamped, true]);
    soundEngine.playTap();
    setValidationMsg(`Seeked to ${formatSeconds(clamped)}`);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const clamped = clampRangeInput(raw, 0, 100, volume);
    setVolume(clamped);
    sendYouTubeCommand('setVolume', [clamped]);
    setValidationMsg(`Volume set to ${clamped}%`);
  };

  const handleRestartTrack = () => {
    soundEngine.playTap();
    setCurrentTime(0);
    sendYouTubeCommand('seekTo', [0, true]);
    setValidationMsg('Rewound vinyl record to 0:00.');
  };

  return (
    <section
      aria-label="The Vinyl Listening Room"
      className="w-full max-w-4xl mx-auto flex flex-col gap-6"
    >
      {/* Top Navigation Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            soundEngine.playTap();
            onBack();
          }}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-[#FFFDF7] border-2 border-[#2B2230] text-sm font-semibold text-[#2B2230] shadow-[2px_3px_0px_#2B2230] hover:bg-[#FFF3D6] transition-colors cursor-pointer"
        >
          ← Back to Keepsake Desk
        </button>

        <div className="text-xs font-medium text-[#2B2230]/75">
          <span>Specimen III · Embedded Song & Vinyl Pressing</span>
          <span className="mx-2">·</span>
          <span>45 RPM Stereo</span>
        </div>
      </div>

      {/* Turntable + Directly Embedded Song Player Card */}
      <div className="bg-[#FFFDF7] rounded-3xl border-2 border-[#2B2230] shadow-[6px_8px_0px_#2B2230] p-6 sm:p-8 flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Spinning Vinyl Platter + Visible Embedded YouTube Song Stage */}
          <div className="lg:col-span-6 flex flex-col items-center gap-4">
            {/* Directly Embedded Song Video Frame right inside the page */}
            <div className="w-full rounded-2xl overflow-hidden border-2 border-[#2B2230] bg-[#1C1830] shadow-[3px_4px_0px_#2B2230] aspect-video relative">
              <iframe
                ref={iframeRef}
                title="Embedded song player for Rishika"
                src={`https://www.youtube.com/embed/${STORY_CONFIG.videoId}?enablejsapi=1&playsinline=1&rel=0`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Companion Vinyl Turntable Platter + Catjam & Lover Stickers */}
            <div className="w-full flex items-center justify-between gap-4 bg-[#FFF3D6]/80 p-3.5 rounded-2xl border border-[#2B2230]/25">
              <div className="flex items-center gap-3">
                <div
                  onClick={togglePlay}
                  role="button"
                  tabIndex={0}
                  aria-label={isPlaying ? 'Pause vinyl record' : 'Play vinyl record'}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      togglePlay();
                    }
                  }}
                  className={`relative w-16 h-16 rounded-full bg-[#1C1830] border-2 border-[#2B2230] flex items-center justify-center cursor-pointer shrink-0 ${
                    isPlaying ? 'animate-[spin_5s_linear_infinite]' : ''
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-[#F4B52E] border border-[#2B2230] flex items-center justify-center">
                    <SunflowerSvg className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#2B2230]">
                    {isPlaying ? 'Spinning on Platter' : 'Turntable Ready'}
                  </p>
                  <p className="text-[11px] text-[#2B2230]/75 italic font-['EB_Garamond',serif]">
                    Side A · Pressed for {STORY_CONFIG.herName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <CatSticker
                  src={STORY_CONFIG.cats.jam}
                  alt="Cat vibing to music"
                  caption={isPlaying ? 'vibing ♫' : 'play me'}
                  size="sm"
                  tilt={3}
                />
              </div>
            </div>
          </div>

          {/* Right: Track Info & Synchronized Turntable Controls (No exposed URL box) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#7C9070]">
                Dedicated Track · For {STORY_CONFIG.herName}
              </p>
              <h2 className="mt-1 font-['Cormorant_Garamond',serif] text-3xl font-bold text-[#2B2230]">
                This one reminds me of you.
              </h2>
              <p className="mt-1 font-['EB_Garamond',serif] italic text-lg text-[#2B2230]/80">
                Press play on the record or video player and listen with me for a minute.
              </p>
            </div>

            {/* Play / Pause & Rewind Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                id="song-play-btn"
                type="button"
                onClick={togglePlay}
                className="min-h-[48px] px-6 py-3 rounded-2xl bg-[#F4B52E] text-[#2B2230] font-bold text-sm border-2 border-[#2B2230] shadow-[3px_4px_0px_#2B2230] hover:bg-[#e5a620] active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
              >
                {isPlaying ? 'Pause Record' : 'Spin Vinyl Record'}
              </button>

              <button
                type="button"
                onClick={handleRestartTrack}
                className="min-h-[48px] px-4 py-3 rounded-2xl bg-[#FFF3D6] text-[#2B2230] font-semibold text-xs border-2 border-[#2B2230] hover:bg-[#fde8b8] cursor-pointer whitespace-nowrap"
              >
                Rewind to Start
              </button>
            </div>

            {/* Validated Scrubber Input */}
            <div className="flex flex-col gap-1.5 bg-[#FFF3D6]/70 p-3.5 rounded-2xl border border-[#2B2230]/20">
              <div className="flex items-center justify-between text-xs font-semibold text-[#2B2230] tabular-nums">
                <label htmlFor="song-scrubber">Track Timeline</label>
                <span>
                  {formatSeconds(currentTime)} / {formatSeconds(DURATION_SEC)}
                </span>
              </div>
              <input
                id="song-scrubber"
                name="song-scrubber"
                type="range"
                min={0}
                max={DURATION_SEC}
                step={1}
                value={currentTime}
                aria-label="Song playback position in seconds"
                aria-valuemin={0}
                aria-valuemax={DURATION_SEC}
                aria-valuenow={currentTime}
                aria-valuetext={`${formatSeconds(currentTime)} of ${formatSeconds(DURATION_SEC)}`}
                onChange={handleScrubberChange}
                className="w-full h-2.5 accent-[#D9961A] rounded-lg cursor-pointer"
              />
            </div>

            {/* Validated Volume Input */}
            <div className="flex flex-col gap-1.5 bg-[#FFF3D6]/70 p-3.5 rounded-2xl border border-[#2B2230]/20">
              <div className="flex items-center justify-between text-xs font-semibold text-[#2B2230] tabular-nums">
                <label htmlFor="song-volume">Turntable Volume</label>
                <span>{volume}%</span>
              </div>
              <input
                id="song-volume"
                name="song-volume"
                type="range"
                min={0}
                max={100}
                step={1}
                value={volume}
                aria-label="Song volume percentage"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={volume}
                aria-valuetext={`Volume ${volume} percent`}
                onChange={handleVolumeChange}
                className="w-full h-2.5 accent-[#7C9070] rounded-lg cursor-pointer"
              />
            </div>

            <p aria-live="polite" className="text-xs text-[#7C9070] min-h-[16px]">
              {validationMsg || 'Vinyl stereo ready · Tap Spin Vinyl Record or press play on the video.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
