"use client"

import { useRef, useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import { setSelectedPoint } from "@/store/forms/formSlice"
import { ChevronLeft, ChevronRight } from "lucide-react"

const PointsField = () => {
  const { selectedForm, selectedPoint } = useSelector((state: RootState) => state.userForms)
  const dispatch = useDispatch()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [needsScrolling, setNeedsScrolling] = useState(false)

  function capitalizeFirstLetter(input: string) {
    if (!input) return ""
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase()
  }

  function truncateText(text: string, maxLength: number) {
    if (!text) return ""
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  const formPoints = selectedForm?.form_type.questions

  // Check if scrolling is needed
  useEffect(() => {
    const checkIfScrollingNeeded = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current
        setNeedsScrolling(scrollWidth > clientWidth)
      }
    }

    // Check initially
    checkIfScrollingNeeded()

    // Set up resize observer to recheck when container size changes
    const resizeObserver = new ResizeObserver(checkIfScrollingNeeded)
    if (scrollContainerRef.current) {
      resizeObserver.observe(scrollContainerRef.current)
    }

    // Clean up
    return () => {
      if (scrollContainerRef.current) {
        resizeObserver.disconnect()
      }
    }
  }, [formPoints])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" })
    }
  }

  if (!formPoints) return <></>

  return (
    <div className="w-full flex flex-row items-center relative">
      {needsScrolling && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 z-10 bg-white/80 rounded-full p-1 shadow-md hover:bg-gray-100"
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className={`${needsScrolling ? "w-[95%]" : "w-full ml-7"} mx-auto flex flex-row gap-2 overflow-x-auto no-scrollbar py-1`}
      >
        {formPoints.map((question, index) => (
          <div
            key={index}
            className={`px-3 py-1 min-h-8 text-xs flex items-center justify-center rounded-t-lg hover:cursor-pointer font-medium whitespace-nowrap transition-colors ${
              selectedPoint === index ? "bg-white text-blue-800 shadow-sm" : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => dispatch(setSelectedPoint(index))}
            title={capitalizeFirstLetter(question.title)}
          >
            {truncateText(capitalizeFirstLetter(question.title), 20)}
          </div>
        ))}
      </div>

      {needsScrolling && (
        <button
          onClick={scrollRight}
          className="absolute right-0 z-10 bg-white/80 rounded-full p-1 shadow-md hover:bg-gray-100"
          aria-label="Scroll right"
        >
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  )
}

export default PointsField

