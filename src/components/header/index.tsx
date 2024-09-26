import Link from "next/link";

import { cn } from "@/lib/utils";
import { Typing } from "../animation/typing";

export const HeaderContainer = ({
  children,
  className,
}: { children: React.ReactNode; className?: string }) => {
  return (
    <header className="pointer-events-none sticky top-0 z-50 flex w-full touch-none justify-center">
      <div className={cn("flex w-full max-w-sm justify-between", className)}>
        {children}
      </div>
    </header>
  );
};

export const HeaderLogo = () => {
  return (
    <Link
      href="/"
      className="pointer-events-auto flex h-14 touch-auto items-center px-4 text-base"
    >
      <Typing cursorClassName="h-4 ml-[2px]" loop>
        yoshikouki
      </Typing>
    </Link>
  );
};

export const HeaderNav = ({
  className = "text-muted-foreground",
}: {
  className?: string;
}) => {
  return (
    <nav
      className={cn(
        "pointer-events-auto flex h-14 touch-auto items-stretch text-base",
        className,
      )}
    >
      <Link href="/canvas" className="flex items-center px-4">
        Canvas
      </Link>
    </nav>
  );
};
