import nextMDX from "@next/mdx";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],

  experimental: {
    mdxRs: false,
  },
};

const withMDX = nextMDX({
  options: {
    extension: /\.mdx?$/,
    remarkPlugins: [remarkGfm, remarkBreaks],
    rehypePlugins: [],
    providerImportSource: "@mdx-js/react",
  },
});

export default withMDX(nextConfig);
