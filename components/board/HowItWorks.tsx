const STEPS = [
  {
    title: "Adaugă figurile",
    body: "Alege din panoul din dreapta cine e relevant pentru situația ta — tu, un părinte, un partener.",
  },
  {
    title: "Poziționează-le",
    body: "Trage fiecare figură pe tablă, la distanța pe care o simți real, nu cum „ar trebui”.",
  },
  {
    title: "Setează direcția",
    body: "Selectează o figură și trage mânerul alb ca să-i spui încotro privește.",
  },
  {
    title: "Leagă-le (opțional)",
    body: "Cu minim două figuri, adaugă un conector — un zid, o inimă, un lanț — pentru relația dintre ele.",
  },
];

interface HowItWorksProps {
  /** How many steps to reveal so far — grows as the user completes each action. */
  visibleCount: number;
}

export default function HowItWorks({ visibleCount }: HowItWorksProps) {
  const steps = STEPS.slice(0, visibleCount);

  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-4">
      {steps.map((step, i) => (
        <div key={step.title} className="animate-step-in rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-xs font-medium text-accent">
            {i + 1}
          </div>
          <h3 className="mb-1 text-sm font-medium text-foreground/90">{step.title}</h3>
          <p className="text-xs leading-relaxed text-foreground/50">{step.body}</p>
        </div>
      ))}
    </div>
  );
}
