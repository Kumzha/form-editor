/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef } from "react";

/**
 * Runs the callback after the dependencies have not changed for the specified delay.
 * Skips running on the very first render if desired.
 *
 * @param callback - Function to run after debounce.
 * @param delay - Delay in milliseconds.
 * @param deps - Dependencies to watch.
 */

export function useDebounceEffect(
  callback: () => void,
  delay: number,
  deps: any[]
) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [...deps, delay]);
}
