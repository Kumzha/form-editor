import React from "react";
import { Form } from "@/types/formType";
import PointsField from "@/components/myComponents/pointsField";
import SubpointsField from "@/components/myComponents/subpointsField";

interface FormEditorProps {
  form: Form | null;
}

const FormEditor: React.FC<FormEditorProps> = ({ form }) => {
  if (!form) {
    return <div>No form selected</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="w-full h-5 text-base font-bold flex items-center justify-center">
          {form.name}
        </div>
        <div className="w-full h-3 text-sm flex items-center justify-center">
          {form.form_type.name}
        </div>
        <div className="flex flex-col">
          <PointsField />
          <SubpointsField />
        </div>
      </div>
    </>
  );
};

export default FormEditor;
