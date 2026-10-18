import React, { useState } from 'react';
import { soundEngine } from '../utils/soundEngine';

interface CatStickerProps {
  src: string;
  alt: string;
  caption?: string;
  size?: 'sm' | 'md' | 'lg';
  tilt?: number;
  className?: string;
  variant?: 'happy' | 'sassy';
}

const PHOTO_GIFS = [
  'tenor-big-eyes-cute-2.gif',
  'cat-side-eye.gif',
  'angry-cat.gif',
  'cat-hitting.gif',
  'catjam.gif',
  'melvin-cat.gif',
  'gato-cat.gif',
  'stare.gif',
];

/**
 * Seamlessly merged botanical illustration companion with warm golden hover glow.
 */
export function CatSticker({
  src,
  alt,
  caption,
  size = 'md',
  tilt = 0,
  className = '',
  variant = 'happy',
}: CatStickerProps) {
  const [boops, setBoops] = useState(0);
  const [isWiggling, setIsWiggling] = useState(false);
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-14 h-14 sm:w-16 sm:h-16',
    md: 'w-22 h-22 sm:w-26 sm:h-26',
    lg: 'w-28 h-28 sm:w-34 sm:h-34',
  }[size];

  const isPhotoGif = PHOTO_GIFS.some((name) => src.includes(name));

  const handleBoop = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playCatBoop(variant);
    setBoops((c) => c + 1);
    setIsWiggling(true);
    window.setTimeout(() => setIsWiggling(false), 360);
  };

  return (
    <div
      className={`inline-flex flex-col items-center select-none ${className}`}
      style={{
        transform: `rotate(${isWiggling ? tilt + (boops % 2 === 0 ? 5 : -5) : tilt}deg) scale(${
          isWiggling ? 1.07 : 1
        })`,
        transition: 'transform 220ms cubic-bezier(0.34, 1.45, 0.64, 1)',
      }}
    >
      <button
        type="button"
        onClick={handleBoop}
        aria-label={`Pet cat companion: ${alt}`}
        className="group relative flex flex-col items-center cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D9961A] rounded-3xl"
      >
        {/* Subtle floating heart burst on boop */}
        {boops > 0 && (
          <span
            key={boops}
            aria-hidden="true"
            className="absolute -top-2.5 -right-1 z-20 px-1.5 py-0.5 text-[10px] font-semibold bg-[#FFF3D6] text-[#B94A3E] border border-[#D9961A]/60 rounded-full shadow-xs animate-[bounce_450ms_ease-out]"
          >
            {variant === 'sassy' ? 'hmph!' : `♥ +${boops}`}
          </span>
        )}

        {/* Seamless parchment-blended vignette with warm golden hover glow */}
        <div
          className={`${sizeClasses} relative overflow-hidden rounded-3xl bg-[#FFFDF7] flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:shadow-[0_0_24px_4px_rgba(244,181,46,0.45)]`}
        >
          {!imgError ? (
            <img
              src={src}
              alt={alt}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className={
                isPhotoGif
                  ? 'w-full h-full object-cover rounded-3xl shadow-inner'
                  : 'w-full h-full object-contain mix-blend-multiply rounded-2xl'
              }
            />
          ) : (
            <span className="text-xl font-serif text-[#8A5A12]" role="img" aria-label={alt}>
              ♥
            </span>
          )}
        </div>

        {caption && (
          <span className="mt-1 text-sm leading-tight text-[#8A5A12]/90 font-['Caveat',cursive] font-semibold tracking-wide">
            {caption}
          </span>
        )}
      </button>
    </div>
  );
}
