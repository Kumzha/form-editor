"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { setSelectedSubpoint } from "@/store/forms/formSlice";
import ModifyButton from "./modifyButton";
import InspireButton from "./inspireButton";
import CanvaTextArea from "./canvaTextArea";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";

// Track active inspire operations
const activeInspires = new Set<string>();

const SubpointsField = () => {
  const dispatch = useDispatch();

  const { selectedForm, selectedPoint, selectedSubpoint } = useSelector(
    (state: RootState) => state.userForms
  );
  const [userPrompts, setUserPrompts] = useState<Record<number, string>>({});

  const formSubpointQuestions =
    selectedForm?.form_type?.questions?.[selectedPoint]?.subpoints;

  if (!formSubpointQuestions) return <></>;

  const handlePromptChange = (index: number, value: string) => {
    setUserPrompts((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const clearPrompt = (index: number) => {
    setUserPrompts((prev) => {
      const newPrompts = { ...prev };
      delete newPrompts[index];
      return newPrompts;
    });
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

          const prompt =
            selectedForm?.form_type.questions[selectedPoint]?.subpoints[index]
              ?.prompt || "";

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
                </div>
                {selectedSubpoint === index && (
                  <div className="absolute top-1/2 right-[-90px] transform -translate-y-1/2 flex flex-col space-y-2">
                    {!subpointContent && <InspireButton />}
                  </div>
                )}
              </div>
              {selectedSubpoint === index && (
                <AnimatePresence>
                  <motion.div
                    key="modify-section"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-1 items-center"
                  >
                    <Input
                      onChange={(e) =>
                        handlePromptChange(index, e.target.value)
                      }
                      placeholder="Enter your prompt"
                      className="bg-[#FCFAF4] mx-1 w-1/3 rounded-2xl border-none"
                      value={userPrompts[index] || ""}
                    />
                    <ModifyButton
                      userPrompt={userPrompts[index] || ""}
                      subpointText={subpointContent}
                      query={prompt}
                      subpointIndex={index}
                      formName={selectedForm?.name}
                      funcAfterSuccess={() => clearPrompt(index)}
                    />
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          );
        }
      )}
    </div>
  );
};

export default SubpointsField;
