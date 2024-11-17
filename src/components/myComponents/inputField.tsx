import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "@/constants/constants";
import { useDispatch } from "react-redux";
import { updateSelectedSubpoint } from "@/store/forms/formSlice";

type GenerateFieldRequest = {
  user_query: string;
  prompt_text: string;
  form_name: string;
};

type ApiResponse = {
  result: string;
  // Add other fields as needed
};

const generateField = async (
  data: GenerateFieldRequest
): Promise<ApiResponse> => {
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

  return response.json(); // Assuming the response has a message field and possibly others
};

const InputField = () => {
  const [inputValue, setInputValue] = useState("");
  const { selectedForm } = useSelector((state: RootState) => state.userForms);
  const { selectedPoint, selectedSubpoint } = useSelector(
    (state: RootState) => state.userForms
  );
  const dispatch = useDispatch();

  const mutation = useMutation<ApiResponse, Error, GenerateFieldRequest>({
    mutationFn: generateField,
    onSuccess: (data) => {
      console.log("Success:", data.result); // Handle success response
      dispatch(updateSelectedSubpoint(data.result));
    },
    onError: (error) => {
      console.error("Error updating form:", error.message); // Handle error
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const data = {
      user_query: inputValue,
      prompt_text:
        selectedForm?.form_type.questions[selectedPoint].subpoints[
          selectedSubpoint
        ].prompt || "",
      form_name: selectedForm?.name || "",
    };

    console.log(data);
    setInputValue("");
    // Trigger the mutation
    mutation.mutate(data);
  };

  return (
    <div className="flex flex-col justify-end h-full">
      <div className="flex gap-4 items-center">
        <label className="form-control">
          <div className="label">
            <span className="label-text">Your bio</span>
          </div>
          <textarea
            className="textarea textarea-bordered h-12 min-w-80"
            placeholder="Bio"
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // Prevent newline from being added
                handleSubmit(e); // Call handleSubmit
              }
            }}
          ></textarea>
          <div className="label">
            <span className="label-text-alt">Alt label</span>
          </div>
        </label>
        <div className="btn btn-sm w-15 font-sans" onClick={handleSubmit}>
          Send
        </div>
      </div>
    </div>
  );
};

export default InputField;
