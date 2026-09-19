import {
  useState,
  useRef,
  useEffect,
  type FC,
  type FormEvent,
  type ChangeEvent,
  type KeyboardEvent,
  type JSX,
} from "react";
import chuks from "../../assets/chukss.svg";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

interface Country {
  code: string;
  flag: string;
  name: string;
  format: string; // X = digit placeholder
  placeholder: string;
  maxDigits: number;
}

// Base URL comes from env so dev/staging/prod can point at different backends.
// Add VITE_API_URL to your .env file; falls back to the current backend if unset.
const API_URL =
  import.meta.env.VITE_API_URL ?? "https://linkedin-guy-backend.onrender.com";

// All flags served the same way (flagcdn) for consistency — no mixed
// local-import/remote-URL sources.
const countries: Country[] = [
  {
    code: "+234",
    flag: "https://flagcdn.com/w20/ng.png",
    name: "Nigeria",
    format: "XXXX XXX XXXX",
    placeholder: "801 234 5678",
    maxDigits: 10,
  },
  {
    code: "+1",
    flag: "https://flagcdn.com/w20/us.png",
    name: "United States",
    format: "(XXX) XXX-XXXX",
    placeholder: "(201) 555-0123",
    maxDigits: 10,
  },
  {
    code: "+44",
    flag: "https://flagcdn.com/w20/gb.png",
    name: "United Kingdom",
    format: "XXXX XXXXXX",
    placeholder: "7911 123456",
    maxDigits: 10,
  },
  {
    code: "+27",
    flag: "https://flagcdn.com/w20/za.png",
    name: "South Africa",
    format: "XX XXX XXXX",
    placeholder: "82 123 4567",
    maxDigits: 9,
  },
  {
    code: "+254",
    flag: "https://flagcdn.com/w20/ke.png",
    name: "Kenya",
    format: "XXX XXXXXX",
    placeholder: "712 345678",
    maxDigits: 9,
  },
  {
    code: "+233",
    flag: "https://flagcdn.com/w20/gh.png",
    name: "Ghana",
    format: "XX XXX XXXX",
    placeholder: "24 123 4567",
    maxDigits: 9,
  },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Formats a string of raw digits according to an "X" placeholder pattern. */
const applyFormat = (digits: string, pattern: string): string => {
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

const onlyDigits = (value: string): string => value.replace(/\D/g, "");

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
}

// --- Country dropdown, split out for readability and keyboard support ---
interface CountryDropdownProps {
  countries: Country[];
  selected: Country;
  onSelect: (country: Country) => void;
}

const CountryDropdown: FC<CountryDropdownProps> = ({
  countries,
  selected,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTriggerKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleOptionKeyDown = (
    e: KeyboardEvent<HTMLDivElement>,
    country: Country,
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(country);
      setIsOpen(false);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Selected country: ${selected.name}, ${selected.code}`}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className="flex items-center gap-1.5 absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer select-none bg-white py-1 pr-1 z-10"
      >
        <div className="flex items-center gap-1">
          <img
            src={selected.flag}
            alt=""
            className="w-[20.67px] h-[12.67px] object-cover rounded-[2px]"
          />
          <span
            className={`text-[#757575] text-xs transition-transform inline-block ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          >
            ▼
          </span>
        </div>
        <span className="text-[#333333] font-normal text-[14px]">
          {selected.code}
        </span>
      </div>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Select country code"
          className="absolute left-0 top-8 w-56 max-h-48 overflow-y-auto bg-white border border-[#757575] rounded-[10px] shadow-lg z-50 py-1"
        >
          {countries.map((country) => (
            <div
              key={country.code + country.name}
              role="option"
              aria-selected={country.code === selected.code}
              tabIndex={0}
              onClick={() => {
                onSelect(country);
                setIsOpen(false);
              }}
              onKeyDown={(e) => handleOptionKeyDown(e, country)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-[#F0F0F0] focus:bg-[#F0F0F0] cursor-pointer transition-colors outline-none"
            >
              <img
                src={country.flag}
                alt=""
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
  );
};

const SignUp: FC = (): JSX.Element => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  // Store raw digits only; format for display is derived. This fixes the bug
  // where switching country re-formatted an already-formatted string.
  const [phoneDigits, setPhoneDigits] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const navigate = useNavigate();

  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);

  const phoneDisplay = applyFormat(phoneDigits, selectedCountry.format);

  const markTouched = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = onlyDigits(e.target.value).slice(
      0,
      selectedCountry.maxDigits,
    );
    setPhoneDigits(digits);
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    // Re-format against the same underlying digits, not the display string —
    // no double-formatting, no drift.
    setPhoneDigits((prev) => prev.slice(0, country.maxDigits));
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};

    if (!firstName.trim()) next.firstName = "First name is required.";
    if (!lastName.trim()) next.lastName = "Last name is required.";

    if (!email.trim()) {
      next.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(email.trim())) {
      next.email = "Enter a valid email address.";
    }

    if (!phoneDigits) {
      next.phoneNumber = "Phone number is required.";
    } else if (phoneDigits.length < selectedCountry.maxDigits) {
      next.phoneNumber = `Enter a full ${selectedCountry.maxDigits}-digit number.`;
    }

    if (!password) {
      next.password = "Password is required.";
    } else if (password.length < 8 || password.length > 72) {
      next.password = "Password must be between 8 and 72 characters.";
    } else if (!/[a-z]/.test(password)) {
      next.password = "Password must contain a lowercase letter.";
    } else if (!/[A-Z]/.test(password)) {
      next.password = "Password must contain an uppercase letter.";
    } else if (!/\d/.test(password)) {
      next.password = "Password must contain a number.";
    }

    if (!confirmPassword) {
      next.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      next.confirmPassword = "Passwords do not match.";
    }

    return next;
  };

  // Live-validate only fields the user has already interacted with, so
  // errors don't appear before someone has had a chance to type.
  useEffect(() => {
    setErrors(validate());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    firstName,
    lastName,
    email,
    phoneDigits,
    password,
    confirmPassword,
    selectedCountry,
  ]);

  const isFormValid = Object.keys(validate()).length === 0;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentErrors = validate();
    setErrors(currentErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phoneNumber: true,
      password: true,
      confirmPassword: true,
    });

    if (Object.keys(currentErrors).length > 0) return;

    setLoading(true);
    setErrorMessage("");

    const fullPhoneNumber = `${selectedCountry.code}${phoneDigits}`;

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Backend expects a single "name" field and "phone" (not
          // "phoneNumber") — see auth.validator.js / auth.routes.js.
          name: `${firstName.trim()} ${lastName.trim()}`.trim(),
          email,
          phone: fullPhoneNumber,
          password,
        }),
      });

      // Parse JSON defensively — a non-JSON error response (e.g. a 502 HTML
      // page) shouldn't throw an unhandled exception here.
      let data: any = null;
      try {
        data = await response.json();
      } catch {
        throw new Error(
          "Unexpected response from the server. Please try again.",
        );
      }

      if (!response.ok || data?.success === false) {
        let details = "";
        if (Array.isArray(data?.errors)) {
          details = data.errors
            .map((err: any) => err.msg || err.message)
            .join(" | ");
        } else if (typeof data?.errors === "object" && data?.errors !== null) {
          details = Object.values(data.errors).join(" | ");
        }

        throw new Error(
          details ||
            data?.message ||
            "Registration failed. Please check your inputs.",
        );
      }

      // NOTE: storing the auth token in localStorage is vulnerable to XSS
      // token theft. The correct long-term fix is for the backend to set an
      // httpOnly, Secure cookie on this response instead of returning the
      // token in the JSON body — that can't be done from the client alone.
      // Keeping this as a stopgap until the backend supports that.
      // Confirmed shape from auth.service.js: { success, message, data: { user, token } }.
      const token = data?.data?.token;
      if (token) {
        localStorage.setItem("authToken", token);
      }

      navigate("/verify");
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

  const fieldError = (field: keyof FormErrors) =>
    touched[field] && errors[field] ? errors[field] : undefined;

  const inputClass = (field: keyof FormErrors, extra = "") =>
    `w-full h-12 rounded-[10px] border outline-none px-3 text-black ${
      fieldError(field)
        ? "border-red-500 focus:border-red-500"
        : "border-[#757575]"
    } ${extra}`;

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-[350px] sm:max-w-md flex flex-col items-center">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center text-center">
          <img src={chuks} alt="Company logo" />
          <p className="font-semibold text-[24px] text-[#333333] mt-2">
            Create Account
          </p>
        </div>

        <div className="flex items-center justify-center w-full mt-3 gap-1.5 text-center flex-wrap">
          <p className="font-normal text-[12px] text-[#333333]">
            Join us and enjoy your favorite meals 🍔
          </p>
        </div>

        {/* Error Alert Display */}
        {errorMessage && (
          <div
            role="alert"
            className="w-full mt-4 p-3 bg-red-100 border border-red-400 text-red-700 text-xs rounded-[10px] text-center"
          >
            {errorMessage}
          </div>
        )}

        {/* Form Container */}
        <form
          className="w-full mt-6 flex flex-col items-center"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* First Name & Last Name */}
          <div className="flex gap-4 sm:gap-5.25 w-full justify-center">
            <div className="flex-1 max-w-[165px]">
              <label
                htmlFor="firstName"
                className="text-[#333333] text-[16px] font-medium block"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={() => markTouched("firstName")}
                required
                aria-invalid={!!fieldError("firstName")}
                aria-describedby={
                  fieldError("firstName") ? "firstName-error" : undefined
                }
                className={inputClass("firstName", "mt-2")}
              />
              {fieldError("firstName") && (
                <p
                  id="firstName-error"
                  className="text-red-600 text-[11px] mt-1"
                >
                  {errors.firstName}
                </p>
              )}
            </div>

            <div className="flex-1 max-w-[165px]">
              <label
                htmlFor="lastName"
                className="text-[#333333] text-[16px] font-medium block"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={() => markTouched("lastName")}
                required
                aria-invalid={!!fieldError("lastName")}
                aria-describedby={
                  fieldError("lastName") ? "lastName-error" : undefined
                }
                className={inputClass("lastName", "mt-2")}
              />
              {fieldError("lastName") && (
                <p
                  id="lastName-error"
                  className="text-red-600 text-[11px] mt-1"
                >
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-2 w-full mt-3">
            <label
              htmlFor="email"
              className="font-medium text-[16px] text-[#333333]"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => markTouched("email")}
              placeholder="example@email.com"
              required
              aria-invalid={!!fieldError("email")}
              aria-describedby={fieldError("email") ? "email-error" : undefined}
              className={inputClass("email")}
            />
            {fieldError("email") && (
              <p id="email-error" className="text-red-600 text-[11px] -mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-2 w-full mt-3">
            <label
              htmlFor="phoneNumber"
              className="font-medium text-[16px] text-[#333333]"
            >
              Phone Number
            </label>
            <div className="relative w-full">
              <input
                id="phoneNumber"
                type="tel"
                value={phoneDisplay}
                onChange={handlePhoneChange}
                onBlur={() => markTouched("phoneNumber")}
                placeholder={selectedCountry.placeholder}
                aria-invalid={!!fieldError("phoneNumber")}
                aria-describedby={
                  fieldError("phoneNumber") ? "phone-error" : undefined
                }
                className={inputClass("phoneNumber", "pl-28 pr-4")}
              />

              <CountryDropdown
                countries={countries}
                selected={selectedCountry}
                onSelect={handleCountrySelect}
              />
            </div>
            {fieldError("phoneNumber") ? (
              <p id="phone-error" className="text-red-600 text-[11px]">
                {errors.phoneNumber}
              </p>
            ) : (
              <p className="text-[#757575] text-[12px]">
                We will send a verification code
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2 w-full mt-3">
            <label
              htmlFor="password"
              className="font-medium text-[16px] text-[#333333]"
            >
              Password
            </label>
            <div className="relative w-full">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => markTouched("password")}
                maxLength={72}
                aria-invalid={!!fieldError("password")}
                aria-describedby="password-hint"
                className={inputClass("password", "pl-3 pr-12")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#757575] text-xl cursor-pointer"
              >
                {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
              </button>
            </div>
            <p
              id="password-hint"
              className={`font-normal text-[12px] ${
                fieldError("password") ? "text-red-600" : "text-[#757575]"
              }`}
            >
              {fieldError("password") ??
                "8-72 characters, with a lowercase letter, an uppercase letter, and a number"}
            </p>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2 w-full mt-3">
            <label
              htmlFor="confirmPassword"
              className="font-medium text-[16px] text-[#333333]"
            >
              Confirm Password
            </label>
            <div className="relative w-full">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => markTouched("confirmPassword")}
                aria-invalid={!!fieldError("confirmPassword")}
                aria-describedby={
                  fieldError("confirmPassword") ? "confirm-error" : undefined
                }
                className={inputClass("confirmPassword", "pl-3 pr-12")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                aria-pressed={showConfirmPassword}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#757575] text-xl cursor-pointer"
              >
                {showConfirmPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
              </button>
            </div>
            {fieldError("confirmPassword") && (
              <p id="confirm-error" className="text-red-600 text-[11px]">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button — inline spinner instead of replacing the whole page */}
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className={`w-full py-3.5 px-4 mt-6 text-[#ffffff] font-medium text-[14px] rounded-[10px] transition flex items-center justify-center gap-2 ${
              isFormValid && !loading
                ? "bg-[#FF6B35] hover:bg-[#d44e0a] cursor-pointer"
                : "bg-[#EC5B0C] opacity-50 cursor-not-allowed"
            }`}
          >
            {loading && (
              <span
                className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"
                aria-hidden="true"
              />
            )}
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Terms */}
        <p className="text-[12px] text-[#000000] text-center mt-3 px-2">
          By clicking "Continue" you certify that you agree to our{" "}
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
            role="button"
            tabIndex={0}
            onClick={() => navigate("/login")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") navigate("/login");
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
