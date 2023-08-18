import { fetchMarkdown } from "@/lib/fetch-markdown";
import { MDXRemote } from "next-mdx-remote/rsc";

export default async function Page({ params: { slug } }: {params: { slug: string[] }}) {
  const fileName = typeof slug === "string" ? slug : slug.join("/");
  const markdown = await fetchMarkdown(fileName);
  return <MDXRemote source={markdown} />;
}
