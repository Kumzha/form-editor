import React, { useState, useRef } from "react";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { updateSelectedSubpoint } from "@/store/forms/formSlice";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "@/constants/constants";
import { useSaveSubpoint } from "@/hooks/useSaveSubpoint";

type InspireRequestSchema = {
  user_query: string;
  prompt_text: string;
  form_name: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isFormIdObject(value: any): value is { $oid: string } {
  return value && typeof value === "object" && "$oid" in value;
}

// Keep track of which subpoints are currently fetching
const activeSubpointFetches = new Set<string>();

const InspireButton: React.FC = () => {
  const dispatch = useDispatch();
  const { selectedForm, selectedPoint, selectedSubpoint } = useSelector(
    (state: RootState) => state.userForms
  );
  const { save } = useSaveSubpoint();
  const [isFetching, setIsFetching] = useState(false);
  const finalTextRef = useRef<string>("");

  // Store the initial subpoint and point that the inspire was triggered for
  const targetSubpoint = useRef(selectedSubpoint);
  const targetPoint = useRef(selectedPoint);

  // Create a key for this specific point+subpoint
  const fetchKey = `${selectedPoint}-${selectedSubpoint}`;

  // Check if this specific subpoint is already being processed
  const isSubpointActive = activeSubpointFetches.has(fetchKey);

  const handleUpdateSubpoint = (value: string) => {
    dispatch(
      updateSelectedSubpoint({
        point: targetPoint.current,
        subpoint: targetSubpoint.current,
        content: value,
      })
    );
  };

  const handleInspire = async () => {
    if (
      isFetching ||
      isSubpointActive ||
      !selectedForm ||
      selectedPoint === null ||
      selectedSubpoint === null
    ) {
      return;
    }

    // Store the current selection as the target for this inspire instance
    targetSubpoint.current = selectedSubpoint;
    targetPoint.current = selectedPoint;

    // Mark this subpoint as active
    activeSubpointFetches.add(fetchKey);
    setIsFetching(true);

    const prompt =
      selectedForm.form_type?.questions?.[selectedPoint]?.subpoints?.[
        selectedSubpoint
      ]?.prompt || "";
    const formName = selectedForm.name || "";
    const userQuery = prompt;

    const data: InspireRequestSchema = {
      user_query: userQuery,
      prompt_text: prompt,
      form_name: formName,
    };

    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`${BASE_URL}/retrieval/generate-field`, {
        method: "POST",
        headers: {
          accept: "text/plain",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to fetch stream");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        accumulatedText += chunk;

        finalTextRef.current = accumulatedText;

        // Update the specific subpoint that this inspire was started for
        handleUpdateSubpoint(accumulatedText);
      }

      // Save final generated text
      save(
        finalTextRef.current,
        targetSubpoint.current,
        targetPoint.current,
        isFormIdObject(selectedForm?.form_id)
          ? selectedForm.form_id.$oid
          : selectedForm?.form_id || "",
        selectedForm?.name || ""
      );
    } catch (error) {
      console.error("Error inspiring:", error);
    } finally {
      // Remove this subpoint from active fetches
      activeSubpointFetches.delete(fetchKey);
      setIsFetching(false);
    }
  };

  // Button is disabled only if THIS specific subpoint is already being fetched
  return (
    <Button
      variant="primary"
      onClick={handleInspire}
      disabled={isSubpointActive}
    >
      {isSubpointActive ? "Loading..." : "Inspire"}
    </Button>
  );
};

export default InspireButton;
