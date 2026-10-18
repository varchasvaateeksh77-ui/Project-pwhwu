import React, { useCallback, useEffect, useState } from 'react';
import {
  BotanicalUniverseArchSvg,
  BouquetVaseSvg,
  ChocolateFoilSvg,
  FloatingPetalsOverlay,
  GardenConservatoryLogoSvg,
  GardenLandscapePlantSvg,
  InlineSunflowerIcon,
  InlineWhiteHeartIcon,
  LilySvg,
  RomanceBookSvg,
  ScallopedCameoLockSvg,
  SealedEnvelopeLogoSvg,
  SunflowerSvg,
  VintageMusicLogoSvg,
} from './components/BotanicalArt';
import { CatSticker } from './components/CatSticker';
import {
  GreenhouseRoom,
  LetterManuscriptRoom,
  VinylSongRoom,
} from './components/InteractiveRooms';
import { STORY_CONFIG } from './config/storyConfig';
import {
  computeDaysSince,
  computeDodgeOffset,
  getChapterNumber,
  normalizeRoute,
  RouteKey,
  validatePasscode,
} from './utils/proposalLogic';
import { soundEngine } from './utils/soundEngine';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('autostart') === '1';
  });

  const [route, setRoute] = useState<RouteKey>(() => {
    if (typeof window === 'undefined') return 'lock';
    const autostart = new URLSearchParams(window.location.search).get('autostart') === '1';
    return autostart ? normalizeRoute(window.location.hash) : 'lock';
  });
  const [isMuted, setIsMuted] = useState<boolean>(() => soundEngine.isMuted());

  // Passcode Lock Screen ('lock') state
  const [passcodeEntry, setPasscodeEntry] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<string>('');
  const [passcodeShake, setPasscodeShake] = useState<boolean>(false);
  const [isUnlockedAnim, setIsUnlockedAnim] = useState<boolean>(false);

  // Chapter 1 state
  const [ch1NoCount, setCh1NoCount] = useState<number>(0);

  // Chapter 2 state
  const [ch2Step, setCh2Step] = useState<number>(0);
  const daysSinceMet = computeDaysSince(STORY_CONFIG.metDateISO);

  // Chapter 3 state
  const [openedNotes, setOpenedNotes] = useState<Record<string, boolean>>({
    sunflowers: true,
  });

  // Chapter 4 visited rooms
  const [visitedRooms, setVisitedRooms] = useState<Record<'garden' | 'letter' | 'song', boolean>>({
    garden: false,
    letter: false,
    song: false,
  });

  // Chapter 6 Bouquet state
  const [bouquetStems, setBouquetStems] = useState<number>(1);

  // Chapter 7 Proposal state ('7a' | '7b' | '7c' | '7d')
  const [ch7Stage, setCh7Stage] = useState<'7a' | '7b' | '7c' | '7d'>('7a');
  const [ch7NoCount, setCh7NoCount] = useState<number>(0);
  const [chosenFlower, setChosenFlower] = useState<'sunflowers' | 'lilies'>('sunflowers');
  const [personalNote, setPersonalNote] = useState<string>('');
  const [noteSaved, setNoteSaved] = useState<boolean>(false);
  const [noteError, setNoteError] = useState<string>('');

  // Storybook 3D Page-Turn Transition state
  const [pageTurnKey, setPageTurnKey] = useState<number>(0);
  const [pageTurnDir, setPageTurnDir] = useState<'forward' | 'backward'>('forward');

  const getRouteOrder = (r: RouteKey): number => {
    const orderMap: Record<RouteKey, number> = {
      lock: 0,
      '1': 1,
      '2': 2,
      '3': 3,
      '4': 4,
      '4/garden': 4.1,
      '4/letter': 4.2,
      '4/song': 4.3,
      '5': 5,
      '6': 6,
      '7': 7,
    };
    return orderMap[r] ?? 1;
  };

  const navigate = useCallback(
    (nextRoute: RouteKey) => {
      const dir = getRouteOrder(nextRoute) >= getRouteOrder(route) ? 'forward' : 'backward';
      soundEngine.playPageTurn(dir);
      setPageTurnDir(dir);
      setPageTurnKey((k) => k + 1);
      if (nextRoute !== 'lock') {
        setIsUnlocked(true);
      }
      if (typeof window !== 'undefined') {
        window.location.hash = `#/${nextRoute}`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setRoute(nextRoute);
    },
    [route]
  );

  // On fresh page load / restart, force hash to #/lock unless ?autostart=1 is present
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const autostart = new URLSearchParams(window.location.search).get('autostart') === '1';
    if (!autostart && window.location.hash !== '#/lock') {
      window.history.replaceState(null, '', '#/lock');
      setRoute('lock');
    }
    const onHashChange = () => {
      const next = normalizeRoute(window.location.hash);
      setIsUnlocked(true);
      setRoute((prev) => {
        if (prev !== next) {
          const dir = getRouteOrder(next) >= getRouteOrder(prev) ? 'forward' : 'backward';
          setPageTurnDir(dir);
          setPageTurnKey((k) => k + 1);
        }
        return next;
      });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const triggerShake = useCallback(() => {
    setPasscodeShake(true);
    window.setTimeout(() => setPasscodeShake(false), 420);
  }, []);

  const attemptUnlockWithCode = useCallback(
    (candidate: string) => {
      const check = validatePasscode(candidate);
      if (!check.isComplete) {
        soundEngine.playCatBoop('sassy');
        setPasscodeError(check.errorMessage);
        triggerShake();
        return;
      }
      if (!check.isValid) {
        soundEngine.playCatBoop('sassy');
        setPasscodeError(check.errorMessage);
        triggerShake();
        window.setTimeout(() => setPasscodeEntry(''), 320);
        return;
      }
      // Valid passcode!
      setPasscodeError('');
      setIsUnlockedAnim(true);
      soundEngine.playHeartShimmer();
      window.setTimeout(() => {
        setIsUnlockedAnim(false);
        setPasscodeEntry('');
        navigate('1');
      }, 460);
    },
    [navigate, triggerShake]
  );

  const handleDigitPress = useCallback(
    (digit: string) => {
      setPasscodeError('');
      setPasscodeEntry((prev) => {
        if (prev.length >= 4) return prev;
        const next = prev + digit;
        soundEngine.playBloomNote(next.length - 1);
        if (next.length === 4) {
          window.setTimeout(() => attemptUnlockWithCode(next), 180);
        }
        return next;
      });
    },
    [attemptUnlockWithCode]
  );

  const handleBackspace = useCallback(() => {
    soundEngine.playTap();
    setPasscodeError('');
    setPasscodeEntry((prev) => prev.slice(0, -1));
  }, []);

  // Physical keyboard listener on Lock Screen
  useEffect(() => {
    if (route !== 'lock') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key)) {
        e.preventDefault();
        handleDigitPress(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        attemptUnlockWithCode(passcodeEntry);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [route, passcodeEntry, handleDigitPress, handleBackspace, attemptUnlockWithCode]);

  const handleMarkVisited = useCallback((room: 'garden' | 'letter' | 'song') => {
    setVisitedRooms((prev) => (prev[room] ? prev : { ...prev, [room]: true }));
  }, []);

  const chapterNum = getChapterNumber(route);

  // Chapter 1 cat reaction progression (unique cute big-eyes cat looking into the eye)
  const getCh1CatState = () => {
    if (ch1NoCount === 0) {
      return {
        src: STORY_CONFIG.cats.tenorMochiPuppyEyes,
        caption: `look into my eyes, ${STORY_CONFIG.herName.toLowerCase()}…`,
        prompt: 'Some people feel like sunlight before they even say a word. I made this little world for you — will you step inside?',
      };
    }
    if (ch1NoCount === 1) {
      return {
        src: STORY_CONFIG.cats.tenorPeachGoma,
        caption: 'please say yes…',
        prompt: 'Wait… how could you say no to those pleading eyes?',
      };
    }
    if (ch1NoCount === 2) {
      return {
        src: STORY_CONFIG.cats.melvin,
        caption: 'really??',
        prompt: 'Every page inside was pressed by hand just for you. Try the golden button instead!',
      };
    }
    if (ch1NoCount === 3) {
      return {
        src: STORY_CONFIG.cats.angry,
        caption: 'wrong button!!',
        prompt: 'Even the kittens are pouting now — you’re not allowed to skip your own keepsake.',
      };
    }
    if (ch1NoCount === 4) {
      return {
        src: STORY_CONFIG.cats.hitting,
        caption: 'last warning!!',
        prompt: 'One more tap on “No” and that button is disappearing into thin air!',
      };
    }
    return {
      src: STORY_CONFIG.cats.tenorShyBlush,
      caption: 'only yes left ♥',
      prompt: 'The “No” button has officially vanished into the wildflowers — only “Yes, show me” remains.',
    };
  };

  const ch1Cat = getCh1CatState();
  const ch1Dodge = computeDodgeOffset(ch1NoCount);
  const ch7Dodge = computeDodgeOffset(ch7NoCount);

  const handleSaveKeepsakeNote = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = personalNote.trim();
    if (trimmed.length < 2) {
      setNoteError('Write at least a tiny word or two before sealing your note.');
      setNoteSaved(false);
      return;
    }
    setNoteError('');
    setNoteSaved(true);
    soundEngine.playHeartShimmer();
  };

  return (
    <div className="min-h-dvh flex flex-col justify-between relative z-10 selection:bg-[#F4B52E]/40">
      {/* Ambient Floating Sunflower & White Lily Petals */}
      <FloatingPetalsOverlay />

      {/* =====================================================================
       * TOP BAR CONTRACT: 3 Clean Zones separated by gap-8
       * Zone 1: Brand Wordmark | Zone 2: Chapter Links | Zone 3: Sound Toggle
       * ===================================================================== */}
      <header className="sticky top-0 z-30 bg-[#FFF3D6]/90 backdrop-blur-md border-b border-[#2B2230]/15 px-4 sm:px-8 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single text wordmark */}
          <a
            href="#/lock"
            onClick={(e) => {
              e.preventDefault();
              navigate('lock');
            }}
            className="font-['Cormorant_Garamond',serif] italic font-bold text-xl sm:text-2xl tracking-tight text-[#2B2230] whitespace-nowrap shrink-0"
          >
            For Rishika
          </a>

          {/* Zone 2: Concise single-line chapter navigation links */}
          <nav
            aria-label="Story Chapters"
            className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#2B2230]/75"
          >
            {[
              { key: 'lock' as RouteKey, num: 0, label: '00. Vault' },
              { key: '1' as RouteKey, num: 1, label: '01. Knock' },
              { key: '2' as RouteKey, num: 2, label: '02. Oct 7' },
              { key: '3' as RouteKey, num: 3, label: '03. Notes' },
              { key: '4' as RouteKey, num: 4, label: '04. Keepsakes' },
              { key: '6' as RouteKey, num: 6, label: '06. Bouquet' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.key)}
                className={`hover:text-[#2B2230] transition-colors whitespace-nowrap shrink-0 cursor-pointer pb-0.5 ${
                  chapterNum === item.num
                    ? 'text-[#2B2230] border-b-2 border-[#D9961A]'
                    : ''
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Single Primary Action (Background Music & Sound Effects Toggle) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsMuted(soundEngine.toggleMute())}
              aria-label={
                isMuted
                  ? 'Turn on background music and sound effects'
                  : 'Mute background music and sound effects'
              }
              className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#FFFDF7] border-2 border-[#2B2230] text-xs font-semibold text-[#2B2230] shadow-[2px_2px_0px_#2B2230] hover:bg-[#F4B52E]/30 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isMuted ? 'Music & SFX: Off' : 'Music & SFX: On ♫'}
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
       * MAIN INTERACTIVE STORYBOOK CANVAS (Responsive 390px -> 1440px)
       * ===================================================================== */}
      <main className="page-turn-perspective flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10 flex flex-col justify-center overflow-x-clip">
        {pageTurnKey > 0 && (
          <div
            key={`curl-${pageTurnKey}`}
            aria-hidden="true"
            className={`pointer-events-none fixed inset-0 z-50 ${
              pageTurnDir === 'forward'
                ? 'page-curl-overlay-forward'
                : 'page-curl-overlay-backward'
            }`}
          />
        )}
        <div
          key={`page-${route}-${ch7Stage}`}
          className={`w-full ${
            pageTurnKey > 0 && route !== '4/garden'
              ? pageTurnDir === 'forward'
                ? 'page-turn-forward'
                : 'page-turn-backward'
              : ''
          }`}
        >
        {/* -------------------------------------------------------------------
         * CHAPTER 0: THE HERBARIUM PASSCODE VAULT (#/lock) — Hint-Free & Tenor Cat
         * ------------------------------------------------------------------- */}
        {route === 'lock' && (
          <section
            aria-label="Passcode Lock Screen"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left Column: Scalloped Botanical Cameo Lock & Integrated Tenor Cat Vignette */}
            <div className="hover-glow-card lg:col-span-6 bg-[#FFFDF7] rounded-3xl border-2 border-[#2B2230] shadow-[6px_8px_0px_#2B2230] p-6 sm:p-10 flex flex-col items-center text-center gap-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#7C9070]">
                Private Herbarium Locket · Kept for {STORY_CONFIG.herName}
              </div>

              <div className="relative flex items-center justify-center">
                <ScallopedCameoLockSvg
                  unlocked={isUnlockedAnim}
                  filledCount={passcodeEntry.length}
                />
                <div className="absolute -bottom-2 -right-3">
                  <CatSticker
                    src={passcodeError ? STORY_CONFIG.cats.sideEye : STORY_CONFIG.cats.tenorPeachPlease}
                    alt="Locket companion cat"
                    caption={passcodeError ? 'try again…' : 'kept for you'}
                    size="sm"
                    variant={passcodeError ? 'sassy' : 'happy'}
                  />
                </div>
              </div>

              <h1 className="mt-2 font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-bold text-[#2B2230] text-balance">
                {isUnlockedAnim
                  ? 'Locket Opened — Welcome in.'
                  : 'Some pages are meant for only one pair of eyes.'}
              </h1>

              <p className="font-['EB_Garamond',serif] italic text-lg sm:text-xl text-[#2B2230]/80 max-w-md">
                Enter the four quiet numbers you already know by heart to open this keepsake.
              </p>
            </div>

            {/* Right Column: Tactile Brass & Botanical Keypad */}
            <div
              style={{
                transform: passcodeShake ? 'translateX(-8px)' : 'translateX(0)',
                transition: 'transform 120ms ease-in-out',
              }}
              className="lg:col-span-6 bg-[#FFFDF7] rounded-3xl border-2 border-[#2B2230] shadow-[6px_8px_0px_#2B2230] p-6 sm:p-10 flex flex-col items-center gap-6"
            >
              <div className="w-full flex items-center justify-between text-xs font-semibold text-[#7C9070]">
                <span>Enter 4-Digit Passcode</span>
                <span className="tabular-nums">{passcodeEntry.length} / 4 Digits</span>
              </div>

              {/* 4 Botanical Wax-Seal Indicator Slots */}
              <div
                role="status"
                aria-label={`Passcode ${passcodeEntry.length} of 4 digits entered`}
                className="flex items-center justify-center gap-3 sm:gap-4 my-1"
              >
                {[0, 1, 2, 3].map((slotIdx) => {
                  const char = passcodeEntry[slotIdx];
                  const isFilled = Boolean(char);
                  return (
                    <div
                      key={slotIdx}
                      className={`w-14 h-16 sm:w-16 sm:h-18 rounded-2xl border-2 border-[#2B2230] flex flex-col items-center justify-center transition-all ${
                        isFilled
                          ? 'bg-[#F4B52E] shadow-[3px_4px_0px_#2B2230] -translate-y-0.5'
                          : 'bg-[#FFF3D6]/70 shadow-inner'
                      }`}
                    >
                      {isFilled ? (
                        <>
                          <span className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-[#2B2230] tabular-nums leading-none">
                            {char}
                          </span>
                          <span
                            aria-hidden="true"
                            className="w-1.5 h-1.5 rounded-full bg-[#2B2230] mt-1.5"
                          />
                        </>
                      ) : (
                        <span className="text-lg text-[#2B2230]/30">•</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Validation / Error Feedback (Zero Hint Spoilers) */}
              <div aria-live="polite" className="min-h-[20px] text-center">
                {passcodeError ? (
                  <p role="alert" className="text-xs font-semibold text-[#B94A3E]">
                    {passcodeError}
                  </p>
                ) : (
                  <p className="text-xs text-[#7C9070]">
                    Tap the brass keys below or type the 4 digits on your keyboard.
                  </p>
                )}
              </div>

              {/* 3x4 Tactile Botanical Keypad */}
              <div
                role="group"
                aria-label="Passcode numeric keypad"
                className="w-full max-w-xs grid grid-cols-3 gap-3"
              >
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleDigitPress(digit)}
                    aria-label={`Digit ${digit}`}
                    className="hover-glow-btn min-h-[52px] rounded-2xl bg-[#FFF3D6] hover:bg-[#F4B52E]/50 active:translate-y-0.5 border-2 border-[#2B2230] shadow-[2px_3px_0px_#2B2230] font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#2B2230] tabular-nums transition-all cursor-pointer"
                  >
                    {digit}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={handleBackspace}
                  aria-label="Delete last digit"
                  className="hover-glow-btn min-h-[52px] rounded-2xl bg-[#FFFDF7] hover:bg-[#F2D5D4]/60 active:translate-y-0.5 border-2 border-[#2B2230] shadow-[2px_3px_0px_#2B2230] text-xs font-bold text-[#2B2230] transition-all cursor-pointer whitespace-nowrap"
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={() => handleDigitPress('0')}
                  aria-label="Digit 0"
                  className="hover-glow-btn min-h-[52px] rounded-2xl bg-[#FFF3D6] hover:bg-[#F4B52E]/50 active:translate-y-0.5 border-2 border-[#2B2230] shadow-[2px_3px_0px_#2B2230] font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#2B2230] tabular-nums transition-all cursor-pointer"
                >
                  0
                </button>

                <button
                  id="passcode-unlock-btn"
                  type="button"
                  onClick={() => attemptUnlockWithCode(passcodeEntry)}
                  aria-label="Unlock keepsake vault"
                  className="hover-glow-btn min-h-[52px] rounded-2xl bg-[#F4B52E] hover:bg-[#e5a620] active:translate-y-0.5 border-2 border-[#2B2230] shadow-[2px_3px_0px_#2B2230] text-xs font-bold text-[#2B2230] transition-all cursor-pointer whitespace-nowrap"
                >
                  Unlock →
                </button>
              </div>
            </div>
          </section>
        )}

        {/* -------------------------------------------------------------------
         * CHAPTER 1: THE SECRET KNOCK (#/1) — Unified Botanical Folio with Merged Cat
         * ------------------------------------------------------------------- */}
        {route === '1' && (
          <section
            aria-label="Chapter 1: A Keepsake for Rishika"
            className="hover-glow-card max-w-4xl mx-auto w-full bg-[#FFFDF7] rounded-3xl border-2 border-[#2B2230] shadow-[6px_8px_0px_#2B2230] p-6 sm:p-10 md:p-12 relative overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[#7C9070] mb-6">
              <span>Herbarium Edition No. 01 · Pressed in October</span>
              <span>For {STORY_CONFIG.herName}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7">
                <h1 className="font-['Cormorant_Garamond',serif] text-4xl sm:text-5xl font-bold tracking-tight text-[#2B2230] leading-[1.08] text-balance">
                  {ch1Cat.prompt}
                </h1>

                <p className="mt-4 font-['EB_Garamond',serif] italic text-xl text-[#2B2230]/80 max-w-xl">
                  A pressed-flower keepsake of golden sunflowers, quiet white lilies, late-night
                  conversations, and a letter sealed just for you.
                </p>

                {/* Primary & Disappearing Dodging Buttons with Warm Hover Glow */}
                <div className="mt-8 flex flex-wrap items-center gap-4 relative min-h-[64px]">
                  <button
                    id="ch1-yes-btn"
                    type="button"
                    onClick={() => navigate('2')}
                    style={{
                      transform: `scale(${1 + Math.min(ch1NoCount * 0.05, 0.22)})`,
                    }}
                    className="hover-glow-btn min-h-[48px] px-7 py-3.5 rounded-2xl bg-[#F4B52E] text-[#2B2230] font-bold text-base border-2 border-[#2B2230] shadow-[3px_4px_0px_#2B2230] hover:bg-[#e5a620] active:translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Yes, show me →
                  </button>

                  {!ch1Dodge.hidden && (
                    <button
                      id="ch1-no-btn"
                      type="button"
                      onClick={() => {
                        soundEngine.playCatBoop('sassy');
                        setCh1NoCount((c) => c + 1);
                      }}
                      style={{
                        transform: `translate(${ch1Dodge.x}px, ${ch1Dodge.y}px) scale(${ch1Dodge.scale})`,
                        opacity: Math.max(0.35, ch1Dodge.scale),
                      }}
                      className="min-h-[48px] px-6 py-3 rounded-2xl bg-[#FFF3D6] text-[#2B2230] font-semibold text-sm border-2 border-[#2B2230] shadow-[2px_3px_0px_#2B2230] hover:bg-[#f7e4b4] transition-all duration-200 cursor-pointer whitespace-nowrap"
                    >
                      No
                    </button>
                  )}
                </div>

                {ch1NoCount > 0 && (
                  <p
                    aria-live="polite"
                    className="mt-3 text-xs font-semibold text-[#B94A3E] italic"
                  >
                    {ch1Dodge.hidden
                      ? 'The “No” button has vanished into the wildflowers — only “Yes, show me” remains.'
                      : `Attempt #${ch1NoCount} to say no gently vetoed.`}
                  </p>
                )}
              </div>

              {/* Lush Botanical Clusters & Cute Pleading-Eyes Cat Vignette */}
              <div className="md:col-span-5 flex flex-col items-center justify-center relative py-2">
                <div className="relative flex items-end justify-center">
                  <div className="-mr-5 mb-1 -rotate-12 opacity-95">
                    <GardenLandscapePlantSvg kind="sunflower" variantIndex={0} />
                  </div>
                  <CatSticker
                    src={ch1Cat.src}
                    alt="Cute pleading-eyes cat looking into your eyes"
                    caption={ch1Cat.caption}
                    size="lg"
                    tilt={ch1NoCount % 2 === 0 ? -2 : 3}
                    variant={ch1NoCount > 0 ? 'sassy' : 'happy'}
                    className="relative z-10"
                  />
                  <div className="-ml-5 mb-1 rotate-12 opacity-95">
                    <GardenLandscapePlantSvg kind="lily" variantIndex={2} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* -------------------------------------------------------------------
         * CHAPTER 2: THE CONSTELLATION OF 7 OCTOBER (#/2)
         * ------------------------------------------------------------------- */}
        {route === '2' && (
          <section
            aria-label="Chapter 2: How We Met on 7 October"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
          >
            <div
              id="ch2-tap-area"
              role="button"
              tabIndex={0}
              aria-label="Tap to reveal each memory from 7 October"
              onClick={() => {
                if (ch2Step < 3) {
                  soundEngine.playBloomNote(ch2Step);
                  setCh2Step((s) => s + 1);
                }
              }}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && ch2Step < 3) {
                  e.preventDefault();
                  soundEngine.playBloomNote(ch2Step);
                  setCh2Step((s) => s + 1);
                }
              }}
              className="lg:col-span-7 bg-[#FFFDF7] rounded-3xl border-2 border-[#2B2230] shadow-[6px_8px_0px_#2B2230] p-6 sm:p-10 flex flex-col justify-between cursor-pointer select-none"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#7C9070] mb-6">
                  <span>Chapter II · Origin Coordinate</span>
                  <span className="tabular-nums">Step {Math.min(ch2Step + 1, 3)} of 3</span>
                </div>

                <div className="space-y-6">
                  <div className="flex items-baseline gap-3">
                    <span className="text-xs font-mono font-bold text-[#D9961A]">01.</span>
                    <h1 className="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-bold text-[#2B2230]">
                      It began on the seventh of October.
                    </h1>
                  </div>

                  {ch2Step >= 1 && (
                    <div className="flex items-baseline gap-3 animate-[fadeIn_350ms_ease-out]">
                      <span className="text-xs font-mono font-bold text-[#D9961A]">02.</span>
                      <p className="font-['Cormorant_Garamond',serif] italic text-2xl sm:text-4xl text-[#2B2230]">
                        Two strangers crossing paths beneath a random comment section, neither of us knowing how much that single moment would quietly change.
                      </p>
                    </div>
                  )}

                  {ch2Step >= 2 && (
                    <div className="flex items-baseline gap-3 animate-[fadeIn_350ms_ease-out]">
                      <span className="text-xs font-mono font-bold text-[#D9961A]">03.</span>
                      <p className="font-['Cormorant_Garamond',serif] text-2xl sm:text-4xl font-semibold text-[#2B2230]">
                        And ever since that day, every quiet thought of mine has found its way back to you.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-[#2B2230]/15 flex flex-wrap items-center justify-between gap-4">
                {ch2Step < 2 ? (
                  <span className="text-sm font-semibold text-[#8A5A12] flex items-center gap-2">
                    <span>Tap anywhere on this page to unfold the next memory →</span>
                  </span>
                ) : (
                  <div className="flex flex-wrap items-center justify-between w-full gap-4">
                    <span className="font-['Caveat',cursive] text-xl text-[#2B2230]/85">
                      {STORY_CONFIG.teases.ch2}
                    </span>
                    <button
                      id="ch2-next-btn"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('3');
                      }}
                      className="hover-glow-btn min-h-[48px] px-6 py-3 rounded-2xl bg-[#F4B52E] text-[#2B2230] font-bold text-sm border-2 border-[#2B2230] shadow-[3px_4px_0px_#2B2230] hover:bg-[#e5a620] cursor-pointer whitespace-nowrap"
                    >
                      Turn the page →
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="hover-glow-card lg:col-span-5 bg-[#FFFDF7] rounded-3xl border-2 border-[#2B2230] shadow-[4px_6px_0px_#2B2230] p-6 sm:p-8 flex flex-col items-center justify-between text-center gap-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#7C9070]">
                Almanac Counter · Local Time
              </div>

              <div className="my-2">
                <div className="font-['Cormorant_Garamond',serif] text-6xl sm:text-7xl font-bold text-[#2B2230] tabular-nums">
                  {daysSinceMet}
                </div>
                <p className="mt-1 font-['EB_Garamond',serif] italic text-xl text-[#2B2230]">
                  {daysSinceMet} days since our paths first crossed
                </p>
                <p className="mt-1 text-xs text-[#2B2230]/65">
                  Every single one of them gentler because neither of us scrolled past.
                </p>
              </div>

              <CatSticker
                src={STORY_CONFIG.cats.tenorPeachFlowers}
                alt="Cat holding peach flowers"
                caption="best coincidence ever"
                size="md"
              />
            </div>
          </section>
        )}

        {/* -------------------------------------------------------------------
         * CHAPTER 3: THE HERBARIUM SPECIMEN DRAWER (#/3)
         * ------------------------------------------------------------------- */}
        {route === '3' && (
          <section
            aria-label="Chapter 3: Things I Remember About Rishika"
            className="flex flex-col gap-6"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#7C9070]">
                  Chapter III · Pressed Specimen Drawer
                </p>
                <h1 className="mt-1 font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-bold text-[#2B2230]">
                  Little things I keep noticing about you.
                </h1>
              </div>

              <p className="text-xs font-medium text-[#2B2230]/75">
                Tap each pressed specimen card to unfold its secret note (
                {Object.values(openedNotes).filter(Boolean).length} / 4 unfolded)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {STORY_CONFIG.notes.map((note, idx) => {
                const isOpen = !!openedNotes[note.id];
                return (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playBloomNote(idx);
                      setOpenedNotes((prev) => ({ ...prev, [note.id]: !prev[note.id] }));
                    }}
                    aria-expanded={isOpen}
                    className={`hover-glow-card text-left rounded-3xl border-2 border-[#2B2230] p-6 transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                      isOpen
                        ? 'bg-[#FFFDF7] shadow-[5px_7px_0px_#2B2230]'
                        : 'bg-[#FFFDF7]/80 shadow-[3px_4px_0px_#2B2230] hover:bg-[#FFFDF7]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 w-full">
                      <div>
                        <span className="text-xs font-semibold text-[#7C9070]">
                          Specimen 0{idx + 1} · {note.interactiveHint}
                        </span>
                        <h2 className="mt-1 font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-[#2B2230]">
                          {note.line}
                        </h2>
                        <p className="mt-1 font-['EB_Garamond',serif] italic text-lg text-[#2B2230]/85">
                          {note.subnote}
                        </p>
                      </div>

                      <div className="shrink-0">
                        {note.id === 'sunflowers' && <GardenLandscapePlantSvg kind="sunflower" variantIndex={0} />}
                        {note.id === 'lilies' && <GardenLandscapePlantSvg kind="lily" variantIndex={2} />}
                        {note.id === 'chocolate' && <ChocolateFoilSvg className="w-16 h-16" />}
                        {note.id === 'dark-romance' && <RomanceBookSvg className="w-16 h-16" />}
                      </div>
                    </div>

                    {isOpen && (
                      <div className="pt-4 border-t border-[#2B2230]/15 flex items-center justify-between gap-3 w-full">
                        <p className="font-['Caveat',cursive] text-xl text-[#8A5A12]">
                          {note.secretReveal}
                        </p>
                        <span className="text-xs font-semibold text-[#7C9070] shrink-0">
                          Unfolded
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="bg-[#FFFDF7] rounded-2xl border-2 border-[#2B2230] shadow-[3px_4px_0px_#2B2230] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <CatSticker
                  src={STORY_CONFIG.cats.eating}
                  alt="Cat snacking on milk chocolate"
                  caption="milk chocolate break"
                  size="sm"
                  tilt={-3}
                />
                <CatSticker
                  src={STORY_CONFIG.cats.tenorKittenBlush}
                  alt="Cute blushing kitten"
                  caption="taking careful notes"
                  size="sm"
                  tilt={2}
                />
                <span className="font-['Caveat',cursive] text-2xl text-[#2B2230]">
                  {STORY_CONFIG.teases.ch3}
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate('4')}
                className="hover-glow-btn min-h-[48px] px-6 py-3 rounded-2xl bg-[#F4B52E] text-[#2B2230] font-bold text-sm border-2 border-[#2B2230] shadow-[3px_4px_0px_#2B2230] hover:bg-[#e5a620] cursor-pointer whitespace-nowrap"
              >
                Enter the Keepsake Desk →
              </button>
            </div>
          </section>
        )}

        {/* -------------------------------------------------------------------
         * CHAPTER 4 HUB: THE KEEPSAKE DESK (#/4)
         * ------------------------------------------------------------------- */}
        {route === '4' && (
          <section
            aria-label="Chapter 4: Three Keepsakes for Rishika"
            className="flex flex-col gap-6"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#7C9070]">
                  Chapter IV · The Botanical Desk
                </p>
                <h1 className="mt-1 font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-bold text-[#2B2230]">
                  Three little rooms I built for you.
                </h1>
              </div>

              <p className="text-xs font-medium text-[#2B2230]/75">
                Explore in any order ·{' '}
                {Object.values(visitedRooms).filter(Boolean).length} of 3 visited
              </p>
            </div>

            {/* 3 Interactive Artifact Cards with Upgraded Heirloom Logos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Artifact 1: The Living Greenhouse Cloche Logo */}
              <button
                type="button"
                onClick={() => navigate('4/garden')}
                className="group text-left bg-[#FFFDF7] rounded-3xl border-2 border-[#2B2230] shadow-[5px_7px_0px_#2B2230] hover:shadow-[7px_9px_0px_#2B2230] hover:-translate-y-0.5 transition-all p-6 flex flex-col justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold text-[#7C9070]">
                    Room I · Botanical Conservatory
                  </span>
                  {visitedRooms.garden && (
                    <span className="text-xs font-bold text-[#8A5A12]">Visited</span>
                  )}
                </div>

                <div className="py-2 flex items-center justify-center">
                  <GardenConservatoryLogoSvg className="w-44 h-36 group-hover:scale-105 transition-transform" />
                </div>

                <div>
                  <h2 className="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#2B2230]">
                    A Little Garden
                  </h2>
                  <p className="mt-1 text-sm text-[#2B2230]/75">
                    Step inside the glass conservatory to plant sunflowers and white lilies under
                    the golden hour sky.
                  </p>
                </div>
              </button>

              {/* Artifact 2: The Sealed Manuscript Envelope Logo */}
              <button
                type="button"
                onClick={() => navigate('4/letter')}
                className="group text-left bg-[#FFFDF7] rounded-3xl border-2 border-[#2B2230] shadow-[5px_7px_0px_#2B2230] hover:shadow-[7px_9px_0px_#2B2230] hover:-translate-y-0.5 transition-all p-6 flex flex-col justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold text-[#7C9070]">
                    Room II · Sealed Manuscript
                  </span>
                  {visitedRooms.letter && (
                    <span className="text-xs font-bold text-[#8A5A12]">Visited</span>
                  )}
                </div>

                <div className="py-2 flex items-center justify-center">
                  <SealedEnvelopeLogoSvg className="w-44 h-36 group-hover:scale-105 transition-transform" />
                </div>

                <div>
                  <h2 className="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#2B2230]">
                    A Letter for You
                  </h2>
                  <p className="mt-1 text-sm text-[#2B2230]/75">
                    Every honest thought I wanted to write down for you, sealed with a pulsing white
                    heart.
                  </p>
                </div>
              </button>

              {/* Artifact 3: The Vintage Vinyl & Embedded Song Logo */}
              <button
                type="button"
                onClick={() => navigate('4/song')}
                className="group text-left bg-[#FFFDF7] rounded-3xl border-2 border-[#2B2230] shadow-[5px_7px_0px_#2B2230] hover:shadow-[7px_9px_0px_#2B2230] hover:-translate-y-0.5 transition-all p-6 flex flex-col justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold text-[#7C9070]">
                    Room III · Embedded Song
                  </span>
                  {visitedRooms.song && (
                    <span className="text-xs font-bold text-[#8A5A12]">Visited</span>
                  )}
                </div>

                <div className="py-2 flex items-center justify-center">
                  <VintageMusicLogoSvg className="w-44 h-36 group-hover:scale-105 transition-transform" />
                </div>

                <div>
                  <h2 className="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#2B2230]">
                    A Song for You
                  </h2>
                  <p className="mt-1 text-sm text-[#2B2230]/75">
                    Watch and listen to the embedded song right on the page while our cat vibes
                    along.
                  </p>
                </div>
              </button>
            </div>

            {/* Continue to Chapter 5 Row */}
            <div className="bg-[#FFFDF7] rounded-2xl border-2 border-[#2B2230] shadow-[3px_4px_0px_#2B2230] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <CatSticker
                  src={STORY_CONFIG.cats.tenorPeachFlowers}
                  alt="Cat bringing a flower"
                  caption="made with love"
                  size="sm"
                  tilt={-2}
                />
                <span className="font-['Caveat',cursive] text-2xl text-[#2B2230]">
                  {STORY_CONFIG.teases.ch4}
                </span>
              </div>

              <button
                type="button"
                onClick={() => navigate('5')}
                className="hover-glow-btn min-h-[48px] px-6 py-3 rounded-2xl bg-[#F4B52E] text-[#2B2230] font-bold text-sm border-2 border-[#2B2230] shadow-[3px_4px_0px_#2B2230] hover:bg-[#e5a620] cursor-pointer whitespace-nowrap"
              >
                Continue to Chapter 5 →
              </button>
            </div>
          </section>
        )}

        {/* -------------------------------------------------------------------
         * CHAPTER 4 SUB-ROOMS (#/4/garden, #/4/letter, #/4/song)
         * ------------------------------------------------------------------- */}
        {route === '4/garden' && (
          <GreenhouseRoom onBack={() => navigate('4')} onMarkVisited={handleMarkVisited} />
        )}
        {route === '4/letter' && (
          <LetterManuscriptRoom onBack={() => navigate('4')} onMarkVisited={handleMarkVisited} />
        )}
        {route === '4/song' && (
          <VinylSongRoom onBack={() => navigate('4')} onMarkVisited={handleMarkVisited} />
        )}

        {/* -------------------------------------------------------------------
         * CHAPTER 5: THE BREATH BEFORE THE QUESTION (#/5) — Cute Pleading Eyes Cat
         * ------------------------------------------------------------------- */}
        {route === '5' && (
          <section
            aria-label="Chapter 5: One More Thing"
            className="hover-glow-card max-w-2xl mx-auto w-full bg-[#FFFDF7] rounded-3xl border-2 border-[#2B2230] shadow-[6px_8px_0px_#2B2230] p-6 sm:p-10 text-center flex flex-col items-center gap-6"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-[#7C9070]">
              Chapter V · A Quiet Pause
            </p>

            <CatSticker
              src={STORY_CONFIG.cats.tenorSadCuteEyes}
              alt="Cute pleading-eyes cat looking into your eyes"
              caption="just one more page…"
              size="lg"
            />

            <h1 className="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-bold text-[#2B2230] text-balance">
              Before this little keepsake closes, there is one more truth I haven’t asked out loud yet.
            </h1>

            <p className="font-['EB_Garamond',serif] italic text-xl text-[#2B2230]/80 max-w-lg">
              The kind of question you only ask when someone has quietly become your favourite part of every day.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
              <button
                type="button"
                onClick={() => navigate('6')}
                className="hover-glow-btn min-h-[50px] px-8 py-3.5 rounded-2xl bg-[#F4B52E] text-[#2B2230] font-bold text-base border-2 border-[#2B2230] shadow-[3px_4px_0px_#2B2230] hover:bg-[#e5a620] cursor-pointer whitespace-nowrap"
              >
                Show me what it is →
              </button>
            </div>
          </section>
        )}

        {/* -------------------------------------------------------------------
         * CHAPTER 6: THE HAND-TIED BOUQUET (#/6)
         * ------------------------------------------------------------------- */}
        {route === '6' && (
          <section
            aria-label="Chapter 6: Building a Bouquet for Rishika"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            <div
              id="bouquet-tap-zone"
              role="button"
              tabIndex={0}
              aria-label="Tap to add another sunflower or lily stem to Rishika's bouquet"
              onClick={() => {
                if (bouquetStems < 8) {
                  const next = bouquetStems + 1;
                  setBouquetStems(next);
                  if (next === 8) {
                    soundEngine.playHeartShimmer();
                  } else {
                    soundEngine.playBloomNote(next);
                  }
                }
              }}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && bouquetStems < 8) {
                  e.preventDefault();
                  const next = bouquetStems + 1;
                  setBouquetStems(next);
                  soundEngine.playBloomNote(next);
                }
              }}
              className="lg:col-span-6 bg-[#FFFDF7] rounded-3xl border-2 border-[#2B2230] shadow-[6px_8px_0px_#2B2230] p-6 sm:p-8 flex flex-col items-center justify-between cursor-pointer select-none"
            >
              <div className="w-full flex items-center justify-between text-xs font-semibold text-[#7C9070]">
                <span>Chapter VI · Hand-Tied Bouquet</span>
                <span className="tabular-nums">{bouquetStems} / 8 Stems</span>
              </div>

              <div className="my-2 w-full">
                <BouquetVaseSvg stemCount={bouquetStems} />
              </div>

              <span className="text-xs font-semibold text-[#8A5A12] bg-[#FFF3D6] px-4 py-1.5 rounded-xl border border-[#2B2230]/25">
                {bouquetStems < 8
                  ? 'Tap the vase to add the next flower stem (+1)'
                  : 'Tied with a linen ribbon · Complete ♥'}
              </span>
            </div>

            <div className="lg:col-span-6 bg-[#FFFDF7] rounded-3xl border-2 border-[#2B2230] shadow-[5px_7px_0px_#2B2230] p-6 sm:p-10 flex flex-col justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#7C9070]">
                  Stem No. 0{bouquetStems} Dedication
                </p>
                <h1 className="mt-2 font-['Cormorant_Garamond',serif] italic text-3xl sm:text-4xl font-bold text-[#2B2230] min-h-[72px]">
                  “{STORY_CONFIG.bouquet[bouquetStems - 1]}”
                </h1>

                {bouquetStems >= 8 && (
                  <p className="mt-3 font-['EB_Garamond',serif] font-semibold text-xl text-[#8A5A12]">
                    All for you, {STORY_CONFIG.herName}.
                  </p>
                )}

                <ul className="mt-6 space-y-2 border-t border-[#2B2230]/15 pt-4 text-sm text-[#2B2230]/80">
                  {STORY_CONFIG.bouquet.slice(0, bouquetStems).map((line, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#D9961A]">0{i + 1}.</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[#2B2230]/15 flex flex-wrap items-center justify-between gap-4">
                {bouquetStems < 8 ? (
                  <button
                    type="button"
                    onClick={() => {
                      const next = Math.min(8, bouquetStems + 1);
                      setBouquetStems(next);
                      if (next === 8) soundEngine.playHeartShimmer();
                      else soundEngine.playBloomNote(next);
                    }}
                    className="min-h-[48px] px-6 py-3 rounded-2xl bg-[#F4B52E] text-[#2B2230] font-bold text-sm border-2 border-[#2B2230] shadow-[3px_4px_0px_#2B2230] hover:bg-[#e5a620] cursor-pointer whitespace-nowrap"
                  >
                    + Add Next Stem ({bouquetStems}/8)
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center justify-between w-full gap-4">
                    <span className="font-['Caveat',cursive] text-2xl text-[#2B2230]">
                      {STORY_CONFIG.teases.ch6}
                    </span>
                    <button
                      id="ch6-next-btn"
                      type="button"
                      onClick={() => {
                        setCh7Stage('7a');
                        navigate('7');
                      }}
                      className="min-h-[48px] px-7 py-3 rounded-2xl bg-[#F4B52E] text-[#2B2230] font-bold text-sm border-2 border-[#2B2230] shadow-[3px_4px_0px_#2B2230] hover:bg-[#e5a620] cursor-pointer whitespace-nowrap"
                    >
                      Continue to the Final Page →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* -------------------------------------------------------------------
         * CHAPTER 7: THE 80-YEAR QUESTION & KEEPSAKE FINALE (#/7)
         * ------------------------------------------------------------------- */}
        {route === '7' && (
          <section
            aria-label="Chapter 7: The Proposal Question for Rishika"
            className="hover-glow-card max-w-3xl mx-auto w-full bg-[#FFFDF7] rounded-3xl border-2 border-[#2B2230] shadow-[6px_8px_0px_#2B2230] p-6 sm:p-10 text-center flex flex-col items-center gap-6"
          >
            {ch7Stage === '7a' && (
              <div className="flex flex-col items-center gap-6 py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#7C9070]">
                  Chapter VII · The Question
                </p>
                <CatSticker
                  src={STORY_CONFIG.cats.tenorBeMine}
                  alt="Cute cat asking a question"
                  caption="for you, rishika…"
                  size="lg"
                />
                <h1 className="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-bold text-[#2B2230]">
                  Okay… deep breath.
                </h1>
                <p className="font-['EB_Garamond',serif] italic text-xl text-[#2B2230]/80 max-w-md">
                  Some questions deserve to be asked with your whole heart on the table.
                </p>
                <button
                  id="ch7a-ready-btn"
                  type="button"
                  onClick={() => {
                    soundEngine.playPageTurn('forward');
                    soundEngine.playBloomNote(2);
                    setPageTurnDir('forward');
                    setPageTurnKey((k) => k + 1);
                    setCh7Stage('7b');
                  }}
                  className="hover-glow-btn min-h-[48px] px-7 py-3.5 rounded-2xl bg-[#F4B52E] text-[#2B2230] font-bold text-sm border-2 border-[#2B2230] shadow-[3px_4px_0px_#2B2230] hover:bg-[#e5a620] cursor-pointer whitespace-nowrap"
                >
                  I’m listening →
                </button>
              </div>
            )}

            {ch7Stage === '7b' && (
              <div className="flex flex-col items-center gap-6 py-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#7C9070]">
                  Chapter VII · Almost There
                </p>

                {/* Rich Celestial Sunflower & White Lily Archway + Unique Tenor Cat Vignette */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <BotanicalUniverseArchSvg className="w-72 h-44 sm:w-80 sm:h-48" />
                  <CatSticker
                    src={STORY_CONFIG.cats.tenorMochiLove}
                    alt="Affectionate cat surrounded by hearts"
                    caption="in every universe ♥"
                    size="md"
                  />
                </div>

                <h1 className="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-bold text-[#2B2230] text-balance">
                  Out of every random comment section in every parallel universe…
                </h1>
                <p className="font-['EB_Garamond',serif] italic text-xl text-[#2B2230]/80 max-w-md">
                  I am endlessly grateful that my universe led me to yours.
                </p>
                <button
                  id="ch7b-ready-btn"
                  type="button"
                  onClick={() => {
                    soundEngine.playPageTurn('forward');
                    soundEngine.playHeartShimmer();
                    setPageTurnDir('forward');
                    setPageTurnKey((k) => k + 1);
                    setCh7Stage('7c');
                  }}
                  className="hover-glow-btn min-h-[48px] px-7 py-3.5 rounded-2xl bg-[#F4B52E] text-[#2B2230] font-bold text-sm border-2 border-[#2B2230] shadow-[3px_4px_0px_#2B2230] hover:bg-[#e5a620] cursor-pointer whitespace-nowrap"
                >
                  Ask me →
                </button>
              </div>
            )}

            {ch7Stage === '7c' && (
              <div className="flex flex-col items-center gap-6 py-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#7C9070]">
                  Chapter VII · For the Next 80-ish Years
                </p>

                <CatSticker
                  src={
                    ch7Dodge.hidden
                      ? STORY_CONFIG.cats.tenorBigEyesCute
                      : ch7NoCount > 2
                      ? STORY_CONFIG.cats.hitting
                      : ch7NoCount > 0
                      ? STORY_CONFIG.cats.angry
                      : STORY_CONFIG.cats.tenorKittenHearts
                  }
                  alt="Proposal cat companion"
                  caption={
                    ch7Dodge.hidden
                      ? 'no button vanished ♥'
                      : ch7NoCount > 0
                      ? 'say yes right now!!'
                      : 'my heart is in your hands'
                  }
                  size="md"
                  variant={ch7NoCount > 0 && !ch7Dodge.hidden ? 'sassy' : 'happy'}
                />

                <div className="space-y-3">
                  <h1 className="font-['Cormorant_Garamond',serif] text-3xl sm:text-5xl font-bold text-[#2B2230] text-balance">
                    {STORY_CONFIG.proposal[0]}
                  </h1>
                  <p className="font-['Cormorant_Garamond',serif] italic text-2xl sm:text-4xl font-semibold text-[#8A5A12]">
                    {STORY_CONFIG.proposal[1]} <InlineWhiteHeartIcon />
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-4 relative min-h-[64px]">
                  <button
                    id="ch7c-yes-btn"
                    type="button"
                    onClick={() => {
                      soundEngine.playPageTurn('forward');
                      soundEngine.playHeartShimmer();
                      setPageTurnDir('forward');
                      setPageTurnKey((k) => k + 1);
                      setCh7Stage('7d');
                    }}
                    style={{
                      transform: `scale(${1 + Math.min(ch7NoCount * 0.06, 0.24)})`,
                    }}
                    className="hover-glow-btn min-h-[52px] px-8 py-3.5 rounded-2xl bg-[#F4B52E] text-[#2B2230] font-bold text-base border-2 border-[#2B2230] shadow-[4px_5px_0px_#2B2230] hover:bg-[#e5a620] cursor-pointer whitespace-nowrap"
                  >
                    Yes!
                  </button>

                  {!ch7Dodge.hidden && (
                    <button
                      id="ch7c-no-btn"
                      type="button"
                      onClick={() => {
                        soundEngine.playCatBoop('sassy');
                        setCh7NoCount((c) => c + 1);
                      }}
                      style={{
                        transform: `translate(${ch7Dodge.x}px, ${ch7Dodge.y}px) scale(${ch7Dodge.scale})`,
                        opacity: Math.max(0.35, ch7Dodge.scale),
                      }}
                      className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-[#FFF3D6] text-[#2B2230] font-semibold text-sm border-2 border-[#2B2230] cursor-pointer whitespace-nowrap transition-all duration-200"
                    >
                      No
                    </button>
                  )}
                </div>

                {ch7NoCount > 0 && (
                  <p aria-live="polite" className="text-xs font-semibold text-[#B94A3E] italic">
                    {ch7Dodge.hidden
                      ? 'The “No” button has officially disappeared — only “Yes!” remains!'
                      : `Attempt #${ch7NoCount} to say no vetoed!`}
                  </p>
                )}
              </div>
            )}

            {ch7Stage === '7d' && (
              <div className="flex flex-col items-center gap-6 w-full py-2 animate-[fadeIn_450ms_ease-out]">
                <div className="flex items-center justify-center gap-5 flex-wrap">
                  <CatSticker
                    src={STORY_CONFIG.cats.tenorMochiKiss}
                    alt="Mochi cats kissing"
                    caption="SHE SAID YES!!"
                    size="md"
                  />
                  <CatSticker
                    src={STORY_CONFIG.cats.dance}
                    alt="Dancing celebration cat"
                    caption="forever & ever ♥"
                    size="md"
                  />
                  <CatSticker
                    src={STORY_CONFIG.cats.jump}
                    alt="Jumping happy cat"
                    caption="yippee!!"
                    size="md"
                  />
                </div>

                <div>
                  <h1 className="font-['Cormorant_Garamond',serif] text-4xl sm:text-5xl font-bold text-[#2B2230]">
                    You just made me the happiest person alive. <InlineSunflowerIcon />{' '}
                    <InlineWhiteHeartIcon />
                  </h1>
                  <p className="mt-2 font-['Caveat',cursive] text-2xl text-[#8A5A12]">
                    ({STORY_CONFIG.kidsJoke})
                  </p>
                </div>

                <form
                  onSubmit={handleSaveKeepsakeNote}
                  noValidate
                  className="w-full max-w-xl bg-[#FFF3D6]/75 rounded-2xl border-2 border-[#2B2230] p-5 text-left flex flex-col gap-4"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#7C9070]">
                      First Adventure Keepsake Stamp
                    </p>
                    <p className="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#2B2230]">
                      Answer the final line of the letter: Sunflowers or Lilies?
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3" role="group" aria-label="Choose your flower">
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playTap();
                        setChosenFlower('sunflowers');
                      }}
                      className={`min-h-[44px] px-4 py-2.5 rounded-xl font-semibold text-sm border-2 border-[#2B2230] flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                        chosenFlower === 'sunflowers'
                          ? 'bg-[#F4B52E] text-[#2B2230] shadow-[2px_3px_0px_#2B2230]'
                          : 'bg-[#FFFDF7] text-[#2B2230]/75'
                      }`}
                    >
                      <SunflowerSvg className="w-5 h-5" />
                      <span>Sunflowers</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playTap();
                        setChosenFlower('lilies');
                      }}
                      className={`min-h-[44px] px-4 py-2.5 rounded-xl font-semibold text-sm border-2 border-[#2B2230] flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                        chosenFlower === 'lilies'
                          ? 'bg-[#F4B52E] text-[#2B2230] shadow-[2px_3px_0px_#2B2230]'
                          : 'bg-[#FFFDF7] text-[#2B2230]/75'
                      }`}
                    >
                      <LilySvg className="w-5 h-5" />
                      <span>White Lilies</span>
                    </button>
                  </div>

                  <div>
                    <label
                      htmlFor="rishika-keepsake-note"
                      className="block text-xs font-semibold text-[#2B2230] mb-1.5"
                    >
                      Leave a tiny keepsake note on this page (optional or seal it below):
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        id="rishika-keepsake-note"
                        type="text"
                        value={personalNote}
                        onChange={(e) => {
                          setPersonalNote(e.target.value);
                          if (noteError) setNoteError('');
                        }}
                        placeholder="e.g., Both + milk chocolate please..."
                        className="flex-1 min-h-[44px] px-3.5 py-2 rounded-xl bg-[#FFFDF7] border-2 border-[#2B2230] text-sm text-[#2B2230] focus:outline-2 focus:outline-[#D9961A]"
                      />
                      <button
                        type="submit"
                        className="min-h-[44px] px-5 py-2 rounded-xl bg-[#2B2230] text-[#FFFDF7] text-xs font-semibold hover:bg-[#3f3246] cursor-pointer whitespace-nowrap"
                      >
                        Seal Keepsake
                      </button>
                    </div>
                    {noteError && (
                      <p role="alert" className="mt-1.5 text-xs font-semibold text-[#B94A3E]">
                        {noteError}
                      </p>
                    )}
                    {noteSaved && (
                      <p aria-live="polite" className="mt-1.5 text-xs font-semibold text-[#58724E]">
                        Sealed with {chosenFlower === 'sunflowers' ? 'Sunflowers' : 'White Lilies'}: “{personalNote.trim()}”
                      </p>
                    )}
                  </div>
                </form>

                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <a
                    href={STORY_CONFIG.chatUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[52px] px-8 py-3.5 rounded-2xl bg-[#F4B52E] text-[#2B2230] font-bold text-base border-2 border-[#2B2230] shadow-[4px_5px_0px_#2B2230] hover:bg-[#e5a620] inline-flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <span>Come tell me · Open our chat →</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => navigate('lock')}
                    className="min-h-[48px] px-5 py-3 rounded-2xl bg-[#FFF3D6] text-[#2B2230] font-semibold text-xs border-2 border-[#2B2230] hover:bg-[#f7e4b4] cursor-pointer whitespace-nowrap"
                  >
                    Replay from Passcode Vault
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
        </div>
      </main>

      {/* =====================================================================
       * QUIET EDITORIAL FOOTER WITH QUICK CHAPTER SWITCHER ON MOBILE
       * ===================================================================== */}
      <footer className="relative z-20 border-t border-[#2B2230]/10 px-4 sm:px-8 py-3 bg-[#FFF3D6]/80">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-[#2B2230]/70">
          <div>
            <span>Hand-crafted for {STORY_CONFIG.herName}</span>
            <span className="mx-2">·</span>
            <span>Sunflowers & Lilies Edition</span>
          </div>

          <div className="flex items-center gap-1.5 md:hidden">
            {[
              { key: 'lock' as RouteKey, label: '0' },
              { key: '1' as RouteKey, label: '1' },
              { key: '2' as RouteKey, label: '2' },
              { key: '3' as RouteKey, label: '3' },
              { key: '4' as RouteKey, label: '4' },
              { key: '5' as RouteKey, label: '5' },
              { key: '6' as RouteKey, label: '6' },
              { key: '7' as RouteKey, label: '7' },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.key)}
                aria-label={`Jump to chapter ${item.label}`}
                className={`w-7 h-7 rounded-lg font-bold text-xs border border-[#2B2230] cursor-pointer ${
                  String(chapterNum) === item.label
                    ? 'bg-[#F4B52E] text-[#2B2230]'
                    : 'bg-[#FFFDF7] text-[#2B2230]/70'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
