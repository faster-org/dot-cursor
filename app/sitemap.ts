import type { MetadataRoute } from "next";
import { loadRules, getCollections } from "@/lib/data-loader";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dotcursor.com";
	const now = new Date();

	const [rules, collections] = await Promise.all([loadRules(), Promise.resolve(getCollections())]);

	const staticRoutes: MetadataRoute.Sitemap = [
		{ url: `${baseUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
		{ url: `${baseUrl}/rules`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
		{ url: `${baseUrl}/trending`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
		{ url: `${baseUrl}/collections`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
	];

	const ruleRoutes: MetadataRoute.Sitemap = rules.map((rule) => ({
		url: `${baseUrl}/rules/${rule.slug}`,
		lastModified: rule.createdAt ? new Date(rule.createdAt) : now,
	}));

	const collectionRoutes: MetadataRoute.Sitemap = collections.map((collection) => ({
		url: `${baseUrl}/collections/${collection.slug}`,
		lastModified: collection.createdAt ? new Date(collection.createdAt) : now,
	}));

	return [...staticRoutes, ...ruleRoutes, ...collectionRoutes];
}
