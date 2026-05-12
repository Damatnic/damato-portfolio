import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, FileDown, Play } from "lucide-react";
import { projects } from "@/lib/projects";

function Github({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.7-3.88-1.54-3.88-1.54-.52-1.34-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.4-5.25 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.77-.01 3.14 0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function Linkedin({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="border-b border-stone-800/60">
        <div className="mx-auto max-w-5xl px-6 pt-20 pb-14 sm:pt-28 sm:pb-20">
          <div className="grid items-start gap-10 sm:grid-cols-[auto_1fr]">
            <div className="relative h-32 w-32 overflow-hidden rounded-md ring-1 ring-stone-700/60 sm:h-36 sm:w-36">
              <Image
                src="/headshot.jpg"
                alt="Nicholas D'Amato"
                fill
                priority
                sizes="(min-width: 640px) 9rem, 8rem"
                className="object-cover"
              />
            </div>

            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-stone-50 sm:text-5xl">
                Nicholas D&apos;Amato
              </h1>
              <p className="mt-3 text-lg text-stone-300">
                Junior data analyst, pivoting in from IT support.
              </p>
              <p className="mt-6 max-w-[60ch] leading-relaxed text-stone-200">
                Three years on service desks: ServiceNow, Active Directory, the
                tools that actually produce the data companies want to analyze.
                Now I&apos;m the one trying to read it. Finishing an AAS in AI
                Data Specialist at WCTC, looking for part-time analyst work or
                an internship.
              </p>

              <div className="mt-7">
                <a
                  href="/DAmato_Resume_DataAnalyst.pdf"
                  download
                  className="inline-flex items-center gap-2 rounded-md border border-[var(--accent)]/50 bg-[var(--accent-soft)] px-4 py-2 text-sm font-medium text-[var(--accent)] transition hover:bg-[var(--accent)]/25"
                >
                  <FileDown className="h-4 w-4" />
                  Download Resume (PDF)
                </a>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-stone-400">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  Pewaukee, WI
                </span>
                <a
                  href="mailto:nickdamatoit@gmail.com"
                  className="inline-flex items-center gap-1.5 hover:text-[var(--accent)]"
                >
                  <Mail className="h-4 w-4" />
                  nickdamatoit@gmail.com
                </a>
                <a
                  href="https://linkedin.com/in/nicholas-damato2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[var(--accent)]"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
                <a
                  href="https://github.com/Damatnic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-[var(--accent)]"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="border-b border-stone-800/60">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="flex items-baseline justify-between gap-6">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-100 sm:text-3xl">
              Things I&apos;ve built
            </h2>
            <Link
              href="https://github.com/Damatnic"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-sm text-stone-500 hover:text-[var(--accent)] sm:inline"
            >
              github.com/Damatnic →
            </Link>
          </div>

          <ol className="mt-10 divide-y divide-stone-800/60">
            {projects.map((p, i) => (
              <li
                key={p.slug}
                className="group relative grid gap-6 py-10 first:pt-6 sm:grid-cols-[5rem_1fr] sm:gap-10"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-3 top-10 h-12 w-px bg-stone-800 transition group-hover:bg-[var(--accent)]"
                />

                <div className="font-mono text-sm text-stone-500">
                  <span className="text-[var(--accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="ml-2 text-stone-700">/</span>
                  <span className="ml-2">
                    {String(projects.length).padStart(2, "0")}
                  </span>
                </div>

                <article className="max-w-[68ch]">
                  <h3 className="text-xl font-semibold text-stone-50 sm:text-2xl">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-stone-400">{p.tagline}</p>

                  <p className="mt-4 leading-relaxed text-stone-200">
                    {p.description}
                  </p>

                  <ul className="mt-5 space-y-2 text-sm text-stone-300">
                    {p.bullets.map((b, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="mt-2.5 inline-block h-px w-3 shrink-0 bg-stone-600" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-5 font-mono text-xs text-stone-500">
                    {p.tech.join("  ·  ")}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                    {p.demoUrl && (
                      <Link
                        href={p.demoUrl}
                        className="inline-flex items-center gap-1.5 font-medium text-[var(--accent)] underline-offset-4 hover:underline"
                      >
                        <Play className="h-3.5 w-3.5" />
                        {p.demoLabel ?? "Try it"}
                      </Link>
                    )}
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-stone-400 hover:text-stone-100"
                    >
                      <Github className="h-4 w-4" />
                      source
                    </a>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-b border-stone-800/60">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="grid gap-10 sm:grid-cols-[2fr_1fr]">
            <div className="space-y-5 leading-relaxed text-stone-200">
              <h2 className="text-2xl font-semibold tracking-tight text-stone-100 sm:text-3xl">
                About
              </h2>
              <p className="max-w-[65ch]">
                Last few years I did IT support. Service desk, ticketing, AD,
                ServiceNow, some PowerShell. Three years across Puget Sound
                Energy, Wolter, CTAccess, and the City of Wauwatosa. Being
                inside the systems that generate the data turns out to be a
                pretty good head start for moving into analytics, especially
                when half the job is figuring out what the data is actually
                saying versus what people <em>think</em> it&apos;s saying.
              </p>
              <p className="max-w-[65ch]">
                The three projects above are real work from my WCTC program,
                cleaned up for public sharing. A Python ETL that scrapes web
                data into SQL Server. A SQL Server schema built from an ER
                diagram with partitioning and audit triggers. A Power BI
                dashboard on a star schema.
              </p>
              <p className="max-w-[65ch]">
                Looking for part-time analyst work or an internship. Remote is
                what I&apos;m after, Milwaukee or Waukesha is fine. Full-time
                works too if the role fits.
              </p>
            </div>

            <dl className="space-y-6 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wide text-stone-500">Education</dt>
                <dd className="mt-1.5 text-stone-200">WCTC · AAS, AI Data Specialist <span className="text-stone-500">(2027)</span></dd>
                <dd className="text-stone-200">MATC · Associate, IT Network <span className="text-stone-500">(2023)</span></dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-stone-500">Certifications</dt>
                <dd className="mt-1.5 text-stone-200">CompTIA A+, Network+</dd>
                <dd className="text-stone-200">Cisco CCNA</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-stone-500">Tools I reach for</dt>
                <dd className="mt-1.5 text-stone-200">
                  Python · pandas · SQL · T-SQL · Power BI · DAX · Excel · SQL
                  Server · BeautifulSoup · PowerShell
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-stone-500">Currently learning</dt>
                <dd className="mt-1.5 text-stone-200">
                  More serious DAX. Window functions in production-scale data.
                  How to make a dashboard people actually use.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-stone-500">
            Nicholas D&apos;Amato · Pewaukee, WI
          </p>
          <div className="flex gap-5 text-sm text-stone-400">
            <a
              href="mailto:nickdamatoit@gmail.com"
              className="inline-flex items-center gap-1.5 hover:text-[var(--accent)]"
            >
              <Mail className="h-4 w-4" /> Email
            </a>
            <a
              href="https://linkedin.com/in/nicholas-damato2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[var(--accent)]"
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
            <a
              href="https://github.com/Damatnic"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-[var(--accent)]"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
