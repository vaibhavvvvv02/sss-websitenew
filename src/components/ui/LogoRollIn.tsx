/**
 * LogoRollIn
 * ──────────
 * The canonical SSS logo animation used on every page hero.
 * - Rolls in from the left with a 720° spin over 1.4s
 * - Then slowly spins continuously at 12s/revolution
 *
 * Matches exactly the animation on the Products page hero.
 */

interface LogoRollInProps {
  size?: number   // width = height in px, default 140
  className?: string
}

export default function LogoRollIn({ size = 140, className = '' }: LogoRollInProps) {
  return (
    <>
      <style>{`
        @keyframes sssLogoRollIn {
          0%   { opacity: 0; transform: translateX(-200px) rotate(-720deg) scale(0.7); }
          70%  { opacity: 1; }
          100% { opacity: 1; transform: translateX(0)      rotate(0deg)   scale(1);   }
        }
        @keyframes sssLogoSpin {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
        .sss-logo-roll {
          animation:
            sssLogoRollIn 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards,
            sssLogoSpin   12s  linear 1.4s infinite;
          opacity: 0;
          object-fit: contain;
          flex-shrink: 0;
          display: block;
        }
        @media (prefers-reduced-motion: reduce) {
          .sss-logo-roll {
            animation: sssLogoRollIn 1.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
        }
      `}</style>
      <img
        src="/assets/sss.png"
        alt="SSS Risk Management Logo"
        className={`sss-logo-roll ${className}`}
        style={{ width: size, height: size }}
      />
    </>
  )
}
