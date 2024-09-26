import { SlideUp } from "@/components/animation/slide-up";
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
            <SlideUp repeat>
              <div>Framer Motion</div>
            </SlideUp>
          </CanvasItem>
        </section>
      </main>
    </>
  );
}
