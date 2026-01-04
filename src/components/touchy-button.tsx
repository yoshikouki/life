import { cn } from "@/lib/utils";
import styles from "./touchy-button.module.css";

export const TouchyButton = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      type="button"
      className={cn(
        "rounded-lg border px-4 py-2",
        styles.touchyButton,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
