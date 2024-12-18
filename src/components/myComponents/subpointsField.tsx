import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  setSelectedSubpoint,
  updateSelectedSubpoint,
} from "@/store/forms/formSlice";

const SubpointsField = () => {
  const dispatch = useDispatch();

  const { selectedForm, selectedPoint } = useSelector(
    (state: RootState) => state.userForms
  );

  const formSubpointQuestions =
    selectedForm?.form_type?.questions?.[selectedPoint].subpoints;

  if (!formSubpointQuestions) return <></>;

  return (
    <>
      <div className="bg-white w-full flex flex-col gap-2 border ">
        {selectedForm?.form_type.questions[selectedPoint].subpoints.map(
          (subpoint, index) => (
            <div
              key={index}
              className=" m-1 rounded-lg  border border-gray-300"
            >
              <div
                className="grid w-full gap-1.5 mt-2"
                onClick={() => dispatch(setSelectedSubpoint(index))}
              >
                <Label htmlFor="message" className="mx-auto">
                  {subpoint.sub_title}
                </Label>
                <Separator />
                <Textarea
                  value={
                    selectedForm?.points?.[selectedPoint]?.subpoints?.[index]
                      ?.content || ""
                  }
                  onChange={(e) => {
                    dispatch(updateSelectedSubpoint(e.target.value));
                  }}
                />
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default SubpointsField;
