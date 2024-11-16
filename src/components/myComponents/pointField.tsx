import React from "react";
import { useSelector } from "react-redux";
import ClasicSubpoint from "./clasicSubpoint";
import { RootState } from "@/store/store";

const PointField = () => {
  const { selectedForm, selectedPoint } = useSelector(
    (state: RootState) => state.userForms
  );

  const formSubpoints =
    selectedForm?.form_type.questions[selectedPoint].subpoints;

  return (
    <div className="max-h-[600px] overflow-auto scrollbar-hide">
      <h3 className="font-semibold text-center">
        {selectedForm?.form_type.questions[selectedPoint].title}
      </h3>
      {/* SUBPOINTS */}
      <div className="flex flex-col gap-4">
        {formSubpoints ? (
          formSubpoints.map((subpoint, key) => (
            <ClasicSubpoint key={key} index={key} question={subpoint} />
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default PointField;
