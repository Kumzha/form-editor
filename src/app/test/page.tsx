"use client";
import { SelectionPopup } from "@/components/myComponents/selectonPopup";
import { useState, useRef, useEffect } from "react";

interface HighlightRange {
  start: number;
  end: number;
  id: string;
  rect: DOMRect | null;
}

export default function TextHighlighter() {
  const [text, setText] = useState(
    "This is a sample text that you can highlight. Try selecting a part of this text to see it get highlighted with a red background."
  );
  const [highlight, setHighlight] = useState<HighlightRange | null>(null);
  const [selectedText, setSelectedText] = useState<string>("");
  const [selection, setSelection] = useState<Selection | null>(null);
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // Separate container for popup
  const isHighlightingRef = useRef<boolean>(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const isInputFocusedRef = useRef<boolean>(false);

  useEffect(() => {
    // Initialize the contentEditable with the text
    if (contentEditableRef.current) {
      contentEditableRef.current.textContent = text;
    }
  }, [text]);

  const handleClosePopup = () => {
    if (!isInputFocusedRef.current) {
      setIsPopupOpen(false);
    }
  };

  const handleSelection = () => {
    if (highlight) removeHighlight();

    // Skip if we're already highlighting or an input is focused
    if (isHighlightingRef.current || isInputFocusedRef.current) {
      console.log("skip");
      return;
    }

    const selectionTemp = window.getSelection();

    if (
      !selectionTemp ||
      selectionTemp.isCollapsed ||
      !contentEditableRef.current
    ) {
      console.log(selectionTemp);
      console.log(selectionTemp?.isCollapsed);
      console.log(contentEditableRef.current);
      return;
    }

    const selectedText = selectionTemp.toString().trim();

    if (!selectedText) {
      console.log("no text");
      return;
    }

    // Find the position of the selected text in the content
    const range = selectionTemp.getRangeAt(0);

    // Create a temporary range to calculate the start position
    const tempRange = document.createRange();
    tempRange.setStart(contentEditableRef.current, 0);
    tempRange.setEnd(range.startContainer, range.startOffset);
    const startOffset = tempRange.toString().length;

    // Calculate the end position
    const endOffset = startOffset + selectedText.length;

    // Get the bounding client rect of the selected text
    const rect = range.getBoundingClientRect();
    const selectionRect = new DOMRect(
      rect.left,
      rect.top,
      rect.width,
      rect.height
    );

    // Create a new highlight
    const newHighlight: HighlightRange = {
      start: startOffset,
      end: endOffset,
      id: `highlight-${Date.now()}`,
      rect: selectionRect,
    };

    setSelection(selectionTemp);
    setHighlight(newHighlight);
    setSelectedText(selectedText);
    setIsPopupOpen(true);
  };

  const clickPopup = () => {
    // First close the popup gracefully
    // Use a small timeout to ensure the portal is unmounted before we modify the DOM

    setTimeout(() => {
      applyHighlight(highlight);
      if (selection) {
        selection.removeAllRanges();
      }
    }, 10);
  };

  const applyHighlight = async (highlightRange: HighlightRange | null) => {
    if (!contentEditableRef.current) return;

    isHighlightingRef.current = true;

    if (highlightRange) {
      // Store current content
      const currentContent = contentEditableRef.current.textContent || "";

      // Split the text into three parts: before, highlighted, and after
      const beforeText = currentContent.substring(0, highlightRange.start);
      const highlightedText = currentContent.substring(
        highlightRange.start,
        highlightRange.end
      );
      const afterText = currentContent.substring(highlightRange.end);

      // Create the HTML with the highlight span, being careful not to add extra spaces
      contentEditableRef.current.innerHTML =
        beforeText +
        `<span class="bg-red-500 text-white">${highlightedText}</span>` +
        afterText;

      // Update text state to match the current content
      setText(currentContent);
    }

    isHighlightingRef.current = false;
  };

  const handleInput = () => {
    if (!contentEditableRef.current || isHighlightingRef.current) return;

    // When typing, update the text state and clear any highlight
    const newText = contentEditableRef.current.textContent || "";

    setText(newText);
    setHighlight(null);
  };

  const removeHighlight = () => {
    if (!contentEditableRef.current) return;
    console.log("removeHighlight");
    // Get the current text without formatting
    const plainText = contentEditableRef.current.textContent || "";

    setSelectedText("");
    setHighlight(null);
    setIsPopupOpen(false);

    // Set the content to plain text
    contentEditableRef.current.textContent = plainText;
  };

  // Handle pasting to strip formatting
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  // Track input focus state
  const handleInputFocus = (focused: boolean) => {
    isInputFocusedRef.current = focused;
  };

  return (
    <div className="p-6 max-w-2xl mx-auto mt-10" ref={containerRef}>
      <div
        ref={contentEditableRef}
        className="p-4 border rounded-md shadow-sm bg-white min-h-32"
        contentEditable
        onMouseDown={() => removeHighlight()}
        onSelect={handleSelection}
        onInput={handleInput}
        onPaste={handlePaste}
        suppressContentEditableWarning
      />

      {/* Render popup outside the contentEditable but inside the container */}
      {highlight && isPopupOpen && highlight.rect && (
        <SelectionPopup
          subpointText={text}
          index={0}
          selectedText={selectedText}
          rect={highlight.rect}
          parentRef={containerRef}
          onClose={handleClosePopup}
          onApply={clickPopup}
          onInputFocus={handleInputFocus} // Pass down the input focus handler
        />
      )}
    </div>
  );
}
