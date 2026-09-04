import { useState, useEffect } from "react";
import chuksLogo from "../../assets/chuks 2.svg";

// 1. Define the props interface
interface SplashScreenProps {
  onFinish: () => void;
}

// 2. Add the interface type to the component props
export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [phase, setPhase] = useState<"splitting" | "logo-out">("splitting");

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase("logo-out");
    }, 2300);

    const t2 = setTimeout(() => {
      // 3. Call onFinish when the animation completes
      onFinish();
    }, 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 w-full h-dvh bg-[#FFE3D6] overflow-hidden flex items-center justify-center z-50">
      {phase === "splitting" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="animate-split-top">
            <div className="w-48 h-48 rounded-full bg-[#FF6B35] shadow-md -mb-10" />
          </div>
          <div className="animate-split-right">
            <div className="w-56 h-56 rounded-full bg-[#D9531E] shadow-lg -ml-12" />
          </div>
          <div className="animate-split-bottom">
            <div className="w-52 h-52 rounded-full bg-[#FF6B35] shadow-md -mt-10" />
          </div>
          <div className="animate-split-left">
            <div className="w-60 h-60 rounded-full bg-[#D9531E] shadow-lg -mr-12" />
          </div>
        </div>
      )}

      <div
        className={`relative z-10 flex flex-col items-center justify-center ${
          phase === "splitting"
            ? "animate-logo-appear"
            : "animate-logo-disappear"
        }`}
      >
        <img
          src={chuksLogo}
          alt="Chuks Kitchen"
          className="w-50 h-50 object-contain drop-shadow-md"
        />
      </div>
    </div>
  );
}
