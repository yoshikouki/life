/**
 * ニュースソース
 */
export interface NewsSource {
  id: string;
  name: string;
  url: string;
  type: "rss" | "atom" | "json";
}

/**
 * 個別のニュースアイテム
 */
export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: NewsSource;
  publishedAt: Date;
  description?: string;
  imageUrl?: string;
}

/**
 * ニュースフィード
 */
export interface NewsFeed {
  source: NewsSource;
  items: NewsItem[];
  fetchedAt: Date;
}
