import pin from "../../assets/pin.svg";
import drp from "../../assets/dropdown.svg";
import cart from "../../assets/cart.svg";
import { IoSearchSharp } from "react-icons/io5";
import fil from "../../assets/filter.svg";
import rice from "../../assets/rice.svg";
import ofada from "../../assets/ofada.svg";
import rice2 from "../../assets/rice 2.svg";
import rice3 from "../../assets/rice33.jpg";
import burger from "../../assets/burger.svg";
import seun from "../../assets/seun.svg";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import bike from "../../assets/bike.svg";
import { RiCheckboxCircleFill } from "react-icons/ri";
import love from "../../assets/love.svg";
import { IoMdStar } from "react-icons/io";
import { useEffect, useState } from "react";
import chips from "../../assets/chips.jpg";
import guy from "../../assets/guy.svg";
import pizza from "../../assets/pizza.png";
import { useFooter } from "../../context/FooterContext";
import pizzaa from "../../assets/big pizza.jpg";
import { IoArrowBack } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import { AiOutlineClockCircle } from "react-icons/ai";
import circ from "../../assets/circle.svg";
import waffles from "../../assets/waffles.svg";
import { FaRegCircle } from "react-icons/fa";
import minus from "../../assets/minus.svg";
import plus from "../../assets/plus.svg";
import { TbShoppingBag } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import { HiPlusCircle } from "react-icons/hi";
import { IoIosArrowForward } from "react-icons/io";
import jug from "../../assets/jug.svg";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

// Detects whether this page load was an actual browser REFRESH
// (in which case we should restore sessionStorage state) vs. a fresh
// in-app navigation (e.g. clicking "Home" in the footer, or the
// "Home"/"Track Order" buttons on the Payment success screen), in
// which case we should reset to the real home screen instead of
// restoring old state.
//
// React Router's client-side navigate() does NOT create a new
// "reload"-type navigation entry — only an actual F5 / browser
// refresh does. So this check is reliable for distinguishing the two.
const isPageReload = () => {
  const navEntries = performance.getEntriesByType(
    "navigation",
  ) as PerformanceNavigationTiming[];
  if (navEntries.length > 0) {
    return navEntries[0].type === "reload";
  }
  return false;
};

const Home = () => {
  const categories = [
    { id: 1, name: "Breakfast", active: true },
    { id: 2, name: "Chicken", active: false },
    { id: 3, name: "Rice", active: false },
  ];

  const location = useLocation();

  const [addToCart, setShowAddToCart] = useState(() => {
    const fromRoute =
      (location.state as { showCart?: boolean })?.showCart === true;
    const fromStorage =
      isPageReload() && sessionStorage.getItem("addToCart") === "true";
    return fromRoute || fromStorage;
  });

  const updateShowAddToCart = (value: boolean) => {
    setShowAddToCart(value);
    sessionStorage.setItem("addToCart", String(value));
  };

  const [showMealDetail, setShowMealDetail] = useState(() => {
    return (
      isPageReload() && sessionStorage.getItem("showMealDetail") === "true"
    );
  });

  const updateShowMealDetail = (value: boolean) => {
    setShowMealDetail(value);
    sessionStorage.setItem("showMealDetail", String(value));
  };

  const [quantity, setQuantity] = useState(1);
  const { setHideFooter } = useFooter();
  useEffect(() => {
    setHideFooter(showMealDetail);

    // Reset footer visibility when leaving this page
    return () => setHideFooter(false);
  }, [showMealDetail, setHideFooter]);

  const [deliveryAddress] = useState(() => {
    return localStorage.getItem("deliveryAddress") || "4 Cobham Street, Ajao";
  });

  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);
  const [networkError, setNetworkError] = useState("");
  const [showCheckoutSheet, setShowCheckoutSheet] = useState(false);
  const navigate = useNavigate();

  const basePrice = 28.0;

  // Cart starts genuinely empty — base count is 0, and only grows
  // when the user actually adds something from the meal detail screen.
  // Persisted to sessionStorage so a refresh (not a fresh nav) keeps it.
  const [cartItem, setCartItem] = useState<
    {
      id: number;
      name: string;
      subtitle: string;
      price: number;
      quantity: number;
      image: string;
    }[]
  >(() => {
    if (!isPageReload()) return [];
    const saved = sessionStorage.getItem("cartItem");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    sessionStorage.setItem("cartItem", JSON.stringify(cartItem));
  }, [cartItem]);

  const handleIncrease = (id: number) => {
    setCartItem((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const handleDecrease = (id: number) => {
    setCartItem((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  };

  // Overall cart total — sums each item's price × quantity.
  // This is the SINGLE source of truth for every total shown
  // across the cart screen, checkout sheet, and payment screen.
  const cartTotal = cartItem
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  // Total quantity of items currently in the cart — starts at 0,
  // increments as real items are added. Used for the header badge.
  const cartCount = cartItem.reduce((sum, item) => sum + item.quantity, 0);

  const handleConfirmOrder = () => {
    if (!navigator.onLine) {
      setNetworkError(
        "No internet connection. Please check your network and try again.",
      );
      return;
    }

    setNetworkError("");
    setIsConfirmingOrder(true);

    setTimeout(() => {
      setIsConfirmingOrder(false);
      localStorage.setItem("orderTotal", cartTotal);
      navigate("/payment");
    }, 2000);
  };

  const handleDecreasee = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleIncreasee = () => {
    setQuantity((prev) => prev + 1);
  };

  // This is the exact amount shown on the meal detail screen.
  // It's also the exact amount that gets merged into the cart below —
  // so the two screens can never show mismatched numbers.
  const totalPrice = (basePrice * quantity).toFixed(2);

  // Adds the currently viewed meal (with its selected quantity) into
  // the cart. If it's already in the cart, quantities are summed
  // together instead of creating a duplicate row.
  const handleAddToCart = () => {
    setCartItem((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.name === "Chicken Supreme Pizza",
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      return [
        ...prev,
        {
          id: Date.now(),
          name: "Chicken Supreme Pizza",
          subtitle: "Defivet Supo",
          price: basePrice,
          quantity: quantity,
          image: pizzaa,
        },
      ];
    });

    updateShowAddToCart(true);
  };

  const promos = [
    {
      id: 1,
      bg: "bg-[#FF6B35]",
      heading: "Up to",
      highlight: "20%",
      highlightColor: "text-[#1E90FF]",
      suffix: "off",
      description: "On your first order",
      image: rice,
      imageAlt: "Rice dish",
    },
    {
      id: 2,
      bg: "bg-[#1E90FF]",
      heading: "Free delivery over",
      highlight: "₦5000",
      highlightColor: "text-white",
      suffix: "",
      description: "On your first order",
      image: rice,
      imageAlt: "Burger",
    },
    {
      id: 3,
      bg: "bg-[#E91E63]",
      heading: "Free delivery over",
      highlight: "₦5000",
      highlightColor: "text-white",
      suffix: "",
      description: "On your first order",
      image: rice,
      imageAlt: "Burger",
    },
  ];

  const foodCategories = [
    { id: 1, name: "Soup", image: rice2 },
    { id: 2, name: "Ofada", image: ofada },
    { id: 3, name: "Burger", image: ofada },
    { id: 4, name: "Burger", image: burger },
    { id: 5, name: "Rice", image: burger },
    { id: 6, name: "Ofada", image: rice2 },
    { id: 7, name: "Abasha", image: burger },
    { id: 8, name: "Abasha", image: burger },
    { id: 9, name: "Abasha", image: burger },
  ];

  const restaurants = [
    {
      id: 1,
      name: "Seun Kitchen",
      foodImage: rice3,
      profileImage: seun,
      rating: "4.5",
      reviewCount: "(25+)",
      deliveryTime: "10 - 15 mins",
    },
    {
      id: 2,
      name: "Chuks Kitchen",
      foodImage: chips,
      profileImage: guy,
      rating: "4.5",
      reviewCount: "(25+)",
      deliveryTime: "10 - 15 mins",
    },
    {
      id: 3,
      name: "Fruities",
      foodImage: rice3,
      profileImage: seun,
      rating: "4.5",
      reviewCount: "(25+)",
      deliveryTime: "10 - 15 mins",
    },
  ];

  const meals = [
    {
      id: 1,
      name: "Chicken Sauce Pizza",
      image: pizza,
      price: "$28.00",
      rating: "4.5",
      reviewCount: "(25+)",
      deliveryTime: "10 - 15 mins",
    },
    {
      id: 2,
      name: "Chicken Sauce Pizza",
      image: pizza,
      price: "$28.00",
      rating: "4.5",
      reviewCount: "(25+)",
      deliveryTime: "10 - 15 mins",
    },
    {
      id: 3,
      name: "Chicken Sauce Pizza",
      image: pizza,
      price: "$28.00",
      rating: "4.5",
      reviewCount: "(25+)",
      deliveryTime: "10 - 15 mins",
    },
  ];

  const [extras, setExtras] = useState([
    {
      id: 1,
      name: "Extra Mozarella",
      price: "+$2.00",
      image: waffles,
      selected: true,
    },
    {
      id: 2,
      name: "Stuffed Crust",
      price: "+$2.00",
      image: waffles,
      selected: false,
    },
    {
      id: 3,
      name: "Extra Toppings",
      price: "+$1.50",
      image: waffles,
      selected: false,
    },
  ]);

  const handleSelectExtra = (id: number) => {
    setExtras((prev) =>
      prev.map((extra) => ({
        ...extra,
        selected: extra.id === id,
      })),
    );
  };

  if (isConfirmingOrder) {
    return (
      <div className="w-full min-h-dvh flex items-center justify-center bg-white">
        <div
          className="w-10 h-10 border-4 border-[#FFD8C7] border-t-[#FF6B35] rounded-full animate-spin"
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (addToCart) {
    return (
      <div className="w-full min-h-dvh max-w-md mx-auto p-4 sm:p-8 mt-2 relative bg-white">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => {
              updateShowAddToCart(false);
              updateShowMealDetail(true);
            }}
          >
            <IoArrowBack className="text-[#FF6B35]" />
          </button>

          <p className="font-semibold text-[17px] text-[#000000]">Cart</p>

          <RiDeleteBin6Line className="text-[#FF6B35] mt-2" />
        </div>

        {/* Cart Item List */}
        <div className="flex flex-col gap-2.5">
          {cartItem.length === 0 ? (
            <p className="text-center text-[#757575] text-sm mt-10">
              Your cart is empty
            </p>
          ) : (
            cartItem.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center mt-6 sm:mt-10 gap-2"
              >
                <div className="gap-2.5 flex items-center min-w-0">
                  <img
                    src={item.image}
                    alt=""
                    className="w-12 h-12 sm:w-auto sm:h-auto object-cover rounded-md shrink-0"
                  />

                  <div className="flex flex-col min-w-0">
                    <h5 className="font-semibold text-[12px] text-black truncate">
                      {item.name}
                    </h5>
                    <p className="font-medium text-[#757575] text-[10px] mt-1 truncate">
                      {item.subtitle}
                    </p>
                    <p className="font-semibold text-[16px] text-[#333333] mt-1.5 truncate">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div
                  className="w-[81.42px] h-[33.62px] rounded-[10px] border-[0.38px] py-[7.64px] px-[15.28px] 
              flex gap-[7.64px] border-[#333333] items-center justify-center shrink-0"
                >
                  <button type="button" onClick={() => handleDecrease(item.id)}>
                    <img
                      src={minus}
                      alt="Decrease"
                      className="w-[18.34px] h-[18.34px]"
                    />
                  </button>
                  <p className="font-semibold text-[#333333] text-[12.23px]">
                    {item.quantity}
                  </p>
                  <button type="button" onClick={() => handleIncrease(item.id)}>
                    <img
                      src={plus}
                      alt="Increase"
                      className="w-[18.34px] h-[18.34px]"
                    />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add items link */}
        <button
          type="button"
          onClick={() => updateShowAddToCart(false)}
          className="flex text-[#FF6B35] mt-8 sm:mt-14 gap-2.5 justify-end mr-2 w-full"
        >
          <HiPlusCircle className="mt-0.5" />

          <p className="font-semibold text-[12px]">Add items</p>
        </button>

        {/* Promo Code Box */}
        <div className="flex justify-between items-center bg-[#F9E8E2] py-2.5 px-3.5 rounded-[10px] w-full h-12.5 mt-6">
          <div className="flex gap-3.75 items-center min-w-0">
            <img src={jug} alt="" className="shrink-0" />
            <p className="font-semibold text-[12px] text-black truncate">
              Add Promo Code
            </p>
          </div>

          <IoIosArrowForward className="text-[#757575] w-3 h-6 shrink-0" />
        </div>

        {/* Total Calculations */}
        <div className="flex flex-col mt-5 gap-1.75 p-2.5">
          <div className="flex justify-between font-medium text-[14px] text-[#757575]">
            <p>Subtotal</p>
            <p>${cartTotal}</p>
          </div>

          <div className="flex justify-between font-medium text-[14px] text-[#757575]">
            <p>Discount</p>
            <p>$0.00</p>
          </div>

          <div className="flex justify-between font-medium text-[14px] text-[#757575]">
            <p>Delivery</p>
            <p>$2.00</p>
          </div>

          <div className="flex justify-between font-medium text-[14px] text-[#757575]">
            <p className="font-semibold text-[18px] text-[#333333]">Total</p>
            <p className="font-semibold text-[18px] text-[#333333]">
              ${(parseFloat(cartTotal) + 2).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Checkout Action Button */}
        <div className="w-full mt-8 sm:mt-12">
          {networkError && (
            <p className="text-center text-red-500 text-xs mb-2">
              {networkError}
            </p>
          )}
          <button
            type="button"
            onClick={() => setShowCheckoutSheet(true)}
            className="w-full py-3.5 px-4 text-[#ffffff] bg-[#FF6B35] font-semibold text-[12px]
            rounded-[10px] transition duration-200 shadow-sm active:scale-[0.98] cursor-pointer"
          >
            Proceed to Checkout - ${(parseFloat(cartTotal) + 2).toFixed(2)}
          </button>
        </div>

        {/* Checkout Modal Sheet */}
        {showCheckoutSheet && (
          <div className="fixed inset-0 z-50 flex items-end justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowCheckoutSheet(false)}
            />

            <div className="relative w-full max-w-md bg-white rounded-t-[20px] p-6 animate-slide-up z-10">
              <div className="flex items-center gap-2.5 mb-5">
                <img src={pin} alt="" className="w-6 h-6 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-normal text-[#757575]">
                    Delivery To
                  </p>
                  <div className="flex items-center gap-1 min-w-0">
                    <p className="font-medium text-[10px] text-[#333333] truncate">
                      {deliveryAddress}
                    </p>
                    <img src={drp} alt="" className="w-3 h-3 shrink-0" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center py-3 border-t border-[#75757530]">
                <p className="font-medium text-[18px] text-[#757575]">
                  Estimated Total Cost
                </p>
                <p className="font-medium text-[18px] text-[#000000]">
                  ${(parseFloat(cartTotal) + 2).toFixed(2)}
                </p>
              </div>

              <div className="flex justify-between items-center py-3 border-t border-[#75757530]">
                <p className="font-medium text-[16px] text-[#757575]">
                  Payment Method
                </p>
                <IoIosArrowDown className="text-[#333333] w-4 h-4 shrink-0" />
              </div>

              <div className="flex justify-between items-center py-3 border-t border-[#75757530]">
                <p className="font-medium text-[16px] text-[#757575]">
                  Cash on Delivery
                </p>
                <IoIosArrowDown className="text-[#333333] w-4 h-4 shrink-0" />
              </div>

              <button
                type="button"
                onClick={handleConfirmOrder}
                className="w-full py-3.5 px-4 mt-6 text-white bg-[#FF6B35] font-semibold text-sm rounded-[10px] shadow-sm 
                active:scale-[0.98] cursor-pointer transition"
              >
                Confirm Order
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  //==========================================

  if (showMealDetail) {
    return (
      <div className="w-full h-dvh flex flex-col max-w-md mx-auto overflow-hidden bg-white relative">
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto pb-6 scrollbar-hide">
          {/* Hero Image Section */}
          <div className="relative w-full">
            <img
              src={pizzaa}
              alt="Chicken Supreme Pizza"
              className="w-full h-87.5 object-cover"
            />

            <button
              type="button"
              onClick={() => updateShowMealDetail(false)}
              className="absolute top-4 left-4 bg-black/40 hover:bg-black/60 rounded-full w-10 h-10 flex items-center justify-center transition cursor-pointer"
              aria-label="Go back"
            >
              <IoArrowBack className="w-5 h-5 text-[#FF6B35]" />
            </button>

            <button
              type="button"
              className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 rounded-full w-10 h-10 flex items-center justify-center transition cursor-pointer"
              aria-label="Add to favorites"
            >
              <IoMdHeartEmpty className="w-5 h-5 text-[#FF6B35]" />
            </button>

            {/* Pagination Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-white" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/50" />
            </div>
          </div>

          {/* Info Header */}
          <div className="flex flex-col p-4 gap-2">
            <h1 className="font-semibold text-lg sm:text-xl text-black">
              Chicken Supreme Pizza
            </h1>

            <div className="flex items-center gap-1.5 mt-0.5">
              <IoMdStar className="text-[#FFC107] w-4 h-4 shrink-0" />
              <p className="font-medium text-xs text-[#333333]">
                4.5{" "}
                <span className="font-medium text-[#757575] text-[10px]">
                  (120 reviews)
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 text-[#757575] text-xs mt-0.5">
              <div className="flex items-center gap-1">
                <AiOutlineClockCircle className="w-3.5 h-3.5 shrink-0" />
                <p className="font-normal">15-25 mins</p>
              </div>

              <span className="w-1 h-1 rounded-full bg-[#757575] shrink-0" />

              <p className="font-normal">$2 delivery</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E90FF] shrink-0" />
              <p className="font-normal text-xs text-[#757575]">
                Open Until 10:30pm
              </p>
            </div>

            <p className="text-[#FF6B35] text-xl font-semibold mt-1">
              ${totalPrice}
            </p>
          </div>

          {/* Description & Extras */}
          <div className="flex flex-col px-4 gap-3">
            <h2 className="font-semibold text-sm text-black">Description</h2>

            <p className="font-normal text-[#757575] text-xs sm:text-sm leading-relaxed w-full">
              A hot oven-baked pizza topped with our signature rich tomato
              sauce, stretchy mozzarella, and a hand crust baked to golden
              perfection.
            </p>

            <h3 className="font-semibold text-sm text-black mt-2">
              Add Extras
            </h3>

            <div className="flex flex-col gap-2.5 w-full">
              {extras.map((extra) => (
                <div
                  key={extra.id}
                  onClick={() => handleSelectExtra(extra.id)}
                  className={`w-full py-2.5 px-4  rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                    extra.selected
                      ? "bg-[#FFECE5]"
                      : "bg-white border border-[#FF6B35]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={extra.image}
                      alt={extra.name}
                      className="w-10 h-10 object-contain shrink-0"
                    />
                    <p className="font-semibold text-[14px] text-black">
                      {extra.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <p className="font-medium text-xs text-[#757575]">
                      {extra.price}
                    </p>
                    {extra.selected ? (
                      <img
                        src={circ}
                        alt="Selected"
                        className="w-4 h-4 shrink-0"
                      />
                    ) : (
                      <FaRegCircle className="w-4 h-4 text-gray-300 shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Responsive Pinned Bottom Bar */}
        <div className="w-full bg-white border-t border-gray-100 px-6.75 py-3 shrink-0 z-50">
          <div className="flex items-center justify-between gap-15 max-w-md mx-auto">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between h-11 w-32 px-3 rounded-xl border border-[#333333] shrink-0">
              <button
                type="button"
                onClick={handleDecreasee}
                className="p-1 active:scale-90 transition-transform"
                aria-label="Decrease quantity"
              >
                <img src={minus} alt="Decrease" className="w-6 h-6" />
              </button>
              <p className="font-semibold text-[#333333] text-[16px]">
                {quantity}
              </p>
              <button
                type="button"
                onClick={handleIncreasee}
                className="p-1 active:scale-90 transition-transform"
                aria-label="Increase quantity"
              >
                <img src={plus} alt="Increase" className="w-6 h-6" />
              </button>
            </div>

            {/* Add to Cart Button — now actually merges into the cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 bg-[#FF6B35] text-white h-11
rounded-xl cursor-pointer active:scale-[0.98] transition-transform text-[14px] font-semibold shadow-sm w-41"
            >
              <TbShoppingBag className="w-6 h-6" />
              <span>Add To Cart</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================================

  return (
    <header className="w-full max-w-md mx-auto mt-2">
      <div className="p-4">
        {/* Header Container */}
        <div className="flex items-center justify-between gap-3 w-full">
          {/* Left Section: Pin Icon & Location Details */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <img
              src={pin}
              alt="Location pin"
              className="w-7 h-7 object-contain shrink-0"
            />

            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-xs text-[#757575]  tracking-wide">
                Delivery To
              </span>
              <button
                type="button"
                className="flex items-center gap-1 cursor-pointer min-w-0 text-left focus:outline-none"
              >
                <span className="font-semibold text-xs sm:text-sm text-[#333333] truncate">
                  {deliveryAddress}
                </span>
                <img
                  src={drp}
                  alt="Select location"
                  className="w-3.5 h-3.5 object-contain shrink-0"
                />
              </button>
            </div>
          </div>

          {/* Right Section: Cart Icon with live count badge, starting at 0 */}
          <button
            type="button"
            onClick={() => updateShowAddToCart(true)}
            className="relative p-1 focus:outline-none shrink-0 cursor-pointer active:opacity-75 transition"
            aria-label="Shopping Cart"
          >
            <img
              src={cart}
              alt="Cart"
              className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
            />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF6B35] text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
      {/* Divider */}
      <div className="border-b border-[#75757580] w-full"></div>
      {/* Search Input Section */}
      <div className="w-full px-4 mt-3">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search for food...."
            className="w-full h-12 rounded-[7px] py-3.5 pl-11 pr-11 outline-none bg-[#FCF7F6] placeholder:text-[12px] font-normal"
          />
          <IoSearchSharp className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#757575] text-lg pointer-events-none" />
          <img
            src={fil}
            alt="Filter"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 object-contain cursor-pointer"
          />
        </div>
      </div>
      {/* Category Pills Section */}
      <div className="w-full px-4 mt-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((category) => (
            <p
              key={category.id}
              className={`py-1.5 px-3 rounded-[100px] font-medium text-[12px] text-center w-19.5 shrink-0 cursor-pointer ${
                category.active
                  ? "bg-[#FF6B35] text-white"
                  : "bg-white border border-[#757575] text-[#333333]"
              }`}
            >
              {category.name}
            </p>
          ))}
        </div>
      </div>
      <div className="flex overflow-x-auto gap-3 px-6 mt-4 -ml-2 snap-x snap-mandatory scrollbar-hide">
        {promos.map((promo) => (
          <div
            key={promo.id}
            className={`shrink-0 snap-center flex items-center justify-between rounded-[10px] ${promo.bg} shadow-[#00000033] max-w-77.25 w-[90%] p-3 h-32.75 overflow-hidden`}
          >
            <div className="flex flex-col justify-between h-full min-w-0">
              <div className="flex flex-col">
                <h2 className="text-white font-semibold text-[14px] whitespace-nowrap">
                  {promo.heading}
                </h2>
                <p className="text-white whitespace-nowrap">
                  <span
                    className={`${promo.highlightColor} font-semibold text-[24px]`}
                  >
                    {promo.highlight}
                  </span>
                  {promo.suffix && ` ${promo.suffix}`}
                </p>
                <p className="text-white font-semibold text-[12px] whitespace-nowrap">
                  {promo.description}
                </p>
              </div>

              <button className="bg-white py-0.75 px-2.5 w-21 h-6 rounded-[5px] font-medium text-[12px] text-[#333333] mt-1.5 whitespace-nowrap">
                Order Now
              </button>
            </div>

            <img
              src={promo.image}
              alt={promo.imageAlt}
              className="w-24 h-24 object-contain shrink-0"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between px-4 mt-4">
        <p className="font-semibold text-[14px] text-[#333333]">Categories</p>
        <p className="text-[#FF6B35] font-medium text-[14px]">See more</p>
      </div>
      <div className="flex overflow-x-auto gap-4 px-6 mt-4 -ml-2 scrollbar-hide">
        {foodCategories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col items-center shrink-0"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-14 h-14 rounded-full object-cover"
            />
            <p className="text-[10px] font-semibold text-[#333333] mt-1.5 whitespace-nowrap">
              {category.name}
            </p>
          </div>
        ))}
      </div>
      <div className="p-4 ml-1">
        <h1 className="font-semibold text-[#333333] text-[14px]">
          Popular Near You
        </h1>

        <div className="flex overflow-x-auto gap-4 px-6 -ml-6 scrollbar-hide">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="relative shrink-0">
              <img
                src={restaurant.foodImage}
                alt=""
                className="w-55.75 h-29.75 rounded-tr-[10px] rounded-tl-[10px] mt-3"
              />

              <div className="w-12.75 h-4.5 flex rounded-[10px] py-0.75 px-1.25 bg-white/20 backdrop-blur-[10px] gap-0.5 absolute top-6 left-4">
                <IoMdStar className="text-[#FFC107] w-2.5 h-2.5 mt-0" />

                <p className="font-medium text-[6px] text-white">
                  {" "}
                  <span className="font-medium text-[8px]">
                    {restaurant.rating}{" "}
                  </span>
                  {restaurant.reviewCount}
                </p>
              </div>

              <img src={love} alt="" className="absolute top-6 left-47.5" />

              <div className="flex gap-3.75 ml-2 mt-4">
                <img src={restaurant.profileImage} alt="" className="" />

                <div className="flex flex-col gap-0.75">
                  <div className="flex gap-0.75">
                    <p className="font-semibold text-[14px] text-black">
                      {restaurant.name}
                    </p>

                    <RiCheckboxCircleFill className="text-[#1E90FF] w-2.5 h-2.5 mt-1.5" />
                  </div>

                  <div className="flex gap-1.25">
                    <div className="flex gap-0.5">
                      <img src={bike} alt="" className="w-4 h-4" />

                      <p className="text-[#FF6B35] text-[6px] font-medium mt-1">
                        Free delivery
                      </p>
                    </div>

                    <div className="flex gap-0.75">
                      <MdOutlineAccessTimeFilled className="text-[#757575] mt-0.5 w-2.5 h-2.5" />

                      <p className="font-normal text-[#757575] text-[10px]">
                        {restaurant.deliveryTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 -ml-1.5">
        <h2 className="font-semibold text-[16px] text-black px-6">
          Meal Nearby
        </h2>

        <div className="flex overflow-x-auto gap-4 px-6 pt-1 mt-3 scrollbar-hide">
          {meals.map((meal) => {
            const isClickable = meal.id === 1;

            return (
              <div
                key={meal.id}
                onClick={
                  isClickable ? () => updateShowMealDetail(true) : undefined
                }
                className={`shrink-0 ${
                  isClickable
                    ? "cursor-pointer active:scale-[0.98] transition-transform"
                    : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={meal.image}
                    alt={meal.name}
                    className={`w-55.75 h-29.75 rounded-[10px] object-cover ${
                      isClickable ? "ring-2 ring-[#FF6B35]" : ""
                    }`}
                  />

                  <div className="absolute top-2 left-2 bg-white rounded-lg px-2 py-0.5">
                    <p className="font-semibold text-[12px] text-[#333333]">
                      {meal.price}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-white/80 rounded-full p-1.5"
                    aria-label="Add to favorites"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img src={love} className="w-3 h-3" />
                  </button>

                  {isClickable && (
                    <div className="absolute bottom-2 left-2 bg-[#FF6B35] rounded-md px-2 py-0.5">
                      <p className="font-medium text-[9px] text-white">
                        Tap to view
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2">
                  <p className="font-semibold text-[13px] text-black ml-2">
                    {meal.name}
                  </p>

                  <div className="flex items-center gap-0.5">
                    <IoMdStar className="text-[#FFC107] w-3 h-3" />
                    <p className="font-medium text-[11px] text-[#333333]">
                      {meal.rating}
                      <span className="text-[#757575]">
                        {" "}
                        {meal.reviewCount}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-0.75 mt-1 ml-2">
                  <MdOutlineAccessTimeFilled className="text-[#757575] w-3 h-3" />
                  <p className="font-normal text-[#757575] text-[11px]">
                    {meal.deliveryTime}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Home;
