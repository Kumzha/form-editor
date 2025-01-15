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
import { Button } from "../ui/button";
import ModifyButton from "./modifyButton";
import { BASE_URL } from "@/constants/constants";
import { useMutation } from "@tanstack/react-query";
import SaveButton from "./saveButton";

type InspireRequestSchema = {
  user_query: string;
  prompt_text: string;
  form_name: string;
};

type InspireApiResponse = {
  result: string;
};

const inspire = async (
  data: InspireRequestSchema
): Promise<InspireApiResponse> => {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${BASE_URL}/retrieval/generate-field`, {
    method: "POST",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update form");
  }

  return response.json();
};

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

  const inspireMutation = useMutation<
    InspireApiResponse,
    Error,
    InspireRequestSchema
  >({
    mutationFn: inspire,
    onSuccess: (data) => {
      handleUpdateSubpoint(data.result);
    },

    onError: (error) => {
      console.log("Error inspiring:", error.message);
    },
  });

  const handleInspire = () => {
    const formName = selectedForm?.form_type.name || "";
    const userQuery =
      selectedForm?.form_type.questions[selectedPoint].subpoints[
        selectedSubpoint
      ].prompt || "";

    const data = {
      user_query: userQuery,
      prompt_text: prompt,
      form_name: formName,
    };

    inspireMutation.mutate(data);
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
                  <Button variant={"primary"} onClick={handleInspire}>
                    Inspire
                  </Button>
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
