"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SelectionPopup } from "./selectonPopup";

interface CanvaDivProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "newForm" | "secondary";
  defaultValue?: string;
  index: number;
}

export interface CanvaDivRef {
  getValue: () => string;
  setValue: (value: string) => void;
}

const CanvaDiv = React.forwardRef<CanvaDivRef, CanvaDivProps>(
  (
    { className, variant = "default", defaultValue = "", index, ...props },
    ref
  ) => {
    const divRef = React.useRef<HTMLDivElement>(null);
    const isInitialMount = React.useRef(true);
    const [selection, setSelection] = React.useState<{
      text: string;
      rect: DOMRect | null;
      isOpen: boolean;
      range: {
        startContainer: Node | null;
        startOffset: number;
        endContainer: Node | null;
        endOffset: number;
      };
    }>({
      text: "",
      rect: null,
      isOpen: false,
      range: {
        startContainer: null,
        startOffset: 0,
        endContainer: null,
        endOffset: 0,
      },
    });

    const variantClasses = {
      default:
        "flex min-h-[60px] w-full rounded-md px-3 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      newForm:
        "col-span-5 border border-grey-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      secondary: "bg-gray-50 border-gray-300 text-gray-700",
    };

    // Set initial content only once after mount
    React.useEffect(() => {
      if (isInitialMount.current && divRef.current) {
        divRef.current.textContent = defaultValue;
        isInitialMount.current = false;
      }
    }, [defaultValue]);

    // Handle text selection
    const handleSelectionChange = React.useCallback(() => {
      const windowSelection = window.getSelection();

      if (
        windowSelection &&
        windowSelection.toString().trim() !== "" &&
        divRef.current &&
        divRef.current.contains(windowSelection.anchorNode)
      ) {
        const range = windowSelection.getRangeAt(0);
        const selectedText = windowSelection.toString();

        // Force a more accurate positioning by creating a temporary range
        // This helps with position accuracy across different text areas
        const tempRange = range.cloneRange();
        const rect = tempRange.getBoundingClientRect();

        // Store the selection rect as a DOMRect object that accounts for scrolling
        const selectionRect = new DOMRect(
          rect.left,
          rect.top,
          rect.width,
          rect.height
        );

        // Store the range information for reselection
        setSelection({
          text: selectedText,
          rect: selectionRect,
          isOpen: true,
          range: {
            startContainer: range.startContainer,
            startOffset: range.startOffset,
            endContainer: range.endContainer,
            endOffset: range.endOffset,
          },
        });
      }
    }, []);

    // Function to close the popup
    const handleClosePopup = React.useCallback(() => {
      setSelection((prev) => ({
        ...prev,
        isOpen: false,
      }));

      // Clear selection after popup is closed
      setTimeout(() => {
        if (!selection.isOpen) {
          setSelection((prev) => ({
            ...prev,
            text: "",
            rect: null,
            isOpen: false,
          }));
        }
      }, 150); // Small delay to ensure popup animations complete
    }, [selection.isOpen]);

    // Create the reselect function
    const reselectText = React.useCallback(() => {
      if (
        selection.range.startContainer &&
        selection.range.endContainer &&
        divRef.current &&
        divRef.current.contains(selection.range.startContainer) &&
        divRef.current.contains(selection.range.endContainer)
      ) {
        const windowSelection = window.getSelection();
        if (windowSelection) {
          const range = document.createRange();

          // Set the start and end positions from our stored range
          range.setStart(
            selection.range.startContainer,
            selection.range.startOffset
          );
          range.setEnd(selection.range.endContainer, selection.range.endOffset);

          // Apply the selection
          windowSelection.removeAllRanges();
          windowSelection.addRange(range);

          // Update popup visibility
          setSelection((prev) => ({
            ...prev,
            isOpen: true,
          }));

          // Optionally, scroll the selected text into view
          const rect = range.getBoundingClientRect();
          if (rect) {
            window.scrollTo({
              top: window.scrollY + rect.top - window.innerHeight / 2,
              behavior: "smooth",
            });
          }

          return true;
        }
      }
      return false;
    }, [selection.range]);

    // Add selection change listener
    React.useEffect(() => {
      document.addEventListener("selectionchange", handleSelectionChange);
      return () => {
        document.removeEventListener("selectionchange", handleSelectionChange);
      };
    }, [handleSelectionChange]);

    // Handle mouse up to catch selection immediately
    const handleMouseUp = () => {
      handleSelectionChange();
    };

    // Expose methods to parent via ref
    React.useImperativeHandle(ref, () => ({
      getValue: () => divRef.current?.textContent || "",
      setValue: (value: string) => {
        if (divRef.current) {
          // Save selection position
          const selection = window.getSelection();
          const hadFocus = document.activeElement === divRef.current;

          // Update content
          divRef.current.textContent = value;

          // Restore focus if it was focused before
          if (hadFocus) {
            divRef.current.focus();

            // Move cursor to end if we had focus
            if (selection && divRef.current) {
              const range = document.createRange();
              range.selectNodeContents(divRef.current);
              range.collapse(false); // collapse to end
              selection.removeAllRanges();
              selection.addRange(range);
            }
          }
        }
      },
    }));

    return (
      <div className="relative">
        <div
          className={cn(
            "flex min-h-[60px] w-full rounded-md px-3 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            variantClasses[variant],
            className
          )}
          ref={divRef}
          contentEditable={true}
          suppressContentEditableWarning={true}
          onMouseUp={handleMouseUp}
          {...props}
        />

        {selection.isOpen && selection.text && selection.rect && (
          <SelectionPopup
            subpointText={defaultValue}
            index={index}
            selectedText={selection.text}
            rect={selection.rect}
            parentRef={divRef}
            onClose={handleClosePopup}
            reselectText={reselectText}
          />
        )}
      </div>
    );
  }
);

CanvaDiv.displayName = "canvaDiv";

export { CanvaDiv };
