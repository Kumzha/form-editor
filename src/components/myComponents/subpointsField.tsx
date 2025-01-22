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
import ModifyButton from "./modifyButton";
import SaveButton from "./saveButton";
import InspireButton from "./inspireButton";

const SubpointsField = () => {
  const dispatch = useDispatch();

  const { selectedForm, selectedPoint, selectedSubpoint } = useSelector(
    (state: RootState) => state.userForms
  );

  const formSubpointQuestions =
    selectedForm?.form_type?.questions?.[selectedPoint].subpoints;

  const prompt =
    selectedForm?.form_type.questions[selectedPoint]?.subpoints[
      selectedSubpoint
    ]?.prompt || "";

  const handleUpdateSubpoint = (value: string) => {
    dispatch(updateSelectedSubpoint(value));
  };

  if (!formSubpointQuestions) return <></>;

  return (
    <>
      <div className="bg-white w-full flex flex-col gap-2 border ">
        {selectedForm?.form_type.questions[selectedPoint].subpoints.map(
          (subpoint, index) => (
            <div
              key={index}
              className="relative m-1 rounded-lg  border border-gray-300"
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
                  variant="default"
                  value={
                    selectedForm?.points?.[selectedPoint]?.subpoints?.[index]
                      ?.content || ""
                  }
                  onChange={(e) => {
                    handleUpdateSubpoint(e.target.value);
                  }}
                />
              </div>
              {selectedSubpoint == index ? (
                <div className="absolute top-1/2 right-[-90px] transform -translate-y-1/2 flex flex-col space-y-2">
                  <InspireButton />
                  <SaveButton />
                  <ModifyButton
                    subpointText={
                      selectedForm?.points?.[selectedPoint]?.subpoints?.[index]
                        ?.content || ""
                    }
                    query={prompt}
                    formName={selectedForm?.name}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          )
        )}
      </div>
    </>
  );
};

export default SubpointsField;
