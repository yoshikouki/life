import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const canvasItemVariants = cva(
  "flex w-full items-center justify-center rounded border-[0.5px] ring-offset-background transition-all duration-1000" +
    "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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

export const CanvasItem = ({
  children,
  className,
  variant,
  size,
  asChild = false,
  ...props
}: DivProps) => {
  return (
    <div
      className={cn(canvasItemVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </div>
  );
};
