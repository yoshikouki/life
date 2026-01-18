// biome-ignore lint/performance/noBarrelFile: Package entry point
export { fetchAllNews, fetchFeed, fetchFeeds } from "./fetcher";
export { feedSources } from "./sources";
export type { NewsFeed, NewsItem, NewsSource } from "./types";

export const NEWS_PACKAGE_VERSION = "0.0.1";
