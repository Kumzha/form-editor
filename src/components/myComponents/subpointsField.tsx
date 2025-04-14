"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { setSelectedSubpoint } from "@/store/forms/formSlice";
import InspireButton from "./inspireButton";
import EvaluateButton from "./evaluateButton";
import CanvaTextArea from "./canvaTextArea";

const activeInspires = new Set<string>();

const SubpointsField = () => {
  const dispatch = useDispatch();

  const { selectedForm, selectedPoint, selectedSubpoint } = useSelector(
    (state: RootState) => state.userForms
  );
  const formSubpointQuestions =
    selectedForm?.form_type?.questions?.[selectedPoint]?.subpoints;

  if (!formSubpointQuestions) return <></>;

  return (
    <div className="bg-[#CACACA] w-full flex flex-col gap-4 rounded pb-10">
      {selectedForm?.form_type.questions[selectedPoint].subpoints.map(
        (subpoint, index) => {
          const subpointContent =
            selectedForm?.points?.[selectedPoint]?.subpoints?.[index]
              ?.content || "";

          const inspireKey = `${selectedPoint}-${index}`;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const isInspireActive = activeInspires.has(inspireKey);

          return (
            <div key={index} className="flex flex-col gap-1">
              <div className="relative mx-1 pb-1 rounded-lg">
                <div
                  className="grid w-full gap-1.5 relative p-1 bg-[#FCFAF4] rounded-2xl black"
                  onClick={() => dispatch(setSelectedSubpoint(index))}
                >
                  <Label htmlFor="message" className="mx-auto my-1 text-[15px]">
                    {subpoint.sub_title}
                  </Label>
                  <Separator />
                  <CanvaTextArea
                    key={`textarea-${selectedPoint}-${index}`}
                    index={index}
                  />
                  <div className="absolute -bottom-5 right-0 p-1 text-xs text-gray-500">
                    {subpointContent.length}
                  </div>
                  {selectedSubpoint === index && (
                    <div className="absolute bottom-2 right-2">
                      {subpointContent ? (
                        <EvaluateButton content={subpointContent} />
                      ) : (
                        <InspireButton />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default SubpointsField;
