import { IoArrowBack } from "react-icons/io5";
import { HiOutlineCreditCard } from "react-icons/hi";
import { MdOutlineCircle } from "react-icons/md";
import colored from "../../assets/colored circle.svg";
import { BsPhone } from "react-icons/bs";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BsPatchCheckFill, BsPatchCheck } from "react-icons/bs";

const Payment = () => {
  const [selectedPayment, setSelectedPayment] = useState(1);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [, setIsOrderConfirmed] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);
  const [isChecked] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const paymentMethods = [
    { id: 1, label: "Card", icon: HiOutlineCreditCard, clickable: true },
    { id: 2, label: "Bank", icon: HiOutlineBuildingLibrary, clickable: false },
    { id: 3, label: "USSD", icon: BsPhone, clickable: false },
  ];

  const [isConfirmingPayment, setIsConfirmingPayment] = useState(() => {
    return sessionStorage.getItem("isConfirmingPayment") === "true";
  });

  const updateIsConfirmingPayment = (value: boolean) => {
    setIsConfirmingPayment(value);
    sessionStorage.setItem("isConfirmingPayment", String(value));
  };

  // Card number: digits only, formatted in groups of 4, max 16 digits
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = digitsOnly.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  // Expiry: digits only, auto-inserts "/" after MM, max MM/YY format
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 4);
    let formatted = digitsOnly;
    if (digitsOnly.length >= 3) {
      formatted = `${digitsOnly.slice(0, 2)} / ${digitsOnly.slice(2)}`;
    }
    setCardExpiry(formatted);
  };

  // CVV: digits only, max 3 digits
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCvv(digitsOnly);
  };

  const handlePayment = () => {
    updateIsConfirmingPayment(false);
    setIsOrderConfirmed(true);
  };

  // Clears any leftover view flags from session storage so Home loads on the main screen
  const handleGoHome = () => {
    sessionStorage.removeItem("addToCart");
    sessionStorage.removeItem("showMealDetail");
    navigate("/home");
  };

  const total = localStorage.getItem("orderTotal") || undefined;
  const displayAmount = total ? (parseFloat(total) + 2).toFixed(2) : "40.00";

  if (isPaymentSuccessful) {
    return (
      <div className="w-full min-h-dvh flex flex-col items-center justify-center max-w-md mx-auto px-6 text-center bg-white animate-fade-scale-in mt-40">
        <div className="mb-6 -mt-2">
          {isChecked ? (
            <BsPatchCheckFill
              key="checked"
              className="w-16 h-16 text-[#FF6B35] animate-toggle-check"
            />
          ) : (
            <BsPatchCheck className="w-16 h-16 text-[#FF6B35]" />
          )}
        </div>

        <div className="mt-30">
          <div className="mt-18">
            <h1 className="font-semibold text-[#FF6B35] text-[20px] mb-2">
              Payment Successful
            </h1>
            <p className="text-[#757575] text-sm">
              Your payment of ${displayAmount} has been processed successfully
            </p>
          </div>

          <div className="-mt-10">
            <button
              type="button"
              onClick={handleGoHome}
              className="w-full max-w-87.5 bg-[#FF6B35] text-white h-12 rounded-[10px] font-semibold text-[12px] py-3.5 px-4 mt-20 cursor-pointer"
            >
              Track Order
            </button>

            <button
              type="button"
              onClick={handleGoHome}
              className="flex w-full max-w-87.5 font-semibold border border-[#FF6B35] text-black items-center justify-center gap-2.5 h-12 rounded-[10px] text-[12px] mt-6 mx-auto cursor-pointer"
            >
              <IoArrowBack className="w-[13.34px] h-[15.96px]" />
              <span>Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isConfirmingPayment) {
    const isCardNumberValid = cardNumber.replace(/\s/g, "").length === 16;
    const isExpiryValid = cardExpiry.length === 7; // "MM / YY"
    const isCvvValid = cvv.length === 3;
    const isFormValid = isCardNumberValid && isExpiryValid && isCvvValid;

    return (
      <div className="w-full max-w-md mx-auto p-4 sm:p-8">
        <button
          type="button"
          onClick={() => updateIsConfirmingPayment(false)}
          className="flex gap-18 items-center cursor-pointer"
        >
          <IoArrowBack className="mt-3.5 shrink-0" />
          <p className="font-semibold text-[17px] text-black ml-3 mt-4">
            Pay Online
          </p>
        </button>

        <h1 className="font-medium text-[#757575] text-[16px] mt-8 justify-center text-center">
          Enter your card details to pay
        </h1>

        <div className="w-full border border-[#75757550] rounded-[10px] px-4 py-2.5 mt-10">
          <label
            htmlFor="cardNumber"
            className="text-[8px] font-medium text-[#757575] block uppercase mt-1"
          >
            Card Number
          </label>
          <input
            id="cardNumber"
            type="text"
            inputMode="numeric"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            className="w-full max-w-87.25 text-[8px] mt-1.5 text-[#333333] placeholder:text-[#B0B0B0] outline-none border-none p-0 bg-transparent"
          />
        </div>

        <div className="flex gap-4 mt-2">
          <div className="flex-1 border border-[#75757550] rounded-[10px] px-4 py-2.5 h-13 min-w-0">
            <label
              htmlFor="cardExpiry"
              className="text-[8px] font-medium text-[#757575] block uppercase"
            >
              Card Expiry
            </label>
            <input
              id="cardExpiry"
              type="text"
              inputMode="numeric"
              value={cardExpiry}
              onChange={handleExpiryChange}
              placeholder="MM / YY"
              maxLength={7}
              className="w-full text-[8px] text-[#333333] placeholder:text-[#B0B0B0] uppercase outline-none border-none p-0 bg-transparent"
            />
          </div>

          <div className="flex-1 border border-[#75757550] rounded-[10px] px-1 py-3.5 h-13 min-w-0">
            <label
              htmlFor="cvv"
              className="text-[8px] font-medium text-[#757575] block ml-3 -mt-1 uppercase"
            >
              CVV
            </label>
            <input
              id="cvv"
              type="text"
              inputMode="numeric"
              value={cvv}
              onChange={handleCvvChange}
              placeholder="123"
              maxLength={3}
              className="w-full text-[8px] ml-3 text-[#333333] placeholder:text-[#B0B0B0] outline-none border-none p-0 bg-transparent"
            />
          </div>
        </div>

        <button
          type="button"
          disabled={!isFormValid}
          onClick={() => {
            setIsPaymentSuccessful(true);
          }}
          className={`w-full max-w-87.9 py-3.5 px-4 mx-auto flex items-center justify-center gap-2 font-semibold text-[12px] rounded-[10px] mt-10 transition ${
            isFormValid
              ? "bg-[#FF6B35] text-white cursor-pointer active:scale-[0.98]"
              : "bg-[#FF6B35]/40 text-white/70 cursor-not-allowed"
          }`}
        >
          <span>Pay</span>
          <span>${displayAmount}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex gap-18">
        <button
          type="button"
          onClick={() =>
            navigate("/home", { state: { showCart: true, total } })
          }
          className="mt-1.5 cursor-pointer"
        >
          <IoArrowBack />
        </button>

        <p className="font-semibold text-[17px] text-black ml-3">Pay Online</p>
      </div>

      <p className="font-medium text-[12px] text-[#757575] mt-6">
        How would you like to pay?
      </p>

      <div className="rounded-[10px] py-4.5 px-5 max-w-87.75 mt-8 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.15)] bg-[#FBF5F3]">
        {paymentMethods.map((method, index) => {
          const Icon = method.icon;
          const isSelected = selectedPayment === method.id;

          return (
            <button
              key={method.id}
              type="button"
              disabled={!method.clickable}
              onClick={() => method.clickable && setSelectedPayment(method.id)}
              className={`flex items-center justify-between w-full ${
                index === 0 ? "" : "mt-8"
              } ${
                method.clickable
                  ? "cursor-pointer"
                  : "opacity-40 cursor-not-allowed"
              }`}
            >
              <div className="flex gap-6.5 items-center">
                <Icon className="text-[#FF6B35] w-5 h-5" />
                <div className="flex items-center gap-2">
                  <p className="font-medium text-[12px] text-black">
                    {method.label}
                  </p>
                  {!method.clickable && (
                    <span className="text-[9px] font-normal text-[#757575]">
                      (coming soon)
                    </span>
                  )}
                </div>
              </div>

              {isSelected ? (
                <img src={colored} alt="Selected" className="w-3.75 h-3.75" />
              ) : (
                <MdOutlineCircle className="w-3.75 h-3.75 text-[#757575]" />
              )}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setIsConfirmingPayment(true)}
        className="w-full max-w-87.25 py-3.5 px-4 mt-6 text-white mx-auto bg-[#FF6B35] font-semibold text-sm rounded-[10px] 
        shadow-sm active:scale-[0.98] cursor-pointer transition"
      >
        Continue
      </button>
    </div>
  );
};

export default Payment;
