"use client";
import Navbar from "@/components/myComponents/navbar";
import { RootState } from "@/store/store";
import { FormInterface, creaFormInterface } from "@/types/formType";
import { useSelector } from "react-redux";
import FormEditor from "@/components/myComponents/FormEditor";

export default function Home() {
  const { isSignedIn } = useSelector((state: RootState) => state.user);

  const { userForms, selectedForm } = useSelector(
    (state: RootState) => state.userForms
  );

  const formTypes: FormInterface[] = [creaFormInterface];

  return (
    <div>
      <Navbar />
      <div className="max-h-screen h-screen flex flex-row bg-gray-100">
        <div className="w-1/6 h-full"></div>
        <div className="w-4/6 h-full bg-gray-100 flex flex-col gap-5">
          <FormEditor form={selectedForm} />
        </div>
        <div className="w-1/6 h-full"></div>
      </div>
    </div>
  );
}
