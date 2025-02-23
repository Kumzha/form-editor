"use client";

import type React from "react";
import { useState, useEffect } from "react";
import DropDown from "./dropDown";
import RefreshForms from "./sidebarButtons/refreshFormButton";
import NewForm from "./sidebarButtons/newForm";
import {
  HiOutlineBookOpen,
  HiOutlineSupport,
  HiOutlineUser,
} from "react-icons/hi";
import { VscFeedback } from "react-icons/vsc";
import SidebarItem from "./sidebarButtons/sidebarItem";
import {
  TbLayoutSidebarLeftExpandFilled,
  TbLayoutSidebarRightExpandFilled,
} from "react-icons/tb";
import ExportButton from "./sidebarButtons/exportButton";
import UploadExamples from "./sidebarButtons/uploadExamplesButton";
import { useRouter } from "next/navigation";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isMobile]);

  const handleToggle = () => {
    if (!isMobile) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div
      className={`fixed left-0 bg-[#CACACA] top-[64px] h-[calc(100vh-60px)] flex flex-col z-50 transition-all duration-300 border-r-2 border-black ${
        isOpen ? "md:w-[15%]" : "w-16"
      }`}
    >
      <div
        onClick={handleToggle}
        className={`my-2 flex items-center justify-center gap-4 bg-[#CACACA] hover:bg-[#000000] hover:text-white transition-all duration-300 cursor-pointer ${
          isOpen
            ? "ml-auto mr-2 w-10 h-10 rounded-md"
            : "mx-auto w-[70%] h-10 p-2 rounded-md"
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
            <SidebarItem
              text="Profile"
              logo={<HiOutlineUser size={20} />}
              isOpen={isOpen}
              onClick={() => router.push("/profile")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
