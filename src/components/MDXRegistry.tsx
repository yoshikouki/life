"use client";

import { MDXProvider } from "@mdx-js/react";
import { ReactNode } from "react";
import { components } from "./MarkdownComponents";

type MDXRegistryProps = {
  children: ReactNode;
};

export default function MDXRegistry(props: MDXRegistryProps) {
  return (
    <MDXProvider components={components}>
      <div {...props} />
    </MDXProvider>
  );
}
