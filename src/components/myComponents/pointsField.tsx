import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setSelectedPoint } from "@/store/forms/formSlice";

const PointsField = () => {
  const { selectedForm, selectedPoint } = useSelector(
    (state: RootState) => state.userForms
  );

  function capitalizeFirstLetter(input: string) {
    if (!input) return "";
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
  }

  const dispatch = useDispatch();

  const formPoints = selectedForm?.form_type.questions;

  if (!formPoints) return <></>;

  return (
    <div className="w-full flex flex-row gap-2 ml-1">
      {formPoints.map((question, index) => (
        <div
          key={index}
          className={`px-2 py-1 h-4 text-xs flex items-center justify-center rounded-t-lg hover:cursor-pointer font-bold ${
            selectedPoint == index ? "bg-white text-blue-800" : "bg-gray-300"
          }`}
          onClick={() => dispatch(setSelectedPoint(index))}
        >
          {capitalizeFirstLetter(question.title)}
        </div>
      ))}
    </div>
  );
};

export default PointsField;
