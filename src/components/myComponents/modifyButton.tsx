import React from "react";
import { updateSelectedSubpoint } from "@/store/forms/formSlice";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "@/constants/constants";
import { useSaveSubpoint } from "@/hooks/useSaveSubpoint";
import { useMutation } from "@tanstack/react-query";
import { RootState } from "@/store/store";
import { FaMagic } from "react-icons/fa";
import { toast } from "sonner";

interface ModifyProps {
  userPrompt: string;
  subpointText: string;
  query: string;
  formName: string;
  funcAfterSuccess: () => void;
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
  userPrompt,
  subpointText,
  query,
  formName,
  funcAfterSuccess,
}) => {
  const dispatch = useDispatch();

  const { selectedForm, selectedPoint, selectedSubpoint } = useSelector(
    (state: RootState) => state.userForms
  );

  const { save } = useSaveSubpoint();

  const modifyMutation = useMutation<ApiResponse, Error, UpdateFieldRequest>({
    mutationFn: updateField,
    onSuccess: (data) => {
      dispatch(updateSelectedSubpoint(data.result));

      save(
        data.result,
        selectedSubpoint,
        selectedPoint,
        isFormIdObject(selectedForm?.form_id)
          ? selectedForm.form_id.$oid
          : selectedForm?.form_id || "",
        selectedForm?.name || ""
      );
      funcAfterSuccess();
    },
    onError: (error) => {
      console.error("Error updating form:", error.message);
    },
  });

  const isFetching = modifyMutation.status === "pending";

  const handleSubmit = async () => {
    if (!userPrompt || !query || !formName || !subpointText) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (isFetching) return;

    const data: UpdateFieldRequest = {
      user_query: userPrompt,
      prompt_text: query,
      form_name: formName,
      subpoint_text: subpointText,
    };

    modifyMutation.mutate(data);
  };

  return (
    <div className="relative inline-block text-left bg-[#524CE7] rounded-xl text-[#FCFAF4] p-2 transform transition duration-150 ease-in-out hover:scale-105 active:scale-95 cursor-pointer">
      <FaMagic onClick={handleSubmit} />
    </div>
  );
};

export default ModifyButton;
