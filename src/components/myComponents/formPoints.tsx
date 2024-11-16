import React from "react";
import { Form } from "@/types/formType";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedPoint } from "@/store/forms/formSlice";
import { RootState } from "@/store/store";

interface FormPointProps {
  selectedForm: Form | null;
}

const FormPoints: React.FC<FormPointProps> = ({ selectedForm }) => {
  const { selectedPoint } = useSelector((state: RootState) => state.userForms);

  const dispatch = useDispatch();

  const setPointIndex = (index: number) => {
    dispatch(setSelectedPoint(index));
  };

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
