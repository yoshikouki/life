"use client";

import { useTransitionRouter } from "next-view-transitions";

export const AnimatedLink = ({
  children,
  href,
  ...props,
}: {
  children: React.ReactNode;
  href: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const router = useTransitionRouter();
  return (
    <button type="button" onClick={() => router.push(href)} {...props}>
      {children}
    </button>
  );
};
