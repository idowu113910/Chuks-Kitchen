import { GoHome } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import { PiShoppingCart } from "react-icons/pi";
import pro from "../assets/profile.svg";

const Footer = () => {
  return (
    <div>
      <div className="bg-white border-t-[0.5px] border-t-black/20 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] mt-6">
        <div className="flex gap-14.75 justify-around">
          <div className="flex flex-col gap-1.25 text-[#FF6B35] items-center mt-4 mb-2">
            <GoHome className="w-6 h-6" />
            <p className="font-medium text-[12px]">Home</p>
          </div>

          <div className="flex flex-col gap-1.25 text-[#757575] items-center  mt-4 mb-2">
            <IoSearchOutline className="w-6 h-6" />
            <p className="font-normal text-[12px] text-[#757575]">Search</p>
          </div>

          <div className="flex flex-col gap-1.25 text-[#757575] items-center  mt-4 mb-2">
            <PiShoppingCart className="w-6 h-6" />

            <p className="font-normal text-[12px] text-[#757575]">Cart</p>
          </div>

          <div className="flex flex-col gap-1.25 text-[#757575] items-center  mt-4 mb-2">
            <img src={pro} alt="" className="w-6 h-6" />
            <p className="font-normal text-[12px] text-[#757575]">Profile</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
