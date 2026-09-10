import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/studio", "/login"] }],
    sitemap: "https://talianamaluje-fakindomin.vercel.app/sitemap.xml"
  };
}
