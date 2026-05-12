import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, FileDown, ExternalLink } from "lucide-react";
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
      <section className="border-b border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-transparent">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <div className="grid items-center gap-10 sm:grid-cols-[auto_1fr]">
            <div className="relative h-40 w-40 overflow-hidden rounded-full ring-2 ring-sky-500/40 ring-offset-4 ring-offset-slate-950 sm:h-48 sm:w-48">
              <Image
                src="/headshot.jpg"
                alt="Nicholas D'Amato"
                fill
                priority
                sizes="(min-width: 640px) 12rem, 10rem"
                className="object-cover"
              />
            </div>

            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-sky-400">
                Junior Data Analyst
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
                Nicholas D&apos;Amato
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">
                Pivoting from IT support into data analytics. Hands-on Python,
                SQL, and Power BI work, backed by years inside the enterprise
                systems that generate the data most companies are trying to
                analyze.
              </p>
              <p className="mt-3 max-w-2xl text-base text-slate-400">
                Finishing an AAS in AI Data Specialist at WCTC. Looking for
                part-time analyst work or a data internship. Remote preferred,
                Milwaukee/Waukesha OK.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
                <span className="inline-flex items-center gap-1.5 text-slate-400">
                  <MapPin className="h-4 w-4" />
                  Pewaukee, WI
                </span>
                <a
                  href="mailto:nickdamatoit@gmail.com"
                  className="inline-flex items-center gap-1.5 text-slate-300 transition hover:text-sky-400"
                >
                  <Mail className="h-4 w-4" />
                  nickdamatoit@gmail.com
                </a>
                <a
                  href="https://linkedin.com/in/nicholas-damato2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-300 transition hover:text-sky-400"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
                <a
                  href="https://github.com/Damatnic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-300 transition hover:text-sky-400"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
                <a
                  href="/DAmato_Resume_DataAnalyst.pdf"
                  download
                  className="inline-flex items-center gap-1.5 rounded-md bg-sky-500/10 px-3 py-1.5 text-sky-400 ring-1 ring-sky-500/30 transition hover:bg-sky-500/20"
                >
                  <FileDown className="h-4 w-4" />
                  Download Resume
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Projects */}
      <section id="projects" className="border-b border-slate-800/60">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-sky-400">
                Featured Work
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Data Projects
              </h2>
            </div>
            <Link
              href="https://github.com/Damatnic"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-sm text-slate-400 transition hover:text-sky-400 sm:inline-flex sm:items-center sm:gap-1.5"
            >
              All projects on GitHub <ExternalLink className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {projects.map((p) => (
              <article
                key={p.slug}
                className="group flex flex-col overflow-hidden rounded-xl bg-slate-900/40 ring-1 ring-slate-800/80 transition hover:ring-sky-500/40"
              >
                <div
                  className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${p.imageGradient}`}
                >
                  {p.imagePath ? (
                    <Image
                      src={p.imagePath}
                      alt={`${p.title} preview`}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover opacity-80 transition group-hover:opacity-100"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-6xl">
                      {p.imageInitials}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-semibold tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm text-sky-400">{p.tagline}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {p.description}
                  </p>
                  <ul className="mt-4 space-y-1.5 text-sm text-slate-400">
                    {p.bullets.map((b, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-1 inline-block h-1 w-1 shrink-0 rounded-full bg-sky-500" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300 ring-1 ring-slate-700/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-1.5 text-sm text-sky-400 transition hover:text-sky-300"
                  >
                    <Github className="h-4 w-4" />
                    View on GitHub
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-b border-slate-800/60">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
          <p className="font-mono text-xs uppercase tracking-widest text-sky-400">
            Background
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            About
          </h2>
          <div className="mt-8 space-y-5 text-base leading-relaxed text-slate-300">
            <p>
              I spent the last few years doing IT support — service desk,
              ticketing systems, Active Directory, ServiceNow, PowerShell
              automation. Three years across Puget Sound Energy, Wolter Inc.,
              CTAccess, and City of Wauwatosa. That work taught me how
              enterprise systems actually generate data, which turns out to be
              a huge head start for the data analyst pivot.
            </p>
            <p>
              I&apos;m finishing an AAS in AI Data Specialist at WCTC (expected
              May 2027), focused on Python data manipulation, advanced SQL,
              and Power BI. The three projects above are real work from this
              program: an end-to-end ETL pipeline, a production-grade SQL
              Server schema, and a multi-page Power BI dashboard.
            </p>
            <p>
              I&apos;m looking for part-time analyst work or a data internship
              — remote preferred, Milwaukee/Waukesha area open. Comfortable
              with full-time too. I ship things, I learn the messy parts of
              new tools, and I&apos;m used to being the one who figures out
              what the data is actually saying.
            </p>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-slate-400">
                Education
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>
                  <strong className="block text-slate-100">WCTC</strong>
                  AAS, AI Data Specialist
                  <span className="block text-slate-500">In Progress (2027)</span>
                </li>
                <li>
                  <strong className="block text-slate-100">MATC</strong>
                  Associate, IT Network Specialist
                  <span className="block text-slate-500">2023</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-slate-400">
                Certifications
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-300">
                <li>CompTIA A+ (2024)</li>
                <li>CompTIA Network+ (2024)</li>
                <li>Cisco CCNA (2022)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono text-xs uppercase tracking-widest text-slate-400">
                Tech
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-300">
                <li>Python · pandas · SQL · T-SQL</li>
                <li>Power BI · DAX · Excel</li>
                <li>SQL Server · ETL · Web Scraping</li>
                <li>AD · PowerShell · ServiceNow</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-400">
            <p>
              Built with Next.js + Tailwind, deployed on Vercel. Source on{" "}
              <a
                href="https://github.com/Damatnic/damato-portfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:text-sky-300"
              >
                GitHub
              </a>
              .
            </p>
            <p className="mt-1 text-slate-500">
              © {new Date().getFullYear()} Nicholas D&apos;Amato
            </p>
          </div>
          <div className="flex gap-4 text-sm">
            <a
              href="mailto:nickdamatoit@gmail.com"
              className="inline-flex items-center gap-1.5 text-slate-300 transition hover:text-sky-400"
            >
              <Mail className="h-4 w-4" /> Email
            </a>
            <a
              href="https://linkedin.com/in/nicholas-damato2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-300 transition hover:text-sky-400"
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
            <a
              href="https://github.com/Damatnic"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-slate-300 transition hover:text-sky-400"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
