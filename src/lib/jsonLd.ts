import { SITE_URL, SITE_NAME } from "@/lib/site";
import type { Project } from "@/lib/projects";

/**
 * schema.org SoftwareSourceCode for a flagship project — helps search engines
 * and recruiter tools associate the work, its repo, and the tech stack with
 * Nicholas as author. Rendered as JSON-LD on each project page.
 */
export function projectJsonLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    abstract: project.tagline,
    description: project.description,
    codeRepository: project.github,
    url: project.demoUrl ? `${SITE_URL}${project.demoUrl}` : SITE_URL,
    keywords: project.tech.join(", "),
    author: {
      "@type": "Person",
      name: "Nicholas D'Amato",
      url: SITE_URL,
    },
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
