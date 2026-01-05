import Link from "next/link";
import { GitHubIcon } from "@/components/icon/github-icon";
import { XIcon } from "@/components/icon/x-icon";

export const Footer = () => {
  return (
    <footer className="mt-20 flex w-full flex-col items-center justify-center gap-4 p-4">
      <div className="flex items-center gap-4 p-4">
        <Link
          href="https://github.com/yoshikouki/life"
          aria-label="GitHub repository"
        >
          <GitHubIcon className="size-6" />
        </Link>
        <Link href="https://x.com/yoshikouki_" aria-label="X (Twitter) profile">
          <XIcon className="size-4 stroke-primary" />
        </Link>
      </div>
      <div className="text-primary/50 text-sm">
        Copyright © {new Date().getFullYear()} yoshikouki
      </div>
    </footer>
  );
};
