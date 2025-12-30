"use server";

import * as cheerio from "cheerio";

export type PreviewData = {
  title: string;
  description: string;
  image: string;
  url: string;
};

export async function scrape(url: string): Promise<PreviewData> {
  // Basic validation
  try {
    new URL(url);
  } catch {
    throw new Error("Invalid URL");
  }

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
    cache: "no-store",
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch the page");
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Prefer OpenGraph (industry standard)
  const title =
    $('meta[property="og:title"]').attr("content") || $("title").text() || "";

  const description =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    "";

  const image =
    $('meta[property="og:image"]').attr("content") ||
    $('meta[name="twitter:image"]').attr("content") ||
    "";

  return {
    title: title.trim(),
    description: description.trim(),
    image: image || "",
    url,
  };
}
