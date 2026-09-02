import React, { useEffect, useState } from "react";
import ois from "../../assets/OIS.svg";
import pwy from "../../assets/PYW.svg";
import qfd from "../../assets/QFD.svg";
import curve1 from "../../assets/blue curve.svg";
import curve2 from "../../assets/pink curve.svg";
import curve3 from "../../assets/orange curve.svg";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosArrowBack } from "react-icons/io";

const OnBoarding = () => {
  const [splashPhase, setSplashPhase] = useState("dot");
  const [currentScreen, setCurrentScreen] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const idleTimer = setTimeout(() => setSplashPhase("dot"), 1200);
    const expandTimer = setTimeout(() => setSplashPhase("expand"), 1600);
    const doneTimer = setTimeout(() => setSplashPhase("done"), 4300);

    return () => {
      clearTimeout(idleTimer);
      clearTimeout(expandTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  const slides = [
    {
      curve: curve1,
      image: ois,
      title: "Order in Seconds",
      description:
        "Browse menus, add to cart and place orders easily with a smooth and simple checkout process",
    },
    {
      curve: curve2,
      image: qfd,
      title: "Pay your Way",
      description:
        "Pay with card, transfer or cash on delivery. Safe, secure and convenient for you without stress",
    },
    {
      curve: curve3,
      image: pwy,
      title: "Quick and Fast Delivery",
      description:
        "Track your order in real time and get your food delivered to your doorstep with zero stress",
    },
  ];

  const handleNext = () => {
    if (currentScreen < slides.length - 1) {
      setCurrentScreen((prev) => prev + 1);
    } else {
      navigate("/login");
    }
  };

  const handleBack = () => {
    if (currentScreen > 0) {
      setCurrentScreen((prev) => prev - 1);
    }
  };

  const current = slides[currentScreen];

  if (splashPhase === "dot") {
    return (
      <div className="min-h-dvh w-full bg-white flex items-center justify-center overflow-hidden">
        <div className="w-3 h-3 rounded-full bg-[#FF6B35]" />
      </div>
    );
  }

  if (splashPhase === "expand") {
    return (
      <div className="min-h-dvh w-full bg-white flex items-center justify-center overflow-hidden relative">
        <motion.div
          className="absolute rounded-full bg-[#FF6B35]"
          initial={{ width: 12, height: 12 }}
          animate={{ width: "200vmax", height: "200vmax" }}
          transition={{ duration: 3.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-dvh w-full bg-white flex flex-col justify-between overflow-hidden relative select-none">
      {/* --- TOP SECTION (CURVE IMAGE + BACK BUTTON + CENTERED ILLUSTRATION) --- */}
      <div className="relative w-full h-[50vh] min-h-87.5">
        {/* Curve Background Image */}
        <AnimatePresence mode="wait">
          <motion.img
            key={`curve-${currentScreen}`}
            src={current.curve}
            alt=""
            className={`absolute left-0 w-full h-full object-cover z-0 pointer-events-none ${
              currentScreen === 1
                ? "top-14"
                : currentScreen === 2
                  ? "top-12"
                  : "top-0"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        {/* Back Button (Only on Screen 2 and 3) */}
        {currentScreen > 0 && (
          <button
            onClick={handleBack}
            aria-label="Go back"
            className="absolute top-6 left-5 z-20 text-black text-2xl p-2 rounded-full hover:bg-black/5
             active:scale-90 transition-transform cursor-pointer"
          >
            <IoIosArrowBack />
          </button>
        )}

        {/* Center Illustration */}
        <div
          className={`absolute inset-0 z-10 flex items-center justify-center px-6 ${
            currentScreen === 1
              ? "pt-32"
              : currentScreen === 2
                ? "pt-20"
                : "pt-12"
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={`image-${currentScreen}`}
              src={current.image}
              alt={current.title}
              className={`w-auto max-h-65 object-contain drop-shadow-md ${
                currentScreen === 2 ? "h-[80%]" : "h-[68%]"
              }`}
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
        </div>
      </div>

      {/* --- MIDDLE SECTION (TEXT) --- */}
      <div className="w-full flex-1 flex flex-col items-center justify-center px-6 text-center max-w-100 mx-auto z-10 pt-6 pb-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${currentScreen}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center gap-2"
          >
            <h2 className="font-bold text-[22px] sm:text-[24px] text-black leading-snug">
              {current.title}
            </h2>
            <p className="font-normal text-[#676565] text-[13px] sm:text-[14px] leading-relaxed max-w-[320px]">
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Pagination Dots */}
        <div className="flex items-center gap-1.5 mt-5">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              className="h-[6px] rounded-full"
              style={{
                backgroundColor:
                  currentScreen === index ? "#FF6B35" : "#D1D5DB",
              }}
              animate={{
                width: currentScreen === index ? 22 : 8,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>

      {/* --- BOTTOM CONTROLS --- */}
      <div className="w-full px-6 pb-6 pt-2 flex items-center justify-between shrink-0 max-w-125 mx-auto z-10">
        <button
          onClick={() => navigate("/home")}
          className="font-medium text-[15px] text-[#9CA3AF] px-2 py-1.5 hover:text-gray-700 active:scale-95 transition-all cursor-pointer"
        >
          SKIP
        </button>

        <button
          onClick={handleNext}
          className="w-20 h-10 rounded-lg bg-[#FF6B35] text-white text-[14px] font-semibold flex items-center
           justify-center shadow-md active:scale-95 transition-transform cursor-pointer"
        >
          {currentScreen === slides.length - 1 ? "START" : "NEXT"}
        </button>
      </div>
    </div>
  );
};

export default OnBoarding;
