import Link from "next/link";
import Starfield from "@/components/Starfield";

interface Section {
  heading: string;
  body: string[];
}

interface FaqItem {
  question: string;
  answer: string;
}

interface ArticlePageProps {
  eyebrow: string;
  title: string;
  intro: string[];
  sections: Section[];
  faq: FaqItem[];
  relatedLinks?: { href: string; label: string }[];
  relatedLinksTitle?: string;
}

export default function ArticlePage({
  eyebrow,
  title,
  intro,
  sections,
  faq,
  relatedLinks,
  relatedLinksTitle,
}: ArticlePageProps) {
  return (
    <div className="relative flex flex-1 flex-col items-center overflow-hidden px-6 py-16">
      <Starfield count={70} />

      <article className="relative z-10 flex w-full max-w-2xl flex-col gap-10">
        <header className="flex flex-col items-center gap-3 text-center">
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-sm tracking-wide text-accent">
            {eyebrow}
          </span>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          {intro.map((p, i) => (
            <p key={i} className="text-balance text-foreground/70">
              {p}
            </p>
          ))}
          <Link
            href="/chestionar"
            className="mt-2 rounded-full bg-accent px-8 py-3 text-base font-medium text-background transition-colors hover:bg-accent-soft"
          >
            Începe explorarea
          </Link>
        </header>

        {sections.map((section, i) => (
          <section key={i}>
            <h2 className="mb-3 text-xl font-semibold">{section.heading}</h2>
            <div className="flex flex-col gap-3 text-foreground/80">
              {section.body.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          </section>
        ))}

        {faq.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-semibold">Întrebări frecvente</h2>
            <div className="flex flex-col gap-5">
              {faq.map((item, i) => (
                <div key={i}>
                  <h3 className="mb-1 font-medium text-foreground/90">{item.question}</h3>
                  <p className="text-foreground/70">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {relatedLinks && relatedLinks.length > 0 && (
          <section>
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-foreground/50">
              {relatedLinksTitle ?? "Vezi și"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm transition-colors hover:bg-white/10"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
