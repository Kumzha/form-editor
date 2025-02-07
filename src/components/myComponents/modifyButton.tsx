import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateSelectedSubpoint } from "@/store/forms/formSlice";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "@/constants/constants";
import { useSaveSubpoint } from "@/hooks/useSaveSubpoint";
import { useMutation } from "@tanstack/react-query";
import { RootState } from "@/store/store";

interface ModifyProps {
  subpointText: string;
  query: string;
  formName: string;
}

type UpdateFieldRequest = {
  user_query: string;
  prompt_text: string;
  form_name: string;
  subpoint_text: string;
};

type ApiResponse = {
  result: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isFormIdObject(value: any): value is { $oid: string } {
  return value && typeof value === "object" && "$oid" in value;
}

// Note: Removed useSelector from this function.
const updateField = async (data: UpdateFieldRequest): Promise<ApiResponse> => {
  const token = localStorage.getItem("authToken");

  const response = await fetch(`${BASE_URL}/retrieval/update-field`, {
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

const ModifyButton: React.FC<ModifyProps> = ({
  subpointText,
  query,
  formName,
}) => {
  const dispatch = useDispatch();

  // Use useSelector at the top of your component.
  const { selectedForm, selectedPoint, selectedSubpoint } = useSelector(
    (state: RootState) => state.userForms
  );

  const { save } = useSaveSubpoint();

  const modifyMutation = useMutation<ApiResponse, Error, UpdateFieldRequest>({
    mutationFn: updateField,
    onSuccess: (data) => {
      // Update your redux store
      dispatch(updateSelectedSubpoint(data.result));

      // Now call your save function with the parameters
      save(
        data.result, // updated subpoint text from API response
        selectedSubpoint,
        selectedPoint,
        isFormIdObject(selectedForm?.form_id)
          ? selectedForm.form_id.$oid
          : selectedForm?.form_id || "",
        selectedForm?.name || ""
      );
    },
    onError: (error) => {
      console.error("Error updating form:", error.message);
    },
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const isFetching = modifyMutation.status === "pending";

  const handleSubmit = async () => {
    if (isFetching) return;

    const data: UpdateFieldRequest = {
      user_query: inputValue,
      prompt_text: query,
      form_name: formName,
      subpoint_text: subpointText,
    };

    modifyMutation.mutate(data);

    setInputValue("");
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative inline-block text-left">
      <Button
        variant={"primary"}
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={isFetching}
      >
        {isFetching ? " " : "Modify"}
      </Button>

      {isOpen && (
        <div
          className="absolute mt-2 w-56 bg-white border rounded shadow-lg p-4 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border rounded"
            placeholder="Write something..."
            rows={3}
          />

          <Button variant={"primary"} onClick={handleSubmit}>
            Update
          </Button>
        </div>
      )}
    </div>
  );
};

export default ModifyButton;
