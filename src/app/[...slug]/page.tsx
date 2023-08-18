import MarkdownContent from "@/components/MarkdownContent";

export default async function Page({
  params: { slug },
}: {
  params: { slug: string[] };
}) {
  const fileName = typeof slug === "string" ? slug : slug.join("/");
  return <MarkdownContent path={fileName} />;
}
