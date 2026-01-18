import type { NewsFeed, NewsItem } from "@life/news";
import { NEWS_PACKAGE_VERSION } from "@life/news";
import { SlideUp } from "@/components/animation/slide-up";
import { Typing } from "@/components/animation/typing";
import { HeaderContainer, HeaderLogo, HeaderNav } from "@/components/header";

const sampleFeed: NewsFeed = {
  source: {
    id: "sample",
    name: "Sample News",
    url: "https://example.com",
    type: "rss",
  },
  items: [],
  fetchedAt: new Date(),
};

export default function NewsPage() {
  return (
    <>
      <HeaderContainer>
        <HeaderLogo />
        <HeaderNav />
      </HeaderContainer>

      <main className="flex flex-col items-center justify-items-center gap-16 pt-10">
        <section className="flex w-full max-w-sm flex-col gap-8 px-4">
          <h2 className="font-black text-6xl">
            <Typing cursorClassName="ml-1 h-14">News</Typing>
          </h2>

          <div className="text-muted-foreground text-sm">
            Package version: {NEWS_PACKAGE_VERSION}
          </div>

          {sampleFeed.items.length === 0 ? (
            <SlideUp>
              <p className="text-lg">
                Coming soon - News feed functionality will be implemented here.
              </p>
            </SlideUp>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {sampleFeed.items.map((item: NewsItem) => (
                <SlideUp key={item.id}>
                  <article className="space-y-2">
                    <h3 className="text-lg">{item.title}</h3>
                    {item.description && (
                      <p className="text-muted-foreground text-sm">
                        {item.description}
                      </p>
                    )}
                  </article>
                </SlideUp>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
