// "use client";

// import * as React from "react";
// import { cn } from "@/lib/utils";
// import { SelectionPopup } from "./selectonPopup";

// interface CanvaDivProps extends React.HTMLAttributes<HTMLDivElement> {
//   variant?: "default" | "newForm" | "secondary";
//   defaultValue?: string;
//   index: number;
// }

// export interface CanvaDivRef {
//   getValue: () => string;
//   setValue: (value: string) => void;
// }

// const CanvaDiv = React.forwardRef<CanvaDivRef, CanvaDivProps>(
//   ({ className, variant = "default", defaultValue = "", ...props }, ref) => {
//     const divRef = React.useRef<HTMLDivElement>(null);
//     const isInitialMount = React.useRef(true);
//     const [selection, setSelection] = React.useState<{
//       text: string;
//       rect: DOMRect | null;
//       isOpen: boolean;
//       savedRange: Range | null;
//     }>({ text: "", rect: null, isOpen: false, savedRange: null });
//     const preventSelectionClearRef = React.useRef(false);

//     const variantClasses = {
//       default:
//         "flex min-h-[60px] w-full rounded-md px-3 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
//       newForm:
//         "col-span-5 border border-grey-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
//       secondary: "bg-gray-50 border-gray-300 text-gray-700",
//     };

//     // Set initial content only once after mount
//     React.useEffect(() => {
//       if (isInitialMount.current && divRef.current) {
//         divRef.current.textContent = defaultValue;
//         isInitialMount.current = false;
//       }
//     }, [defaultValue]);

//     // Handle text selection
//     const handleSelectionChange = React.useCallback(() => {
//       // Skip if we're preventing selection clear during popup interaction
//       if (preventSelectionClearRef.current) return;

//       const windowSelection = window.getSelection();

//       if (
//         windowSelection &&
//         windowSelection.toString().trim() !== "" &&
//         divRef.current &&
//         divRef.current.contains(windowSelection.anchorNode)
//       ) {
//         const range = windowSelection.getRangeAt(0);
//         const selectedText = windowSelection.toString();
//         const rect = range.getBoundingClientRect();

//         // Clone the range to save it
//         const savedRange = range.cloneRange();

//         setSelection({
//           text: selectedText,
//           rect,
//           isOpen: true,
//           savedRange,
//         });
//       }
//     }, []);

//     // Create a global document-level handler for capturing mousedown events on popup
//     React.useEffect(() => {
//       // Handler for capturing events on the popup to prevent selection loss
//       const handleSelectionPreservation = (e: MouseEvent) => {
//         // Check if this is a popup interaction
//         if (!selection.isOpen) return;

//         let target = e.target as HTMLElement | null;
//         let isPopupClick = false;

//         // Walk up the DOM tree to see if we're clicking inside the popup
//         while (target) {
//           if (
//             target.classList &&
//             (target.classList.contains("selection-popup") ||
//               target.closest(".selection-popup"))
//           ) {
//             isPopupClick = true;
//             break;
//           }
//           target = target.parentElement;
//         }

//         // If it's a popup click, prevent selection from being cleared
//         if (isPopupClick) {
//           e.preventDefault();
//           e.stopPropagation();

//           // Set flag to prevent selection handling
//           preventSelectionClearRef.current = true;

//           // Restore selection
//           if (selection.savedRange) {
//             try {
//               const windowSelection = window.getSelection();
//               if (windowSelection) {
//                 windowSelection.removeAllRanges();
//                 windowSelection.addRange(selection.savedRange);
//               }
//             } catch (err) {
//               console.error("Failed to restore selection:", err);
//             }
//           }

//           // Reset flag after a short delay
//           setTimeout(() => {
//             preventSelectionClearRef.current = false;
//           }, 100);
//         }
//       };

//       // Add in capture phase to intercept before default browser behavior
//       document.addEventListener("mousedown", handleSelectionPreservation, true);

//       return () => {
//         document.removeEventListener(
//           "mousedown",
//           handleSelectionPreservation,
//           true
//         );
//       };
//     }, [selection.isOpen, selection.savedRange]);

//     // Function to close the popup
//     const handleClosePopup = React.useCallback(() => {
//       setSelection((prev) => ({
//         ...prev,
//         isOpen: false,
//       }));

//       // Clear selection state completely after popup is closed
//       setTimeout(() => {
//         setSelection({ text: "", rect: null, isOpen: false, savedRange: null });
//       }, 150);
//     }, []);

//     // Add selection change listener
//     React.useEffect(() => {
//       document.addEventListener("selectionchange", handleSelectionChange);
//       return () => {
//         document.removeEventListener("selectionchange", handleSelectionChange);
//       };
//     }, [handleSelectionChange]);

//     // Handle mouse up to catch selection immediately
//     const handleMouseUp = () => {
//       if (!preventSelectionClearRef.current) {
//         handleSelectionChange();
//       }
//     };

//     // Expose methods to parent via ref
//     React.useImperativeHandle(ref, () => ({
//       getValue: () => divRef.current?.textContent || "",
//       setValue: (value: string) => {
//         if (divRef.current) {
//           // Save selection position
//           const selection = window.getSelection();
//           const hadFocus = document.activeElement === divRef.current;

//           // Update content
//           divRef.current.textContent = value;

//           // Restore focus if it was focused before
//           if (hadFocus) {
//             divRef.current.focus();

//             // Move cursor to end if we had focus
//             if (selection && divRef.current) {
//               const range = document.createRange();
//               range.selectNodeContents(divRef.current);
//               range.collapse(false); // collapse to end
//               selection.removeAllRanges();
//               selection.addRange(range);
//             }
//           }
//         }
//       },
//     }));

//     return (
//       <div className="relative">
//         <div
//           className={cn(
//             "flex min-h-[60px] w-full rounded-md px-3 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
//             variantClasses[variant],
//             className
//           )}
//           ref={divRef}
//           contentEditable={true}
//           suppressContentEditableWarning={true}
//           onMouseUp={handleMouseUp}
//           {...props}
//         />

//         {selection.isOpen && selection.text && selection.rect && (
//           <SelectionPopup
//             subpointText={defaultValue}
//             index={props.index}
//             selectedText={selection.text}
//             rect={selection.rect}
//             parentRef={divRef}
//             onClose={handleClosePopup}
//             savedSelection={selection.savedRange}
//           />
//         )}
//       </div>
//     );
//   }
// );

// CanvaDiv.displayName = "canvaDiv";

// export { CanvaDiv };

// OLD

"use client";

import * as React from "react";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useSaveSubpoint } from "@/hooks/useSaveSubpoint";
import {
  updateSelectedSubpoint,
  setSelectedSubpoint,
} from "@/store/forms/formSlice";
import { cn } from "@/lib/utils";
import { SelectionPopup } from "./selectonPopup";

// Utility type check function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isFormIdObject(value: any): value is { $oid: string } {
  return value && typeof value === "object" && "$oid" in value;
}

interface CanvaDivProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "newForm" | "secondary";
  defaultValue?: string;
  index: number;
  onContentChange?: (value: string) => void; // Optional callback for content changes
  onSelection?: (selectedText: string) => void; // Optional callback for text selection
}

export interface CanvaDivRef {
  getValue: () => string;
  setValue: (value: string) => void;
  highlightText: (text: string, className: string) => void;
  removeHighlights: () => void;
  focus: () => void;
}

interface TextSegment {
  id: string;
  text: string;
  className?: string;
}

const CanvaDiv = forwardRef<CanvaDivRef, CanvaDivProps>(
  (
    {
      className,
      variant = "default",
      defaultValue = "",
      index,
      onContentChange,
      onSelection,
      ...props
    },
    ref
  ) => {
    const dispatch = useDispatch();
    const { selectedForm, selectedPoint } = useSelector(
      (state: RootState) => state.userForms
    );
    const { save } = useSaveSubpoint();

    const divRef = useRef<HTMLDivElement>(null);
    const isInitialMount = useRef(true);
    const [segments, setSegments] = useState<TextSegment[]>([]);
    const [plainText, setPlainText] = useState<string>(defaultValue);
    const [selection, setSelection] = useState<{
      text: string;
      rect: DOMRect | null;
      isOpen: boolean;
    }>({ text: "", rect: null, isOpen: false });
    const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
      null
    );

    // Get current content from Redux store
    const currentContent =
      selectedForm?.points?.[selectedPoint]?.subpoints?.[index]?.content || "";

    const variantClasses = {
      default:
        "min-h-[60px] w-full rounded-md px-3 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      newForm:
        "col-span-5 border border-grey-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
      secondary: "bg-gray-50 border-gray-300 text-gray-700",
    };

    // Generate a unique ID for segments
    const generateId = () => crypto.randomUUID();

    // Initialize segments with default text
    useEffect(() => {
      if (isInitialMount.current) {
        setSegments([{ id: generateId(), text: defaultValue }]);
        setPlainText(defaultValue);
        isInitialMount.current = false;
      }
    }, [defaultValue]);

    // Update content when it changes in Redux
    useEffect(() => {
      if (plainText !== currentContent && currentContent !== "") {
        setPlainText(currentContent);
        setSegments([{ id: generateId(), text: currentContent }]);

        // Update the DOM directly to prevent cursor jump
        if (divRef.current) {
          // Store current selection
          const selection = window.getSelection();
          let savedRange = null;

          if (selection && selection.rangeCount > 0) {
            savedRange = selection.getRangeAt(0).cloneRange();
          }

          // Only update inner content if it differs
          if (divRef.current.innerText !== currentContent) {
            // Clear the div and add the new content
            divRef.current.innerHTML = "";
            const span = document.createElement("span");
            span.textContent = currentContent;
            span.dataset.segmentId = generateId();
            divRef.current.appendChild(span);
          }

          // Restore selection if we had one
          if (savedRange && document.activeElement === divRef.current) {
            selection?.removeAllRanges();
            selection?.addRange(savedRange);
          }
        }
      }
    }, [currentContent, plainText]);

    // Save content to Redux and backend
    const saveContent = useCallback(
      (value: string) => {
        // Update Redux state
        dispatch(
          updateSelectedSubpoint({
            point: selectedPoint,
            subpoint: index,
            content: value,
          })
        );

        // Save to backend with debounce
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }

        const timer = setTimeout(() => {
          save(
            value,
            index,
            selectedPoint,
            isFormIdObject(selectedForm?.form_id)
              ? selectedForm.form_id.$oid
              : selectedForm?.form_id || "",
            selectedForm?.name || ""
          );
        }, 5000);

        setDebounceTimer(timer);

        // Call optional onContentChange prop
        if (onContentChange) {
          onContentChange(value);
        }
      },
      [
        debounceTimer,
        dispatch,
        index,
        onContentChange,
        save,
        selectedForm,
        selectedPoint,
      ]
    );

    // Highlight specific text with a CSS class
    const highlightText = useCallback(
      (textToHighlight: string, highlightClass: string) => {
        if (!textToHighlight || !divRef.current) return;

        // First, normalize the text to ensure we're working with the same representation
        const normalizedText = plainText.normalize();
        const normalizedHighlight = textToHighlight.normalize();

        // Find the indices of all occurrences (in case there are multiple)
        const indices: number[] = [];
        let startPos = 0;
        let pos: number;

        while (
          (pos = normalizedText.indexOf(normalizedHighlight, startPos)) !== -1
        ) {
          indices.push(pos);
          startPos = pos + normalizedHighlight.length;
        }

        // If no occurrences found, return
        if (indices.length === 0) return;

        // Create new segments
        const newSegments: TextSegment[] = [];
        let lastEnd = 0;

        // Process each occurrence
        for (const startIndex of indices) {
          const endIndex = startIndex + normalizedHighlight.length;

          // Add text before this occurrence
          if (startIndex > lastEnd) {
            newSegments.push({
              id: generateId(),
              text: plainText.substring(lastEnd, startIndex),
            });
          }

          // Add the highlighted segment
          newSegments.push({
            id: generateId(),
            text: plainText.substring(startIndex, endIndex),
            className: highlightClass,
          });

          lastEnd = endIndex;
        }

        // Add any remaining text
        if (lastEnd < plainText.length) {
          newSegments.push({
            id: generateId(),
            text: plainText.substring(lastEnd),
          });
        }

        setSegments(newSegments);
      },
      [plainText]
    );

    // Remove all highlights and return to plain text
    const removeHighlights = useCallback(() => {
      setSegments([{ id: generateId(), text: plainText }]);
    }, [plainText]);

    // Handle text selection from CanvaDiv
    const handleSelectionChange = useCallback(() => {
      const windowSelection = window.getSelection();

      if (
        windowSelection &&
        windowSelection.toString().trim() !== "" &&
        divRef.current &&
        divRef.current.contains(windowSelection.anchorNode)
      ) {
        const range = windowSelection.getRangeAt(0);
        const selectedText = windowSelection.toString();

        // Set the selected subpoint in Redux
        dispatch(setSelectedSubpoint(index));

        // Notify through callback if provided
        if (onSelection) {
          onSelection(selectedText);
        }

        const tempRange = range.cloneRange();
        const rect = tempRange.getBoundingClientRect();

        // Store the selection rect as a DOMRect object that accounts for scrolling
        const selectionRect = new DOMRect(
          rect.left,
          rect.top,
          rect.width,
          rect.height
        );

        setSelection({ text: selectedText, rect: selectionRect, isOpen: true });
      }
    }, [dispatch, index, onSelection]);

    // Handle input from the contentEditable div - this is key to fixing the cursor jump issue
    const handleInput = useCallback(
      (e: React.FormEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        const newText = target.innerText || "";

        // Only update if text actually changed to avoid unnecessary rerenders
        if (newText !== plainText) {
          // Update the plain text state
          setPlainText(newText);

          // We don't need to update segments here, as that can cause cursor jumps
          // Instead, keep the DOM structure intact and just track the text

          // Save the new content
          saveContent(newText);
        }
      },
      [plainText, saveContent]
    );

    // Function to close the popup
    const handleClosePopup = useCallback(() => {
      setSelection((prev) => ({
        ...prev,
        isOpen: false,
      }));

      // Clear selection after popup is closed
      setTimeout(() => {
        if (!selection.isOpen) {
          setSelection({ text: "", rect: null, isOpen: false });
        }
      }, 150); // Small delay to ensure popup animations complete
    }, [selection.isOpen]);

    // Add selection change listener
    useEffect(() => {
      document.addEventListener("selectionchange", handleSelectionChange);
      return () => {
        document.removeEventListener("selectionchange", handleSelectionChange);
      };
    }, [handleSelectionChange]);

    // Handle mouse up to catch selection immediately and highlight text
    const handleMouseUp = () => {
      handleSelectionChange();

      // Get the current selection
      const windowSelection = window.getSelection();
      if (
        windowSelection &&
        windowSelection.toString().trim() !== "" &&
        divRef.current &&
        divRef.current.contains(windowSelection.anchorNode)
      ) {
        const selectedText = windowSelection.toString();
        // Highlight the selected text with red background
        highlightText(selectedText, "bg-red-200");
      }
    };

    // Auto-adjust height function
    const adjustHeight = useCallback(() => {
      if (divRef.current) {
        divRef.current.style.height = "auto";
        divRef.current.style.height = `${divRef.current.scrollHeight}px`;
        divRef.current.style.overflowY = "hidden";
      }
    }, []);

    // Adjust height whenever segments change or text changes
    useEffect(() => {
      adjustHeight();
    }, [segments, plainText, adjustHeight]);

    // Set up resize observer to adjust height when content changes
    useEffect(() => {
      if (!divRef.current) return;

      // Create resize observer
      const resizeObserver = new ResizeObserver(() => {
        adjustHeight();
      });

      resizeObserver.observe(divRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }, [adjustHeight]);

    // Handle window resize
    useEffect(() => {
      window.addEventListener("resize", adjustHeight);
      return () => window.removeEventListener("resize", adjustHeight);
    }, [adjustHeight]);

    // Expose methods to parent via ref
    useImperativeHandle(ref, () => ({
      getValue: () => plainText,
      setValue: (value: string) => {
        if (divRef.current) {
          // Save selection status
          const hadFocus = document.activeElement === divRef.current;
          const selection = window.getSelection();
          let savedRange = null;

          if (selection && selection.rangeCount > 0 && hadFocus) {
            savedRange = selection.getRangeAt(0).cloneRange();
          }

          // Update states
          setPlainText(value);
          setSegments([{ id: generateId(), text: value }]);

          // Update DOM directly
          divRef.current.innerHTML = "";
          const span = document.createElement("span");
          span.textContent = value;
          span.dataset.segmentId = generateId();
          divRef.current.appendChild(span);

          // Restore focus if it was focused before
          if (hadFocus) {
            divRef.current.focus();

            // Try to restore selection position
            if (savedRange) {
              try {
                selection?.removeAllRanges();
                selection?.addRange(savedRange);
              } catch {
                // If restoring fails, move cursor to end
                const range = document.createRange();
                if (divRef.current.lastChild) {
                  range.selectNodeContents(divRef.current.lastChild);
                  range.collapse(false); // collapse to end
                  selection?.removeAllRanges();
                  selection?.addRange(range);
                }
              }
            }
          }

          // Save the new content
          saveContent(value);
        }
      },
      highlightText,
      removeHighlights,
      focus: () => {
        if (divRef.current) {
          divRef.current.focus();

          // Place cursor at the end
          const selection = window.getSelection();
          if (selection && divRef.current.lastChild) {
            const range = document.createRange();
            range.selectNodeContents(divRef.current.lastChild);
            range.collapse(false); // collapse to end
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
      },
    }));

    // Clean up debounce timer on unmount
    useEffect(() => {
      return () => {
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }
      };
    }, [debounceTimer]);

    return (
      <div className="relative overflow-visible">
        <div
          className={cn(
            "block whitespace-pre-wrap text-left min-h-[60px] w-full rounded-md px-3 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none bg-[#FCFAF4]",
            variantClasses[variant],
            className
          )}
          ref={divRef}
          contentEditable={true}
          suppressContentEditableWarning={true}
          onInput={handleInput}
          onMouseUp={handleMouseUp}
          {...props}
        >
          {segments.map((segment) => (
            <span
              key={segment.id}
              className={segment.className}
              data-segment-id={segment.id}
            >
              {segment.text}
            </span>
          ))}
        </div>

        {selection.isOpen && selection.text && selection.rect && (
          <SelectionPopup
            subpointText={plainText}
            index={index}
            selectedText={selection.text}
            rect={selection.rect}
            parentRef={divRef}
            onClose={handleClosePopup}
          />
        )}
      </div>
    );
  }
);

CanvaDiv.displayName = "CanvaDiv";

export { CanvaDiv };

// Usage example for CanvaDiv (can be removed when implementing)
// const MyComponent = () => {
//   const divRef = useRef<CanvaDivRef>(null);
//   return (
//     <CanvaDiv
//       ref={divRef}
//       index={0}
//       defaultValue="Initial text"
//       className="custom-class"
//     />
//   );
// };
