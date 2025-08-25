import { fetchArticles } from "@/lib/news";
import { prisma } from "@/lib/prisma";
import openai from "@/lib/openai";
import { logger, schedules } from "@trigger.dev/sdk";
import { marked } from "marked";
import nodemailer from "nodemailer";
import {
  generateNewsletterHTML,
  generatePlainTextNewsletter,
} from "@/lib/email-template";

export const newsletterTask = schedules.task({
  id: "newsletter-schedule",
  run: async (payload) => {
    const { externalId } = payload;

    if (!externalId) {
      logger.error("No externalId provided in payload:", { payload });
      return;
    }

    const { isActive, categories, email, unsubscribeToken } = await getUserData(
      externalId
    );
    if (!isActive || !email || categories.length === 0) {
      logger.info("User is not active, skipping newsletter:", { externalId });
      return;
    }

    const articles = await fetchNews(categories);

    if (articles.length === 0) {
      logger.info("No articles found for categories:", { categories });
      return;
    }

    const newsletterContent = await summarizeArticles(articles, categories);

    logger.info("Newsletter generated successfully:", {
      articleCount: articles.length,
      categories,
    });

    const htmlContent = await marked(newsletterContent);

    const templateParams = {
      to: email,
      content: htmlContent,
      categories: categories.join(", "),
      articleCount: articles.length,
      date: new Date().toLocaleDateString(),
      unsubscribeToken,
    };

    await sendMail(templateParams);
  },
});

async function getUserData(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerk_id: userId },

      select: {
        email: true,
        unsubscribe_token: true,
        preferences: {
          select: {
            is_active: true,
            categories: true,
          },
        },
        subscription: {
          select: {
            status: true,
            current_period_end: true,
          },
        },
      },
    });
    if (!user || !user.preferences) {
      logger.error("User or preferences not found for userId:", { userId });
      return {
        isActive: false,
        categories: [],
        email: null,
        unsubscribeToken: null,
      };
    }

    const now = new Date();
    const subscriptionEnd = user.subscription?.current_period_end;

    if (
      user.subscription?.status !== "active" ||
      (subscriptionEnd && subscriptionEnd < now)
    ) {
      logger.info("User subscription is not active or expired:", { userId });
      return {
        isActive: false,
        categories: [],
        email: null,
        unsubscribeToken: null,
      };
    }

    return {
      isActive: user.preferences.is_active,
      categories: user.preferences.categories,
      email: user.email,
      unsubscribeToken: user.unsubscribe_token,
    };
  } catch (error) {
    logger.error("Error checking user status:", { error });
    return {
      isActive: false,
      categories: [],
      email: null,
      unsubscribeToken: null,
    };
  }
}

async function fetchNews(categories: string[]) {
  try {
    return fetchArticles(categories);
  } catch (error) {
    logger.error("Error fetching news articles:", { error });
    throw error;
  }
}

async function summarizeArticles(
  articles: { title: string; description: string; url: string }[],
  categories: string[]
) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an elite AI newsletter curator and editor with expertise in crafting compelling, personalized news digests. Your role is to transform raw news articles into an insightful, engaging newsletter that readers actually look forward to receiving.

          **Core Objectives:**
          - Create a newsletter that feels personally curated, not automatically generated
          - Balance information density with readability - respect the reader's time
          - Add value through synthesis, context, and connecting patterns across stories
          - Write with authority while maintaining accessibility
          
          **Newsletter Structure Requirements:**
          1. **Subject Line:** Craft a compelling subject that highlights the most intriguing story
          2. **Opening:** Start with a brief executive summary (2-3 sentences) of key themes
          3. **Main Content:** 
             - Group related stories thematically when possible
             - Lead with the most impactful/relevant story
             - Include 3-5 bullet points per major story with key takeaways
             - Add brief context about why each story matters
          4. **Insights Section:** Identify 1-2 emerging trends or patterns across the news
          5. **Quick Reads:** Include 2-3 brief mentions of other noteworthy stories
          
          **Writing Style Guidelines:**
          - Use active voice and vary sentence structure for engagement
          - Include relevant data points, statistics, or quotes when impactful
          - Write transitions that connect stories and maintain narrative flow
          - Employ strategic formatting: bold for emphasis, bullet points for clarity
          - Avoid clichés and generic newsletter language
          - Match tone to content: serious for important news, lighter for human interest
          
          **Personalization Elements:**
          - Prioritize stories based on the user's selected categories
          - Draw connections between stories that align with category interests
          - Highlight implications relevant to the reader's interests
          
          **Quality Standards:**
          - Fact-check consciousness: present information accurately
          - Balanced perspective: acknowledge different viewpoints when relevant
          - Future-focused: include "what to watch for" elements
          - Actionable when appropriate: suggest what readers can do with this information
          
          Format as HTML-friendly text with clear visual hierarchy using markdown-style formatting that translates well to email.`,
        },
        {
          role: "user",
          content: `Create a personalized newsletter digest for a reader interested in: ${categories.join(
            ", "
          )}
          
          Context: This is their weekly digest covering the most important developments from the past week.
          Article Count: ${articles.length} articles to synthesize
          
          Source Articles:
          ${articles
            .map(
              (article, index: number) =>
                `Article ${index + 1}:
                Title: ${article.title}
                Summary: ${article.description}
                Link: ${article.url}
                ---`
            )
            .join("\n")}
          
          Requirements:
          1. Create a compelling subject line that captures the week's biggest story
          2. Open with an executive summary highlighting 2-3 major themes
          3. Organize content by impact/relevance, not just chronologically
          4. Include specific data points, quotes, or statistics from the articles
          5. Connect stories to show broader patterns and implications
          6. End with forward-looking insights about what these developments mean
          7. Keep total length under 800 words for a 3-5 minute read
          
          Remember: The reader chose ${categories.join(
            " and "
          )} as their interests, so emphasize connections and implications relevant to these areas.`,
        },
      ],
    });

    const newsletterContent = completion.choices[0].message.content;

    if (!newsletterContent) {
      throw new Error("Failed to generate newsletter content");
    }

    return newsletterContent;
  } catch (error) {
    logger.error("Error summarizing articles with OpenAI:", { error });
    throw error;
  }
}

async function sendMail(templateParams: {
  to: string;
  content: string;
  categories: string;
  articleCount: number;
  date: string;
  unsubscribeToken: string;
}) {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT
    ? parseInt(process.env.SMTP_PORT)
    : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass) {
    throw new Error("SMTP configuration missing");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const htmlContent = generateNewsletterHTML({
    content: templateParams.content,
    categories: templateParams.categories,
    articleCount: templateParams.articleCount,
    date: templateParams.date,
    unsubscribeToken: templateParams.unsubscribeToken,
  });

  const plainTextContent = generatePlainTextNewsletter({
    content: templateParams.content,
    categories: templateParams.categories,
    articleCount: templateParams.articleCount,
    date: templateParams.date,
    unsubscribeToken: templateParams.unsubscribeToken,
  });

  try {
    const info = await transporter.sendMail({
      from: smtpFrom,
      to: templateParams.to,
      subject: `Your AI Newsletter - ${templateParams.categories} - ${templateParams.date}`,
      html: htmlContent,
      text: plainTextContent,
    });

    logger.info(`Email sent successfully to ${templateParams.to}`, {
      messageId: info.messageId,
    });
  } catch (error) {
    logger.error(`Error sending email to ${templateParams.to}:`, { error });
    throw error;
  }
}
