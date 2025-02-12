import React from "react";
import DropDown from "./dropDown";
import RefreshForms from "./refreshFormButton";
import NewForm from "./newForm";
// import ShrinkingDiv from "./shrinkingDiv";
import { HiOutlineBookOpen } from "react-icons/hi";
import { HiOutlineSupport } from "react-icons/hi";
import { VscFeedback } from "react-icons/vsc";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div
        className={`fixed left-0 bg-[#E9E8DF] top-[65px] h-[calc(100vh-76px)] w-[15%] flex flex-col z-50 shadow-sm transition-transform duration-300 border rounded-tr-lg rounded-br-lg ${
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}
      >
        {/* Main Content Div */}
        <div className="flex flex-col gap-3">
          {/* Removed the header with "coGrant" */}

          <div className="flex flex-col gap-9">
            {/* First Group Of Buttons */}
            <div className="flex flex-col w-full gap-2">
              <div className="text-sm w-[90%] mx-auto p-1 text-gray-500">
                Subfield of menu
              </div>
              <NewForm />
              <DropDown />
              <RefreshForms />
            </div>

            <div className="flex flex-col w-full gap-2">
              <div className="text-sm w-[90%] mx-auto p-1 text-gray-500">
                Subfield of menu
              </div>
              <div className="flex items-center mx-auto justify-center gap-4 w-[90%] bg-[#E9E8DF] hover:bg-[#c6c4b8] transition-all p-2 rounded-md duration-300 cursor-pointer">
                <HiOutlineBookOpen size={20} />
                <span className="w-full">Documentation</span>
              </div>
              <div className="flex items-center mx-auto justify-center gap-4 w-[90%] bg-[#E9E8DF] hover:bg-[#c6c4b8] transition-all p-2 rounded-md duration-300 cursor-pointer">
                <HiOutlineSupport size={20} />
                <span className="w-full">Support</span>
              </div>
              <div className="flex items-center mx-auto justify-center gap-4 w-[90%] bg-[#E9E8DF] hover:bg-[#c6c4b8] transition-all p-2 rounded-md duration-300 cursor-pointer">
                <VscFeedback size={20} />
                <span className="w-full">Feedback</span>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div
          onClick={handleToggle}
          className="absolute right-0 mr-1 top-1/2 cursor-pointer p-2 bg-gray-700 text-white rounded transition-transform duration-300 hover:scale-110"
        >
          <IoIosArrowBack />
        </div>
      </div>

      {/* Open Button */}
      {!isOpen && (
        <div
          onClick={handleToggle}
          className="bg-gray-700 ml-1 text-white fixed left-0 top-1/2 p-2 cursor-pointer rounded-md z-50 transition-transform duration-300 hover:scale-110"
        >
          <IoIosArrowForward />
        </div>
      )}
    </>
  );
};

export default Sidebar;
