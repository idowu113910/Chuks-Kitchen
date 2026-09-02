import { useNavigate } from "react-router-dom";
import back from "../../assets/back.svg";
import bike from "../../assets/bicycle.svg";
import srch from "../../assets/search.svg";
import loc from "../../assets/loc.svg";
import { useMemo, useState } from "react";

const locations = [
  {
    id: 1,
    name: "Ikeja City Mall",
    address: "Obafemi Awolowo Way, Ikeja, Lagos",
  },
  { id: 2, name: "Lekki Phase 1", address: "Admiralty Way, Lekki, Lagos" },
  {
    id: 3,
    name: "Victoria Island",
    address: "Ahmadu Bello Way, VI, Lagos",
  },
  {
    id: 4,
    name: "Surulere",
    address: "Adeniran Ogunsanya St, Surulere, Lagos",
  },
  { id: 5, name: "Ajah", address: "Addo Road, Ajah, Lagos" },
  { id: 6, name: "Yaba", address: "Herbert Macaulay Way, Yaba, Lagos" },
  { id: 7, name: "Ikoyi", address: "Bourdillon Road, Ikoyi, Lagos" },
  { id: 8, name: "Gbagada", address: "Gbagada Expressway, Gbagada, Lagos" },
];

const Map = () => {
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(() => {
    return sessionStorage.getItem("showMap") === "true";
  });
  const [isConfirmingLocation, setIsConfirmingLocation] = useState(false);

  const updateShowMap = (value: boolean) => {
    setShowMap(value);
    sessionStorage.setItem("showMap", String(value));
  };

  const [query, setQuery] = useState("");

  const filteredLocations = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();

    let results = locations;

    if (trimmedQuery) {
      results = locations.filter(
        (loc) =>
          loc.name.toLowerCase().includes(trimmedQuery) ||
          loc.address.toLowerCase().includes(trimmedQuery),
      );
    }

    return [...results].sort((a, b) => a.name.localeCompare(b.name));
  }, [query]);

  // Shared handler for BOTH selection paths:
  // 1. Clicking a location from the search results list
  // 2. Using "use your current location"
  const handleSelectLocation = (name: string) => {
    setQuery(name);

    setTimeout(() => {
      setIsConfirmingLocation(true);

      setTimeout(() => {
        localStorage.setItem("deliveryAddress", name);
        navigate("/home");
      }, 2000);
    }, 600);
  };

  //============================================================
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                "Accept-Language": "en",
              },
            },
          );

          if (!response.ok) {
            throw new Error("Failed to fetch address");
          }

          const data = await response.json();
          const address = data.display_name || `${latitude}, ${longitude}`;

          setIsLocating(false);
          // Route through the SAME shared handler used by the search results list
          handleSelectLocation(address);
        } catch (err) {
          console.error("Reverse geocoding error:", err);
          setLocationError("Could not determine your address");
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location access was denied");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information unavailable");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out");
            break;
          default:
            setLocationError("An unknown error occurred");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  // Loading / Confirming Location View
  if (isConfirmingLocation) {
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

  // Address Selection View
  if (showMap) {
    return (
      <div className="w-full min-h-dvh flex flex-col px-4 sm:px-6 py-6 max-w-md mx-auto">
        {/* Header Navigation */}
        <div className="flex items-center gap-4 mt-2">
          <button
            type="button"
            onClick={() => updateShowMap(false)}
            className="p-1 focus:outline-none rounded-lg active:bg-gray-100 transition cursor-pointer"
            aria-label="Go back"
          >
            <img
              src={back}
              alt="Back"
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
            />
          </button>

          <h2 className="font-semibold text-base sm:text-lg text-black">
            Delivery address
          </h2>
        </div>

        {/* Search Input Container */}
        <div className="w-full">
          <div className="relative w-full mt-6">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter a new address"
              className="w-full h-12 border border-[#757575] rounded-[10px] py-3.5 pl-10 pr-4 text-sm text-[#333333] placeholder:text-xs placeholder:text-[#757575] outline-none focus:border-[#FF6B35] transition"
            />
            <img
              src={srch}
              alt="Search icon"
              className="absolute top-1/2 -translate-y-1/2 left-3.5 w-4 h-4 object-contain pointer-events-none"
            />
          </div>

          {/* Results list */}
          <div className="mt-3 max-h-72 overflow-y-auto">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleSelectLocation(loc.name)}
                  className="w-full text-left py-3 px-2 border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <p className="text-sm font-medium text-[#333333]">
                    {loc.name}
                  </p>
                  <p className="text-xs text-[#757575]">{loc.address}</p>
                </button>
              ))
            ) : (
              <p className="text-xs text-[#757575] text-center py-4">
                No matching addresses found
              </p>
            )}
          </div>
        </div>

        {/* Use Current Location Action */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="flex items-center gap-3.5 mt-6 px-1 py-2 text-left cursor-pointer active:opacity-75 transition disabled:opacity-50"
        >
          <img
            src={loc}
            alt="Location icon"
            className="w-5 h-5 object-contain flex-shrink-0"
          />
          <p className="font-normal text-base sm:text-lg text-black">
            {isLocating
              ? "Getting your location..."
              : "Use your current location"}
          </p>
        </button>

        {locationError && (
          <p className="text-xs text-red-500 mt-2">{locationError}</p>
        )}
      </div>
    );
  }

  // Initial Location Prompt View
  return (
    <div className="w-full min-h-dvh flex flex-col justify-between items-center px-4 sm:px-6 py-8 max-w-md mx-auto">
      {/* Spacer to push content to middle */}
      <div className="hidden sm:block" />

      {/* Main Content Area */}
      <div className="flex flex-col items-center w-full my-auto">
        {/* Bicycle Hero Graphic */}
        <img src={bike} alt="Bicycle illustration" className="" />

        {/* Text Container */}
        <div className="flex flex-col items-center text-center mt-6 sm:mt-8 w-full">
          <h1 className="font-semibold text-black text-xl sm:text-2xl">
            Find food near you
          </h1>
          <p className="font-medium text-sm sm:text-base text-[#757575] px-4 sm:px-8 mt-2 leading-relaxed max-w-xs">
            We need your location to show restaurants and deliver faster
          </p>
        </div>

        {/* Action Button */}
        <div className="w-full max-w-[320px] sm:max-w-full mt-6 sm:mt-8">
          <button
            type="button"
            onClick={() => updateShowMap(true)}
            className="w-full py-3.5 px-4 text-[#ffffff] bg-[#FF6B35] hover:bg-[#d44e0a] font-semibold text-xs sm:text-sm rounded-[10px] transition duration-200 shadow-sm active:scale-[0.98] cursor-pointer"
          >
            Choose delivery address
          </button>
        </div>
      </div>

      {/* Footer spacing alignment */}
      <div className="w-full" />
    </div>
  );
};

export default Map;
