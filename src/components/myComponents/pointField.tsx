import { FormPoint, Point } from "@/types/formType";
import React from "react";
import { Form } from "@/types/formType";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import clasicSubpoint from "./clasicSubpoint";
import { RootState } from "@/store/store";

interface PointFieldProps {
  selectedPoint: FormPoint;
  setSubpoint: (subpoint: number) => void;
}

const PointField: React.FC<PointFieldProps> = ({
  selectedPoint,
  setSubpoint,
}) => {
  const { selectedForm } = useSelector((state: RootState) => state.userForms);

  return (
    <div>
      <h1>{selectedPoint.title}</h1>
      {selectedPoint.subpoints.map((subpoint, key) => (
        <div key={key}>{subpoint.sub_title}</div>
      ))}
    </div>
  );
};

export default PointField;
