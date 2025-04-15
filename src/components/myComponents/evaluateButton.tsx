import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ClipboardCheck } from "lucide-react";
import { Form } from "@/types/formType";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { BASE_URL } from "@/constants/constants";
import { useSaveSubpoint } from "@/hooks/useSaveSubpoint";
import { updateSelectedSubpoint } from "@/store/forms/formSlice";

// Utility type check function
function isFormIdObject(value: unknown): value is { $oid: string } {
  return (
    value !== null &&
    typeof value === "object" &&
    "$oid" in value &&
    typeof (value as { $oid: unknown }).$oid === "string"
  );
}

interface EvaluationResult {
  string: string;
}

interface EvaluateButtonProps {
  content: string;
}

interface EvaluationResponse {
  result: {
    criteria: string[];
    insights: string[];
    score: number;
  };
}

interface UpdateSubpointResponse {
  result: {
    improved_text: string;
  };
}

const EvaluateButton: React.FC<EvaluateButtonProps> = ({ content }) => {
  const { selectedForm, selectedPoint, selectedSubpoint } = useSelector(
    (state: RootState) => state.userForms
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<{
    criteria: EvaluationResult[];
    insights: EvaluationResult[];
    score: number;
  }>({
    criteria: [],
    insights: [],
    score: 0,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { save } = useSaveSubpoint();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const mockEvaluation = async () => {
    // If we already have results, just toggle visibility
    if (results.criteria.length > 0) {
      setShowResults(!showResults);
      return;
    }

    if (
      !selectedForm ||
      selectedPoint === undefined ||
      selectedSubpoint === undefined
    ) {
      console.error("No form, point, or subpoint selected");
      return;
    }

    setIsLoading(true);
    setShowResults(false);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Find the criteria for the selected subpoint using indices
      const formPoint = selectedForm.form_type.questions[selectedPoint];
      const subpointQuestion = formPoint?.subpoints[selectedSubpoint];
      const criteria = subpointQuestion?.criteria || "";

      const response = await fetch(`${BASE_URL}/evaluate-subpoint`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subpoint_text: content,
          criteria: criteria,
          form_name: selectedForm.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to evaluate subpoint");
      }

      const data = (await response.json()) as EvaluationResponse;

      // Transform the response into the expected format
      const transformedResults = {
        criteria: data.result.criteria.map((item) => ({ string: item })),
        insights: data.result.insights.map((item) => ({ string: item })),
        score: data.result.score,
      };

      setResults(transformedResults);
      setShowResults(true);
    } catch (error) {
      console.error("Error evaluating subpoint:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  // Reset results when content changes
  useEffect(() => {
    setResults({ criteria: [], insights: [], score: 0 });
  }, [content]);

  const handleModify = async () => {
    if (
      !selectedForm ||
      selectedPoint === undefined ||
      selectedSubpoint === undefined
    ) {
      console.error("No form, point, or subpoint selected");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `${BASE_URL}/update-subpoint-with-insights`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            subpoint_text: content,
            form_name: selectedForm.name,
            point: selectedPoint,
            subpoint: selectedSubpoint,
            criteria: results.criteria.map((item) => item.string),
            insights: results.insights.map((item) => item.string),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update subpoint with insights");
      }

      const data = (await response.json()) as UpdateSubpointResponse;

      // Update Redux state with the improved text
      dispatch(
        updateSelectedSubpoint({
          point: selectedPoint,
          subpoint: selectedSubpoint,
          content: data.result.improved_text,
        })
      );

      // Save the updated content to backend
      save(
        data.result.improved_text,
        selectedSubpoint,
        selectedPoint,
        isFormIdObject(selectedForm?.form_id)
          ? selectedForm.form_id.$oid
          : selectedForm?.form_id || "",
        selectedForm?.name || ""
      );

      // Close the results dropdown
      setShowResults(false);
    } catch (error) {
      console.error("Error updating subpoint with insights:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative" ref={buttonRef}>
      <div className="flex items-center gap-2">
        <Button
          variant="primary"
          onClick={mockEvaluation}
          className="flex items-center gap-2 rounded-[8px]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Evaluating...
            </>
          ) : (
            <>
              <ClipboardCheck className="h-4 w-4" />
              {results.criteria.length > 0 ? "Show Evaluation" : "Evaluate"}
            </>
          )}
        </Button>

        {results.criteria.length > 0 && (
          <Button
            variant="outline"
            onClick={handleModify}
            className="flex items-center gap-2 rounded-[8px]"
            disabled={isLoading}
          >
            <ClipboardCheck className="h-4 w-4" />
            Modify Based on Evaluation
          </Button>
        )}
      </div>

      {showResults && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-[calc(100%+0.5rem)] w-[600px] bg-white rounded-lg shadow-lg border border-gray-200 z-50"
        >
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Evaluation Results</h3>
              <div
                className={`text-md font-bold ${
                  results.score < 50
                    ? "text-red-500"
                    : results.score < 70
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                Score: {results.score}
              </div>
            </div>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 border-b">
                    Criteria
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 border-b">
                    Suggestion
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.criteria.map((criteria, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors border-b last:border-b-0"
                  >
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {criteria.string}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {results.insights[index]?.string}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluateButton;
