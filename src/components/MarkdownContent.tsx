import { fetchMarkdown } from "@/lib/fetch-markdown";
import { MDXRemote } from "next-mdx-remote/rsc";
import MDXRegistry from "./MDXRegistry";

interface Props {
  path: string;
}

const MarkdownContent = async ({ path }: Props) => {
  const markdown = await fetchMarkdown(path);
  return (
    <MDXRegistry>
      <MDXRemote source={markdown} />
    </MDXRegistry>
  );
};

export default MarkdownContent;
