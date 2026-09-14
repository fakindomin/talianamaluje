import type { MetadataRoute } from "next";
import { artist } from "@/lib/data";
import { getProjects } from "@/lib/db";

const siteUrl = "https://talianamaluje-fakindomin.vercel.app";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  const publicProjects = projects.filter((project) => project.public);

  return [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/@${artist.slug}`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/modelki`, changeFrequency: "monthly", priority: 0.5 },
    ...publicProjects.map((project) => ({
      url: `${siteUrl}/work/${project.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6
    }))
  ];
}
