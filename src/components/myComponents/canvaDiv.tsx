"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
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

    // AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    // AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    // AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA


    const normalizeContentEditable = (element: HTMLElement | null) => {
      if (!element) return;
      
      // First pass: collect all text content
      let allText = '';
      const childNodes = Array.from(element.childNodes);
      
      childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          allText += node.textContent || '';
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // For inline elements, get their text content
          allText += (node as HTMLElement).innerText || '';
        }
      });
      
      // Clear the element
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      
      // Create a single text node with all content
      if (allText) {
        const textNode = document.createTextNode(allText);
        element.appendChild(textNode);
      }
      
      return allText;
    };
    
    /**
     * Carefully sets cursor position for iOS
     * This works around various iOS-specific issues with contentEditable
     */
    const setCursorPositionIOS = (
      element: HTMLElement | null,
      position: number = -1 // -1 means end of content
    ): boolean => {
      // Guard against null element
      if (!element) return false;
      
      // Make sure content is normalized first
      const content = normalizeContentEditable(element);
      
      // Determine actual position (end of content if position is -1)
      const actualPosition = position === -1 ? 
        (content?.length || 0) : 
        Math.min(position, content?.length || 0);
      
      try {
        // Focus the element first
        element.focus();
        
        // Small delay for iOS to register the focus
        setTimeout(() => {
          // Get the current selection
          const selection = window.getSelection();
          if (!selection) return;
          
          // Create a new range
          const range = document.createRange();
          
          // Make sure we have a text node
          if (!element.firstChild || element.firstChild.nodeType !== Node.TEXT_NODE) {
            const textNode = document.createTextNode(content || '');
            element.appendChild(textNode);
          }
          
          // Set the position in the text node
          const textNode = element.firstChild;
          
          // Check if textNode exists
          if (!textNode) {
            console.error('No text node found in element');
            return;
          }
          
          // Safely set range based on available content
          const safePosition = Math.min(
            actualPosition,
            (textNode.textContent || '').length
          );
          
          range.setStart(textNode, safePosition);
          range.setEnd(textNode, safePosition);
          
          // Apply the range to the selection
          selection.removeAllRanges();
          selection.addRange(range);
        }, 50); // Slightly longer delay for iOS
        
        return true;
      } catch (error) {
        console.error('Error setting cursor position:', error);
        return false;
      }
    };
    
    // Then modify your handleClick function to handle iOS differently:
    
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!contentEditableRef.current) return;
      
      // Detect iOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && 
                   !(window as Window & { MSStream?: unknown }).MSStream;
                   
      if (isIOS) {
        // On iOS, we need special handling
        e.preventDefault(); // Prevent default behavior
        
        // Get the click position relative to the content
        const selection = window.getSelection();
        if (!selection) return;
        
        // Normalize the content first to ensure we have a single text node
        normalizeContentEditable(contentEditableRef.current);
        
        // Get the clicked position approximation
        // This is tricky on iOS, but we can estimate based on click coordinates
        const range = document.caretRangeFromPoint(e.clientX, e.clientY);
        if (!range) {
          // If we can't get a precise position, just focus the element
          contentEditableRef.current.focus();
          return;
        }
        
        // Set the selection at the clicked position
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      // For non-iOS, the default browser behavior works fine
    };
    



    // BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
    // BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
    // BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB

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
        
        // Detect iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && 
                     !(window as Window & { MSStream?: unknown }).MSStream;
                     
        // Store current selection BEFORE updating state
        const selection = window.getSelection();
        let cursorPosition = 0;
        
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          
          // Store the cursor position
          if (range.startContainer.nodeType === Node.TEXT_NODE) {
            // We're in a text node, so we can use the offset directly
            cursorPosition = range.startOffset;
            
            // If we're not at the first text node, add the length of previous nodes
            if (contentEditableRef.current && range.startContainer !== contentEditableRef.current.firstChild) {
              let node = contentEditableRef.current.firstChild;
              while (node && node !== range.startContainer) {
                cursorPosition += (node.textContent || "").length;
                node = node.nextSibling;
              }
            }
          }
        }
        
        // For iOS, normalize the content to a single text node
        if (isIOS) {
          normalizeContentEditable(contentEditableRef.current);
        }
        
        // Update state
        setPlainText(newText);
        setHighlight(null);
        
        // Adjust height
        adjustHeight();
        
        // Save content
        saveContent(newText);
        
        // Restore cursor position
        if (isIOS) {
          // Use our special iOS function for cursor positioning
          setCursorPositionIOS(contentEditableRef.current, cursorPosition);
        } else {
          // For other browsers, standard approach works fine
          setTimeout(() => {
            if (contentEditableRef.current && selection && selection.rangeCount > 0) {
              try {
                const range = document.createRange();
                const textNode = contentEditableRef.current.firstChild;
                
                if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                  const newPosition = Math.min(cursorPosition, (textNode.textContent || "").length);
                  range.setStart(textNode, newPosition);
                  range.setEnd(textNode, newPosition);
                  selection.removeAllRanges();
                  selection.addRange(range);
                }
              } catch (error) {
                console.error("Error restoring cursor position:", error);
              }
            }
          }, 0);
        }
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
      const rafId: number = requestAnimationFrame(() => {
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
        
        // Check if we're on iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream;
        
        // Update the DOM directly and force a re-render
        setTimeout(() => {
          if (contentEditableRef.current) {
            // For iOS, we need to normalize text handling
            if (isIOS) {
              // First, ensure we only have a single text node to avoid iOS selection issues
              while (contentEditableRef.current.firstChild) {
                contentEditableRef.current.removeChild(contentEditableRef.current.firstChild);
              }
              
              // Create a fresh text node
              const textNode = document.createTextNode(value);
              contentEditableRef.current.appendChild(textNode);
            } else {
              // For other browsers, this simple approach works fine
              contentEditableRef.current.textContent = value;
            }
            
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
        }, 10); // Slightly longer timeout for iOS
        
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
                onClick={handleClick}
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

