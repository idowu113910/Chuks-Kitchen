import { useNavigate } from "react-router-dom";
import chuks from "../../assets/chuks 2.svg";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-1.5 -mt-2">
      <img src={chuks} alt="" />

      <div className="flex flex-col">
        <h1 className="font-semibold text-[24px] text-black">
          Welcome to{" "}
          <span className="text-[#FF6B35]"> Chuks Kitchen </span>{" "}
        </h1>
        <p className="font-normal text-[#757575]">
          We’ve got some exciting discounts for you
        </p>
      </div>

      <button
        type="submit"
        onClick={() => {
          navigate("/map");
        }}
        className="w-full max-w-87.5 mx-auto flex text-center justify-center py-3.5 px-4 
        mt-6 text-[#ffffff] bg-[#FF6B35]
         font-medium text-[14px] rounded-[10px] transition"
      >
        Start Ordering
      </button>
    </div>
  );
};

export default Welcome;
