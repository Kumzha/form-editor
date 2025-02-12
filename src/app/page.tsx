/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Navbar from "@/components/myComponents/navbar";
import { RootState } from "@/store/store";
import { FormInterface } from "@/types/formType";
import { useSelector, useDispatch } from "react-redux";
import { setUserForms } from "@/store/forms/formSlice";
import { useRouter } from "next/navigation";
import FormEditor from "@/components/myComponents/FormEditor";
import { useEffect } from "react";
import Sidebar from "@/components/myComponents/appSidebar";
import WithAuth from "@/components/hoc/withAuth";

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useSelector((state: RootState) => state.user);
  const { userForms, selectedForm } = useSelector(
    (state: RootState) => state.userForms
  );

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("No token found inside main page useEffect");
      router.push("/login");
    }
  }, [router]);

  return (
    <WithAuth>
      <div className="flex flex-col min-h-screen">
        <Navbar form={selectedForm} />
        <div className="flex flex-1 bg-[#F1F0E8]">
          <div className="w-1/6">
            <Sidebar />
          </div>
          <div className="w-4/6 flex flex-col gap-5 flex-1">
            <FormEditor form={selectedForm} />
          </div>
          <div className="w-1/6"></div>
        </div>
      </div>
    </WithAuth>
  );
}
