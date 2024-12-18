"use client";
import Navbar from "@/components/myComponents/navbar";
import { RootState } from "@/store/store";
import DropDown from "@/components/myComponents/dropDown";
import MyModal from "@/components/myComponents/myModal";
import { FormInterface, creaFormInterface } from "@/types/formType";
import { useSelector } from "react-redux";
import FormPoints from "@/components/myComponents/formPoints";
import PointField from "@/components/myComponents/pointField";
import InputField from "@/components/myComponents/inputField";

export default function Home() {
  const { isSignedIn } = useSelector((state: RootState) => state.user);

  const { userForms, selectedForm } = useSelector(
    (state: RootState) => state.userForms
  );

  const formTypes: FormInterface[] = [creaFormInterface];

  return (
    <div className="max-h-screen h-screen flex flex-col">
      <Navbar userSignedIn={isSignedIn} />
      <div className="container mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DropDown forms={userForms} />
          <MyModal
            title="Fill out the information about your form"
            openButtonLabel="New Form"
            formTypes={formTypes}
          />
        </div>
        <FormPoints selectedForm={selectedForm} />
      </div>
      {selectedForm && (
        <div className="container mx-auto flex flex-grow gap-20 mb-5 max-h-[726px]">
          <div className="ml-5" style={{ flexBasis: "60%" }}>
            <PointField />
          </div>
          <div className="mr-5" style={{ flexBasis: "40%" }}>
            <InputField />
          </div>
        </div>
      )}
    </div>
  );
}
