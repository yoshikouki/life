import MarkdownContent from "@/components/MarkdownContent";

export default async function Page({
  params: { slug },
}: {
  params: { slug: string[] };
}) {
  return <MarkdownContent path={"/"} />;
}
