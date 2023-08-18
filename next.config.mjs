import nextMDX from "@next/mdx";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],

  // TODO: Correction for bad manners.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/yoshikouki/yoshikouki/main/**",
      },
    ],
  },

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
