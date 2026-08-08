import Starfield from "@/components/Starfield";

/** Fixed, viewport-spanning star backdrop — persists behind every page and survives navigation. */
export default function GlobalStarfield() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <Starfield count={160} />
    </div>
  );
}
