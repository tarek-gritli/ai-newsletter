# AI Newsletter Platform

An intelligent newsletter platform that automatically generates personalized AI-curated newsletters based on user preferences, featuring subscription management, payment processing, and automated email delivery.

## Features

- **AI-Powered Content Curation**: Leverages OpenAI to automatically summarize and curate news articles
- **User Authentication**: Secure authentication and user management with Clerk
- **Subscription Management**: Flexible monthly and yearly subscription plans via Stripe
- **Personalized Preferences**: Users can select categories and delivery frequency
- **Automated Email Delivery**: Scheduled newsletter sending via Trigger.dev and Nodemailer
- **Modern Tech Stack**: Built with Next.js 15, React 19, TypeScript, and Tailwind CSS
- **Database Management**: PostgreSQL with Prisma ORM for efficient data handling

## Prerequisites

- Node.js 20+
- PostgreSQL database (example: Supabase)
- Accounts and API keys for:
  - OpenAI
  - Clerk
  - Stripe
  - Trigger.dev
  - News API
  - SMTP service

## Installation

1. Clone the repository:

```bash
git clone https://github.com/tarek-gritli/ai-newsletter.git
cd ai-newsletter
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Configure your `.env` file with all required API keys and credentials:

```env
# OpenAI API Key for AI summarization
OPENAI_API_KEY=your_openai_api_key

# Trigger.dev configuration
TRIGGER_SECRET_KEY=your_trigger_secret_key

# News API key for fetching articles
NEWS_API_KEY=your_news_api_key

# Nodemailer configuration
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM="NewsMind AI"

# Database configuration
DATABASE_URL=postgresql://user:password@localhost:5432/ai_newsletter

# Stripe configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=your_monthly_price_id
NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID=your_yearly_price_id

# Clerk configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/subscribe
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard

# Project configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Set up the database:

```bash
npx prisma migrate deploy
npx prisma generate
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Key Features Implementation

### User Authentication

- Implemented with Clerk for secure user management
- Protected routes for authenticated users
- Profile management with Clerk UserProfile component

### Subscription System

- Stripe integration for payment processing
- Monthly and yearly subscription plans
- Webhook handling for subscription events
- Automatic user status updates

### Newsletter Generation

- AI-powered content summarization using OpenAI
- Personalized content based on user preferences
- Categories include Technology, Business, Health, Sports, Entertainment, and Science
- Flexible delivery frequency (daily, weekly, bi-weekly)

### Email Delivery

- Automated scheduling with Trigger.dev
- SMTP integration via Nodemailer
- Unsubscribe token generation for compliance
- HTML email templates with markdown support

## Database Schema

The application uses PostgreSQL with Prisma ORM, featuring:

- **User**: Stores user information with Clerk integration
- **UserPreferences**: Manages newsletter preferences
- **Subscription**: Tracks Stripe subscription details

## API Routes

- `/api/webhooks/stripe` - Handles Stripe subscription events
- `/api/webhooks/clerk` - Manages Clerk user events
- `/api/unsubscribe` - Processes newsletter unsubscribe requests

## Deployment

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm run start
```

### Environment Variables for Production

Ensure all environment variables are properly configured in your production environment, particularly:

- Update `NEXT_PUBLIC_APP_URL` to your production domain
- Configure production database URL
- Set up production API keys for all services
- Configure Stripe webhook endpoints for production

## Security Considerations

- All sensitive operations use server actions
- API routes are protected with webhook secret validation
- Database queries use Prisma's built-in SQL injection protection
- User authentication handled by Clerk's secure infrastructure

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact me directly at [email](mailto:gritli.tarek66@gmail.com).
