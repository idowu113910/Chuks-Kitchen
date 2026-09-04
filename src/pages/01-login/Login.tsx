import React, { useState, useRef, useEffect } from "react";
import chuks from "../../assets/chukss.svg";
import flg from "../../assets/green.svg";
import drpdown from "../../assets/dropdown.svg";
import { HiOutlineLockClosed } from "react-icons/hi2";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaApple } from "react-icons/fa";
import g from "../../assets/google.svg";
import { useNavigate } from "react-router-dom";

interface Country {
  code: string;
  flag: string;
  name: string;
  format: string;
  placeholder: string;
}

// Country list with format patterns (X = digit)
const countries: Country[] = [
  {
    code: "+234",
    flag: flg,
    name: "Nigeria",
    format: "XXXX XXX XXXX",
    placeholder: "801 234 5678",
  },
  {
    code: "+1",
    flag: "https://flagcdn.com/w20/us.png",
    name: "United States",
    format: "(XXX) XXX-XXXX",
    placeholder: "(201) 555-0123",
  },
  {
    code: "+44",
    flag: "https://flagcdn.com/w20/gb.png",
    name: "United Kingdom",
    format: "XXXX XXXXXX",
    placeholder: "7911 123456",
  },
  {
    code: "+27",
    flag: "https://flagcdn.com/w20/za.png",
    name: "South Africa",
    format: "XX XXX XXXX",
    placeholder: "82 123 4567",
  },
  {
    code: "+254",
    flag: "https://flagcdn.com/w20/ke.png",
    name: "Kenya",
    format: "XXX XXXXXX",
    placeholder: "712 345678",
  },
  {
    code: "+233",
    flag: "https://flagcdn.com/w20/gh.png",
    name: "Ghana",
    format: "XX XXX XXXX",
    placeholder: "24 123 4567",
  },
];

// Helper to format input string based on pattern
const formatPhoneNumber = (value: string, pattern: string): string => {
  const digits = value.replace(/\D/g, "");
  let formatted = "";
  let digitIndex = 0;

  for (let i = 0; i < pattern.length && digitIndex < digits.length; i++) {
    if (pattern[i] === "X") {
      formatted += digits[digitIndex];
      digitIndex++;
    } else {
      formatted += pattern[i];
    }
  }

  return formatted;
};

const Login = () => {
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const navigate = useNavigate();

  // Set default selected country with complete properties
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);

  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  // Calculate required digits by counting 'X' instances in format
  const requiredLength =
    (selectedCountry?.format?.match(/X/g) || []).length || 10;

  // Extract raw digits from the phone number input state
  const currentDigits = phoneNumber.replace(/\D/g, "");

  // Form is valid when digit count reaches required length
  const isFormValid = currentDigits.length === requiredLength;

  // Handle phone input change with dynamic masking
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, "");
    if (rawDigits.length <= requiredLength) {
      const formatted = formatPhoneNumber(rawDigits, selectedCountry.format);
      setPhoneNumber(formatted);
    }
  };

  // Navigate to home screen on submit after displaying continuous loading screen
  const handleContinue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid && !isNavigating) {
      setIsNavigating(true);
      setTimeout(() => {
        navigate("/welcome");
      }, 1500); // Simulates network transition delay before showing /home screen
    }
  };

  // Country Picker State
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reformat existing digits when changing selected country
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setPhoneNumber(formatPhoneNumber(currentDigits, country.format));
    setIsDropdownOpen(false);
  };

  // Auto-uncheck "Remember me" if the input becomes invalid
  useEffect(() => {
    if (!isFormValid && rememberMe) {
      setRememberMe(false);
    }
  }, [isFormValid, rememberMe]);

  const handleRememberMeClick = () => {
    if (isFormValid) {
      setRememberMe(!rememberMe);
    }
  };

  // Display blank full-screen loading state when transitioning
  if (isNavigating) {
    return (
      <div className="w-full min-h-screen bg-white flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-[350px] sm:max-w-md flex flex-col items-center">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center text-center mt-6">
          <img src={chuks} alt="Logo" />
          <p className="font-semibold text-[24px] text-[#333333] mt-2">
            Sign In
          </p>
        </div>

        <div className="flex items-center justify-center w-full mt-3 gap-1.5 text-center flex-wrap">
          <p className="font-normal text-[12px] text-[#333333]">
            Welcome Back 👋
          </p>
          <p className="font-normal text-[12px] text-[#333333]">
            Let’s get your craving started
          </p>
        </div>

        {/* Form Container */}
        <form
          className="w-full mt-6 flex flex-col items-center"
          onSubmit={handleContinue}
        >
          {/* Phone Input with Dynamic Formatting */}
          <div className="flex flex-col gap-2 w-full">
            <h5 className="font-medium text-[16px] text-[#333333]">
              Phone Number
            </h5>
            <div className="relative w-full" ref={dropdownRef}>
              <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder={selectedCountry.placeholder}
                className="w-full h-12 text-black rounded-[10px] border-[1.5px] border-[#757575] outline-none pl-28 pr-4"
              />

              {/* Selected Country Flag & Dropdown Trigger */}
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer select-none bg-white py-1 pr-1"
              >
                <div className="flex items-center gap-1">
                  <img
                    src={selectedCountry.flag}
                    alt={selectedCountry.name}
                    className="w-[20.67px] h-[12.67px] object-cover rounded-[2px]"
                  />
                  <img
                    src={drpdown}
                    alt="Dropdown"
                    className={`text-[#757575] w-5 h-5 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
                <span className="text-[#333333] font-normal text-[14px]">
                  {selectedCountry.code}
                </span>
              </div>

              {/* Dropdown Options */}
              {isDropdownOpen && (
                <div className="absolute left-0 top-14 w-full max-h-48 overflow-y-auto bg-white border border-[#757575] rounded-[10px] shadow-lg z-50 py-1">
                  {countries.map((country) => (
                    <div
                      key={country.code + country.name}
                      onClick={() => handleCountrySelect(country)}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-[#F0F0F0] cursor-pointer transition-colors"
                    >
                      <img
                        src={country.flag}
                        alt={country.name}
                        className="w-[20.67px] h-[12.67px] object-cover rounded-[2px]"
                      />
                      <span className="text-[14px] font-medium text-[#333333] w-12">
                        {country.code}
                      </span>
                      <span className="text-[14px] text-[#757575] truncate">
                        {country.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Password Input Group */}
          <div className="flex flex-col gap-2 w-full mt-4">
            <h5 className="font-medium text-[16px] text-[#333333]">Password</h5>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 text-black rounded-[10px] border-[1.5px] border-[#757575] outline-none pl-10 pr-12"
              />
              <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#757575] text-lg pointer-events-none" />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#757575] text-xl cursor-pointer"
              >
                {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center w-full mt-3">
            <div
              onClick={handleRememberMeClick}
              className={`flex gap-1.5 items-center select-none ${
                isFormValid ? "cursor-pointer" : "cursor-not-allowed opacity-50"
              }`}
            >
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                disabled={!isFormValid}
                onChange={handleRememberMeClick}
                className="w-4.5 h-4 text-[#FF6B35] accent-[#FF6B35] rounded cursor-pointer disabled:cursor-not-allowed"
              />
              <label
                htmlFor="rememberMe"
                className={`text-[12px] font-medium text-[#333333] ${
                  isFormValid ? "cursor-pointer" : "cursor-not-allowed"
                }`}
              >
                Remember me
              </label>
            </div>
            <p className="text-[12px] font-semibold text-[#FF6B35] cursor-pointer">
              Forgot Password?
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-3.5 px-4 mt-6 text-[#ffffff] font-medium text-[14px] rounded-[10px] transition ${
              isFormValid
                ? "bg-[#FF6B35] hover:bg-[#d44e0a]"
                : "bg-[#EC5B0C] opacity-50 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </form>

        {/* Terms */}
        <p className="text-[12px] text-[#000000] text-center mt-3 px-2">
          By Clicking “Continue” you certify that you agree to our{" "}
          <span className="text-[#FF6B35] cursor-pointer">privacy policy</span>{" "}
          and{" "}
          <span className="text-[#FF6B35] cursor-pointer">
            Terms and Conditions
          </span>
        </p>

        {/* Divider */}
        <div className="flex items-center gap-4 w-full mt-6">
          <hr className="flex-1 border-t border-[#FF6B35]" />
          <span className="font-normal text-[16px] text-[#000000]">Or</span>
          <hr className="flex-1 border-t border-[#FF6B35]" />
        </div>

        {/* Social Buttons */}
        <div className="flex items-center justify-center gap-4 w-full mt-4">
          <button className="bg-black text-white p-2.5 h-11 rounded-[5px] gap-2 flex items-center justify-center flex-1 max-w-[140px]">
            <FaApple className="w-[20px] h-[20px]" />
            <span className="font-medium text-[16px]">Apple</span>
          </button>

          <button className="bg-[#F0F0F0] p-2.5 h-11 rounded-[5px] gap-2 flex items-center justify-center flex-1 max-w-[140px]">
            <img src={g} alt="Google" className="w-5 h-5" />
            <span className="font-medium text-[16px] text-[#333333]">
              Google
            </span>
          </button>
        </div>
      </div>

      <p className="text-[16px] font-normal text-black mt-12 text-center">
        New User?{" "}
        <span
          onClick={() => {
            navigate("/signup");
          }}
          className="text-[#FF6B35] cursor-pointer"
        >
          Register
        </span>
      </p>
    </div>
  );
};

export default Login;
