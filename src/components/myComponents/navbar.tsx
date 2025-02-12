/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { signOut } from "@/store/user/userSlice";
import { FaUserCircle } from "react-icons/fa";
import DropDown from "./dropDown";
import NewForm from "./newForm";
import RefreshForms from "./refreshFormButton";
import { Form } from "@/types/formType";
import { Progress } from "../ui/progress";

interface NavbarProps {
  form: Form | null;
}

const Navbar: React.FC<NavbarProps> = ({ form }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <div className="navbar h-10 bg-[#E9E8DF] fixed top-0 left-0 right-0 z-50 border-b-8 border-[#F1F0E8]">
      <div className="navbar-start w-[15%]">
        <div className="h-16 p-3 text-center flex items-center justify-center">
          <p className="text-xl font-bold font-sans pl-3">coGrant</p>
        </div>
      </div>
      <div className="navbar-center w-[70%] hidden lg:flex items-center">
        {form ? (
          <div className="flex flex-col gap-2 w-full items-center font-semibold">
            <span className="whitespace-nowrap">{form.name}</span>
          </div>
        ) : null}
        {/* {form ? <Progress form={form} className="w-[40%]" /> : null} */}
      </div>
      <div className="navbar-end w-[15%]"></div>
    </div>
  );
};

export default Navbar;
