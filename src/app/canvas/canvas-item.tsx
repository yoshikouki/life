import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import React from "react";

const canvasItemVariants = cva(
  "flex w-full items-center justify-center rounded border-[0.5px] ring-offset-background transition-all duration-1000" +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "",
      },
      size: {
        default: "py-20",
        square: "aspect-square",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface DivProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof canvasItemVariants> {
  asChild?: boolean;
}

export const CanvasItem = React.forwardRef<HTMLDivElement, DivProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <div
        className={cn(canvasItemVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
