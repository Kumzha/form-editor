"use client";
import Navbar from "@/components/myComponents/navbar";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import DropDown from "@/components/myComponents/dropDown";
import MyModal from "@/components/myComponents/myModal";
import { exampleFormInterface, FormInterface } from "@/types/formType";

export default function Home() {
  const formTypes: FormInterface[] = [exampleFormInterface];

  const { isSignedIn } = useSelector((state: RootState) => state.user);
  const { userForms } = useSelector((state: RootState) => state.userForms);

  return (
    <div>
      <Navbar userSignedIn={isSignedIn} />
      <div className="container mx-auto p-4 bg-red-300 flex flex-row items-center gap-4">
        <DropDown forms={userForms} />
        <MyModal
          title="Fill out the information about your form"
          openButtonLabel="Add New Form"
          formTypes={formTypes}
        />
      </div>
    </div>
  );
}
