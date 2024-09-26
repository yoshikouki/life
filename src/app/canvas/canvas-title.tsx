import { AnimatedLink } from "@/components/animated-link";
import { CodeXmlIcon } from "lucide-react";

export const CanvasTitle = ({
  children,
  source,
}: {
  children: React.ReactNode;
  source?: string;
}) => {
  return (
    <div className="flex h-11 items-center justify-between">
      <h3 className="font-black text-xl">{children}</h3>
      {source && (
        <AnimatedLink
          href={source}
          className="group rounded-none p-3 transition-all duration-200 hover:rounded hover:bg-muted"
          target="_blank"
          rel="noopener noreferrer"
        >
          <CodeXmlIcon className="size-5 stroke-border transition-all duration-500 group-hover:stroke-muted-foreground" />
        </AnimatedLink>
      )}
    </div>
  );
};
