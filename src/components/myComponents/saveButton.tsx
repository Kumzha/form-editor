import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "../ui/button";
import { BASE_URL } from "@/constants/constants";
import { useMutation } from "@tanstack/react-query";

type SaveRequestSchema = {
  form_name: string;
  form_id: string;
  form_point: number;
  form_subpoint: number;
  text: string;
};

type SaveApiResponse = {
  result: string;
};

const save = async (data: SaveRequestSchema): Promise<SaveApiResponse> => {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${BASE_URL}/form-update`, {
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

const SaveButton = () => {
  const { selectedForm, selectedPoint, selectedSubpoint } = useSelector(
    (state: RootState) => state.userForms
  );

  const handleSave = () => {
    const formName = selectedForm?.name || "";
    const formId = selectedForm?.form_id || "";
    const subpointText =
      selectedForm?.points?.[selectedPoint]?.subpoints?.[selectedSubpoint]
        ?.content || "";

    const data = {
      form_name: formName,
      form_id: formId,
      text: subpointText,
      form_point: selectedPoint,
      form_subpoint: selectedSubpoint,
    };
    saveMutation.mutate(data);
  };

  const saveMutation = useMutation<SaveApiResponse, Error, SaveRequestSchema>({
    mutationFn: save,
    onSuccess: (data) => {
      alert("Subpoint updated successfully!");
      console.log("Success:", data);
    },
    onError: (error) => {
      console.log("Error updating form:", error.message);
    },
  });

  return (
    <Button variant={"primary"} onClick={handleSave}>
      Save
    </Button>
  );
};
export default SaveButton;
