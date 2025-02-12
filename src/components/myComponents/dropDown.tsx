"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { setSelectedForm } from "@/store/forms/formSlice";
import { RiFileList3Line } from "react-icons/ri";

const DropDown: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <div
      className="flex items-center mx-auto justify-center gap-4 w-[90%] bg-[#E9E8DF] hover:bg-[#c6c4b8] transition-all p-2 rounded-md duration-300 cursor-pointer"
      onClick={() => dispatch(setSelectedForm(null))}
    >
      <RiFileList3Line size={20} />
      <span className="w-full">My Forms</span>
    </div>
  );
};
export default DropDown;
