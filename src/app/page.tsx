import Link from "next/link";
import { SlideUp } from "@/components/animation/slide-up";
import { Typing } from "@/components/animation/typing";
import { Hero } from "./hero";

const contents = [
  {
    name: "Personality",
    url: "https://github.com/yoshikouki/yoshikouki/wiki/Personality-%E4%BA%BA%E3%81%A8%E3%81%AA%E3%82%8A",
  },
  {
    name: "Curriculum Vitae",
    url: "https://github.com/yoshikouki/yoshikouki/wiki/Curriculum-Vitae-%E8%81%B7%E5%8B%99%E7%B5%8C%E6%AD%B4%E6%9B%B8",
  },
  {
    name: "Interests Profile",
    url: "https://github.com/yoshikouki/yoshikouki/wiki/Interests-Profile-%E8%88%88%E5%91%B3%E5%88%86%E9%87%8E",
  },
  {
    name: "Inputs",
    url: "https://github.com/yoshikouki/yoshikouki/blob/main/Inputs.md",
  },
];

const work = [
  {
    name: "WEB+DB PRESS Vol.130「作って学ぶWeb3」",
    url: "https://gihyo.jp/magazine/wdpress/archive/2022/vol130",
  },
];

const sns = [
  {
    name: "X",
    url: "https://x.com/yoshikouki_",
  },
  {
    name: "note",
    url: "https://note.com/yoshikouki",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/yoshikoukii/",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/yoshikouki/",
  },
];

const otherLinks = [
  {
    name: "GitHub",
    url: "https://github.com/yoshikouki",
  },
  {
    name: "connpass",
    url: "https://connpass.com/user/yoshikouki/",
  },
  {
    name: "Speaker Deck",
    url: "https://speakerdeck.com/yoshikouki",
  },
  {
    name: "Zenn",
    url: "https://zenn.dev/yoshikouki",
  },
  {
    name: "Qiita",
    url: "https://qiita.com/yoshikouki",
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      <main className="flex flex-col items-center justify-items-center gap-16 pt-28">
        <section className="flex w-full max-w-sm flex-col gap-8">
          <h2 className="px-4 font-black text-6xl">
            <Typing cursorClassName="ml-1 h-14">Contents</Typing>
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {contents.map((content) => (
              <SlideUp key={content.url}>
                <Link
                  href={content.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="px-4 text-lg">{content.name}</div>
                </Link>
              </SlideUp>
            ))}
          </div>
        </section>

        <section className="flex w-full max-w-sm flex-col gap-8">
          <h2 className="px-4 font-black text-6xl">
            <Typing cursorClassName="ml-1 h-14">Work</Typing>
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {work.map((item) => (
              <SlideUp key={item.url}>
                <Link href={item.url} target="_blank" rel="noopener noreferrer">
                  <div className="px-4 text-lg">{item.name}</div>
                </Link>
              </SlideUp>
            ))}
          </div>
        </section>

        <section className="flex w-full max-w-sm flex-col gap-8">
          <h2 className="px-4 font-black text-6xl">
            <Typing cursorClassName="ml-1 h-14">SNS</Typing>
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {sns.map((item) => (
              <SlideUp key={item.url}>
                <Link href={item.url} target="_blank" rel="noopener noreferrer">
                  <div className="px-4 text-lg">{item.name}</div>
                </Link>
              </SlideUp>
            ))}
          </div>
        </section>

        <section className="flex w-full max-w-sm flex-col gap-8">
          <h2 className="px-4 font-black text-6xl">
            <Typing cursorClassName="ml-1 h-14">Other Link</Typing>
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {otherLinks.map((item) => (
              <SlideUp key={item.url}>
                <Link href={item.url} target="_blank" rel="noopener noreferrer">
                  <div className="px-4 text-lg">{item.name}</div>
                </Link>
              </SlideUp>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
