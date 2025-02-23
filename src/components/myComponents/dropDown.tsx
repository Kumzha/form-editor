"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { setSelectedForm } from "@/store/forms/formSlice";
import { RiFileList3Line } from "react-icons/ri";
import SidebarItem from "./sidebarButtons/sidebarItem";
import { useRouter, usePathname } from "next/navigation";

const DropDown: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    dispatch(setSelectedForm(null));
    if (pathname !== "/") {
      router.push("/");
    }
  };

  return (
    <SidebarItem
      text="My Proposals"
      logo={<RiFileList3Line size={20} />}
      onClick={handleClick}
      isOpen={isOpen}
    />
  );
};

export default DropDown;
