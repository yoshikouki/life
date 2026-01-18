import Parser from "rss-parser";
import type { NewsFeed, NewsItem, NewsSource } from "./types";

const parser = new Parser({
  timeout: 10_000,
  headers: {
    "User-Agent": "life-news-aggregator/1.0",
  },
});

/**
 * 単一のフィードソースからニュースを取得
 */
export async function fetchFeed(source: NewsSource): Promise<NewsFeed> {
  const feed = await parser.parseURL(source.url);

  const items: NewsItem[] = (feed.items || []).map((item, index) => ({
    id: item.guid || item.link || `${source.id}-${index}`,
    title: item.title || "Untitled",
    url: item.link || source.url,
    source,
    publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
    description: item.contentSnippet || item.content,
    imageUrl: extractImageUrl(item),
  }));

  return {
    source,
    items,
    fetchedAt: new Date(),
  };
}

/**
 * 複数のフィードソースからニュースを取得
 */
export async function fetchFeeds(sources: NewsSource[]): Promise<NewsFeed[]> {
  const results = await Promise.allSettled(sources.map(fetchFeed));

  return results
    .filter(
      (result): result is PromiseFulfilledResult<NewsFeed> =>
        result.status === "fulfilled"
    )
    .map((result) => result.value);
}

/**
 * 複数のフィードを統合してアイテムを日付順にソート
 */
export async function fetchAllNews(sources: NewsSource[]): Promise<NewsItem[]> {
  const feeds = await fetchFeeds(sources);
  const allItems = feeds.flatMap((feed) => feed.items);

  return allItems.sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
  );
}

/**
 * RSSアイテムから画像URLを抽出
 */
function extractImageUrl(
  item: Parser.Item & { enclosure?: { url?: string } }
): string | undefined {
  if (item.enclosure?.url) {
    return item.enclosure.url;
  }
  return undefined;
}
