import { SlideUp } from "@/components/animattion/slide-up";
import { Typing } from "@/components/animattion/typing";

export default function CanvasPage() {
  return (
    <>
      <header className="flex items-center p-4">
        <h1>
          <Typing className="h-4">Canvas</Typing>
        </h1>
      </header>

      <main className="flex flex-col items-center justify-items-center gap-16 pt-10">
        <section className="flex w-full max-w-sm flex-col gap-8 px-4">
          <h2 className="font-black text-2xl">Framer Motion</h2>

          <SlideUp>
            <div>WIP</div>
          </SlideUp>
        </section>
      </main>
    </>
  );
}
