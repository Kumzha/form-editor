import React from "react";
import { Form } from "@/types/formType";

interface FormPointProps {
  selectedForm: Form | null;
  setPointIndex: (index: number) => void;
  selectedPoint: number | null;
}

const FormPoints: React.FC<FormPointProps> = ({
  selectedForm,
  setPointIndex,
  selectedPoint,
}) => {
  if (!selectedForm) {
    return <></>;
  }

  return (
    <div>
      <ul className="menu menu-horizontal bg-base-200 gap-1 rounded-xl">
        {Array.from(
          { length: selectedForm.form_type.questions.length },
          (_, i) => (
            <li key={i} onClick={() => setPointIndex(i)}>
              <a className={selectedPoint === i ? "active" : ""}>{i + 1}</a>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default FormPoints;
