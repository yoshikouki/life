import { fetchMarkdown } from "@/lib/fetch-markdown";
import { MDXRemote } from "next-mdx-remote/rsc";

export default async function Home() {
  const markdown = await fetchMarkdown();
  return <MDXRemote source={markdown} />;
}
