import { useState, type FC, type FormEvent } from "react";
import chuks from "../../assets/chukss.svg";
import { HiOutlineLockClosed } from "react-icons/hi2";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FaApple } from "react-icons/fa";
import g from "../../assets/google.svg";
import { useNavigate } from "react-router-dom";

// Same env-based base URL as SignUp.tsx — add VITE_API_URL to your .env.
const API_URL =
  import.meta.env.VITE_API_URL ?? "https://linkedin-guy-backend.onrender.com";
const LOGIN_ENDPOINT = `${API_URL}/api/auth/login`;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormErrors {
  email?: string;
  password?: string;
}

const Login: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const navigate = useNavigate();

  const markTouched = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const validate = (): FormErrors => {
    const next: FormErrors = {};

    if (!email.trim()) {
      next.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(email.trim())) {
      next.email = "Please provide a valid email address.";
    }

    if (!password) {
      next.password = "Password is required.";
    }

    return next;
  };

  const isFormValid = Object.keys(validate()).length === 0;

  const fieldError = (field: keyof FormErrors) =>
    touched[field] && errors[field] ? errors[field] : undefined;

  const inputClass = (field: keyof FormErrors, extra = "") =>
    `w-full h-12 rounded-[10px] border outline-none text-black ${
      fieldError(field)
        ? "border-red-500 focus:border-red-500"
        : "border-[1.5px] border-[#757575]"
    } ${extra}`;

  const handleContinue = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const currentErrors = validate();
    setErrors(currentErrors);
    setTouched({ email: true, password: true });

    if (Object.keys(currentErrors).length > 0 || loading) return;

    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

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
            .map((err: any) => err.message || err.msg)
            .join(" | ");
        } else if (typeof data?.errors === "object" && data?.errors !== null) {
          details = Object.values(data.errors).join(" | ");
        }

        throw new Error(
          details ||
            data?.message ||
            "Login failed. Please check your details and try again.",
        );
      }

      // Confirmed shape from auth.service.js: { success, message, data: { user, token } }.
      // NOTE: same localStorage caveat as SignUp — an httpOnly cookie set by
      // the backend would be safer against XSS; keeping this as a stopgap.
      const token = data?.data?.token;
      if (token) {
        localStorage.setItem("authToken", token);
      }
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email.trim().toLowerCase());
      }

      navigate("/welcome");
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-[350px] sm:max-w-md flex flex-col items-center">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center text-center mt-6">
          <img src={chuks} alt="Company logo" />
          <p className="font-semibold text-[24px] text-[#333333] mt-2">
            Sign In
          </p>
        </div>

        <div className="flex items-center justify-center w-full mt-3 gap-1.5 text-center flex-wrap">
          <p className="font-normal text-[12px] text-[#333333]">
            Welcome Back 👋
          </p>
          <p className="font-normal text-[12px] text-[#333333]">
            Let's get your craving started
          </p>
        </div>

        {/* Form Container */}
        <form
          className="w-full mt-6 flex flex-col items-center"
          onSubmit={handleContinue}
          noValidate
        >
          {/* Email */}
          <div className="flex flex-col gap-2 w-full">
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
              aria-invalid={!!fieldError("email")}
              aria-describedby={fieldError("email") ? "email-error" : undefined}
              className={inputClass("email", "px-3")}
            />
            {fieldError("email") && (
              <p id="email-error" className="text-red-600 text-[11px]">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Input Group */}
          <div className="flex flex-col gap-2 w-full mt-4">
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
                aria-invalid={!!fieldError("password")}
                aria-describedby={
                  fieldError("password") ? "password-error" : undefined
                }
                className={inputClass("password", "pl-10 pr-12")}
              />
              <HiOutlineLockClosed
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#757575] text-lg pointer-events-none"
                aria-hidden="true"
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
            {fieldError("password") && (
              <p id="password-error" className="text-red-600 text-[11px]">
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center w-full mt-3">
            <div className="flex gap-1.5 items-center select-none">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4.5 h-4 text-[#FF6B35] accent-[#FF6B35] rounded cursor-pointer"
              />
              <label
                htmlFor="rememberMe"
                className="text-[12px] font-medium text-[#333333] cursor-pointer"
              >
                Remember me
              </label>
            </div>
            <button
              type="button"
              className="text-[12px] font-semibold text-[#FF6B35] cursor-pointer bg-transparent"
            >
              Forgot Password?
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p
              role="alert"
              className="text-[12px] text-red-500 font-medium w-full mt-3 text-center"
            >
              {errorMessage}
            </p>
          )}

          {/* Submit Button — inline spinner instead of replacing the whole page */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
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
            {loading ? "Signing in..." : "Continue"}
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

        {/* Divider */}
        <div className="flex items-center gap-4 w-full mt-6">
          <hr className="flex-1 border-t border-[#FF6B35]" />
          <span className="font-normal text-[16px] text-[#000000]">Or</span>
          <hr className="flex-1 border-t border-[#FF6B35]" />
        </div>

        {/* Social Buttons */}
        <div className="flex items-center justify-center gap-4 w-full mt-4">
          <button
            type="button"
            className="bg-black text-white p-2.5 h-11 rounded-[5px] gap-2 flex items-center justify-center flex-1 max-w-[140px]"
          >
            <FaApple className="w-[20px] h-[20px]" />
            <span className="font-medium text-[16px]">Apple</span>
          </button>

          <button
            type="button"
            className="bg-[#F0F0F0] p-2.5 h-11 rounded-[5px] gap-2 flex items-center justify-center flex-1 max-w-[140px]"
          >
            <img src={g} alt="" className="w-5 h-5" />
            <span className="font-medium text-[16px] text-[#333333]">
              Google
            </span>
          </button>
        </div>
      </div>

      <p className="text-[16px] font-normal text-black mt-12 text-center">
        New User?{" "}
        <span
          role="button"
          tabIndex={0}
          onClick={() => navigate("/signup")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") navigate("/signup");
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
