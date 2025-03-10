"use client";

import { useState, useRef, useEffect } from "react";

interface HighlightRange {
  start: number;
  end: number;
  id: string;
}

export default function TextHighlighter() {
  const [text, setText] = useState(
    "This is a sample text that you can highlight. Try selecting a part of this text to see it get highlighted with a red background."
  );
  const [highlightedText, setHighlightedText] = useState<string>("");
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const isHighlightingRef = useRef<boolean>(false);

  useEffect(() => {
    // Initialize the contentEditable with the text
    if (contentEditableRef.current) {
      contentEditableRef.current.textContent = text;
    }
  }, [text]);

  const handleSelection = () => {
    if (isHighlightingRef.current) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !contentEditableRef.current) {
      return;
    }

    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    // Get the current text content (without any existing highlights)
    const currentText = contentEditableRef.current.textContent || "";

    // Find the position of the selected text in the content
    const range = selection.getRangeAt(0);

    // Create a temporary range to calculate the start position
    const tempRange = document.createRange();
    tempRange.setStart(contentEditableRef.current, 0);
    tempRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = tempRange.toString().length;

    // Calculate the end position
    const endOffset = startOffset + selectedText.length;

    // Create a new highlight
    const newHighlight: HighlightRange = {
      start: startOffset,
      end: endOffset,
      id: `highlight-${Date.now()}`,
    };

    // Update highlight state
    setHighlightedText(selectedText);

    // Apply the highlight without modifying the DOM structure
    applyHighlight(newHighlight, currentText);

    // Prevent default browser text selection behavior
    selection.removeAllRanges();
  };

  const applyHighlight = (
    highlightRange: HighlightRange | null,
    currentText: string
  ) => {
    if (!contentEditableRef.current) return;
    isHighlightingRef.current = true;

    if (highlightRange) {
      // Make sure we're working with the accurate text content
      const textContent =
        currentText || contentEditableRef.current.textContent || "";

      // Split the text into three parts: before, highlighted, and after
      const beforeText = textContent.substring(0, highlightRange.start);
      const highlightedText = textContent.substring(
        highlightRange.start,
        highlightRange.end
      );
      const afterText = textContent.substring(highlightRange.end);

      // Create the HTML with the highlight span, being careful not to add extra spaces
      contentEditableRef.current.innerHTML =
        beforeText +
        `<span class="bg-red-500 text-white">${highlightedText}</span>` +
        afterText;
    } else {
      // If no highlight, just set the plain text
      contentEditableRef.current.textContent = currentText;
    }

    isHighlightingRef.current = false;
  };

  const handleInput = () => {
    if (!contentEditableRef.current || isHighlightingRef.current) return;

    // When typing, update the text state and clear any highlight
    const newText = contentEditableRef.current.textContent || "";
    setText(newText);
    // setHighlightedText("");
  };

  const removeHighlight = () => {
    if (!contentEditableRef.current) return;

    // Get the current text without formatting
    const plainText = contentEditableRef.current.textContent || "";

    // Clear the highlight state
    setHighlightedText("");

    // Set the content to plain text
    contentEditableRef.current.textContent = plainText;
  };

  // Handle pasting to strip formatting
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto mt-10">
      <div
        ref={contentEditableRef}
        className="p-4 border rounded-md shadow-sm bg-white min-h-32"
        contentEditable
        onMouseUp={handleSelection}
        onInput={handleInput}
        onBlur={handleInput}
        onPaste={handlePaste}
        suppressContentEditableWarning
      ></div>
      <div className="mt-4 flex gap-2">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded"
          onClick={removeHighlight}
        >
          Clear Highlight
        </button>
        <button
          className="px-3 py-1 bg-gray-200 rounded"
          onClick={() => console.log(highlightedText)}
        >
          Check Highlight
        </button>
      </div>
    </div>
  );
}
