import { fetchMarkdown } from "@/lib/fetch-markdown";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import { components } from "./MarkdownComponents";

interface Props {
  path: string;
}

const MarkdownContent = async ({ path }: Props) => {
  const markdown = await fetchMarkdown(path);
  return (
    <MDXRemote
      source={markdown}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkBreaks],
          rehypePlugins: [],
        },
      }}
    />
  );
};

export default MarkdownContent;
