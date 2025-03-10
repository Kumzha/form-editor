"use client";
import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { setSelectedSubpoint } from "@/store/forms/formSlice";
import InspireButton from "./inspireButton";
import { CanvaDiv, type CanvaDivRef } from "./canvaDiv";

const activeInspires = new Set<string>();

const SubpointsField = () => {
  const dispatch = useDispatch();
  const canvaDivRefs = useRef<Map<number, React.RefObject<CanvaDivRef>>>(
    new Map()
  );

  const { selectedForm, selectedPoint, selectedSubpoint } = useSelector(
    (state: RootState) => state.userForms
  );
  const formSubpointQuestions =
    selectedForm?.form_type?.questions?.[selectedPoint]?.subpoints;

  if (!formSubpointQuestions) return <></>;

  // Get or create a ref for a specific index
  const getCanvaDivRef = (index: number) => {
    if (!canvaDivRefs.current.has(index)) {
      canvaDivRefs.current.set(index, React.createRef<CanvaDivRef>());
    }
    return canvaDivRefs.current.get(index)!;
  };

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
                  <CanvaDiv
                    ref={getCanvaDivRef(index)}
                    key={`canvadiv-${selectedPoint}-${index}`}
                    index={index}
                    defaultValue={subpointContent}
                    className="bg-[#FCFAF4] min-h-[2.5rem]"
                  />
                  <div className="absolute -bottom-5 right-0 p-1 text-xs text-gray-500">
                    {subpointContent.length}
                  </div>
                </div>
                {selectedSubpoint === index && (
                  <div className="absolute top-1/2 right-[-90px] transform -translate-y-1/2 flex flex-col space-y-2">
                    {!subpointContent && <InspireButton />}
                  </div>
                )}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default SubpointsField;
