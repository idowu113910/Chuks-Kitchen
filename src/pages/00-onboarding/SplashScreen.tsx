import  { useState, useEffect } from "react";
import chuksLogo from "../../assets/chuks 2.svg"; // Adjust asset path if needed

interface SplashScreenProps {
  onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  // Animation phases: 'splitting' | 'logo-out'
  const [phase, setPhase] = useState<"splitting" | "logo-out">("splitting");

  useEffect(() => {
    // 1. Circles split away and logo displays (0ms -> 2300ms)
    const t1 = setTimeout(() => {
      setPhase("logo-out");
    }, 2300);

    // 2. Logo fades out and signals parent to finish splash transition (2300ms -> 3500ms)
    const t2 = setTimeout(() => {
      onFinish?.();
    }, 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 w-full h-dvh bg-[#FFE3D6] overflow-hidden flex items-center justify-center z-50 select-none">
      {/* --- CIRCLE GROUPS (Only render during initial split) --- */}
      {phase === "splitting" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Top Direction Group */}
          <div className="animate-split-top">
            <div className="w-48 h-48 rounded-full bg-[#FF6B35] shadow-md -mb-10" />
          </div>

          {/* Right Direction Group */}
          <div className="animate-split-right">
            <div className="w-56 h-56 rounded-full bg-[#D9531E] shadow-lg -ml-12" />
          </div>

          {/* Bottom Direction Group */}
          <div className="animate-split-bottom">
            <div className="w-52 h-52 rounded-full bg-[#FF6B35] shadow-md -mt-10" />
          </div>

          {/* Left Direction Group */}
          <div className="animate-split-left">
            <div className="w-60 h-60 rounded-full bg-[#D9531E] shadow-lg -mr-12" />
          </div>
        </div>
      )}

      {/* --- CHUKS KITCHEN LOGO --- */}
      <div
        className={`relative z-10 flex flex-col items-center justify-center transition-opacity duration-500 ${
          phase === "splitting"
            ? "animate-logo-appear"
            : "animate-logo-disappear"
        }`}
      >
        <img
          src={chuksLogo}
          alt="Chuks Kitchen"
          className="w-[200px] h-[200px] object-contain drop-shadow-md"
        />
      </div>
    </div>
  );
}
