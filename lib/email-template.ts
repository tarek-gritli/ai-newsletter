export function generateNewsletterHTML(params: {
  content: string;
  categories: string;
  articleCount: number;
  date: string;
  unsubscribeToken: string;
}) {
  const { content, categories, articleCount, date, unsubscribeToken } = params;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: #f5f5f5;
      padding: 20px 0;
    }
    
    .email-wrapper {
      max-width: 650px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 30px;
      text-align: center;
    }
    
    .header h1 {
      color: #ffffff;
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 10px;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .header p {
      color: rgba(255, 255, 255, 0.95);
      font-size: 16px;
    }
    
    .meta-bar {
      background: #f8f9fa;
      padding: 15px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 15px;
      border-bottom: 2px solid #e9ecef;
    }
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #6c757d;
      font-size: 14px;
    }
    
    .meta-item strong {
      color: #495057;
    }
    
    .categories-tag {
      background: #667eea;
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
    }
    
    .content-section {
      padding: 40px 30px;
    }
    
    .newsletter-content {
      color: #333;
      font-size: 16px;
      line-height: 1.8;
    }
    
    .newsletter-content h1 {
      color: #2d3748;
      font-size: 28px;
      font-weight: 700;
      margin: 30px 0 20px 0;
      padding-left: 15px;
      border-left: 4px solid #667eea;
    }
    
    .newsletter-content h2 {
      color: #4a5568;
      font-size: 22px;
      font-weight: 600;
      margin: 25px 0 15px 0;
      padding-bottom: 8px;
      border-bottom: 2px solid #e2e8f0;
    }
    
    .newsletter-content h3 {
      color: #718096;
      font-size: 18px;
      font-weight: 600;
      margin: 20px 0 10px 0;
    }
    
    .newsletter-content p {
      margin-bottom: 16px;
      color: #4a5568;
    }
    
    .newsletter-content ul,
    .newsletter-content ol {
      margin: 16px 0;
      padding-left: 30px;
      color: #4a5568;
    }
    
    .newsletter-content li {
      margin-bottom: 8px;
      line-height: 1.8;
    }
    
    .newsletter-content strong {
      color: #2d3748;
      font-weight: 600;
    }
    
    .newsletter-content em {
      color: #718096;
      font-style: italic;
    }
    
    .newsletter-content a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      border-bottom: 1px solid transparent;
      transition: border-color 0.3s;
    }
    
    .newsletter-content a:hover {
      border-bottom-color: #667eea;
    }
    
    .newsletter-content blockquote {
      border-left: 4px solid #667eea;
      padding-left: 20px;
      margin: 20px 0;
      font-style: italic;
      color: #718096;
      background: #f7fafc;
      padding: 15px 20px;
      border-radius: 0 8px 8px 0;
    }
    
    .newsletter-content code {
      background: #f7fafc;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      color: #e53e3e;
    }
    
    .newsletter-content hr {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 30px 0;
    }
    
    .footer {
      background: #2d3748;
      color: #ffffff;
      padding: 30px;
      text-align: center;
    }
    
    .footer-logo {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 15px;
      color: #ffffff;
    }
    
    .footer-text {
      color: #cbd5e0;
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    
    .footer-links {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #4a5568;
    }
    
    .footer-links a {
      color: #a0aec0;
      text-decoration: none;
      margin: 0 15px;
      font-size: 13px;
      transition: color 0.3s;
    }
    
    .footer-links a:hover {
      color: #667eea;
    }
    
    .unsubscribe {
      margin-top: 20px;
      font-size: 12px;
      color: #718096;
    }
    
    .unsubscribe a {
      color: #667eea;
      text-decoration: none;
    }
    
    @media only screen and (max-width: 600px) {
      .email-wrapper {
        border-radius: 0;
      }
      
      .header {
        padding: 30px 20px;
      }
      
      .header h1 {
        font-size: 26px;
      }
      
      .content-section {
        padding: 30px 20px;
      }
      
      .newsletter-content h1 {
        font-size: 24px;
      }
      
      .newsletter-content h2 {
        font-size: 20px;
      }
      
      .newsletter-content h3 {
        font-size: 17px;
      }
      
      .meta-bar {
        padding: 12px 20px;
      }
      
      .footer {
        padding: 25px 20px;
      }
      
      .footer-links a {
        display: block;
        margin: 10px 0;
      }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <!-- Header Section -->
    <div class="header">
      <h1>AI Newsletter</h1>
      <p>Your Personalized Weekly Tech Digest</p>
    </div>
    
    <!-- Meta Information Bar -->
    <div class="meta-bar">
      <div class="meta-item">
        <strong>📅 Date:</strong> ${date}
      </div>
      <div class="meta-item">
        <strong>📰 Articles:</strong> ${articleCount}
      </div>
      <div class="categories-tag">
        ${categories}
      </div>
    </div>
    
    <!-- Main Content Section -->
    <div class="content-section">
      <div class="newsletter-content">
        ${content}
      </div>
    </div>
    
    <!-- Footer Section -->
    <div class="footer">
      <div class="footer-logo">AI Newsletter</div>
      <p class="footer-text">
        Stay informed with the latest in AI and technology.<br>
        Curated specially for you based on your interests.
      </p>
      ${
        unsubscribeToken
          ? `
      <div class="footer-links">
        <a href="${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/unsubscribe?token=${unsubscribeToken}">Unsubscribe</a>
      </div>
      `
          : ""
      }
    </div>
  </div>
</body>
</html>
`;
}

export function generatePlainTextNewsletter(params: {
  content: string;
  categories: string;
  articleCount: number;
  date: string;
  unsubscribeToken?: string;
}) {
  const { content, categories, articleCount, date, unsubscribeToken } = params;

  const plainTextContent = content
    .replace(/<[^>]*>/g, "")
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*/g, "")
    .replace(/\*/g, "• ")
    .replace(/\n{3,}/g, "\n\n");

  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AI NEWSLETTER - Your Personalized Weekly Digest
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 ${date} | 📰 ${articleCount} Articles | 🏷️ ${categories}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${plainTextContent}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You're receiving this because you subscribed to our AI-powered newsletter.
Curated with ❤️ by NewsMind AI

${
  unsubscribeToken
    ? `
To unsubscribe, visit: ${
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      }/unsubscribe?token=${unsubscribeToken}
`
    : ""
}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
}
