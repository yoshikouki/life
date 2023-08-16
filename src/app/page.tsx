import { MDXRemote } from "next-mdx-remote/rsc";

export default async function Home() {
    const res = await fetch(
      "https://raw.githubusercontent.com/yoshikouki/yoshikouki/main/README.md"
    );
    const markdown = await res.text();
    return <MDXRemote source={markdown} />;
}
