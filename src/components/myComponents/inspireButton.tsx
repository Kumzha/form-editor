import React from "react";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { updateSelectedSubpoint } from "@/store/forms/formSlice";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "@/constants/constants";
import { useMutation } from "@tanstack/react-query";

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
  const respData = await response.json();
  return respData;
};

const InspireButton: React.FC = () => {
  const dispatch = useDispatch();

  const { selectedForm, selectedPoint, selectedSubpoint } = useSelector(
    (state: RootState) => state.userForms
  );

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

  const isFetching = inspireMutation.status === "pending"; // Check if mutation is in progress

  const handleInspire = () => {
    if (isFetching) return; // Prevent multiple requests

    const prompt =
      selectedForm?.form_type.questions[selectedPoint]?.subpoints[
        selectedSubpoint
      ]?.prompt || "";

    const formName = selectedForm?.name || "";
    const userQuery =
      selectedForm?.form_type.questions[selectedPoint].subpoints[
        selectedSubpoint
      ].prompt || "";

    const data = {
      user_query: userQuery,
      prompt_text: prompt,
      form_name: formName,
    };

    console.log(selectedForm);
    inspireMutation.mutate(data);
  };

  return (
    <Button variant="primary" onClick={handleInspire} disabled={isFetching}>
      {isFetching ? " " : "Inspire"}
    </Button>
  );
};

export default InspireButton;
