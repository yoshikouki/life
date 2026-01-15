import Link from "next/link";
import { GitHubIcon } from "@/components/icon/github-icon";
import { XIcon } from "@/components/icon/x-icon";

export const Footer = () => {
  return (
    <footer className="mt-20 flex w-full flex-col items-center justify-center gap-4 p-4">
      <div className="flex items-center gap-4 p-4">
        <Link
          aria-label="GitHub repository"
          href="https://github.com/yoshikouki/life"
        >
          <GitHubIcon className="size-6" />
        </Link>
        <Link aria-label="X (Twitter) profile" href="https://x.com/yoshikouki_">
          <XIcon className="size-4 stroke-primary" />
        </Link>
      </div>
      <div className="text-primary/50 text-sm">
        Copyright © {new Date().getFullYear()} yoshikouki
      </div>
    </footer>
  );
};
