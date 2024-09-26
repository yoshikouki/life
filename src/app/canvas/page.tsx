import { SlideUp } from "@/components/animation/slide-up";
import { Typing } from "@/components/animation/typing";
import { UnmaskRight } from "@/components/animation/unmask-right";
import { HeaderContainer, HeaderLogo, HeaderNav } from "@/components/header";
import { CanvasItem } from "./canvas-item";

export default function CanvasPage() {
  return (
    <>
      <HeaderContainer>
        <HeaderLogo />
        <HeaderNav />
      </HeaderContainer>

      <main className="flex flex-col items-center justify-items-center gap-16 pt-10">
        <section className="flex w-full max-w-sm flex-col gap-4 px-4">
          <h2 className="pb-4 font-black text-2xl">Framer Motion</h2>

          <h3 className="font-black text-xl">Slide up</h3>
          <CanvasItem>
            <SlideUp repeat>Framer Motion</SlideUp>
          </CanvasItem>

          <h3 className="font-black text-xl">Grow right</h3>
          <CanvasItem>
            <UnmaskRight repeat>Framer Motion</UnmaskRight>
          </CanvasItem>

          <h3 className="font-black text-xl">Typing</h3>
          <CanvasItem>
            <Typing cursorClassName="h-4" loop repeat>
              Framer Motion
            </Typing>
          </CanvasItem>
        </section>
      </main>
    </>
  );
}
