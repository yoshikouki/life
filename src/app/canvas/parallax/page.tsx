import { Parallax } from "@/components/animation/parallax";

export default function ParallaxPage() {
  return (
    <div className="h-full w-full p-5">
      <div className="flex items-center justify-center gap-5 py-40">
        <Parallax distance={500}>
          <div className="flex size-10 items-center justify-center rounded-lg bg-accent">
            Far
          </div>
        </Parallax>
        <Parallax distance={300}>
          <div className="flex size-14 items-center justify-center rounded-lg bg-accent">
            Mid
          </div>
        </Parallax>
        <Parallax distance={100}>
          <div className="flex size-20 items-center justify-center rounded-lg bg-accent">
            Near
          </div>
        </Parallax>
        <div className="flex aspect-square size-24 items-center justify-center rounded-lg border">
          Normal
        </div>
        <Parallax distance={-200}>
          <div className="flex size-28 items-center justify-center rounded-lg bg-accent">
            Front
          </div>
        </Parallax>
        <div className="flex aspect-square size-24 items-center justify-center rounded-lg border">
          Normal
        </div>
        <Parallax distance={100}>
          <div className="flex size-20 items-center justify-center rounded-lg bg-accent">
            Near
          </div>
        </Parallax>
        <Parallax distance={300}>
          <div className="flex size-14 items-center justify-center rounded-lg bg-accent">
            Mid
          </div>
        </Parallax>
        <Parallax distance={500}>
          <div className="flex size-10 items-center justify-center rounded-lg bg-accent">
            Far
          </div>
        </Parallax>
      </div>

      <div className="flex items-center justify-center gap-5 py-40">
        <Parallax distance={-200}>
          <div className="flex size-28 items-center justify-center rounded-lg bg-accent">
            Front
          </div>
        </Parallax>

        <div className="flex aspect-square size-24 items-center justify-center rounded-lg border">
          Normal
        </div>
        <Parallax distance={100}>
          <div className="flex size-20 items-center justify-center rounded-lg bg-accent">
            Near
          </div>
        </Parallax>
        <Parallax distance={300}>
          <div className="flex size-14 items-center justify-center rounded-lg bg-accent">
            Mid
          </div>
        </Parallax>
        <Parallax distance={500}>
          <div className="flex size-10 items-center justify-center rounded-lg bg-accent">
            Far
          </div>
        </Parallax>
        <Parallax distance={300}>
          <div className="flex size-14 items-center justify-center rounded-lg bg-accent">
            Mid
          </div>
        </Parallax>
        <Parallax distance={100}>
          <div className="flex size-20 items-center justify-center rounded-lg bg-accent">
            Near
          </div>
        </Parallax>
        <div className="flex aspect-square size-24 items-center justify-center rounded-lg border">
          Normal
        </div>
        <Parallax distance={-200}>
          <div className="flex size-28 items-center justify-center rounded-lg bg-accent">
            Front
          </div>
        </Parallax>
      </div>

      <div className="flex items-center justify-center gap-5 py-40">
        <Parallax distance={500}>
          <div className="flex size-10 items-center justify-center rounded-lg bg-accent">
            Far
          </div>
        </Parallax>
        <Parallax distance={300}>
          <div className="flex size-14 items-center justify-center rounded-lg bg-accent">
            Mid
          </div>
        </Parallax>
        <Parallax distance={100}>
          <div className="flex size-20 items-center justify-center rounded-lg bg-accent">
            Near
          </div>
        </Parallax>
        <div className="flex aspect-square size-24 items-center justify-center rounded-lg border">
          Normal
        </div>
        <Parallax distance={-200}>
          <div className="flex size-28 items-center justify-center rounded-lg bg-accent">
            Front
          </div>
        </Parallax>
        <div className="flex aspect-square size-24 items-center justify-center rounded-lg border">
          Normal
        </div>
        <Parallax distance={100}>
          <div className="flex size-20 items-center justify-center rounded-lg bg-accent">
            Near
          </div>
        </Parallax>
        <Parallax distance={300}>
          <div className="flex size-14 items-center justify-center rounded-lg bg-accent">
            Mid
          </div>
        </Parallax>
        <Parallax distance={500}>
          <div className="flex size-10 items-center justify-center rounded-lg bg-accent">
            Far
          </div>
        </Parallax>
      </div>
    </div>
  );
}
