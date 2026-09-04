import {
  useState,
  useRef,
  useEffect,
  type FC,
  type FormEvent,
  type ChangeEvent,
  type JSX,
} from "react";
import chuks from "../../assets/chukss.svg";
import flg from "../../assets/green.svg";
import drpdown from "../../assets/dropdown.svg";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
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

const SignUp: FC = (): JSX.Element => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmpassword, setConfirmpassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Country Picker State
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
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

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value, selectedCountry.format);
    setPhoneNumber(formatted);
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setPhoneNumber(formatPhoneNumber(phoneNumber, country.format));
    setIsDropdownOpen(false);
  };

  const isFormValid =
    password.trim() !== "" &&
    confirmpassword.trim() !== "" &&
    password === confirmpassword &&
    phoneNumber.trim() !== "";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);

    // Simulate account creation before navigating
    setTimeout(() => {
      setLoading(false);
      navigate("/verify");
    }, 2000);
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-white flex items-center justify-center fixed inset-0 z-50">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#FF6B35] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-[350px] sm:max-w-md flex flex-col items-center">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center text-center">
          <img src={chuks} alt="Logo" />
          <p className="font-semibold text-[24px] text-[#333333] mt-2">
            Create Account
          </p>
        </div>

        <div className="flex items-center justify-center w-full mt-3 gap-1.5 text-center flex-wrap">
          <p className="font-normal text-[12px] text-[#333333]">
            Join us and enjoy your favorite meals 🍔
          </p>
        </div>

        {/* Form Container */}
        <form
          className="w-full mt-6 flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          {/* First Name & Last Name */}
          <div className="flex gap-4 sm:gap-5.25 w-full justify-center">
            <div className="flex-1 max-w-[165px]">
              <h5 className="text-[#333333] text-[16px] font-medium">
                First Name
              </h5>
              <input
                type="text"
                className="w-full h-12 rounded-[10px] border border-[#757575] opacity-48 mt-2 px-3 outline-none"
              />
            </div>

            <div className="flex-1 max-w-[165px]">
              <h5 className="text-[#333333] text-[16px] font-medium">
                Last Name
              </h5>
              <input
                type="text"
                className="w-full h-12 rounded-[10px] border border-[#757575] opacity-48 mt-2 px-3 outline-none"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-2 w-full mt-3">
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
                    className={`text-[#757575] w-5 h-5 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
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
            <p className="text-[#757575] text-[12px]">
              We will send a verification code
            </p>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2 w-full mt-3">
            <h5 className="font-medium text-[16px] text-[#333333]">Password</h5>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 text-black rounded-[10px] border-[1.5px] border-[#757575] outline-none pl-3 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#757575] text-xl cursor-pointer"
              >
                {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
              </button>
            </div>
            <p className="font-normal text-[12px] text-[#757575]">
              Must be at least 8 characters, including one uppercase letter
            </p>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2 w-full mt-3">
            <h5 className="font-medium text-[16px] text-[#333333]">
              Confirm Password
            </h5>
            <div className="relative w-full">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmpassword}
                onChange={(e) => setConfirmpassword(e.target.value)}
                className="w-full h-12 text-black rounded-[10px] border-[1.5px] border-[#757575] outline-none pl-3 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#757575] text-xl cursor-pointer"
              >
                {showConfirmPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className={`w-full py-3.5 px-4 mt-6 text-[#ffffff] font-medium text-[14px] rounded-[10px] transition ${
              isFormValid
                ? "bg-[#FF6B35] hover:bg-[#d44e0a]"
                : "bg-[#EC5B0C] opacity-50 cursor-not-allowed"
            }`}
          >
            {loading ? "Creating account..." : "Sign Up"}
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

        {/* Sign In Link */}
        <p className="text-[16px] font-normal text-black mt-12 text-center">
          Already have an account?{" "}
          <span
            onClick={() => {
              navigate("/login");
            }}
            className="text-[#FF6B35] cursor-pointer font-normal"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
