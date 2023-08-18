import { baseURL } from "@/lib/fetch-markdown";
import { Components, MergeComponents } from "@mdx-js/react/lib";
import { Typography } from "@mui/material";
import Image from "next/image";

export const components: Components | MergeComponents = {
  img: (props) =>
    props.src && (
      <Image
        alt={props.alt || "image"}
        style={{ width: "100%", height: "auto" }}
        width={500}
        height={300}
        src={props.src.replace(new RegExp("[.]+/"), baseURL)}
      />
    ),
  h1: ({ children }) => <Typography variant="h1">{children}</Typography>,
  h2: ({ children }) => <Typography variant="h2">{children}</Typography>,
  p: ({ children }) => <Typography variant="body1">{children}</Typography>,
};
