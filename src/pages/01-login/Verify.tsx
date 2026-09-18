import back from "../../assets/back.svg";
import mail from "../../assets/mail.svg";
import boxx from "../../assets/boxx.svg";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Verify = () => {
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(59);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve email from location state or localStorage
  const userEmail =
    location.state?.email || localStorage.getItem("userEmail") || "your email";

  // Helper to mask email address (e.g., john.doe@gmail.com -> j***e@gmail.com)
  const maskEmail = (emailStr: string) => {
    if (!emailStr.includes("@")) return emailStr;
    const [name, domain] = emailStr.split("@");
    if (name.length <= 2) return `${name}***@${domain}`;
    return `${name[0]}***${name[name.length - 1]}@${domain}`;
  };

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const otp = otpValues.join("");
  const isOtpFilled = otp.length === 6;

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpValues];
    newOtp[index] = value.slice(-1);
    setOtpValues(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (!isOtpFilled || loading) return;

    setLoading(true);
    setErrorMessage("");
    setInfoMessage("");

    try {
      const response = await fetch(
        "https://linkedin-guy-backend.onrender.com/api/auth/verify-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userEmail,
            code: otp,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Verification failed. Please check the code and try again.",
        );
      }

      // Navigate to welcome/dashboard upon successful verification
      navigate("/welcome");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setTimer(59);
    setErrorMessage("");
    setInfoMessage("");

    try {
      const response = await fetch(
        "https://linkedin-guy-backend.onrender.com/api/auth/resend-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend code.");
      }

      setInfoMessage("A new verification code has been sent to your email.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Could not resend verification code.");
      }
    }
  };

  return (
    <div className="relative w-full min-h-dvh flex flex-col justify-between px-4 sm:px-6 py-6 max-w-md mx-auto">
      {/* Full Screen Blank Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#FF6B35] rounded-full animate-spin" />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col items-center w-full">
        {/* Top Header Navigation */}
        <div className="flex items-center w-full gap-4 mt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-1 focus:outline-none rounded-lg active:bg-gray-100 transition"
            aria-label="Go back"
          >
            <img
              src={back}
              alt="Back"
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
            />
          </button>

          <h1 className="font-semibold text-lg sm:text-xl text-[#333333]">
            Verify Email Address
          </h1>
        </div>

        {/* Mail Icon & Text Instructions */}
        <div className="flex flex-col items-center justify-center mt-6 sm:mt-10 text-center w-full">
          <img
            src={mail}
            alt="Mail icon"
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
          />
          <p className="text-xs sm:text-sm text-[#333333] px-2 mt-4 leading-relaxed max-w-70 sm:max-w-xs">
            Enter the 6-digit code sent to{" "}
            <span className="text-[#FF6B35] font-medium">
              {maskEmail(userEmail)}
            </span>
          </p>
        </div>

        {/* Dynamic Status Notifications */}
        {errorMessage && (
          <div className="w-full mt-4 p-3 bg-red-100 border border-red-400 text-red-700 text-xs rounded-[10px] text-center">
            {errorMessage}
          </div>
        )}
        {infoMessage && (
          <div className="w-full mt-4 p-3 bg-green-100 border border-green-400 text-green-700 text-xs rounded-[10px] text-center">
            {infoMessage}
          </div>
        )}

        {/* Verification Code Input Container */}
        <div className="flex flex-col items-center justify-center mt-8 sm:mt-12 w-full">
          <p className="font-normal text-xs sm:text-sm text-[#757575] mb-3">
            Enter Verification Code
          </p>

          {/* Code Input Boxes */}
          <div className="flex justify-between items-center gap-1.5 sm:gap-2.5 w-full max-w-[320px]">
            {otpValues.map((val, index) => (
              <div
                key={index}
                className="flex-1 max-w-12 aspect-square relative"
              >
                <img
                  src={boxx}
                  alt=""
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="relative z-10 w-full h-full bg-transparent text-center text-lg font-semibold text-[#333333] outline-none caret-[#FF6B35]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full max-w-[320px] sm:max-w-full mt-8 sm:mt-10">
          <button
            type="submit"
            onClick={handleVerify}
            disabled={loading || !isOtpFilled}
            className="w-full py-3.5 px-4 text-[#ffffff] bg-[#FF6B35] hover:bg-[#d44e0a] font-medium text-xs sm:text-sm rounded-[10px] 
            transition duration-200 shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verify
          </button>
        </div>

        {/* Resend Timer Section */}
        <div className="flex justify-center mt-6">
          {timer === 0 ? (
            <p
              onClick={handleResendCode}
              className="text-xs sm:text-sm text-[#FF6B35] cursor-pointer font-semibold"
            >
              Resend code
            </p>
          ) : (
            <p className="font-normal text-xs sm:text-sm text-[#757575]">
              Resend code in{" "}
              <span className="text-xs sm:text-sm font-semibold text-[#FF6B35]">
                00:{timer < 10 ? `0${timer}` : timer}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Verify;
