/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { signOut } from "@/store/user/userSlice";
import { Form } from "@/types/formType";

interface NavbarProps {
  form?: Form | null;
}

const Navbar: React.FC<NavbarProps> = ({ form }) => {
  return (
    <div className="h-16 bg-[#6a6a6d] fixed top-0 left-0 right-0 z-50 border-b-2 border-[#000000] flex flex-row">
      <div className="w-[15%]">
        <div className="h-16 p-3 flex items-center justify-center">
          <div className="w-5 h-5 bg-white rounded-full"></div>
          <span className="inline-flex items-center text-xl font-bold font-sans pl-3 m-0 leading-none text-white select-none">
            cogrant
          </span>
        </div>
      </div>
      <div className="w-[70%] hidden lg:flex items-center text-white">
        {form ? (
          <div className="flex flex-col gap-2 w-full items-center font-semibold">
            <span className="whitespace-nowrap">{form.name}</span>
          </div>
        ) : null}
        {/* {form ? <Progress form={form} className="w-[40%]" /> : null} */}
      </div>
      <div className="w-[15%]"></div>
    </div>
  );
};

export default Navbar;
