"use client";

import { MDXProvider } from "@mdx-js/react";
import { Components, MergeComponents } from "@mdx-js/react/lib";
import { Typography } from "@mui/material";
import Image from "next/image";
import { ReactNode } from "react";

const components: Components | MergeComponents = {
  img: (props) =>
    props.src && (
      <Image
        alt={props.alt || "image"}
        style={{ width: "100%", height: "auto" }}
        layout="responsive"
        width={500}
        height={300}
        src={props.src}
      />
    ),
  h1: ({ children, ...props }) => <p>{children}</p>,
  h2: ({ children, ...props }) => (
    <Typography variant="h2">{children}</Typography>
  ),
  p: ({ children, ...props }) => (
    <Typography variant="body1">{children}</Typography>
  ),
};

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
