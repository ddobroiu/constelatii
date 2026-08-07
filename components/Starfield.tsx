function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export default function Starfield({ count = 140 }: { count?: number }) {
  const random = seededRandom(42);
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    top: `${(random() * 100).toFixed(2)}%`,
    left: `${(random() * 100).toFixed(2)}%`,
    size: 1 + Math.round(random() * 2),
    opacity: (0.25 + random() * 0.6).toFixed(2),
    delay: `${(random() * 6).toFixed(2)}s`,
  }));

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(109,91,208,0.25),_transparent_60%)]" />
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: Number(star.opacity),
            animationDelay: star.delay,
            animationDuration: "4s",
          }}
        />
      ))}
    </div>
  );
}
