"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { setSelectedForm } from "@/store/forms/formSlice";
import { RiFileList3Line } from "react-icons/ri";
import SidebarItem from "./sidebarItem";

const DropDown: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const dispatch = useDispatch();

  return (
    <SidebarItem
      text="My Forms"
      logo={<RiFileList3Line size={20} />}
      onClick={() => dispatch(setSelectedForm(null))}
      isOpen={isOpen}
    />
  );
};
export default DropDown;
