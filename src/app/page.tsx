"use client";
import { useState } from "react";
import Navbar from "@/components/myComponents/navbar";
import { RootState } from "@/store/store";
import DropDown from "@/components/myComponents/dropDown";
import MyModal from "@/components/myComponents/myModal";
import { exampleFormInterface, FormInterface } from "@/types/formType";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "@/types/formType";
import FormPoints from "@/components/myComponents/formPoints";
import { setSelectedForm } from "@/store/forms/formSlice";
import PointField from "@/components/myComponents/pointField";

export default function Home() {
  const dispatch = useDispatch();

  const handleSetSelectedForm = (form: Form) => {
    dispatch(setSelectedForm(form));
  };

  const { isSignedIn } = useSelector((state: RootState) => state.user);

  const { userForms, selectedForm } = useSelector(
    (state: RootState) => state.userForms
  );

  const formTypes: FormInterface[] = [exampleFormInterface];

  const [pointIndex, setPointIndex] = useState<number>(1);
  const [subpointIndex, setSubpointIndex] = useState<number>(1);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userSignedIn={isSignedIn} />
      <div className="container mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DropDown forms={userForms} setSelectedForm={handleSetSelectedForm} />
          <MyModal
            title="Fill out the information about your form"
            openButtonLabel="New Form"
            formTypes={formTypes}
          />
        </div>
        <FormPoints
          selectedForm={selectedForm}
          setPointIndex={setPointIndex}
          selectedPoint={pointIndex}
        />
      </div>
      {selectedForm && (
        <div className="container mx-auto p-4 flex flex-grow h-full gap-40 mb-5 bg-red-300">
          <div className="bg-red-500" style={{ flexBasis: "35%" }}>
            a
          </div>
          <div className="bg-red-500" style={{ flexBasis: "65%" }}>
            <PointField
              setSubpoint={setSubpointIndex}
              selectedPoint={selectedForm.form_type.questions[pointIndex]}
            />
          </div>
        </div>
      )}
    </div>
  );
}
