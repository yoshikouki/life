import type { NewsItem } from "@life/news";
import { feedSources, fetchAllNews } from "@life/news";
import { SlideUp } from "@/components/animation/slide-up";
import { Typing } from "@/components/animation/typing";
import { HeaderContainer, HeaderLogo, HeaderNav } from "@/components/header";

export default async function NewsPage() {
  const newsItems = await fetchAllNews(feedSources);

  return (
    <>
      <HeaderContainer>
        <HeaderLogo />
        <HeaderNav />
      </HeaderContainer>

      <main className="flex flex-col items-center justify-items-center gap-16 pt-10">
        <section className="flex w-full max-w-2xl flex-col gap-8 px-4">
          <h2 className="font-black text-6xl">
            <Typing cursorClassName="ml-1 h-14">News</Typing>
          </h2>

          <p className="text-muted-foreground text-sm">
            {newsItems.length} articles from {feedSources.length} sources
          </p>

          <div className="grid grid-cols-1 gap-6">
            {newsItems.map((item: NewsItem) => (
              <SlideUp key={item.id}>
                <article className="space-y-2 border-b pb-4">
                  <a
                    className="hover:underline"
                    href={item.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <h3 className="font-medium text-lg">{item.title}</h3>
                  </a>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs">
                    <span>{item.source.name}</span>
                    <span>•</span>
                    <time dateTime={item.publishedAt.toISOString()}>
                      {formatDate(item.publishedAt)}
                    </time>
                  </div>
                  {item.description && (
                    <p className="line-clamp-2 text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  )}
                </article>
              </SlideUp>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (hours < 1) {
    return "just now";
  }
  if (hours < 24) {
    return `${hours}h ago`;
  }
  if (days < 7) {
    return `${days}d ago`;
  }
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
