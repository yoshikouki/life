import type { NewsSource } from "./types";

/**
 * 購読するフィードソース
 */
export const feedSources: NewsSource[] = [
  {
    id: "zenn",
    name: "Zenn",
    url: "https://zenn.dev/feed",
    type: "rss",
  },
  {
    id: "ai-news",
    name: "AI News",
    url: "https://ai-news.dev/feeds/",
    type: "rss",
  },
];
