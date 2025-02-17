import React from "react";
import DropDown from "./dropDown";
import RefreshForms from "./sidebarButtons/refreshFormButton";
import NewForm from "./sidebarButtons/newForm";
import { HiOutlineBookOpen } from "react-icons/hi";
import { HiOutlineSupport } from "react-icons/hi";
import { VscFeedback } from "react-icons/vsc";
import SidebarItem from "./sidebarButtons/sidebarItem";
import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import { TbLayoutSidebarRightExpandFilled } from "react-icons/tb";
import ExportButton from "./sidebarButtons/exportButton";
import UploadExamples from "./sidebarButtons/uploadExamplesButton";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="fixed left-0 bg-[#E9E8DF] top-[65px] h-[calc(100vh-76px)] flex flex-col z-50 shadow-sm border rounded-tr-lg rounded-br-lg transition-all duration-300"
      style={{
        width: isOpen ? "15%" : "4rem", // Adjust the closed width as needed
      }}
    >
      <div
        onClick={handleToggle}
        className={`my-2 flex items-center justify-center gap-4 bg-[#E9E8DF] hover:bg-[#c6c4b8] transition-all duration-300 cursor-pointer ${
          isOpen
            ? "ml-auto mr-2 w-10 h-10 rounded-md" // When open: pushed right and square
            : "mx-auto w-[70%] h-10 p-2 rounded-md" // When closed: centered, same height
        }`}
      >
        {isOpen ? (
          <TbLayoutSidebarRightExpandFilled size={25} />
        ) : (
          <TbLayoutSidebarLeftExpandFilled size={25} />
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-9">
          {/* First Group Of Buttons */}
          <div className="flex flex-col w-full gap-2">
            <NewForm isOpen={isOpen} />
            <DropDown isOpen={isOpen} />
            <RefreshForms isOpen={isOpen} />
          </div>

          <div className="flex flex-col w-full gap-2">
            <ExportButton isOpen={isOpen} />
            <UploadExamples isOpen={isOpen} />
            <SidebarItem
              text="Documentation"
              logo={<HiOutlineBookOpen size={20} />}
              isOpen={isOpen}
            />
            <SidebarItem
              text="Support"
              logo={<HiOutlineSupport size={20} />}
              isOpen={isOpen}
            />
            <SidebarItem
              text="Feedback"
              logo={<VscFeedback size={20} />}
              isOpen={isOpen}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
