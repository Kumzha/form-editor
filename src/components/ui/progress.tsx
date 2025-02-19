"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";
import { Form } from "@/types/formType"; // Adjust the import path as needed

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    form: Form;
    value?: number;
  }
>(({ className, value, form, ...props }, ref) => {
  // Log the form prop value
  const [progressValue, setProgressValue] = useState<number>(0);
  const [numberOfSubpoints, setNumberOfSubpoints] = useState<number>(0);
  const [numberOfSubpointsWithContent, setNumberOfSubpointsWithContent] =
    useState<number>(0);

  useEffect(() => {
    const numberOfSubpoints = form.form_type.questions.reduce(
      (total, question) =>
        total + (question.subpoints ? question.subpoints.length : 0),
      0
    );
    const numberOfSubpointsWithContent =
      form.points?.reduce(
        (total, point) =>
          total +
          (point.subpoints
            ? point.subpoints.filter((subpoint) => subpoint.content).length
            : 0),
        0
      ) || 0;

    setNumberOfSubpointsWithContent(numberOfSubpointsWithContent);
    setNumberOfSubpoints(numberOfSubpoints);
    setProgressValue((numberOfSubpointsWithContent / numberOfSubpoints) * 100);
  }, [form, value]);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-2 mb-2">
      <span className="text-sm whitespace-nowrap">{form.form_type.name}</span>
      <div className="flex justify-between text-xs mt-1 bg-[#CACACA]">
        {((numberOfSubpointsWithContent / numberOfSubpoints) * 100).toFixed(0)}%
      </div>
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className="h-full w-full flex-1 bg-primary transition-all"
          style={{ transform: `translateX(-${100 - (progressValue || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
    </div>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
