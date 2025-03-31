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
  onApply?: () => void; // Optional callback for apply action
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
      onApply,
      ...props
    },
    ref
  ) => {
    const dispatch = useDispatch();
    const { selectedForm, selectedPoint } = useSelector(
      (state: RootState) => state.userForms
    );
    const { save } = useSaveSubpoint();

    
    const [segments, setSegments] = useState<TextSegment[]>([]);
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
    // const highlightText = useCallback(
    //   (textToHighlight: string, highlightClass: string) => {
    //     if (!textToHighlight || !divRef.current) return;

    //     // First, normalize the text to ensure we're working with the same representation
    //     const normalizedText = plainText.normalize();
    //     const normalizedHighlight = textToHighlight.normalize();

    //     // Find the indices of all occurrences (in case there are multiple)
    //     const indices: number[] = [];
    //     let startPos = 0;
    //     let pos: number;

    //     while (
    //       (pos = normalizedText.indexOf(normalizedHighlight, startPos)) !== -1
    //     ) {
    //       indices.push(pos);
    //       startPos = pos + normalizedHighlight.length;
    //     }

    //     // If no occurrences found, return
    //     if (indices.length === 0) return;

    //     // Create new segments
    //     const newSegments: TextSegment[] = [];
    //     let lastEnd = 0;

    //     // Process each occurrence
    //     for (const startIndex of indices) {
    //       const endIndex = startIndex + normalizedHighlight.length;

    //       // Add text before this occurrence
    //       if (startIndex > lastEnd) {
    //         newSegments.push({
    //           id: generateId(),
    //           text: plainText.substring(lastEnd, startIndex),
    //         });
    //       }

    //       // Add the highlighted segment
    //       newSegments.push({
    //         id: generateId(),
    //         text: plainText.substring(startIndex, endIndex),
    //         className: highlightClass,
    //       });

    //       lastEnd = endIndex;
    //     }

    //     // Add any remaining text
    //     if (lastEnd < plainText.length) {
    //       newSegments.push({
    //         id: generateId(),
    //         text: plainText.substring(lastEnd),
    //       });
    //     }

    //     setSegments(newSegments);
    //   },
    //   [plainText]
    // );

    // Remove all highlights and return to plain text
    // const removeHighlights = useCallback(() => {
    //   setSegments([{ id: generateId(), text: plainText }]);
    // }, [plainText]);

    // Handle text selection from CanvaDiv
    // const handleSelectionChange = useCallback(() => {
    //   const windowSelection = window.getSelection();

    //   if (
    //     windowSelection &&
    //     windowSelection.toString().trim() !== "" &&
    //     divRef.current &&
    //     divRef.current.contains(windowSelection.anchorNode)
    //   ) {
    //     const range = windowSelection.getRangeAt(0);
    //     const selectedText = windowSelection.toString();

    //     // Set the selected subpoint in Redux
    //     dispatch(setSelectedSubpoint(index));

    //     // Notify through callback if provided
    //     if (onSelection) {
    //       onSelection(selectedText);
    //     }

    //     const tempRange = range.cloneRange();
    //     const rect = tempRange.getBoundingClientRect();

    //     // Store the selection rect as a DOMRect object that accounts for scrolling
    //     const selectionRect = new DOMRect(
    //       rect.left,
    //       rect.top,
    //       rect.width,
    //       rect.height
    //     );

    //     setSelection({ text: selectedText, rect: selectionRect, isOpen: true });
    //   }
    // }, [dispatch, index, onSelection]);

     // Handle input from the contentEditable div - this is key to fixing the cursor jump issue
    // const handleInput = useCallback(
    //   (e: React.FormEvent<HTMLDivElement>) => {
    //     const target = e.target as HTMLDivElement;
    //     const newText = target.innerText || "";

    //     // Only update if text actually changed to avoid unnecessary rerenders
    //     if (newText !== plainText) {
    //       // Update the plain text state
    //       setPlainText(newText);

    //       // We don't need to update segments here, as that can cause cursor jumps
    //       // Instead, keep the DOM structure intact and just track the text

    //       // Save the new content
    //       saveContent(newText);
    //     }
    //   },
    //   [plainText, saveContent]
    // );

    // Function to close the popup

    // OLD CLOSE POPUP FUNCTIONALITY
    // const handleClosePopup = useCallback(() => {
    //   setSelection((prev) => ({
    //     ...prev,
    //     isOpen: false,
    //   }));

    //   // Clear selection after popup is closed
    //   setTimeout(() => {
    //     if (!selection.isOpen) {
    //       setSelection({ text: "", rect: null, isOpen: false });
    //     }
    //   }, 150); // Small delay to ensure popup animations complete
    // }, [selection.isOpen]);

    // Add selection change listener
    // useEffect(() => {
    //   document.addEventListener("selectionchange", handleSelectionChange);
    //   return () => {
    //     document.removeEventListener("selectionchange", handleSelectionChange);
    //   };
    // }, [handleSelectionChange]);

    // Handle mouse up to catch selection immediately and highlight text
    // const handleMouseUp = () => {
    //   handleSelectionChange();

    //   // Get the current selection
    //   const windowSelection = window.getSelection();
    //   if (
    //     windowSelection &&
    //     windowSelection.toString().trim() !== "" &&
    //     divRef.current &&
    //     divRef.current.contains(windowSelection.anchorNode)
    //   ) {
    //     const selectedText = windowSelection.toString();
    //     // Highlight the selected text with red background
    //     highlightText(selectedText, "bg-red-200");
    //   }
    // };


    // // Expose methods to parent via ref
    // useImperativeHandle(ref, () => ({
    //   getValue: () => plainText,
    //   setValue: (value: string) => {
    //     if (divRef.current) {
    //       // Update states first and let React handle rendering
    //       setPlainText(value);
    //       setSegments([{ id: generateId(), text: value }]);
          
    //       // Only attempt to restore focus and cursor position
    //       try {
    //         const hadFocus = document.activeElement === divRef.current;
    //         if (hadFocus) {
    //           // Wait for React to update the DOM in the next tick
    //           setTimeout(() => {
    //             divRef.current?.focus();
                
    //             // Move cursor to end
    //             const selection = window.getSelection();
    //             if (selection && divRef.current?.lastChild) {
    //               const range = document.createRange();
    //               range.selectNodeContents(divRef.current.lastChild);
    //               range.collapse(false); // collapse to end
    //               selection.removeAllRanges();
    //               selection.addRange(range);
    //             }
    //           }, 0);
    //         }
    //       } catch (error) {
    //         console.error("Error restoring focus:", error);
    //       }
          
    //       // Save the new content
    //       saveContent(value);
    //     }
    //   },
    //   highlightText,
    //   removeHighlights,
    //   focus: () => {
    //     if (divRef.current) {
    //       divRef.current.focus();

    //       // Place cursor at the end
    //       const selection = window.getSelection();
    //       if (selection && divRef.current.lastChild) {
    //         const range = document.createRange();
    //         range.selectNodeContents(divRef.current.lastChild);
    //         range.collapse(false); // collapse to end
    //         selection.removeAllRanges();
    //         selection.addRange(range);
    //       }
    //     }
    //   },
    // }));

    // Clean up debounce timer on unmount
    useEffect(() => {
      return () => {
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }
      };
    }, [debounceTimer]);

    // NEW NEW NEW FUNCTIONALITY
        // NEW NEW NEW FUNCTIONALITY
            // NEW NEW NEW FUNCTIONALITY
                // NEW NEW NEW FUNCTIONALITY
                    // NEW NEW NEW FUNCTIONALITY
    interface HighlightRange {
        start: number;
        end: number;
        id: string;
        rect: DOMRect | null;
        }

    const [selectedText, setSelectedText] = useState<string>("");
    const [highlight, setHighlight] = useState<HighlightRange | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const contentEditableRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const isHighlightingRef = useRef<boolean>(false);
    const isInputFocusedRef = useRef<boolean>(false);
    const [selectionObject, setSelectionObject] = useState<Selection | null>(null);
    const [plainText, setPlainText] = useState<string>(defaultValue);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {

        // AR REIKALINGA
          setSegments([{ id: generateId(), text: defaultValue }]);
            
          setPlainText(defaultValue);


          isInitialMount.current = false;
        }
      }, [defaultValue]);
  
      // Update content when it changes in Redux
      useEffect(() => {
        // Always update when currentContent changes and doesn't match local state
        if (plainText !== currentContent) {
          console.log("Updating from Redux:", currentContent);
          
          // Update state
          setPlainText(currentContent);
          
          // Directly update DOM
          if (contentEditableRef.current) {
            contentEditableRef.current.textContent = currentContent;
          }
          
          // AR REIKALINGA
          setSegments([{ id: generateId(), text: currentContent }]);
        }
      }, [currentContent, plainText]);

    const removeHighlight = () => {
        if (!contentEditableRef.current) return;
        const plainText = contentEditableRef.current.textContent || "";
    
        setSelectedText("");
        setHighlight(null);
        setIsPopupOpen(false);

        if (contentEditableRef.current) {
            contentEditableRef.current.textContent = plainText;
        }
      };
    
    const handleSelection = () => {
        if (highlight) removeHighlight();
    
        // Skip if we're already highlighting or an input is focused
        if (isHighlightingRef.current || isInputFocusedRef.current) {
          return;
        }
    
        const selectionTemp = window.getSelection();
    
        if (
          !selectionTemp ||
          selectionTemp.isCollapsed ||
          !contentEditableRef.current
        ) {
          return;
        }
    
        const selectedText = selectionTemp.toString().trim();
    
        if (!selectedText) {
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
    
        setSelectionObject(selectionTemp);
        setHighlight(newHighlight);
        setSelectedText(selectedText);
        setIsPopupOpen(true);
      };

      // Learn how this works
      const adjustHeight = useCallback(() => {
        if (contentEditableRef.current) {
          // Store the current scroll position
          const scrollPos = window.scrollY;
          
          // Reset height to calculate the real content height
          contentEditableRef.current.style.height = "auto";
          
          // Add extra padding for comfortable editing (prevents hitting the bottom)
          const extraPadding = 10; // 10px extra space at bottom
          const newHeight = Math.max(60, contentEditableRef.current.scrollHeight + extraPadding);
          
          // Only update height if it has actually changed
          if (parseInt(contentEditableRef.current.style.height) !== newHeight) {
            contentEditableRef.current.style.height = `${newHeight}px`;
          }
          
          // Always hide overflow-y to prevent scrollbars inside the div
          contentEditableRef.current.style.overflowY = "hidden";
          
          // Restore the scroll position to prevent the page from jumping
          window.scrollTo({top: scrollPos});
        }
      }, []);

      const handleTextInput = () => {
        if (!contentEditableRef.current || isHighlightingRef.current) return;
    
        // When typing, update the text state and clear any highlight
        const newText = contentEditableRef.current.textContent || "";
    
        // Store selection position before updating state
        const selection = window.getSelection();
        let cursorPosition = 0;
        
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          cursorPosition = range.startOffset;
        }
        
        setPlainText(newText);
        setHighlight(null);
        
        // Adjust the height whenever text changes
        adjustHeight();
        
        // Save content to Redux and backend
        saveContent(newText);
        
        // Restore cursor position after state update
        setTimeout(() => {
          if (contentEditableRef.current && selection && selection.rangeCount > 0) {
            // Only try to restore if we still have a valid selection
            try {
              const range = document.createRange();
              const textNode = contentEditableRef.current.firstChild || contentEditableRef.current;
              
              // Check if we're dealing with a text node or element node
              if (textNode.nodeType === Node.TEXT_NODE) {
                // For text nodes, set cursor within the text
                const offset = Math.min(cursorPosition, (textNode.textContent || "").length);
                range.setStart(textNode, offset);
                range.setEnd(textNode, offset);
              } else if (textNode.nodeType === Node.ELEMENT_NODE && contentEditableRef.current.textContent) {
                // For element nodes (happens with innerHTML), try to find the right position
                const walker = document.createTreeWalker(
                  contentEditableRef.current,
                  NodeFilter.SHOW_TEXT,
                  null
                );
                
                let node = walker.nextNode();
                let offset = cursorPosition;
                
                // Walk through text nodes until we find our position
                while (node && offset > (node.textContent?.length || 0)) {
                  offset -= node.textContent?.length || 0;
                  node = walker.nextNode();
                }
                
                if (node) {
                  range.setStart(node, offset);
                  range.setEnd(node, offset);
                }
              }
              
              selection.removeAllRanges();
              selection.addRange(range);
            } catch (error) {
              console.error("Error restoring cursor position:", error);
            }
          }
        }, 0);
      };

      const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
      };

            const handleClosePopup = () => {
    if (!isInputFocusedRef.current) {
      setIsPopupOpen(false);
    }
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
        `<span class="bg-blue-600 text-white">${highlightedText}</span>` +
        afterText;

      // Update text state to match the current content
      setPlainText(currentContent);
    }

    isHighlightingRef.current = false;
  };

  const clickPopup = () => {
    // First close the popup gracefully
    // Use a small timeout to ensure the portal is unmounted before we modify the DOM
    setTimeout(() => {
      applyHighlight(highlight);
      if (selectionObject) {
        selectionObject.removeAllRanges();
      }
      
      // After highlighting, call onApply if available
      if (onApply) {
        onApply();
      }
    }, 10);
  };

  const handleInputFocus = (focused: boolean) => {
    isInputFocusedRef.current = focused;
  };
      
    // NEW NEW NEW FUNCTIONALITY
        // NEW NEW NEW FUNCTIONALITY
            // NEW NEW NEW FUNCTIONALITY
                // NEW NEW NEW FUNCTIONALITY
                    // NEW NEW NEW FUNCTIONALITY


    // OLD BUT NEW FUNCTIONALITY
    // OLD BUT NEW FUNCTIONALITY
    // OLD BUT NEW FUNCTIONALITY
    // OLD BUT NEW FUNCTIONALITY
      
    // Learn how this works
    useEffect(() => {
        if (!contentEditableRef.current) return;
  
        // Use a debounced version of adjustHeight to avoid too many resizes
        let resizeTimeout: NodeJS.Timeout | null = null;
        
        const debouncedAdjustHeight = () => {
          if (resizeTimeout) {
            clearTimeout(resizeTimeout);
          }
          resizeTimeout = setTimeout(() => {
            adjustHeight();
          }, 50); // Small timeout to batch resize operations
        };
  
        const resizeObserver = new ResizeObserver(() => {
          debouncedAdjustHeight();
        });
  
        resizeObserver.observe(contentEditableRef.current);
  
        return () => {
          if (resizeTimeout) {
            clearTimeout(resizeTimeout);
          }
          resizeObserver.disconnect();
        };
      }, [adjustHeight]);
  
      useEffect(() => {
        let resizeTimeout: NodeJS.Timeout | null = null;
        
        const handleResize = () => {
          if (resizeTimeout) {
            clearTimeout(resizeTimeout);
          }
          resizeTimeout = setTimeout(() => {
            adjustHeight();
          }, 100); // Larger timeout for window resize events which are less critical
        };
        
        window.addEventListener("resize", handleResize);
        
        return () => {
          if (resizeTimeout) {
            clearTimeout(resizeTimeout);
          }
          window.removeEventListener("resize", handleResize);
        };
      }, [adjustHeight]);



    // OLD BUT NEW FUNCTIONALITY
    // OLD BUT NEW FUNCTIONALITY
    // OLD BUT NEW FUNCTIONALITY
    // OLD BUT NEW FUNCTIONALITY

    // Adjust height when plainText changes - using requestAnimationFrame for smoother updates
    useEffect(() => {
      // Use requestAnimationFrame instead of setTimeout for smoother updates
      let rafId: number;
      rafId = requestAnimationFrame(() => {
        adjustHeight();
      });
      return () => cancelAnimationFrame(rafId);
    }, [plainText, adjustHeight]);
    
    // Set initial content when component mounts
    useEffect(() => {
        if (contentEditableRef.current && plainText) {
            contentEditableRef.current.textContent = plainText;
            // Use requestAnimationFrame for smoother initial height adjustment
            requestAnimationFrame(adjustHeight);
        }
    }, []);

    // Update content when plainText changes from external sources
    useEffect(() => {
        if (contentEditableRef.current && plainText !== contentEditableRef.current.textContent) {
            contentEditableRef.current.textContent = plainText;
        }
    }, [plainText]);

    // Expose methods to parent components via ref
    useImperativeHandle(ref, () => ({
      getValue: () => plainText,
      setValue: (value: string) => {
        console.log("CanvaDiv setValue called with:", value);
        
        // Store current cursor and focus state
        const hadFocus = document.activeElement === contentEditableRef.current;
        const selection = window.getSelection();
        let cursorPosition = 0;
        
        if (selection && selection.rangeCount > 0 && hadFocus) {
          const range = selection.getRangeAt(0);
          cursorPosition = range.startOffset;
        }
        
        // Update the state
        setPlainText(value);
        
        // Update the DOM directly and force a re-render
        setTimeout(() => {
          if (contentEditableRef.current) {
            contentEditableRef.current.textContent = value;
            
            // Restore focus and cursor position if we had focus before
            if (hadFocus) {
              contentEditableRef.current.focus();
              
              try {
                if (selection) {
                  const range = document.createRange();
                  const textNode = contentEditableRef.current.firstChild || contentEditableRef.current;
                  
                  // Position cursor - if the new text is shorter than the previous position, place at end
                  const newPosition = Math.min(cursorPosition, (contentEditableRef.current.textContent || "").length);
                  
                  if (textNode.nodeType === Node.TEXT_NODE) {
                    range.setStart(textNode, newPosition);
                    range.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range);
                  }
                }
              } catch (error) {
                console.error("Error restoring cursor in setValue:", error);
              }
            }
          }
        }, 0);
        
        // Update segments
        setSegments([{ id: generateId(), text: value }]);
      },
      highlightText: (text: string, className: string) => {
        // Implement if needed
      },
      removeHighlights: () => {
        removeHighlight();
      },
      focus: () => {
        if (contentEditableRef.current) {
          contentEditableRef.current.focus();
        }
      }
    }), [plainText]);

    return (
        <div className="relative w-full" ref={containerRef}>
            <div
                ref={contentEditableRef}
                className={cn(
                    "block whitespace-pre-wrap text-left min-h-[60px] w-full rounded-md px-3 py-2 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none bg-[#FCFAF4] overflow-hidden",
                    variantClasses[variant],
                    className
                )}
                contentEditable
                suppressContentEditableWarning
                onMouseDown={() => removeHighlight()}
                onSelect={handleSelection}
                onInput={handleTextInput}
                onPaste={handlePaste}
                style={{ minHeight: "60px", height: "auto", overflowY: "hidden" }}
            />

            {highlight && isPopupOpen && highlight.rect && (
                <SelectionPopup
                subpointText={plainText}
                index={index}
                selectedText={selectedText}
                rect={highlight.rect}
                parentRef={containerRef}
                onClose={handleClosePopup}
                onApply={clickPopup}
                onInputFocus={handleInputFocus}
                />
            )}
        </div>
    );
  }
);

CanvaDiv.displayName = "CanvaDiv";

export { CanvaDiv };

