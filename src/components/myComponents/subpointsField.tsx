import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { setSelectedSubpoint } from "@/store/forms/formSlice";
import ModifyButton from "./modifyButton";
import InspireButton from "./inspireButton";
import CanvaTextArea from "./canvaTextArea";

const SubpointsField = () => {
  const dispatch = useDispatch();

  const { selectedForm, selectedPoint, selectedSubpoint } = useSelector(
    (state: RootState) => state.userForms
  );

  const formSubpointQuestions =
    selectedForm?.form_type?.questions?.[selectedPoint].subpoints;

  if (!formSubpointQuestions) return <></>;

  const selectedSubpointContent =
    selectedForm?.points?.[selectedPoint]?.subpoints?.[selectedSubpoint]
      ?.content || "";

  const prompt =
    selectedForm?.form_type.questions[selectedPoint]?.subpoints[
      selectedSubpoint
    ]?.prompt || "";

  return (
    <div className="bg-white w-full flex flex-col gap-2 rounded pb-3 border">
      {selectedForm?.form_type.questions[selectedPoint].subpoints.map(
        (subpoint, index) => (
          <div
            key={index}
            className="relative m-1 rounded-lg border border-gray-300"
          >
            <div
              className="grid w-full gap-1.5 mt-2 relative p-1"
              onClick={() => dispatch(setSelectedSubpoint(index))}
            >
              <Label htmlFor="message" className="mx-auto">
                {subpoint.sub_title}
              </Label>
              <Separator />
              <CanvaTextArea
                key={`textarea-${selectedPoint}-${index}`}
                index={index}
              />
              <div className="absolute -bottom-5 left-0 p-1 text-xs text-gray-500">
                {
                  (
                    selectedForm?.points?.[selectedPoint]?.subpoints?.[index]
                      ?.content || ""
                  ).length
                }
              </div>
            </div>
            {selectedSubpoint === index && (
              <div className="absolute top-1/2 right-[-90px] transform -translate-y-1/2 flex flex-col space-y-2">
                {selectedSubpointContent ? <></> : <InspireButton />}
                <ModifyButton
                  subpointText={selectedSubpointContent}
                  query={prompt}
                  formName={selectedForm?.name}
                />
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default SubpointsField;
