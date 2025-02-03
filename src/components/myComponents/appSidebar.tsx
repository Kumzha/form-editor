import React from "react";
import DropDown from "./dropDown";
import RefreshForms from "./refreshFormButton";
import NewForm from "./newForm";
import ShrinkingDiv from "./shrinkingDiv";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div
        className={`fixed left-0 top-0 h-screen w-[15%] flex flex-col z-50 shadow-sm transition-transform duration-300 ${
          isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}
      >
        <ShrinkingDiv />

        {/* Main Content Div */}
        <div className="flex flex-col gap-3 p-2">
          <div className="w-full h-16 p-3 text-center flex items-center justify-center">
            HEADER SIDEBAR
          </div>

          {/* First Group Of Buttons */}
          <div className="flex flex-col w-full gap-3 p-2">
            <DropDown />
            <RefreshForms />
            <NewForm />
          </div>
        </div>

        {/* Close Button */}
        <div
          onClick={handleToggle}
          className="absolute right-0 top-1/2 cursor-pointer p-2 bg-gray-700 text-white rounded transition-transform duration-300 hover:scale-105"
        >
          Close
        </div>
      </div>

      {/* Open Button */}
      {!isOpen && (
        <div
          className="bg-green-500 fixed left-0 top-1/2 p-2 cursor-pointer rounded-md z-50 transition-transform duration-300 hover:scale-110"
          onClick={handleToggle}
        >
          Open
        </div>
      )}
    </>
  );
};

export default Sidebar;
