import { SlideUp } from "@/components/animattion/slide-up";
import { Typing } from "@/components/animattion/typing";
import Link from "next/link";

export default function CanvasPage() {
  return (
    <>
      <header className="pointer-events-none sticky top-0 z-50 flex w-full touch-none justify-center">
        <div className="flex w-full max-w-sm justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="pointer-events-auto flex h-14 touch-auto items-center px-4 text-base"
          >
            <Typing cursorClassName="h-4 ml-[2px]" loop>
              yoshikouki
            </Typing>
          </Link>

          {/* Nav */}
          <nav className="pointer-events-auto flex h-14 touch-auto items-stretch text-base">
            <Link href="/canvas" className="flex items-center px-4">
              Canvas
            </Link>
          </nav>
        </div>
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
