import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ClipboardCheck } from "lucide-react";

interface EvaluationResult {
  string: string;
}

interface EvaluateButtonProps {
  content: string;
}

const EvaluateButton: React.FC<EvaluateButtonProps> = ({ content }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<{
    criteria: EvaluationResult[];
    insights: EvaluationResult[];
  }>({
    criteria: [],
    insights: [],
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

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

    setIsLoading(true);
    setShowResults(false);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock response data
    const mockResults = {
      criteria: [
        { string: "Clear and concise writing style" },
        { string: "Proper grammar and punctuation" },
        { string: "Relevant to the topic" },
      ],
      insights: [
        { string: "Consider adding more specific examples" },
        { string: "Strong opening statement" },
        {
          string:
            "Could benefit from additional supporting details Could benefit from additional supporting details Could benefit from additional supporting details Could benefit from additional supporting details",
        },
      ],
    };

    setResults(mockResults);
    setIsLoading(false);
    setShowResults(true);
  };

  // Reset results when content changes
  useEffect(() => {
    setResults({ criteria: [], insights: [] });
  }, [content]);

  return (
    <div className="relative" ref={buttonRef}>
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

      {showResults && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-[calc(100%+0.5rem)] w-[600px] bg-white rounded-lg shadow-lg border border-gray-200 z-50"
        >
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
