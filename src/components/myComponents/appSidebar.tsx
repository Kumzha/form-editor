import React from "react";
import DropDown from "./dropDown";
import RefreshForms from "./refreshFormButton";
import NewForm from "./newForm";
import ShrinkingDiv from "./shrinkingDiv";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isOpen ? (
        <div className="fixed left-0 top-0 h-screen w-[15%] flex flex-col z-50 border ">
          <ShrinkingDiv />
          <div className="flex flex-col gap-3">
            <div className="w-full h-16 p-3 text-center flex items-center justify-center">
              HEADER SIDEBAR
            </div>
            <div className="flex flex-col gap-3 w-[80%] mx-auto">
              <DropDown />
              <RefreshForms />
              <NewForm />
            </div>
          </div>

          {/* Close Button */}
          <div
            onClick={handleToggle}
            className="absolute right-0 top-1/2 cursor-pointer p-2 bg-gray-700 text-white rounded"
          >
            Close
          </div>
        </div>
      ) : (
        <div
          className="bg-green-500 fixed left-0 top-1/2 p-2 cursor-pointer rounded-md z-50"
          onClick={handleToggle}
        >
          Open
        </div>
      )}
    </>
  );
};

export default Sidebar;
