import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateSelectedSubpoint } from "@/store/forms/formSlice";
import { useDispatch } from "react-redux";
import { BASE_URL } from "@/constants/constants";
import { useMutation } from "@tanstack/react-query";

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
  // Add other fields as needed
};

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

  const modifyMutation = useMutation<ApiResponse, Error, UpdateFieldRequest>({
    mutationFn: updateField,
    onSuccess: (data) => {
      console.log("Success:", data.result);
      dispatch(updateSelectedSubpoint(data.result));
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
    // Prevent submitting another request while one is in progress
    if (isFetching) return;

    const data = {
      user_query: inputValue,
      prompt_text: query,
      form_name: formName,
      subpoint_text: subpointText,
    };

    modifyMutation.mutate(data);

    // Optionally clear the input and close the popover
    setInputValue("");
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line insertion
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
