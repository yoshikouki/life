import { SlideUp } from "@/components/animation/slide-up";
import { Typing } from "@/components/animation/typing";
import { UnmaskRight } from "@/components/animation/unmask-right";
import { HeaderContainer, HeaderLogo, HeaderNav } from "@/components/header";
import { CanvasItem } from "./canvas-item";
import { CanvasTitle } from "./canvas-title";

export default function CanvasPage() {
  return (
    <>
      <HeaderContainer>
        <HeaderLogo />
        <HeaderNav />
      </HeaderContainer>

      <main className="flex flex-col items-center justify-items-center gap-16 pt-10">
        <section className="flex w-full max-w-sm flex-col gap-20 px-4">
          <h2 className="pb-4 font-black text-2xl">Framer Motion</h2>

          <div className="space-y-2">
            <CanvasTitle source="https://github.com/yoshikouki/life/blob/main/src/components/animation/parallax.tsx">
              Parallax scroll
            </CanvasTitle>
            <CanvasItem className="items-start" size={"square"}>
              <iframe
                src="/canvas/parallax"
                title="Sample parallax scroll"
                className="h-full w-full"
              />
            </CanvasItem>
          </div>

          <div className="space-y-2">
            <CanvasTitle source="https://github.com/yoshikouki/life/blob/main/src/components/animation/slide-up.tsx">
              Slide up
            </CanvasTitle>
            <CanvasItem>
              <SlideUp repeat>Framer Motion</SlideUp>
            </CanvasItem>
          </div>

          <div className="space-y-2">
            <CanvasTitle source="https://github.com/yoshikouki/life/blob/main/src/components/animation/unmask-right.tsx">
              Grow right
            </CanvasTitle>
            <CanvasItem>
              <UnmaskRight repeat>Framer Motion</UnmaskRight>
            </CanvasItem>
          </div>

          <div className="space-y-2">
            <CanvasTitle source="https://github.com/yoshikouki/life/blob/main/src/components/animation/typing.tsx">
              Typing
            </CanvasTitle>
            <CanvasItem>
              <Typing cursorClassName="h-4" loop repeat>
                Framer Motion
              </Typing>
            </CanvasItem>
          </div>
        </section>
      </main>
    </>
  );
}
