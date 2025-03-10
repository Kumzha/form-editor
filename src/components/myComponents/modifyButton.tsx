"use client";

import type React from "react";
import { useRef, useState } from "react";
import { updateSelectedSubpoint } from "@/store/forms/formSlice";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "@/constants/constants";
import { useSaveSubpoint } from "@/hooks/useSaveSubpoint";
import { useMutation } from "@tanstack/react-query";
import type { RootState } from "@/store/store";
import { FaMagic } from "react-icons/fa";
import { toast } from "sonner";
import { Input } from "../ui/input";

interface ModifyProps {
  selectedText: string;
  subpointText: string;
  query: string;
  formName: string;
  subpointIndex: number;
  index: number;
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

// Track active modify operations
const activeModifyOperations = new Set<string>();

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
  subpointIndex,
}) => {
  const dispatch = useDispatch();

  const { selectedForm, selectedPoint } = useSelector(
    (state: RootState) => state.userForms
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userPrompt, setUserPrompt] = useState<string>("");

  const handlePromptChange = (value: string) => {
    setUserPrompt(value);
  };

  const { save } = useSaveSubpoint();

  // Store the target point and subpoint
  const targetPoint = useRef(selectedPoint);
  const targetSubpoint = useRef(subpointIndex);

  // Create a key for this specific modification
  const modifyKey = `${selectedPoint}-${subpointIndex}`;
  const isModifyActive = activeModifyOperations.has(modifyKey);

  const modifyMutation = useMutation<ApiResponse, Error, UpdateFieldRequest>({
    mutationFn: updateField,
    onMutate: () => {
      // Mark this operation as active
      activeModifyOperations.add(modifyKey);
      // Store the current targets
      targetPoint.current = selectedPoint;
      targetSubpoint.current = subpointIndex;
    },
    onSuccess: (data) => {
      // Update the specific subpoint that was modified
      dispatch(
        updateSelectedSubpoint({
          point: targetPoint.current,
          subpoint: targetSubpoint.current,
          content: data.result,
        })
      );

      save(
        data.result,
        targetSubpoint.current,
        targetPoint.current,
        isFormIdObject(selectedForm?.form_id)
          ? selectedForm.form_id.$oid
          : selectedForm?.form_id || "",
        selectedForm?.name || ""
      );
    },
    onError: (error) => {
      console.error("Error updating form:", error.message);
      toast.error(`Error: ${error.message}`);
    },
    onSettled: () => {
      // Remove from active operations
      activeModifyOperations.delete(modifyKey);
    },
  });

  const handleSubmit = async () => {
    if (!userPrompt || !query || !formName || !subpointText) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (isModifyActive) return;

    const data: UpdateFieldRequest = {
      user_query: userPrompt,
      prompt_text: query,
      form_name: formName,
      subpoint_text: subpointText,
    };

    modifyMutation.mutate(data);
  };

  const isPending = modifyMutation.isPending || isModifyActive;

  return (
    <div className="flex flex-row w-full h-8 items-center">
      {" "}
      <Input
        onChange={(e) => handlePromptChange(e.target.value)}
        placeholder="Enter your prompt"
        className="bg-[#FCFAF4] mx-1 w-full rounded-2xl border-none"
        value={userPrompt}
        disabled={isPending}
      />
      <div
        className={`
        relative inline-block text-left bg-[#524CE7] rounded-xl text-[#FCFAF4] p-2 
        transform transition duration-150 ease-in-out 
        ${
          isPending
            ? "cursor-wait"
            : "hover:scale-105 active:scale-95 cursor-pointer"
        }
        ${
          isPending
            ? "shadow-inner shadow-[#3a36a3]"
            : "shadow-sm hover:shadow-md"
        }
      `}
        onClick={isPending ? undefined : handleSubmit}
        aria-disabled={isPending}
      >
        <div className="relative">
          {isPending ? (
            <div className="flex items-center justify-center">
              <FaMagic className="animate-pulse opacity-70" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="h-4 w-4 rounded-full border-2 border-t-transparent border-[#FCFAF4] animate-spin"></span>
              </span>
            </div>
          ) : (
            <FaMagic />
          )}
        </div>

        {/* Ripple effect when active */}
        {isPending && (
          <span className="absolute inset-0 rounded-xl overflow-hidden">
            <span className="absolute inset-0 rounded-xl bg-white/20 animate-ping opacity-30"></span>
          </span>
        )}
      </div>
    </div>
  );
};

export default ModifyButton;
