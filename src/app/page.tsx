/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Navbar from "@/components/myComponents/navbar";
import { RootState } from "@/store/store";
import { FormInterface, creaFormInterface } from "@/types/formType";
import { useSelector, useDispatch } from "react-redux";
import { setUserForms } from "@/store/forms/formSlice";
import { useRouter } from "next/navigation";
import FormEditor from "@/components/myComponents/FormEditor";
import { useEffect } from "react";
import DropDown from "@/components/myComponents/dropDown";

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useSelector((state: RootState) => state.user);
  const { userForms, selectedForm } = useSelector(
    (state: RootState) => state.userForms
  );

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    }
  }, [router]);
  return (
    <div>
      <Navbar />
      <div className="max-h-screen h-screen flex flex-row bg-gray-100">
        <DropDown />
        <div className="w-1/6 h-full"></div>
        <div className="w-4/6 h-full bg-gray-100 flex flex-col gap-5">
          <FormEditor form={selectedForm} />
        </div>
        <div className="w-1/6 h-full"></div>
      </div>
    </div>
  );
}
