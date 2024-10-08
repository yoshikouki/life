import { cn } from "@/lib/utils";
import { AnimatedLink } from "../animated-link";
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
    <AnimatedLink
      href="/"
      className="pointer-events-auto flex h-14 touch-auto items-center px-4 text-base"
      // MEMO: Translating animation is unpleasant.
      // style={{
      //   viewTransitionName: "header-logo",
      // }}
    >
      <Typing cursorClassName="h-4 ml-[2px]" loop>
        yoshikouki
      </Typing>
    </AnimatedLink>
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
      <AnimatedLink
        href="/canvas"
        className="flex items-center px-4"
        style={{
          viewTransitionName: "header-nav-canvas",
        }}
      >
        Canvas
      </AnimatedLink>
    </nav>
  );
};
