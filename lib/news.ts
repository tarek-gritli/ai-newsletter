import { logger } from "@trigger.dev/sdk";
import { Article } from "./types";

export async function fetchArticles(
  categories: string[]
): Promise<Array<{ title: string; url: string; description: string }>> {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const promises = categories.map(async (category) => {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(
          category
        )}&from=${since}&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`
      );

      if (!response.ok) {
        logger.error(`Failed to fetch news for category ${category}`);
        return [];
      }

      const data = await response.json();

      if (data.status === "error") {
        logger.error(`News API error for category ${category}:`, data.message);
        return [];
      }

      logger.log(
        `Fetched ${data.articles.length} articles for category ${category}`
      );

      return data.articles.slice(0, 5).map((article: Article) => ({
        title: article.title || "No title",
        url: article.url || "#",
        description: article.description || "No description available",
      }));
    } catch (error) {
      logger.error(`Error fetching news for category ${category}`, { error });
      return [];
    }
  });

  const results = await Promise.all(promises);
  return results.flat();
}
